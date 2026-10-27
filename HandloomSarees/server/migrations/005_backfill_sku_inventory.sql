-- ============================================================================
-- Migration 005: SKU & Inventory Data Backfill (Issue #13)
-- Idempotently seeds default product_variants, inventory baselines,
-- initial inventory transactions, cart item SKUs, and normalizes order_items.
--
-- Resilient to historical data quirks: missing/deleted products, non-UUID keys,
-- and unmapped SKUs without violating relational constraints.
-- Preserves complete frozen order snapshots including line_total.
-- Safe to execute repeatedly without duplicating records or corrupting data.
-- ============================================================================

DO $$
DECLARE
    v_var_count INT := 0;
    v_inv_count INT := 0;
    v_cart_count INT := 0;
    v_order_items_count INT := 0;
BEGIN
    RAISE NOTICE 'Starting SKU & Inventory Data Backfill...';

    -- 1. Generate default product_variants for all existing products lacking variants
    INSERT INTO public.product_variants (
        product_id,
        sku,
        attributes,
        price_override,
        is_active,
        created_at,
        updated_at
    )
    SELECT
        p.id AS product_id,
        'SKU-' || UPPER(REPLACE(SUBSTRING(p.id::text FROM 1 FOR 8), '-', '')) AS sku,
        jsonb_build_object(
            'color', COALESCE(p.color, 'Standard'),
            'fabric', COALESCE(p.fabric, 'Standard')
        ) AS attributes,
        NULL AS price_override,
        TRUE AS is_active,
        NOW() AS created_at,
        NOW() AS updated_at
    FROM public.products p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.product_variants pv WHERE pv.product_id = p.id
    )
    ON CONFLICT (sku) DO NOTHING;

    GET DIAGNOSTICS v_var_count = ROW_COUNT;
    RAISE NOTICE 'Created % default product variants', v_var_count;


    -- 2. Seed inventory table from products stock for all variants
    INSERT INTO public.inventory (
        sku,
        quantity_available,
        quantity_reserved,
        updated_at
    )
    SELECT
        pv.sku,
        GREATEST(0, COALESCE(p.stock, 0)) AS quantity_available,
        0 AS quantity_reserved,
        NOW() AS updated_at
    FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id
    ON CONFLICT (sku) DO UPDATE
    SET quantity_available = EXCLUDED.quantity_available,
        updated_at = NOW()
    WHERE public.inventory.quantity_available = 0;

    GET DIAGNOSTICS v_inv_count = ROW_COUNT;
    RAISE NOTICE 'Seeded % inventory records', v_inv_count;


    -- 3. Create initial inventory transaction audit records (idempotent)
    INSERT INTO public.inventory_transactions (
        sku,
        quantity_change,
        reason,
        reference_id,
        created_at
    )
    SELECT
        pv.sku,
        GREATEST(0, COALESCE(p.stock, 0)) AS quantity_change,
        'initial_migration' AS reason,
        'MIGRATION-005-' || pv.sku AS reference_id,
        NOW() AS created_at
    FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id
    ON CONFLICT (sku, reference_id, reason) DO NOTHING;


    -- 4. Update cart_items with corresponding default product variant SKUs
    UPDATE public.cart_items ci
    SET sku = pv.sku
    FROM public.product_variants pv
    WHERE ci.product_id = pv.product_id
      AND ci.sku IS NULL;

    GET DIAGNOSTICS v_cart_count = ROW_COUNT;
    RAISE NOTICE 'Updated % cart_items with SKUs', v_cart_count;


    -- 5. Normalize legacy orders.items JSON snapshots into order_items rows
    -- Handles missing products, non-UUID identifiers, and missing variant SKUs gracefully
    INSERT INTO public.order_items (
        order_id,
        product_id,
        sku,
        selected_addons,
        price_at_purchase,
        addons_price_at_purchase,
        quantity,
        line_total,
        product_name_at_purchase,
        variant_attributes_at_purchase,
        created_at
    )
    SELECT
        o.id AS order_id,
        -- Set product_id only if it references an existing product in public.products
        p.id AS product_id,
        -- Set sku only if it exists in public.product_variants, else NULL
        COALESCE(pv_explicit.sku, pv_product.sku, NULL) AS sku,
        -- Selected Add-ons JSON array
        CASE
            WHEN jsonb_typeof(item->'selected_addons') = 'array' THEN item->'selected_addons'
            ELSE '[]'::jsonb
        END AS selected_addons,
        -- Price snapshot
        COALESCE(
            CASE WHEN (item->>'price') ~ '^[0-9]+(\.[0-9]+)?$' THEN (item->>'price')::numeric ELSE NULL END,
            CASE WHEN (item->>'product_price') ~ '^[0-9]+(\.[0-9]+)?$' THEN (item->>'product_price')::numeric ELSE NULL END,
            p.price,
            0.00
        ) AS price_at_purchase,
        -- Add-ons price snapshot
        COALESCE(
            CASE WHEN (item->>'addons_total') ~ '^[0-9]+(\.[0-9]+)?$' THEN (item->>'addons_total')::numeric ELSE NULL END,
            CASE WHEN (item->>'addons_price') ~ '^[0-9]+(\.[0-9]+)?$' THEN (item->>'addons_price')::numeric ELSE NULL END,
            0.00
        ) AS addons_price_at_purchase,
        -- Quantity
        GREATEST(
            1,
            COALESCE(
                CASE WHEN (item->>'quantity') ~ '^[0-9]+$' THEN (item->>'quantity')::int ELSE NULL END,
                1
            )
        ) AS quantity,
        -- Line total frozen snapshot
        COALESCE(
            CASE WHEN (item->>'line_total') ~ '^[0-9]+(\.[0-9]+)?$' THEN (item->>'line_total')::numeric ELSE NULL END,
            CASE WHEN (item->>'total') ~ '^[0-9]+(\.[0-9]+)?$' THEN (item->>'total')::numeric ELSE NULL END,
            (
                (COALESCE(
                    CASE WHEN (item->>'price') ~ '^[0-9]+(\.[0-9]+)?$' THEN (item->>'price')::numeric ELSE NULL END,
                    CASE WHEN (item->>'product_price') ~ '^[0-9]+(\.[0-9]+)?$' THEN (item->>'product_price')::numeric ELSE NULL END,
                    p.price,
                    0.00
                ) * GREATEST(1, COALESCE(CASE WHEN (item->>'quantity') ~ '^[0-9]+$' THEN (item->>'quantity')::int ELSE NULL END, 1)))
                + COALESCE(
                    CASE WHEN (item->>'addons_total') ~ '^[0-9]+(\.[0-9]+)?$' THEN (item->>'addons_total')::numeric ELSE NULL END,
                    CASE WHEN (item->>'addons_price') ~ '^[0-9]+(\.[0-9]+)?$' THEN (item->>'addons_price')::numeric ELSE NULL END,
                    0.00
                )
            ),
            0.00
        ) AS line_total,
        -- Product name snapshot
        COALESCE(item->>'product_name', item->>'name', p.name, 'Handloom Saree') AS product_name_at_purchase,
        -- Variant attributes snapshot
        CASE
            WHEN jsonb_typeof(item->'variant_attributes') = 'object' THEN item->'variant_attributes'
            WHEN jsonb_typeof(item->'attributes') = 'object' THEN item->'attributes'
            ELSE '{}'::jsonb
        END AS variant_attributes_at_purchase,
        COALESCE(o.created_at, NOW()) AS created_at
    FROM public.orders o
    CROSS JOIN LATERAL jsonb_array_elements(
        CASE
            WHEN jsonb_typeof(o.items) = 'array' THEN o.items
            ELSE '[]'::jsonb
        END
    ) AS item
    -- Safe UUID product join using guarded CASE to prevent invalid UUID syntax casting errors
    LEFT JOIN public.products p ON (
        p.id = (
            CASE
                WHEN (item->>'product_id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
                THEN (item->>'product_id')::uuid
                ELSE NULL
            END
        )
    )
    -- Explicit variant lookup by SKU string
    LEFT JOIN public.product_variants pv_explicit ON (
        (item->>'sku') IS NOT NULL
        AND pv_explicit.sku = (item->>'sku')
    )
    -- Fallback variant lookup by resolved product_id
    LEFT JOIN public.product_variants pv_product ON (
        p.id IS NOT NULL
        AND pv_product.product_id = p.id
    )
    WHERE NOT EXISTS (
        SELECT 1 FROM public.order_items oi WHERE oi.order_id = o.id
    );

    GET DIAGNOSTICS v_order_items_count = ROW_COUNT;
    RAISE NOTICE 'Backfilled % order_items from historical orders', v_order_items_count;


    -- 6. Backfill line_total on existing order_items where line_total is currently 0.00
    UPDATE public.order_items oi
    SET line_total = (oi.price_at_purchase * oi.quantity) + COALESCE(oi.addons_price_at_purchase, 0.00)
    WHERE oi.line_total = 0.00 AND oi.price_at_purchase > 0;


    RAISE NOTICE 'SKU & Inventory Data Backfill Completed Successfully.';
END $$;
