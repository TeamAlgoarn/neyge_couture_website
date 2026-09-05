import re
from pathlib import Path


SERVER_ROOT = Path(__file__).resolve().parents[1]
APP_ROOT = SERVER_ROOT / "app"
PREVIEW_BOOTSTRAP = (
    SERVER_ROOT / "migrations" / "preview" / "001_preview_schema_bootstrap.sql"
)
ADDRESS_MIGRATION = SERVER_ROOT / "migrations" / "001_create_addresses_table.sql"
SKU_MIGRATION = SERVER_ROOT / "migrations" / "004_sku_inventory_schema.sql"

REQUIRED_TABLES = [
    "profiles",
    "collections",
    "products",
    "festive_collections",
    "festive_collection_products",
    "carts",
    "cart_items",
    "addresses",
    "orders",
    "payment_sessions",
    "processed_webhook_events",
    "product_variants",
    "inventory",
    "inventory_transactions",
    "order_items",
    "wishlists",
    "reviews",
    "video_bookings",
    "chatbot_leads",
]


def _read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _preview_sql() -> str:
    return _read(PREVIEW_BOOTSTRAP)


def _extract_function(sql: str, schema: str | None, name: str) -> dict[str, str]:
    prefix = rf"{re.escape(schema)}\." if schema else r"(?:public\.)?"
    prefix_attrs_pattern = re.compile(
        rf"CREATE OR REPLACE FUNCTION\s+{prefix}{name}\s*"
        r"\((?P<args>.*?)\)\s*"
        r"RETURNS\s+(?P<returns>[A-Z0-9_]+)\s*"
        r"LANGUAGE\s+(?P<language>[A-Z0-9_]+)\s*"
        r"(?P<attrs>.*?)"
        r"AS\s+\$\$(?P<body>.*?)\$\$;",
        re.IGNORECASE | re.DOTALL,
    )
    suffix_attrs_pattern = re.compile(
        rf"CREATE OR REPLACE FUNCTION\s+{prefix}{name}\s*"
        r"\((?P<args>.*?)\)\s*"
        r"RETURNS\s+(?P<returns>[A-Z0-9_]+)\s*"
        r"AS\s+\$\$(?P<body>.*?)\$\$\s*"
        r"(?P<attrs>.*?);",
        re.IGNORECASE | re.DOTALL,
    )
    match = prefix_attrs_pattern.search(sql) or suffix_attrs_pattern.search(sql)
    assert match, f"Missing function {schema + '.' if schema else ''}{name}"
    return {key: value.strip() for key, value in match.groupdict().items()}


def _normalize_sql(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip()).lower()


def _backend_rpc_names() -> set[str]:
    names = set()
    for path in APP_ROOT.rglob("*.py"):
        if "__pycache__" in path.parts:
            continue
        source = _read(path)
        names.update(re.findall(r"\.rpc\(\s*['\"]([A-Za-z_][A-Za-z0-9_]*)['\"]", source))
    return names


def test_preview_bootstrap_exists_and_creates_preview_schema():
    sql = _preview_sql()

    assert PREVIEW_BOOTSTRAP.is_file()
    assert "PREVIEW ONLY" in sql
    assert "CREATE SCHEMA IF NOT EXISTS preview" in sql


def test_preview_bootstrap_creates_required_application_tables():
    sql = _preview_sql()

    for table in REQUIRED_TABLES:
        assert f"CREATE TABLE IF NOT EXISTS preview.{table}" in sql


def test_preview_bootstrap_has_no_production_ecommerce_mutation_sql():
    sql = _preview_sql()
    forbidden_patterns = [
        r"\bCREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\.",
        r"\bALTER\s+TABLE\s+public\.",
        r"\bDROP\s+TABLE\s+public\.",
        r"\bTRUNCATE\s+TABLE\s+public\.",
        r"\bINSERT\s+INTO\s+public\.",
        r"\bUPDATE\s+public\.",
        r"\bDELETE\s+FROM\s+public\.",
        r"\bCREATE\s+TRIGGER\b.*\bON\s+public\.",
        r"\bCREATE\s+POLICY\b.*\bON\s+public\.",
        r"\bCREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.",
    ]

    for pattern in forbidden_patterns:
        assert not re.search(pattern, sql, flags=re.IGNORECASE | re.DOTALL), pattern


def test_preview_bootstrap_has_no_preview_to_public_ecommerce_foreign_keys():
    sql = _preview_sql()

    assert not re.search(
        r"CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+preview\..*?REFERENCES\s+public\.",
        sql,
        flags=re.IGNORECASE | re.DOTALL,
    )
    assert "REFERENCES public." not in sql


def test_backend_rpc_calls_exist_in_preview_bootstrap():
    sql = _preview_sql()
    backend_rpcs = _backend_rpc_names()

    assert backend_rpcs == {
        "increment_product_stock",
        "set_default_address",
        "delete_address_and_promote",
    }
    for function_name in backend_rpcs:
        assert f"CREATE OR REPLACE FUNCTION preview.{function_name}" in sql
        assert f"GRANT EXECUTE ON FUNCTION preview.{function_name}" in sql


def test_address_delete_rpc_matches_production_contract():
    preview = _extract_function(_preview_sql(), "preview", "delete_address_and_promote")
    production = _extract_function(
        _read(ADDRESS_MIGRATION), None, "delete_address_and_promote"
    )

    assert _normalize_sql(preview["args"]) == _normalize_sql(production["args"])
    assert preview["returns"].upper() == production["returns"].upper() == "VOID"
    assert "SECURITY DEFINER" in preview["attrs"].upper()
    assert "SET search_path = preview, pg_temp" in preview["attrs"]
    assert "preview.addresses" in preview["body"]
    assert "public.addresses" not in preview["body"]
    assert "CREATE OR REPLACE FUNCTION preview.delete_address_with_default" not in _preview_sql()


def test_preview_sku_rpc_contracts_match_production_signatures_and_return_types():
    preview_sql = _preview_sql()
    production_sql = _read(SKU_MIGRATION)

    for function_name in [
        "reserve_sku_stock",
        "release_sku_stock",
        "commit_sku_stock",
    ]:
        preview = _extract_function(preview_sql, "preview", function_name)
        production = _extract_function(production_sql, "public", function_name)

        assert _normalize_sql(preview["args"]) == _normalize_sql(production["args"])
        assert preview["returns"].upper() == production["returns"].upper() == "JSONB"
        assert "SECURITY DEFINER" in preview["attrs"].upper()
        assert "SET search_path = preview, pg_temp" in preview["attrs"]


def test_preview_sku_rpc_jsonb_contract_and_table_targets():
    sql = _preview_sql()

    expected_json_keys = [
        "'success'",
        "'error'",
        "'sku'",
        "'reserved_qty'",
        "'released_qty'",
        "'committed_qty'",
        "'remaining_available'",
        "'remaining_reserved'",
    ]
    for key in expected_json_keys:
        assert key in sql

    for function_name in [
        "reserve_sku_stock",
        "release_sku_stock",
        "commit_sku_stock",
    ]:
        function = _extract_function(sql, "preview", function_name)
        body = function["body"]
        assert "preview.inventory" in body
        assert "public.inventory" not in body
        assert "public.inventory_transactions" not in body

    assert "preview.inventory_transactions" in _extract_function(
        sql, "preview", "commit_sku_stock"
    )["body"]


def test_preview_bootstrap_has_no_default_future_select_grants_to_public_roles():
    sql = _preview_sql()

    assert not re.search(
        r"ALTER\s+DEFAULT\s+PRIVILEGES\s+IN\s+SCHEMA\s+preview\s+GRANT\s+SELECT\s+ON\s+TABLES\s+TO\s+anon",
        sql,
        flags=re.IGNORECASE,
    )
    assert not re.search(
        r"ALTER\s+DEFAULT\s+PRIVILEGES\s+IN\s+SCHEMA\s+preview\s+GRANT\s+SELECT\s+ON\s+TABLES\s+TO\s+.*authenticated",
        sql,
        flags=re.IGNORECASE,
    )


def test_preview_explicit_grants_do_not_expose_sensitive_tables():
    sql = _preview_sql()
    public_tables = {
        "collections",
        "products",
        "festive_collections",
        "product_variants",
        "inventory",
        "reviews",
    }
    sensitive_tables = {
        "carts",
        "cart_items",
        "addresses",
        "orders",
        "order_items",
        "payment_sessions",
        "processed_webhook_events",
        "inventory_transactions",
        "chatbot_leads",
        "video_bookings",
    }

    for table in public_tables:
        assert f"GRANT SELECT ON preview.{table} TO anon, authenticated;" in sql
    for table in sensitive_tables:
        assert f"GRANT SELECT ON preview.{table} TO anon, authenticated;" not in sql


def test_security_definer_functions_use_safe_preview_search_path():
    sql = _preview_sql()
    functions = re.finditer(
        r"CREATE OR REPLACE FUNCTION\s+preview\.([A-Za-z_][A-Za-z0-9_]*)"
        r".*?\$\$;",
        sql,
        flags=re.IGNORECASE | re.DOTALL,
    )

    security_definer_functions = []
    for match in functions:
        definition = match.group(0)
        if "SECURITY DEFINER" not in definition.upper():
            continue
        security_definer_functions.append(match.group(1))
        assert "SET search_path = preview, pg_temp" in definition
        assert "SET search_path = public" not in definition

    assert set(security_definer_functions) == {
        "increment_product_stock",
        "set_default_address",
        "delete_address_and_promote",
        "reserve_sku_stock",
        "release_sku_stock",
        "commit_sku_stock",
    }


def test_expected_preview_tables_have_rls_enabled():
    sql = _preview_sql()
    rls_block = re.search(
        r"FOREACH table_name IN ARRAY ARRAY\[(?P<tables>.*?)\]\s+LOOP\s+"
        r"EXECUTE format\('ALTER TABLE preview\.%I ENABLE ROW LEVEL SECURITY'",
        sql,
        flags=re.IGNORECASE | re.DOTALL,
    )

    assert rls_block
    rls_tables = set(re.findall(r"'([A-Za-z_][A-Za-z0-9_]*)'", rls_block.group("tables")))
    for table in REQUIRED_TABLES:
        assert table in rls_tables
