-- Preview-schema equivalent of production migration 007.

ALTER TABLE preview.products
    ADD COLUMN IF NOT EXISTS design TEXT,
    ADD COLUMN IF NOT EXISTS zari TEXT,
    ADD COLUMN IF NOT EXISTS certification TEXT,
    ADD COLUMN IF NOT EXISTS brand TEXT NOT NULL DEFAULT 'Neyge Couture';

CREATE OR REPLACE FUNCTION preview.set_product_sku(
    p_product_id UUID,
    p_new_sku VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = preview, pg_temp
AS $$
DECLARE
    v_sku VARCHAR(100) := UPPER(BTRIM(p_new_sku));
    v_variant preview.product_variants%ROWTYPE;
BEGIN
    IF v_sku IS NULL OR v_sku !~ '^[A-Z0-9][A-Z0-9._-]{0,99}$' THEN
        RAISE EXCEPTION 'Invalid SKU format' USING ERRCODE = '22023';
    END IF;

    PERFORM 1 FROM preview.products WHERE id = p_product_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found' USING ERRCODE = 'P0002';
    END IF;

    IF EXISTS (
        SELECT 1 FROM preview.product_variants
        WHERE sku = v_sku AND product_id <> p_product_id
    ) THEN
        RAISE EXCEPTION 'SKU already exists' USING ERRCODE = '23505';
    END IF;

    IF (
        SELECT COUNT(*) FROM preview.product_variants
        WHERE product_id = p_product_id AND is_active = TRUE
    ) > 1 THEN
        RAISE EXCEPTION 'SKU must be managed at variant level for products with multiple variants'
            USING ERRCODE = '22023';
    END IF;

    SELECT * INTO v_variant
    FROM preview.product_variants
    WHERE product_id = p_product_id AND is_active = TRUE
    ORDER BY created_at
    LIMIT 1
    FOR UPDATE;

    IF NOT FOUND THEN
        INSERT INTO preview.product_variants (product_id, sku, attributes, is_active)
        SELECT p.id, v_sku,
               jsonb_build_object(
                   'color', COALESCE(p.color, 'Standard'),
                   'fabric', COALESCE(p.fabric, 'Standard')
               ),
               TRUE
        FROM preview.products p
        WHERE p.id = p_product_id;

        INSERT INTO preview.inventory (sku, quantity_available, quantity_reserved)
        SELECT v_sku, GREATEST(0, COALESCE(stock, 0)), 0
        FROM preview.products
        WHERE id = p_product_id
        ON CONFLICT (sku) DO NOTHING;

        RETURN jsonb_build_object('sku', v_sku, 'created', TRUE);
    END IF;

    IF v_variant.sku = v_sku THEN
        RETURN jsonb_build_object('sku', v_sku, 'created', FALSE);
    END IF;

    INSERT INTO preview.product_variants (
        product_id, sku, attributes, price_override, is_active, created_at, updated_at
    )
    VALUES (
        v_variant.product_id, v_sku, v_variant.attributes,
        v_variant.price_override, v_variant.is_active,
        v_variant.created_at, NOW()
    );

    INSERT INTO preview.inventory (sku, quantity_available, quantity_reserved, updated_at)
    SELECT v_sku, quantity_available, quantity_reserved, NOW()
    FROM preview.inventory
    WHERE sku = v_variant.sku
    ON CONFLICT (sku) DO NOTHING;

    IF NOT FOUND THEN
        INSERT INTO preview.inventory (sku, quantity_available, quantity_reserved)
        SELECT v_sku, GREATEST(0, COALESCE(stock, 0)), 0
        FROM preview.products
        WHERE id = p_product_id
        ON CONFLICT (sku) DO NOTHING;
    END IF;

    UPDATE preview.inventory_transactions SET sku = v_sku WHERE sku = v_variant.sku;
    UPDATE preview.cart_items SET sku = v_sku WHERE sku = v_variant.sku;
    UPDATE preview.order_items SET sku = v_sku WHERE sku = v_variant.sku;
    DELETE FROM preview.inventory WHERE sku = v_variant.sku;
    DELETE FROM preview.product_variants WHERE id = v_variant.id;

    RETURN jsonb_build_object('sku', v_sku, 'created', FALSE);
END;
$$;

REVOKE EXECUTE ON FUNCTION preview.set_product_sku(UUID, VARCHAR) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION preview.set_product_sku(UUID, VARCHAR) TO service_role;
