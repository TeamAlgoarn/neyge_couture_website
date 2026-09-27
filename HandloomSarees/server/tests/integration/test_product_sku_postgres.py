"""Real PostgreSQL coverage for migrations 007/preview 003 and product SKU RPCs.

Set NEYGE_TEST_POSTGRES_DSN to a disposable database whose name contains
"test". Each test uses and drops a unique schema; Production is never allowed.
"""
import json
import os
import re
import threading
import time
import uuid
from pathlib import Path

import pytest

psycopg = pytest.importorskip("psycopg")

SERVER_ROOT = Path(__file__).resolve().parents[2]
MIGRATIONS = [
    ("public", SERVER_ROOT / "migrations" / "007_admin_product_metadata.sql"),
    ("preview", SERVER_ROOT / "migrations" / "preview" / "003_admin_product_metadata.sql"),
]

BASE_DDL = """
CREATE TABLE {s}.collections (id UUID PRIMARY KEY DEFAULT gen_random_uuid());
CREATE TABLE {s}.products (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL,
 slug TEXT NOT NULL UNIQUE, price NUMERIC(10,2) NOT NULL,
 discount_price NUMERIC(10,2), images JSONB NOT NULL DEFAULT '[]',
 thumbnail TEXT, short_description TEXT, story TEXT, fabric TEXT, color TEXT,
 technique TEXT, origin TEXT, collection_id UUID REFERENCES {s}.collections(id),
 occasion JSONB NOT NULL DEFAULT '[]', artisan JSONB, stock INT NOT NULL DEFAULT 0,
 is_featured BOOLEAN NOT NULL DEFAULT FALSE, is_active BOOLEAN NOT NULL DEFAULT TRUE,
 care_instructions TEXT, tags JSONB NOT NULL DEFAULT '[]',
 has_fall BOOLEAN DEFAULT FALSE, fall_price NUMERIC(10,2) DEFAULT 0,
 has_in_skirt BOOLEAN DEFAULT FALSE, in_skirt_price NUMERIC(10,2) DEFAULT 0,
 has_variants BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE {s}.carts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id TEXT NOT NULL
);
CREATE TABLE {s}.orders (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 order_status TEXT NOT NULL DEFAULT 'confirmed'
);
CREATE TABLE {s}.product_variants (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 product_id UUID NOT NULL REFERENCES {s}.products(id) ON DELETE CASCADE,
 sku VARCHAR(100) NOT NULL UNIQUE, attributes JSONB NOT NULL DEFAULT '{{}}',
 price_override NUMERIC(10,2), is_active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE {s}.inventory (
 sku VARCHAR(100) PRIMARY KEY REFERENCES {s}.product_variants(sku) ON DELETE CASCADE,
 quantity_available INT NOT NULL DEFAULT 0,
 quantity_reserved INT NOT NULL DEFAULT 0,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 CHECK (quantity_reserved <= quantity_available)
);
CREATE TABLE {s}.cart_items (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 cart_id UUID NOT NULL REFERENCES {s}.carts(id) ON DELETE CASCADE,
 product_id UUID NOT NULL REFERENCES {s}.products(id) ON DELETE CASCADE,
 quantity INT NOT NULL DEFAULT 1,
 sku VARCHAR(100) REFERENCES {s}.product_variants(sku) ON DELETE SET NULL
);
CREATE TABLE {s}.order_items (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 order_id UUID NOT NULL REFERENCES {s}.orders(id) ON DELETE CASCADE,
 product_id UUID REFERENCES {s}.products(id) ON DELETE SET NULL,
 sku VARCHAR(100) REFERENCES {s}.product_variants(sku) ON DELETE SET NULL
);
CREATE TABLE {s}.inventory_transactions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 sku VARCHAR(100) NOT NULL REFERENCES {s}.inventory(sku) ON DELETE CASCADE,
 quantity_change INT NOT NULL, reason VARCHAR(50) NOT NULL,
 reference_id TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE (sku, reference_id, reason)
);
"""


def _migration_sql(path: Path, source_schema: str, target_schema: str) -> str:
    sql = path.read_text(encoding="utf-8").replace(
        f"{source_schema}.", f"{target_schema}."
    ).replace(
        f"search_path = {source_schema},", f"search_path = {target_schema},"
    )
    return re.sub(
        r"^(?:REVOKE|GRANT) EXECUTE ON FUNCTION .*?;$",
        "",
        sql,
        flags=re.MULTILINE,
    )


@pytest.fixture(params=MIGRATIONS, ids=["migration-007", "preview-003"])
def pg(request):
    dsn = os.getenv("NEYGE_TEST_POSTGRES_DSN")
    if not dsn:
        pytest.skip("NEYGE_TEST_POSTGRES_DSN is not configured")
    conn = psycopg.connect(dsn, autocommit=True)
    db_name = conn.info.dbname or ""
    if "test" not in db_name.lower():
        conn.close()
        pytest.fail("Refusing PostgreSQL integration tests outside a test database")

    source_schema, path = request.param
    schema = f"neyge_it_{uuid.uuid4().hex[:12]}"
    with conn.cursor() as cur:
        cur.execute(f'CREATE SCHEMA "{schema}"')
        cur.execute(BASE_DDL.format(s=schema))
        migration = _migration_sql(path, source_schema, schema)
        cur.execute(migration)
        cur.execute(migration)  # migrations must be safely re-runnable
    try:
        yield conn, schema
    finally:
        with conn.cursor() as cur:
            cur.execute(f'DROP SCHEMA IF EXISTS "{schema}" CASCADE')
        conn.close()


def _create(cur, schema, slug, sku=None, **values):
    product = {
        "name": values.pop("name", "Test Saree"),
        "slug": slug,
        "price": values.pop("price", 1000),
        "stock": values.pop("stock", 5),
        **values,
    }
    cur.execute(
        f"SELECT {schema}.create_product_with_sku(%s::jsonb, %s)",
        (json.dumps(product), sku),
    )
    return cur.fetchone()[0]


def test_atomic_create_default_generation_and_inventory(pg):
    conn, schema = pg
    with conn.cursor() as cur:
        product = _create(cur, schema, "generated", stock=7)
        assert product["sku"].startswith("NEY-")
        cur.execute(
            f"""SELECT v.is_active, i.quantity_available, i.quantity_reserved
                FROM {schema}.product_variants v JOIN {schema}.inventory i USING (sku)
                WHERE v.product_id = %s""",
            (product["id"],),
        )
        assert cur.fetchone() == (True, 7, 0)


def test_duplicate_sku_rolls_back_and_retry_succeeds(pg):
    conn, schema = pg
    with conn.cursor() as cur:
        _create(cur, schema, "first", "NEY-DUP")
        with pytest.raises(psycopg.errors.UniqueViolation):
            _create(cur, schema, "rolled-back", "NEY-DUP")
        cur.execute(f"SELECT COUNT(*) FROM {schema}.products WHERE slug='rolled-back'")
        assert cur.fetchone()[0] == 0
        cur.execute(
            f"""SELECT COUNT(*) FROM {schema}.product_variants v
                JOIN {schema}.products p ON p.id=v.product_id
                WHERE p.slug='rolled-back'"""
        )
        assert cur.fetchone()[0] == 0
        cur.execute(
            f"""SELECT COUNT(*) FROM {schema}.inventory i
                JOIN {schema}.product_variants v USING(sku)
                JOIN {schema}.products p ON p.id=v.product_id
                WHERE p.slug='rolled-back'"""
        )
        assert cur.fetchone()[0] == 0
        retried = _create(cur, schema, "rolled-back", "NEY-RETRY")
        assert retried["sku"] == "NEY-RETRY"


def test_update_and_sku_failure_are_atomic(pg):
    conn, schema = pg
    with conn.cursor() as cur:
        first = _create(cur, schema, "first", "NEY-FIRST", design="Original")
        _create(cur, schema, "second", "NEY-TAKEN")
        with pytest.raises(psycopg.errors.UniqueViolation):
            cur.execute(
                f"SELECT {schema}.update_product_with_sku(%s, %s::jsonb, %s)",
                (first["id"], json.dumps({"design": "Must rollback"}), "NEY-TAKEN"),
            )
        cur.execute(f"SELECT design FROM {schema}.products WHERE id=%s", (first["id"],))
        assert cur.fetchone()[0] == "Original"
        cur.execute(
            f"""SELECT sku FROM {schema}.product_variants
                WHERE product_id=%s AND is_active=TRUE""",
            (first["id"],),
        )
        assert cur.fetchone()[0] == "NEY-FIRST"


def test_multi_variant_metadata_edit_and_sku_restriction(pg):
    conn, schema = pg
    with conn.cursor() as cur:
        product = _create(cur, schema, "variants", "NEY-V1")
        cur.execute(
            f"""INSERT INTO {schema}.product_variants(product_id,sku)
                VALUES (%s,'NEY-V2')""",
            (product["id"],),
        )
        cur.execute(f"INSERT INTO {schema}.inventory(sku) VALUES ('NEY-V2')")
        cur.execute(
            f"UPDATE {schema}.products SET has_variants=TRUE WHERE id=%s",
            (product["id"],),
        )
        cur.execute(
            f"SELECT {schema}.update_product_with_sku(%s,%s::jsonb,NULL)",
            (product["id"], json.dumps({"design": "Peacock"})),
        )
        assert cur.fetchone()[0]["design"] == "Peacock"
        with pytest.raises(psycopg.errors.InvalidParameterValue):
            cur.execute(
                f"SELECT {schema}.update_product_with_sku(%s,%s::jsonb,%s)",
                (product["id"], json.dumps({"brand": "Neyge Couture"}), "NEY-NEW"),
            )


def test_rename_preserves_historical_skus_and_fk_integrity(pg):
    conn, schema = pg
    with conn.cursor() as cur:
        product = _create(cur, schema, "history", "NEY-OLD", stock=4)
        cur.execute(f"INSERT INTO {schema}.orders(order_status) VALUES ('delivered') RETURNING id")
        order_id = cur.fetchone()[0]
        cur.execute(
            f"INSERT INTO {schema}.order_items(order_id,product_id,sku) VALUES (%s,%s,'NEY-OLD')",
            (order_id, product["id"]),
        )
        cur.execute(
            f"""INSERT INTO {schema}.inventory_transactions
                (sku,quantity_change,reason,reference_id)
                VALUES ('NEY-OLD',-1,'sale','completed-order')"""
        )
        cur.execute(
            f"SELECT {schema}.update_product_with_sku(%s,%s::jsonb,%s)",
            (product["id"], json.dumps({"design": "Updated"}), "NEY-NEW"),
        )
        assert cur.fetchone()[0]["sku"] == "NEY-NEW"
        cur.execute(f"SELECT sku FROM {schema}.order_items")
        assert cur.fetchone()[0] == "NEY-OLD"
        cur.execute(f"SELECT sku FROM {schema}.inventory_transactions")
        assert cur.fetchone()[0] == "NEY-OLD"
        cur.execute(
            f"""SELECT v.sku,v.is_active,i.quantity_available
                FROM {schema}.product_variants v JOIN {schema}.inventory i USING(sku)
                ORDER BY v.sku"""
        )
        assert cur.fetchall() == [("NEY-NEW", True, 4), ("NEY-OLD", False, 0)]


def test_rename_rejects_reservations_carts_and_active_orders(pg):
    conn, schema = pg
    with conn.cursor() as cur:
        for suffix, blocker in [("RES", "reservation"), ("CART", "cart"), ("ORDER", "order")]:
            product = _create(cur, schema, suffix.lower(), f"NEY-{suffix}", stock=3)
            if blocker == "reservation":
                cur.execute(
                    f"UPDATE {schema}.inventory SET quantity_reserved=1 WHERE sku=%s",
                    (f"NEY-{suffix}",),
                )
            elif blocker == "cart":
                cur.execute(f"INSERT INTO {schema}.carts(user_id) VALUES ('u') RETURNING id")
                cart_id = cur.fetchone()[0]
                cur.execute(
                    f"INSERT INTO {schema}.cart_items(cart_id,product_id,sku) VALUES (%s,%s,%s)",
                    (cart_id, product["id"], f"NEY-{suffix}"),
                )
            else:
                cur.execute(f"INSERT INTO {schema}.orders(order_status) VALUES ('confirmed') RETURNING id")
                order_id = cur.fetchone()[0]
                cur.execute(
                    f"INSERT INTO {schema}.order_items(order_id,product_id,sku) VALUES (%s,%s,%s)",
                    (order_id, product["id"], f"NEY-{suffix}"),
                )
            with pytest.raises(psycopg.errors.ObjectNotInPrerequisiteState):
                cur.execute(
                    f"SELECT {schema}.set_product_sku(%s,%s)",
                    (product["id"], f"NEY-{suffix}-NEW"),
                )


def test_direct_product_variant_inventory_and_fk_invariants(pg):
    conn, schema = pg
    with conn.cursor() as cur:
        _create(cur, schema, "invariant-one", None)
        _create(cur, schema, "invariant-two", "NEY-INVARIANT", stock=2)
        checks = [
            f"""SELECT COUNT(*) FROM {schema}.products p
                WHERE NOT EXISTS (
                    SELECT 1 FROM {schema}.product_variants v
                    WHERE v.product_id=p.id AND v.is_active=TRUE)""",
            f"""SELECT COUNT(*) FROM {schema}.product_variants v
                LEFT JOIN {schema}.inventory i ON i.sku=v.sku
                WHERE v.is_active=TRUE AND i.sku IS NULL""",
            f"""SELECT COUNT(*) FROM {schema}.products p
                WHERE p.has_variants=FALSE AND (
                    SELECT COUNT(*) FROM {schema}.product_variants v
                    WHERE v.product_id=p.id AND v.is_active=TRUE) <> 1""",
            f"""SELECT COUNT(*) FROM {schema}.cart_items ci
                LEFT JOIN {schema}.product_variants v ON v.sku=ci.sku
                WHERE ci.sku IS NOT NULL AND v.sku IS NULL""",
            f"""SELECT COUNT(*) FROM {schema}.order_items oi
                LEFT JOIN {schema}.product_variants v ON v.sku=oi.sku
                WHERE oi.sku IS NOT NULL AND v.sku IS NULL""",
            f"""SELECT COUNT(*) FROM {schema}.inventory_transactions tx
                LEFT JOIN {schema}.inventory i ON i.sku=tx.sku
                WHERE i.sku IS NULL""",
        ]
        for query in checks:
            cur.execute(query)
            assert cur.fetchone()[0] == 0


def _run_in_thread(action):
    outcome = {}
    started = threading.Event()

    def runner():
        try:
            started.set()
            action()
            outcome["result"] = "committed"
        except Exception as exc:  # captured for assertions in the parent thread
            outcome["error"] = exc

    thread = threading.Thread(target=runner, daemon=True)
    thread.start()
    return thread, outcome, started


def _wait_until_lock_wait(observer, backend_pid, started):
    assert started.wait(1), "concurrent transaction did not start"
    deadline = time.monotonic() + 5
    while time.monotonic() < deadline:
        with observer.cursor() as cur:
            cur.execute(
                """SELECT wait_event_type
                   FROM pg_stat_activity
                   WHERE pid = %s""",
                (backend_pid,),
            )
            row = cur.fetchone()
        if row and row[0] == "Lock":
            return
        time.sleep(0.02)
    pytest.fail("concurrent transaction never reached the expected lock wait")


def test_reference_first_serializes_then_rejects_rename(pg):
    conn, schema = pg
    product = None
    cart_id = None
    with conn.cursor() as cur:
        product = _create(cur, schema, "reference-first", "NEY-LOCK-A")
        cur.execute(f"INSERT INTO {schema}.carts(user_id) VALUES ('lock-a') RETURNING id")
        cart_id = cur.fetchone()[0]

    first = psycopg.connect(os.environ["NEYGE_TEST_POSTGRES_DSN"])
    second = psycopg.connect(os.environ["NEYGE_TEST_POSTGRES_DSN"])
    try:
        with first.cursor() as cur:
            cur.execute(
                f"INSERT INTO {schema}.cart_items(cart_id,product_id,sku) VALUES (%s,%s,%s)",
                (cart_id, product["id"], "NEY-LOCK-A"),
            )

        def rename():
            with second.cursor() as cur:
                cur.execute("SET LOCAL statement_timeout = '5s'")
                cur.execute(
                    f"SELECT {schema}.set_product_sku(%s,%s)",
                    (product["id"], "NEY-LOCK-A-NEW"),
                )
            second.commit()

        thread, outcome, started = _run_in_thread(rename)
        _wait_until_lock_wait(conn, second.info.backend_pid, started)
        first.commit()
        thread.join(5)
        assert not thread.is_alive(), "rename path deadlocked"
        assert isinstance(
            outcome.get("error"), psycopg.errors.ObjectNotInPrerequisiteState
        )
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT sku,is_active FROM {schema}.product_variants WHERE product_id=%s",
                (product["id"],),
            )
            assert cur.fetchall() == [("NEY-LOCK-A", True)]
    finally:
        first.rollback()
        second.rollback()
        first.close()
        second.close()


def test_rename_first_serializes_then_rejects_old_reference(pg):
    conn, schema = pg
    with conn.cursor() as cur:
        product = _create(cur, schema, "rename-first", "NEY-LOCK-B")
        cur.execute(f"INSERT INTO {schema}.carts(user_id) VALUES ('lock-b') RETURNING id")
        cart_id = cur.fetchone()[0]

    first = psycopg.connect(os.environ["NEYGE_TEST_POSTGRES_DSN"])
    second = psycopg.connect(os.environ["NEYGE_TEST_POSTGRES_DSN"])
    try:
        with first.cursor() as cur:
            cur.execute(
                f"SELECT {schema}.set_product_sku(%s,%s)",
                (product["id"], "NEY-LOCK-B-NEW"),
            )

        def add_old_reference():
            with second.cursor() as cur:
                cur.execute("SET LOCAL statement_timeout = '5s'")
                cur.execute(
                    f"INSERT INTO {schema}.cart_items(cart_id,product_id,sku) VALUES (%s,%s,%s)",
                    (cart_id, product["id"], "NEY-LOCK-B"),
                )
            second.commit()

        thread, outcome, started = _run_in_thread(add_old_reference)
        _wait_until_lock_wait(conn, second.info.backend_pid, started)
        first.commit()
        thread.join(5)
        assert not thread.is_alive(), "reference path deadlocked"
        assert isinstance(outcome.get("error"), psycopg.errors.ForeignKeyViolation)
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT COUNT(*) FROM {schema}.cart_items WHERE sku='NEY-LOCK-B'"
            )
            assert cur.fetchone()[0] == 0
            cur.execute(
                f"""SELECT sku,is_active FROM {schema}.product_variants
                    WHERE product_id=%s ORDER BY sku""",
                (product["id"],),
            )
            assert cur.fetchall() == [
                ("NEY-LOCK-B", False),
                ("NEY-LOCK-B-NEW", True),
            ]
    finally:
        first.rollback()
        second.rollback()
        first.close()
        second.close()


def test_order_reference_first_serializes_then_rejects_rename(pg):
    conn, schema = pg
    with conn.cursor() as cur:
        product = _create(cur, schema, "order-reference-first", "NEY-ORDER-A")
        cur.execute(
            f"INSERT INTO {schema}.orders(order_status) VALUES ('confirmed') RETURNING id"
        )
        order_id = cur.fetchone()[0]

    first = psycopg.connect(os.environ["NEYGE_TEST_POSTGRES_DSN"])
    second = psycopg.connect(os.environ["NEYGE_TEST_POSTGRES_DSN"])
    try:
        with first.cursor() as cur:
            cur.execute(
                f"INSERT INTO {schema}.order_items(order_id,product_id,sku) VALUES (%s,%s,%s)",
                (order_id, product["id"], "NEY-ORDER-A"),
            )

        def rename():
            with second.cursor() as cur:
                cur.execute("SET LOCAL statement_timeout = '5s'")
                cur.execute(
                    f"SELECT {schema}.set_product_sku(%s,%s)",
                    (product["id"], "NEY-ORDER-A-NEW"),
                )
            second.commit()

        thread, outcome, started = _run_in_thread(rename)
        _wait_until_lock_wait(conn, second.info.backend_pid, started)
        first.commit()
        thread.join(5)
        assert not thread.is_alive(), "order/rename path deadlocked"
        assert isinstance(
            outcome.get("error"), psycopg.errors.ObjectNotInPrerequisiteState
        )
    finally:
        first.rollback()
        second.rollback()
        first.close()
        second.close()


def test_rename_first_serializes_then_rejects_old_order_reference(pg):
    conn, schema = pg
    with conn.cursor() as cur:
        product = _create(cur, schema, "order-rename-first", "NEY-ORDER-B")
        cur.execute(
            f"INSERT INTO {schema}.orders(order_status) VALUES ('confirmed') RETURNING id"
        )
        order_id = cur.fetchone()[0]

    first = psycopg.connect(os.environ["NEYGE_TEST_POSTGRES_DSN"])
    second = psycopg.connect(os.environ["NEYGE_TEST_POSTGRES_DSN"])
    try:
        with first.cursor() as cur:
            cur.execute(
                f"SELECT {schema}.set_product_sku(%s,%s)",
                (product["id"], "NEY-ORDER-B-NEW"),
            )

        def add_old_reference():
            with second.cursor() as cur:
                cur.execute("SET LOCAL statement_timeout = '5s'")
                cur.execute(
                    f"INSERT INTO {schema}.order_items(order_id,product_id,sku) VALUES (%s,%s,%s)",
                    (order_id, product["id"], "NEY-ORDER-B"),
                )
            second.commit()

        thread, outcome, started = _run_in_thread(add_old_reference)
        _wait_until_lock_wait(conn, second.info.backend_pid, started)
        first.commit()
        thread.join(5)
        assert not thread.is_alive(), "rename/order path deadlocked"
        assert isinstance(outcome.get("error"), psycopg.errors.ForeignKeyViolation)
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT COUNT(*) FROM {schema}.order_items WHERE sku='NEY-ORDER-B'"
            )
            assert cur.fetchone()[0] == 0
    finally:
        first.rollback()
        second.rollback()
        first.close()
        second.close()


@pytest.mark.parametrize("reference_kind", ["cart", "order"])
def test_normal_active_sku_reference_succeeds(pg, reference_kind):
    conn, schema = pg
    with conn.cursor() as cur:
        product = _create(
            cur, schema, f"active-{reference_kind}", f"NEY-ACTIVE-{reference_kind.upper()}"
        )
        sku = f"NEY-ACTIVE-{reference_kind.upper()}"
        if reference_kind == "cart":
            cur.execute(
                f"INSERT INTO {schema}.carts(user_id) VALUES ('active') RETURNING id"
            )
            parent_id = cur.fetchone()[0]
            cur.execute(
                f"INSERT INTO {schema}.cart_items(cart_id,product_id,sku) VALUES (%s,%s,%s)",
                (parent_id, product["id"], sku),
            )
        else:
            cur.execute(
                f"INSERT INTO {schema}.orders(order_status) VALUES ('confirmed') RETURNING id"
            )
            parent_id = cur.fetchone()[0]
            cur.execute(
                f"INSERT INTO {schema}.order_items(order_id,product_id,sku) VALUES (%s,%s,%s)",
                (parent_id, product["id"], sku),
            )


@pytest.mark.parametrize("reference_kind", ["cart", "order"])
def test_already_inactive_sku_reference_is_rejected(pg, reference_kind):
    conn, schema = pg
    with conn.cursor() as cur:
        product = _create(
            cur, schema, f"inactive-{reference_kind}", f"NEY-OLD-{reference_kind.upper()}"
        )
        old_sku = f"NEY-OLD-{reference_kind.upper()}"
        cur.execute(
            f"SELECT {schema}.set_product_sku(%s,%s)",
            (product["id"], f"NEY-NEW-{reference_kind.upper()}"),
        )
        with pytest.raises(psycopg.errors.ForeignKeyViolation):
            if reference_kind == "cart":
                cur.execute(
                    f"INSERT INTO {schema}.carts(user_id) VALUES ('inactive') RETURNING id"
                )
                parent_id = cur.fetchone()[0]
                cur.execute(
                    f"INSERT INTO {schema}.cart_items(cart_id,product_id,sku) VALUES (%s,%s,%s)",
                    (parent_id, product["id"], old_sku),
                )
            else:
                cur.execute(
                    f"INSERT INTO {schema}.orders(order_status) VALUES ('confirmed') RETURNING id"
                )
                parent_id = cur.fetchone()[0]
                cur.execute(
                    f"INSERT INTO {schema}.order_items(order_id,product_id,sku) VALUES (%s,%s,%s)",
                    (parent_id, product["id"], old_sku),
                )
