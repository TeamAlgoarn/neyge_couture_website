-- Preview equivalent of production migration 007.
ALTER TABLE preview.products
    ADD COLUMN IF NOT EXISTS design TEXT,
    ADD COLUMN IF NOT EXISTS zari TEXT,
    ADD COLUMN IF NOT EXISTS certification TEXT,
    ADD COLUMN IF NOT EXISTS brand TEXT NOT NULL DEFAULT 'Neyge Couture';

CREATE OR REPLACE FUNCTION preview.require_active_sku_reference()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = preview, pg_temp AS $$
DECLARE
    v_product_id UUID;
BEGIN
    IF NEW.sku IS NULL THEN RETURN NEW; END IF;

    -- Resolve without locking, then always lock PRODUCT -> VARIANT. The active
    -- check must be a separate statement after the product-lock wait: values
    -- read by the original statement are not refreshed merely because it waits.
    SELECT product_id INTO v_product_id
    FROM preview.product_variants
    WHERE sku = NEW.sku;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'SKU is not active' USING ERRCODE = '23503';
    END IF;

    PERFORM 1 FROM preview.products
    WHERE id = v_product_id
    FOR SHARE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'SKU is not active' USING ERRCODE = '23503';
    END IF;

    PERFORM 1 FROM preview.product_variants
    WHERE sku = NEW.sku
      AND product_id = v_product_id
      AND is_active = TRUE
    FOR SHARE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'SKU is not active' USING ERRCODE = '23503';
    END IF;
    RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_cart_items_require_active_sku ON preview.cart_items;
CREATE TRIGGER trg_cart_items_require_active_sku
BEFORE INSERT OR UPDATE OF sku ON preview.cart_items
FOR EACH ROW EXECUTE FUNCTION preview.require_active_sku_reference();
DROP TRIGGER IF EXISTS trg_order_items_require_active_sku ON preview.order_items;
CREATE TRIGGER trg_order_items_require_active_sku
BEFORE INSERT OR UPDATE OF sku ON preview.order_items
FOR EACH ROW EXECUTE FUNCTION preview.require_active_sku_reference();

CREATE OR REPLACE FUNCTION preview.set_product_sku(
    p_product_id UUID, p_new_sku VARCHAR DEFAULT NULL
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = preview, pg_temp AS $$
DECLARE
    v_requested_sku VARCHAR(100) := NULLIF(UPPER(BTRIM(p_new_sku)), '');
    v_sku VARCHAR(100);
    v_variant preview.product_variants%ROWTYPE;
    v_inventory preview.inventory%ROWTYPE;
    v_active_count INT;
BEGIN
    PERFORM 1 FROM preview.products WHERE id = p_product_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Product not found' USING ERRCODE = 'P0002'; END IF;
    SELECT COUNT(*) INTO v_active_count FROM preview.product_variants
    WHERE product_id = p_product_id AND is_active = TRUE;
    IF v_active_count > 1 THEN
        IF v_requested_sku IS NOT NULL THEN
            RAISE EXCEPTION 'SKU must be managed at variant level for products with multiple variants'
                USING ERRCODE = '22023';
        END IF;
        RETURN jsonb_build_object('sku', NULL, 'created', FALSE, 'multi_variant', TRUE);
    END IF;
    SELECT * INTO v_variant FROM preview.product_variants
    WHERE product_id = p_product_id AND is_active = TRUE
    ORDER BY created_at, id LIMIT 1 FOR UPDATE;
    IF FOUND AND v_requested_sku IS NULL THEN
        RETURN jsonb_build_object('sku', v_variant.sku, 'created', FALSE);
    END IF;
    v_sku := COALESCE(v_requested_sku,
        'NEY-' || UPPER(REPLACE(gen_random_uuid()::TEXT, '-', '')));
    IF v_sku !~ '^[A-Z0-9][A-Z0-9._-]{0,99}$' THEN
        RAISE EXCEPTION 'Invalid SKU format' USING ERRCODE = '22023';
    END IF;
    IF v_active_count = 0 THEN
        LOOP
            BEGIN
                INSERT INTO preview.product_variants (product_id, sku, attributes, is_active)
                SELECT p.id, v_sku, jsonb_build_object(
                    'color', COALESCE(p.color, 'Standard'),
                    'fabric', COALESCE(p.fabric, 'Standard')), TRUE
                FROM preview.products p WHERE p.id = p_product_id;
                EXIT;
            EXCEPTION WHEN unique_violation THEN
                IF v_requested_sku IS NOT NULL THEN
                    RAISE EXCEPTION 'SKU already exists' USING ERRCODE = '23505';
                END IF;
                v_sku := 'NEY-' || UPPER(REPLACE(gen_random_uuid()::TEXT, '-', ''));
            END;
        END LOOP;
        INSERT INTO preview.inventory (sku, quantity_available, quantity_reserved)
        SELECT v_sku, GREATEST(0, COALESCE(stock, 0)), 0
        FROM preview.products WHERE id = p_product_id;
        UPDATE preview.products SET has_variants = FALSE, updated_at = NOW()
        WHERE id = p_product_id;
        RETURN jsonb_build_object('sku', v_sku, 'created', TRUE);
    END IF;
    IF v_variant.sku = v_sku THEN
        RETURN jsonb_build_object('sku', v_sku, 'created', FALSE);
    END IF;
    IF EXISTS (SELECT 1 FROM preview.product_variants WHERE sku = v_sku) THEN
        RAISE EXCEPTION 'SKU already exists' USING ERRCODE = '23505';
    END IF;
    SELECT * INTO v_inventory FROM preview.inventory
    WHERE sku = v_variant.sku FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Current SKU has no inventory row' USING ERRCODE = '23503';
    END IF;
    IF v_inventory.quantity_reserved > 0 THEN
        RAISE EXCEPTION 'SKU cannot be renamed while stock is reserved' USING ERRCODE = '55000';
    END IF;
    IF EXISTS (SELECT 1 FROM preview.cart_items WHERE sku = v_variant.sku) THEN
        RAISE EXCEPTION 'SKU cannot be renamed while it is referenced by a cart' USING ERRCODE = '55000';
    END IF;
    IF EXISTS (
        SELECT 1 FROM preview.order_items oi
        JOIN preview.orders o ON o.id = oi.order_id
        WHERE oi.sku = v_variant.sku
          AND o.order_status NOT IN ('delivered', 'cancelled')
    ) THEN
        RAISE EXCEPTION 'SKU cannot be renamed while it is referenced by an active order'
            USING ERRCODE = '55000';
    END IF;
    INSERT INTO preview.product_variants
        (product_id, sku, attributes, price_override, is_active)
    VALUES (v_variant.product_id, v_sku, v_variant.attributes,
            v_variant.price_override, TRUE);
    INSERT INTO preview.inventory (sku, quantity_available, quantity_reserved)
    VALUES (v_sku, v_inventory.quantity_available, 0);
    UPDATE preview.inventory SET quantity_available = 0, quantity_reserved = 0,
        updated_at = NOW() WHERE sku = v_variant.sku;
    UPDATE preview.product_variants SET is_active = FALSE, updated_at = NOW()
    WHERE id = v_variant.id;
    RETURN jsonb_build_object('sku', v_sku, 'created', FALSE,
                              'renamed_from', v_variant.sku);
END;
$$;

CREATE OR REPLACE FUNCTION preview.create_product_with_sku(
    p_product JSONB, p_requested_sku VARCHAR DEFAULT NULL
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = preview, pg_temp AS $$
DECLARE
    v_product preview.products%ROWTYPE;
    v_sku_result JSONB;
    v_input JSONB;
BEGIN
    v_input := jsonb_build_object(
        'id', gen_random_uuid(), 'images', '[]'::jsonb, 'occasion', '[]'::jsonb,
        'stock', 0, 'is_featured', FALSE, 'is_active', TRUE,
        'tags', '[]'::jsonb, 'has_fall', FALSE, 'fall_price', 0,
        'has_in_skirt', FALSE, 'in_skirt_price', 0, 'has_variants', FALSE,
        'brand', 'Neyge Couture', 'created_at', NOW(), 'updated_at', NOW()
    ) || (p_product - ARRAY['id', 'has_variants', 'created_at', 'updated_at']);
    INSERT INTO preview.products
    SELECT (jsonb_populate_record(NULL::preview.products, v_input)).*
    RETURNING * INTO v_product;
    v_sku_result := preview.set_product_sku(v_product.id, p_requested_sku);
    SELECT * INTO v_product FROM preview.products WHERE id = v_product.id;
    RETURN to_jsonb(v_product) || jsonb_build_object('sku', v_sku_result->>'sku');
END;
$$;

CREATE OR REPLACE FUNCTION preview.update_product_with_sku(
    p_product_id UUID, p_changes JSONB, p_requested_sku VARCHAR DEFAULT NULL
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = preview, pg_temp AS $$
DECLARE
    v_current preview.products%ROWTYPE;
    v_updated preview.products%ROWTYPE;
    v_sku_result JSONB;
BEGIN
    SELECT * INTO v_current FROM preview.products
    WHERE id = p_product_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Product not found' USING ERRCODE = 'P0002'; END IF;
    v_updated := jsonb_populate_record(v_current,
        p_changes - ARRAY['id', 'has_variants', 'created_at', 'updated_at']);
    UPDATE preview.products SET
        name = v_updated.name, slug = v_updated.slug, price = v_updated.price,
        discount_price = v_updated.discount_price, images = v_updated.images,
        thumbnail = v_updated.thumbnail, short_description = v_updated.short_description,
        story = v_updated.story, fabric = v_updated.fabric, color = v_updated.color,
        technique = v_updated.technique, origin = v_updated.origin,
        collection_id = v_updated.collection_id, occasion = v_updated.occasion,
        artisan = v_updated.artisan, stock = v_updated.stock,
        is_featured = v_updated.is_featured, is_active = v_updated.is_active,
        care_instructions = v_updated.care_instructions, tags = v_updated.tags,
        has_fall = v_updated.has_fall, fall_price = v_updated.fall_price,
        has_in_skirt = v_updated.has_in_skirt, in_skirt_price = v_updated.in_skirt_price,
        design = v_updated.design, zari = v_updated.zari,
        certification = v_updated.certification, brand = v_updated.brand,
        updated_at = NOW()
    WHERE id = p_product_id RETURNING * INTO v_updated;
    v_sku_result := preview.set_product_sku(p_product_id, p_requested_sku);
    SELECT * INTO v_updated FROM preview.products WHERE id = p_product_id;
    RETURN to_jsonb(v_updated) || jsonb_build_object('sku', v_sku_result->>'sku');
END;
$$;

REVOKE EXECUTE ON FUNCTION preview.require_active_sku_reference() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION preview.set_product_sku(UUID, VARCHAR) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION preview.create_product_with_sku(JSONB, VARCHAR) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION preview.update_product_with_sku(UUID, JSONB, VARCHAR) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION preview.set_product_sku(UUID, VARCHAR) TO service_role;
GRANT EXECUTE ON FUNCTION preview.create_product_with_sku(JSONB, VARCHAR) TO service_role;
GRANT EXECUTE ON FUNCTION preview.update_product_with_sku(UUID, JSONB, VARCHAR) TO service_role;
