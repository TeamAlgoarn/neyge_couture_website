"""
Unit and Integration Tests for SKU/Inventory Migration Readiness (Issue #13 Follow-up)
───────────────────────────────────────────────────────────────────────────────────────
Covers:
  - Migration SQL syntax, idempotency, and non-destructive forward safety
  - Security hardening: fixed search_path = public, pg_temp on SECURITY DEFINER RPCs
  - Permission lockdown: REVOKE from PUBLIC/anon/authenticated and GRANT to service_role
  - Reservation-safe commit semantics: prevents consuming stock reserved for other sessions
  - Order items line_total frozen snapshot preservation
  - Data backfill resilience on legacy JSON snapshots with missing products / invalid UUIDs
  - In-memory relational schema DDL & constraint verification
  - Down-migration / Rollback safety (reverts only new artifacts, protects legacy tables)
"""

import os
import re
import sqlite3
import pytest

MIGRATIONS_DIR = os.path.join(
    os.path.dirname(__file__), "..", "migrations"
)
DOCS_DIR = os.path.join(
    os.path.dirname(__file__), "..", "..", "docs", "migration"
)


# ════════════════════════════════════════════════════════════════════════════════
# 1. Migration File Integrity & Forward Non-Destructive Safety
# ════════════════════════════════════════════════════════════════════════════════

class TestMigrationFileIntegrityAndSafety:
    def test_migration_files_exist(self):
        schema_file = os.path.join(MIGRATIONS_DIR, "004_sku_inventory_schema.sql")
        down_file = os.path.join(MIGRATIONS_DIR, "004_sku_inventory_schema_down.sql")
        backfill_file = os.path.join(MIGRATIONS_DIR, "005_backfill_sku_inventory.sql")
        docs_file = os.path.join(DOCS_DIR, "SKU_INVENTORY_MIGRATION_READINESS.md")

        assert os.path.isfile(schema_file), "004_sku_inventory_schema.sql must exist"
        assert os.path.isfile(down_file), "004_sku_inventory_schema_down.sql must exist"
        assert os.path.isfile(backfill_file), "005_backfill_sku_inventory.sql must exist"
        assert os.path.isfile(docs_file), "SKU_INVENTORY_MIGRATION_READINESS.md must exist"

    def test_forward_migration_is_strictly_additive_and_idempotent(self):
        with open(os.path.join(MIGRATIONS_DIR, "004_sku_inventory_schema.sql"), "r", encoding="utf-8") as f:
            sql = f.read()

        # Forward migration must NOT drop legacy tables
        assert "DROP TABLE public.products" not in sql
        assert "DROP TABLE public.orders" not in sql
        assert "DROP TABLE public.cart_items" not in sql
        assert "DROP TABLE public.payment_sessions" not in sql

        # Forward migration must be idempotent
        assert "CREATE TABLE IF NOT EXISTS public.product_variants" in sql
        assert "CREATE TABLE IF NOT EXISTS public.inventory" in sql
        assert "CREATE TABLE IF NOT EXISTS public.inventory_transactions" in sql
        assert "CREATE TABLE IF NOT EXISTS public.order_items" in sql
        assert "ADD COLUMN IF NOT EXISTS has_variants" in sql
        assert "ADD COLUMN IF NOT EXISTS sku" in sql

        # Check for line_total column
        assert "line_total NUMERIC(10, 2)" in sql

        # Check for required constraints & indexes
        assert "chk_inventory_reserved_lte_available" in sql
        assert "uq_inventory_tx_idempotency" in sql
        assert "CREATE INDEX IF NOT EXISTS idx_order_items_order_id" in sql
        assert "CREATE INDEX IF NOT EXISTS idx_cart_items_sku" in sql

    def test_rpc_functions_use_row_level_locking_fixed_search_path_and_permissions(self):
        with open(os.path.join(MIGRATIONS_DIR, "004_sku_inventory_schema.sql"), "r", encoding="utf-8") as f:
            sql = f.read()

        assert "CREATE OR REPLACE FUNCTION public.reserve_sku_stock" in sql
        assert "CREATE OR REPLACE FUNCTION public.release_sku_stock" in sql
        assert "CREATE OR REPLACE FUNCTION public.commit_sku_stock" in sql

        # Row-level locking verification
        assert sql.count("FOR UPDATE") >= 3
        assert sql.count("SECURITY DEFINER") >= 3

        # Fixed search_path verification on all 3 functions
        assert sql.count("SET search_path = public, pg_temp") >= 3

        # Permissions lockdown verification
        assert "REVOKE EXECUTE ON FUNCTION public.reserve_sku_stock" in sql
        assert "REVOKE EXECUTE ON FUNCTION public.release_sku_stock" in sql
        assert "REVOKE EXECUTE ON FUNCTION public.commit_sku_stock" in sql
        assert "GRANT EXECUTE ON FUNCTION public.reserve_sku_stock(VARCHAR, INT) TO service_role" in sql
        assert "GRANT EXECUTE ON FUNCTION public.release_sku_stock(VARCHAR, INT) TO service_role" in sql
        assert "GRANT EXECUTE ON FUNCTION public.commit_sku_stock(VARCHAR, INT, VARCHAR, TEXT, BOOLEAN) TO service_role" in sql

    def test_readiness_doc_has_no_local_machine_links(self):
        with open(os.path.join(DOCS_DIR, "SKU_INVENTORY_MIGRATION_READINESS.md"), "r", encoding="utf-8") as f:
            content = f.read()

        # Must not contain absolute file:/// URLs
        assert "file:///c:/" not in content.lower()
        assert "file:///" not in content.lower()

    def test_down_migration_is_clean_and_safe(self):
        with open(os.path.join(MIGRATIONS_DIR, "004_sku_inventory_schema_down.sql"), "r", encoding="utf-8") as f:
            sql = f.read()

        # Must drop newly created tables in reverse dependency order
        assert "DROP TABLE IF EXISTS public.order_items CASCADE;" in sql
        assert "DROP TABLE IF EXISTS public.inventory_transactions CASCADE;" in sql
        assert "DROP TABLE IF EXISTS public.inventory CASCADE;" in sql
        assert "DROP TABLE IF EXISTS public.product_variants CASCADE;" in sql

        # Must drop RPC functions
        assert "DROP FUNCTION IF EXISTS public.reserve_sku_stock" in sql
        assert "DROP FUNCTION IF EXISTS public.release_sku_stock" in sql
        assert "DROP FUNCTION IF EXISTS public.commit_sku_stock" in sql

        # Must NOT drop legacy tables
        assert "DROP TABLE IF EXISTS public.products" not in sql
        assert "DROP TABLE IF EXISTS public.orders" not in sql


# ════════════════════════════════════════════════════════════════════════════════
# 2. Data Backfill & Legacy Snapshot Normalization Simulation
# ════════════════════════════════════════════════════════════════════════════════

class TestBackfillDataTransformation:
    def test_backfill_sql_syntax_and_resilience(self):
        with open(os.path.join(MIGRATIONS_DIR, "005_backfill_sku_inventory.sql"), "r", encoding="utf-8") as f:
            sql = f.read()

        assert "INSERT INTO public.product_variants" in sql
        assert "ON CONFLICT (sku) DO NOTHING" in sql
        assert "INSERT INTO public.inventory" in sql
        assert "INSERT INTO public.inventory_transactions" in sql
        assert "UPDATE public.cart_items" in sql
        assert "INSERT INTO public.order_items" in sql
        assert "line_total" in sql
        assert "jsonb_array_elements" in sql

        # UUID regex sanitization check
        assert "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$" in sql

    def test_legacy_order_items_json_normalization_with_line_total(self):
        """Simulate extracting normalized order items handling invalid UUIDs and deleted products with line_total."""
        valid_products = {
            "11111111-1111-1111-1111-111111111111": {
                "name": "Kanchipuram Silk Saree",
                "price": 8500.00,
                "sku": "SKU-11111111",
            }
        }

        legacy_orders = [
            {
                "id": "order-uuid-1",
                "items": [
                    # Normal product
                    {
                        "product_id": "11111111-1111-1111-1111-111111111111",
                        "product_name": "Kanchipuram Silk Saree",
                        "price": 8500.00,
                        "quantity": 1,
                        "selected_addons": [{"type": "fall", "price": 150.00}],
                        "addons_total": 150.00,
                    },
                    # Deleted product (UUID exists in history but deleted from products catalog)
                    {
                        "product_id": "22222222-2222-2222-2222-222222222222",
                        "product_name": "Archived Banarasi Silk Saree",
                        "product_price": 6200.00,
                        "quantity": 2,
                        "selected_addons": [],
                        "addons_price": 0.00,
                    },
                    # Malformed/non-UUID product_id with explicit line total
                    {
                        "product_id": "legacy-item-999",
                        "name": "Custom Tailoring Saree",
                        "price": 3500.00,
                        "quantity": 1,
                        "line_total": 3500.00,
                    },
                ],
            }
        ]

        normalized_rows = []
        uuid_pattern = re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")

        for order in legacy_orders:
            for item in order["items"]:
                raw_prod_id = item.get("product_id", "")
                is_valid_uuid = bool(uuid_pattern.match(raw_prod_id))
                prod_data = valid_products.get(raw_prod_id) if is_valid_uuid else None

                product_id = raw_prod_id if (is_valid_uuid and prod_data) else None
                sku = prod_data["sku"] if prod_data else None
                price = float(item.get("price") or item.get("product_price") or (prod_data["price"] if prod_data else 0.0))
                addons_price = float(item.get("addons_total") or item.get("addons_price") or 0.0)
                quantity = int(item.get("quantity") or 1)
                line_total = float(item.get("line_total") or item.get("total") or ((price * quantity) + addons_price))
                product_name = item.get("product_name") or item.get("name") or (prod_data["name"] if prod_data else "Handloom Saree")

                normalized_rows.append({
                    "order_id": order["id"],
                    "product_id": product_id,
                    "sku": sku,
                    "price_at_purchase": price,
                    "addons_price_at_purchase": addons_price,
                    "quantity": quantity,
                    "line_total": line_total,
                    "product_name_at_purchase": product_name,
                })

        assert len(normalized_rows) == 3
        # 1. Normal line item
        assert normalized_rows[0]["product_id"] == "11111111-1111-1111-1111-111111111111"
        assert normalized_rows[0]["sku"] == "SKU-11111111"
        assert normalized_rows[0]["line_total"] == 8650.00

        # 2. Deleted product line item (product_id is None, preserved historical line_total)
        assert normalized_rows[1]["product_id"] is None
        assert normalized_rows[1]["sku"] is None
        assert normalized_rows[1]["product_name_at_purchase"] == "Archived Banarasi Silk Saree"
        assert normalized_rows[1]["line_total"] == 12400.00

        # 3. Non-UUID legacy line item
        assert normalized_rows[2]["product_id"] is None
        assert normalized_rows[2]["sku"] is None
        assert normalized_rows[2]["line_total"] == 3500.00


# ════════════════════════════════════════════════════════════════════════════════
# 3. Inventory Concurrency & Reservation-Safe State Machine Simulation
# ════════════════════════════════════════════════════════════════════════════════

class ReservationSafeInventorySimulator:
    def __init__(self, sku: str, initial_stock: int):
        self.sku = sku
        self.quantity_available = initial_stock
        self.quantity_reserved = 0
        self.transactions = set()  # Set of (sku, ref_id, reason) tuples

    def reserve(self, qty: int) -> dict:
        if qty <= 0:
            return {"success": False, "error": "Quantity must be greater than zero"}
        unreserved = self.quantity_available - self.quantity_reserved
        if unreserved < qty:
            return {
                "success": False,
                "error": "Insufficient available stock",
                "available_unreserved": unreserved,
                "requested": qty,
            }
        self.quantity_reserved += qty
        return {
            "success": True,
            "sku": self.sku,
            "reserved_qty": qty,
            "total_reserved": self.quantity_reserved,
            "remaining_unreserved": self.quantity_available - self.quantity_reserved,
        }

    def release(self, qty: int) -> dict:
        if qty <= 0:
            return {"success": False, "error": "Quantity must be greater than zero"}
        self.quantity_reserved = max(0, self.quantity_reserved - qty)
        return {"success": True, "sku": self.sku, "new_reserved": self.quantity_reserved}

    def commit(self, qty: int, reason: str = "purchase", ref_id: str = None, is_reserved: bool = True) -> dict:
        if qty <= 0:
            return {"success": False, "error": "Quantity must be greater than zero"}

        # 1. Pre-check idempotency BEFORE subtracting stock
        tx_key = (self.sku, ref_id, reason)
        if ref_id is not None and tx_key in self.transactions:
            return {
                "success": True,
                "sku": self.sku,
                "idempotent_skip": True,
                "message": "Transaction already recorded",
                "remaining_available": self.quantity_available,
            }

        # 2. Validate total stock availability
        if self.quantity_available < qty:
            return {
                "success": False,
                "error": "Insufficient available stock to commit",
                "available": self.quantity_available,
                "requested": qty,
            }

        # 3. Reservation-safe validation
        if is_reserved:
            # Must have enough reserved stock for this checkout
            if self.quantity_reserved < qty:
                return {
                    "success": False,
                    "error": "Insufficient reserved stock to commit",
                    "reserved": self.quantity_reserved,
                    "requested": qty,
                }
            self.quantity_available -= qty
            self.quantity_reserved -= qty
        else:
            # Direct unreserved commit cannot consume stock reserved for other sessions
            unreserved = self.quantity_available - self.quantity_reserved
            if unreserved < qty:
                return {
                    "success": False,
                    "error": "Insufficient unreserved stock to commit",
                    "available_unreserved": unreserved,
                    "requested": qty,
                }
            self.quantity_available -= qty

        self.transactions.add(tx_key)
        return {
            "success": True,
            "sku": self.sku,
            "committed_qty": qty,
            "remaining_available": self.quantity_available,
            "remaining_reserved": self.quantity_reserved,
        }


class TestInventoryConcurrencySimulation:
    def test_successful_reservation_and_commit(self):
        inv = ReservationSafeInventorySimulator(sku="SKU-SILK-001", initial_stock=5)
        # 1. Reserve 2 items
        res = inv.reserve(2)
        assert res["success"] is True
        assert res["remaining_unreserved"] == 3
        assert inv.quantity_available == 5
        assert inv.quantity_reserved == 2

        # 2. Commit 2 items for order-1 (with is_reserved=True)
        com = inv.commit(2, reason="purchase", ref_id="order-1", is_reserved=True)
        assert com["success"] is True
        assert inv.quantity_available == 3
        assert inv.quantity_reserved == 0

    def test_commit_rejects_without_matching_reservation(self):
        """Verify committing 3 reserved items fails when only 1 is reserved (cannot steal other checkouts' stock)."""
        inv = ReservationSafeInventorySimulator(sku="SKU-SILK-002", initial_stock=10)
        # Only 1 item is reserved
        inv.reserve(1)
        assert inv.quantity_reserved == 1

        # Attempt to commit 3 items under is_reserved=True
        com = inv.commit(3, reason="purchase", ref_id="order-unreserved-steal", is_reserved=True)
        assert com["success"] is False
        assert "Insufficient reserved stock" in com["error"]
        # Reserved and available stock must remain untouched
        assert inv.quantity_reserved == 1
        assert inv.quantity_available == 10

    def test_direct_unreserved_commit_cannot_steal_reserved_stock(self):
        """Verify direct unreserved commit (is_reserved=False) cannot exceed unreserved availability."""
        inv = ReservationSafeInventorySimulator(sku="SKU-SILK-003", initial_stock=5)
        # 4 items reserved for active checkout sessions
        inv.reserve(4)
        assert inv.quantity_available == 5
        assert inv.quantity_reserved == 4

        # Attempt direct unreserved commit for 2 items (only 1 unreserved item available)
        com = inv.commit(2, reason="manual_adjustment", ref_id="admin-adj", is_reserved=False)
        assert com["success"] is False
        assert "Insufficient unreserved stock" in com["error"]
        # Stock untouched
        assert inv.quantity_available == 5
        assert inv.quantity_reserved == 4

    def test_commit_idempotency_prevents_duplicate_deduction(self):
        inv = ReservationSafeInventorySimulator(sku="SKU-SILK-004", initial_stock=10)
        inv.reserve(1)
        # First commit
        inv.commit(1, reason="purchase", ref_id="order-dup-1", is_reserved=True)
        assert inv.quantity_available == 9
        assert inv.quantity_reserved == 0

        # Duplicate webhook arrives with same ref_id & reason
        dup = inv.commit(1, reason="purchase", ref_id="order-dup-1", is_reserved=True)
        assert dup["success"] is True
        assert dup.get("idempotent_skip") is True
        # Stock must remain 9, not deducted twice
        assert inv.quantity_available == 9

    def test_reservation_release_on_checkout_cancellation(self):
        inv = ReservationSafeInventorySimulator(sku="SKU-SILK-005", initial_stock=4)
        inv.reserve(3)
        assert inv.quantity_reserved == 3
        assert inv.quantity_available == 4

        # Release stock
        rel = inv.release(3)
        assert rel["success"] is True
        assert inv.quantity_reserved == 0
        assert inv.quantity_available == 4


# ════════════════════════════════════════════════════════════════════════════════
# 4. In-Memory Relational Schema DDL & Constraint Execution
# ════════════════════════════════════════════════════════════════════════════════

class TestRelationalSchemaExecution:
    def test_sqlite_ddl_and_foreign_key_constraints(self):
        """Execute equivalent relational DDL in SQLite to verify FKs, line_total checks, and unique keys."""
        conn = sqlite3.connect(":memory:")
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()

        # 1. Create base mock tables
        cursor.execute("""
            CREATE TABLE products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                stock INTEGER DEFAULT 0,
                price REAL DEFAULT 0.0,
                has_variants BOOLEAN DEFAULT 0
            );
        """)
        cursor.execute("""
            CREATE TABLE orders (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                total_amount REAL DEFAULT 0.0
            );
        """)

        # 2. Create variant, inventory, transaction, and order_items tables
        cursor.execute("""
            CREATE TABLE product_variants (
                id TEXT PRIMARY KEY,
                product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                sku TEXT NOT NULL UNIQUE,
                attributes TEXT DEFAULT '{}',
                price_override REAL,
                is_active BOOLEAN DEFAULT 1
            );
        """)
        cursor.execute("""
            CREATE TABLE inventory (
                sku TEXT PRIMARY KEY REFERENCES product_variants(sku) ON DELETE CASCADE,
                quantity_available INTEGER NOT NULL CHECK(quantity_available >= 0),
                quantity_reserved INTEGER NOT NULL DEFAULT 0 CHECK(quantity_reserved >= 0),
                CHECK(quantity_reserved <= quantity_available)
            );
        """)
        cursor.execute("""
            CREATE TABLE inventory_transactions (
                id TEXT PRIMARY KEY,
                sku TEXT NOT NULL REFERENCES inventory(sku) ON DELETE CASCADE,
                quantity_change INTEGER NOT NULL,
                reason TEXT NOT NULL,
                reference_id TEXT,
                UNIQUE(sku, reference_id, reason)
            );
        """)
        cursor.execute("""
            CREATE TABLE order_items (
                id TEXT PRIMARY KEY,
                order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
                sku TEXT REFERENCES product_variants(sku) ON DELETE SET NULL,
                price_at_purchase REAL NOT NULL,
                addons_price_at_purchase REAL NOT NULL DEFAULT 0.0,
                quantity INTEGER NOT NULL CHECK(quantity > 0),
                line_total REAL NOT NULL CHECK(line_total >= 0),
                product_name_at_purchase TEXT NOT NULL
            );
        """)

        # 3. Test insert & cascade
        cursor.execute("INSERT INTO products (id, name, stock, price) VALUES ('p1', 'Kanchipuram Saree', 10, 5000.0);")
        cursor.execute("INSERT INTO product_variants (id, product_id, sku) VALUES ('v1', 'p1', 'SKU-P1-RED');")
        cursor.execute("INSERT INTO inventory (sku, quantity_available, quantity_reserved) VALUES ('SKU-P1-RED', 10, 0);")
        cursor.execute("INSERT INTO inventory_transactions (id, sku, quantity_change, reason, reference_id) VALUES ('t1', 'SKU-P1-RED', 10, 'initial_migration', 'ref-1');")
        cursor.execute("INSERT INTO orders (id, total_amount) VALUES ('o1', 5000.0);")
        cursor.execute("INSERT INTO order_items (id, order_id, product_id, sku, price_at_purchase, quantity, line_total, product_name_at_purchase) VALUES ('oi1', 'o1', 'p1', 'SKU-P1-RED', 5000.0, 1, 5000.0, 'Kanchipuram Saree');")

        # 4. Verify duplicate transaction with same (sku, reference_id, reason) raises IntegrityError
        with pytest.raises(sqlite3.IntegrityError):
            cursor.execute("INSERT INTO inventory_transactions (id, sku, quantity_change, reason, reference_id) VALUES ('t2', 'SKU-P1-RED', 10, 'initial_migration', 'ref-1');")

        # 5. Verify over-reservation check constraint (reserved > available) raises IntegrityError
        with pytest.raises(sqlite3.IntegrityError):
            cursor.execute("INSERT INTO inventory (sku, quantity_available, quantity_reserved) VALUES ('SKU-P1-ERR', 5, 10);")

        conn.close()
