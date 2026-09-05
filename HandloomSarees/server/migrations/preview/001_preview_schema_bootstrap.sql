-- ============================================================================
-- PREVIEW ONLY: Neyge Couture one-project schema isolation bootstrap
-- ============================================================================
--
-- Purpose:
--   Create the Preview/Staging ecommerce application schema inside the shared
--   Supabase project without modifying Production ecommerce data.
--
-- Architecture:
--   preview schema -> Preview/Staging ecommerce application data
--   public schema  -> Production ecommerce application data
--   auth schema    -> Shared Supabase Auth, managed by Supabase
--   storage schema -> Shared Supabase Storage metadata, managed by Supabase
--
-- DO NOT run this against Production as a replacement for Production tables.
-- DO NOT duplicate or alter Supabase-managed auth/storage schemas here.
-- Review in Supabase SQL Editor first, then execute only after confirming the
-- target project is the approved shared Neyge Supabase project.
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS preview;

GRANT USAGE ON SCHEMA preview TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA preview
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA preview
    GRANT USAGE, SELECT ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA preview
    GRANT EXECUTE ON FUNCTIONS TO service_role;

CREATE OR REPLACE FUNCTION preview.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = preview, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS preview.profiles (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    addresses JSONB NOT NULL DEFAULT '[]'::jsonb,
    wishlist JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preview.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    banner_image TEXT,
    description TEXT,
    story TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    category TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preview.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    discount_price NUMERIC(10, 2) CHECK (discount_price IS NULL OR discount_price >= 0),
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    thumbnail TEXT,
    short_description TEXT,
    story TEXT,
    fabric TEXT,
    color TEXT,
    technique TEXT,
    origin TEXT,
    collection_id UUID REFERENCES preview.collections(id) ON DELETE SET NULL,
    occasion JSONB NOT NULL DEFAULT '[]'::jsonb,
    artisan JSONB,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    care_instructions TEXT,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    has_fall BOOLEAN DEFAULT FALSE,
    fall_price NUMERIC(10, 2) DEFAULT 0.00 CHECK (fall_price >= 0),
    has_in_skirt BOOLEAN DEFAULT FALSE,
    in_skirt_price NUMERIC(10, 2) DEFAULT 0.00 CHECK (in_skirt_price >= 0),
    has_variants BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preview_products_collection_id
    ON preview.products (collection_id);
CREATE INDEX IF NOT EXISTS idx_preview_products_is_active
    ON preview.products (is_active);
CREATE INDEX IF NOT EXISTS idx_preview_products_is_featured
    ON preview.products (is_featured);

CREATE TABLE IF NOT EXISTS preview.festive_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    banner_image TEXT,
    popup_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    popup_message TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preview.festive_collection_products (
    festive_collection_id UUID NOT NULL REFERENCES preview.festive_collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES preview.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (festive_collection_id, product_id)
);

CREATE TABLE IF NOT EXISTS preview.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS preview.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES preview.carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES preview.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    product_price NUMERIC(10, 2) DEFAULT 0.00 CHECK (product_price >= 0),
    selected_addons JSONB DEFAULT '[]'::jsonb,
    addons_total NUMERIC(10, 2) DEFAULT 0.00 CHECK (addons_total >= 0),
    sku VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preview_cart_items_cart_id
    ON preview.cart_items (cart_id);
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_cart_product_addons_key
    ON preview.cart_items (cart_id, product_id, selected_addons);

CREATE TABLE IF NOT EXISTS preview.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    line1 VARCHAR(200) NOT NULL,
    line2 VARCHAR(200) DEFAULT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preview_addresses_user_id
    ON preview.addresses (user_id);
CREATE INDEX IF NOT EXISTS idx_preview_addresses_user_default
    ON preview.addresses (user_id, is_default);
CREATE UNIQUE INDEX IF NOT EXISTS addresses_one_default_per_user
    ON preview.addresses (user_id)
    WHERE is_default IS TRUE;

CREATE TABLE IF NOT EXISTS preview.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    payment_status TEXT NOT NULL DEFAULT 'pending',
    order_status TEXT NOT NULL DEFAULT 'confirmed',
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    payment_id TEXT,
    razorpay_order_id TEXT,
    courier_name TEXT,
    tracking_number TEXT,
    tracking_url TEXT,
    status_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preview_orders_user_id
    ON preview.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_preview_orders_razorpay_order_id
    ON preview.orders (razorpay_order_id)
    WHERE razorpay_order_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS preview.payment_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    cart_id UUID,
    order_id UUID REFERENCES preview.orders(id) ON DELETE SET NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    cart_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    idempotency_key TEXT,
    refund_id TEXT,
    refund_status TEXT,
    refund_amount NUMERIC,
    refund_reason TEXT,
    refund_created_at TIMESTAMPTZ,
    webhook_event_id TEXT,
    webhook_verified_at TIMESTAMPTZ,
    failure_reason TEXT,
    failed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_sessions_idempotency_key
    ON preview.payment_sessions (idempotency_key)
    WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_preview_payment_sessions_razorpay_order_id
    ON preview.payment_sessions (razorpay_order_id)
    WHERE razorpay_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_preview_payment_sessions_user_id
    ON preview.payment_sessions (user_id);

CREATE TABLE IF NOT EXISTS preview.processed_webhook_events (
    event_id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preview.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES preview.products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    price_override NUMERIC(10, 2) DEFAULT NULL CHECK (price_override IS NULL OR price_override >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preview_product_variants_product_id
    ON preview.product_variants (product_id);
CREATE INDEX IF NOT EXISTS idx_preview_product_variants_sku
    ON preview.product_variants (sku);

CREATE TABLE IF NOT EXISTS preview.inventory (
    sku VARCHAR(100) PRIMARY KEY REFERENCES preview.product_variants(sku) ON DELETE CASCADE,
    quantity_available INT NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
    quantity_reserved INT NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_preview_inventory_reserved_lte_available CHECK (quantity_reserved <= quantity_available)
);

CREATE TABLE IF NOT EXISTS preview.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) NOT NULL REFERENCES preview.inventory(sku) ON DELETE CASCADE,
    quantity_change INT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    reference_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_preview_inventory_tx_idempotency UNIQUE (sku, reference_id, reason)
);

CREATE INDEX IF NOT EXISTS idx_preview_inventory_transactions_sku
    ON preview.inventory_transactions (sku);
CREATE INDEX IF NOT EXISTS idx_preview_inventory_transactions_reference_id
    ON preview.inventory_transactions (reference_id)
    WHERE reference_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS preview.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES preview.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES preview.products(id) ON DELETE SET NULL,
    sku VARCHAR(100) REFERENCES preview.product_variants(sku) ON DELETE SET NULL,
    name TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    addons_total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (addons_total >= 0),
    selected_addons JSONB NOT NULL DEFAULT '[]'::jsonb,
    line_total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (line_total >= 0),
    product_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preview_order_items_order_id
    ON preview.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_preview_order_items_product_id
    ON preview.order_items (product_id);
CREATE INDEX IF NOT EXISTS idx_preview_order_items_sku
    ON preview.order_items (sku)
    WHERE sku IS NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_preview_cart_items_sku'
          AND conrelid = 'preview.cart_items'::regclass
    ) THEN
        ALTER TABLE preview.cart_items
            ADD CONSTRAINT fk_preview_cart_items_sku
            FOREIGN KEY (sku) REFERENCES preview.product_variants(sku) ON DELETE SET NULL
            NOT VALID;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_preview_cart_items_sku
    ON preview.cart_items (sku)
    WHERE sku IS NOT NULL;

CREATE TABLE IF NOT EXISTS preview.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES preview.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS preview.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES preview.products(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preview.video_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    occasion TEXT,
    budget_range TEXT,
    preferred_date TIMESTAMPTZ NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS preview.chatbot_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL DEFAULT 'chatbot',
    flow TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT,
    occasion TEXT,
    budget TEXT,
    saree_type TEXT,
    preferred_date DATE,
    preferred_time TEXT,
    requirement_type TEXT,
    approx_quantity TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION preview.increment_product_stock(p_id UUID, qty INT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = preview, pg_temp
AS $$
BEGIN
    UPDATE products
    SET stock = stock + qty,
        updated_at = NOW()
    WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION preview.set_default_address(target_user_id TEXT, target_address_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = preview, pg_temp
AS $$
BEGIN
    UPDATE addresses
    SET is_default = FALSE,
        updated_at = NOW()
    WHERE user_id = target_user_id;

    UPDATE addresses
    SET is_default = TRUE,
        updated_at = NOW()
    WHERE id = target_address_id
      AND user_id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION preview.delete_address_and_promote(
    target_user_id TEXT,
    target_address_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = preview, pg_temp
AS $$
DECLARE
    was_def BOOLEAN;
    next_id UUID;
BEGIN
    SELECT is_default INTO was_def
    FROM preview.addresses
    WHERE id = target_address_id
      AND user_id = target_user_id;

    DELETE FROM preview.addresses
    WHERE id = target_address_id
      AND user_id = target_user_id;

    IF was_def THEN
        SELECT id INTO next_id
        FROM preview.addresses
        WHERE user_id = target_user_id
        ORDER BY created_at DESC
        LIMIT 1;

        IF next_id IS NOT NULL THEN
            UPDATE preview.addresses
            SET is_default = TRUE,
                updated_at = NOW()
            WHERE id = next_id
              AND user_id = target_user_id;
        END IF;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION preview.reserve_sku_stock(p_sku VARCHAR, p_qty INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = preview, pg_temp
AS $$
DECLARE
    v_available INT;
    v_reserved INT;
BEGIN
    IF p_qty <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Quantity must be greater than zero');
    END IF;

    SELECT quantity_available, quantity_reserved
    INTO v_available, v_reserved
    FROM preview.inventory
    WHERE sku = p_sku
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'SKU not found in inventory');
    END IF;

    IF (v_available - v_reserved) < p_qty THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Insufficient available stock',
            'available_unreserved', (v_available - v_reserved),
            'requested', p_qty
        );
    END IF;

    UPDATE preview.inventory
    SET quantity_reserved = quantity_reserved + p_qty,
        updated_at = NOW()
    WHERE sku = p_sku;

    RETURN jsonb_build_object(
        'success', true,
        'sku', p_sku,
        'reserved_qty', p_qty,
        'total_reserved', (v_reserved + p_qty),
        'remaining_unreserved', (v_available - v_reserved - p_qty)
    );
END;
$$;

CREATE OR REPLACE FUNCTION preview.release_sku_stock(p_sku VARCHAR, p_qty INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = preview, pg_temp
AS $$
DECLARE
    v_reserved INT;
BEGIN
    IF p_qty <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Quantity must be greater than zero');
    END IF;

    SELECT quantity_reserved
    INTO v_reserved
    FROM preview.inventory
    WHERE sku = p_sku
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'SKU not found in inventory');
    END IF;

    UPDATE preview.inventory
    SET quantity_reserved = GREATEST(quantity_reserved - p_qty, 0),
        updated_at = NOW()
    WHERE sku = p_sku;

    RETURN jsonb_build_object(
        'success', true,
        'sku', p_sku,
        'released_qty', p_qty,
        'new_reserved', GREATEST(0, v_reserved - p_qty)
    );
END;
$$;

CREATE OR REPLACE FUNCTION preview.commit_sku_stock(
    p_sku VARCHAR,
    p_qty INT,
    p_reason VARCHAR DEFAULT 'purchase',
    p_ref_id TEXT DEFAULT NULL,
    p_is_reserved BOOLEAN DEFAULT TRUE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = preview, pg_temp
AS $$
DECLARE
    v_available INT;
    v_reserved INT;
BEGIN
    IF p_qty <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Quantity must be greater than zero');
    END IF;

    SELECT quantity_available, quantity_reserved
    INTO v_available, v_reserved
    FROM preview.inventory
    WHERE sku = p_sku
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'SKU not found in inventory');
    END IF;

    IF p_ref_id IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM preview.inventory_transactions
            WHERE sku = p_sku AND reference_id = p_ref_id AND reason = p_reason
        ) THEN
            RETURN jsonb_build_object(
                'success', true,
                'sku', p_sku,
                'idempotent_skip', true,
                'message', 'Transaction already recorded',
                'remaining_available', v_available,
                'remaining_reserved', v_reserved
            );
        END IF;
    END IF;

    IF v_available < p_qty THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Insufficient available stock to commit',
            'available', v_available,
            'requested', p_qty
        );
    END IF;

    IF p_is_reserved THEN
        IF v_reserved < p_qty THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Insufficient reserved stock to commit',
                'reserved', v_reserved,
                'requested', p_qty
            );
        END IF;

        UPDATE preview.inventory
        SET quantity_available = quantity_available - p_qty,
            quantity_reserved = quantity_reserved - p_qty,
            updated_at = NOW()
        WHERE sku = p_sku;
    ELSE
        IF (v_available - v_reserved) < p_qty THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Insufficient unreserved stock to commit',
                'available_unreserved', (v_available - v_reserved),
                'requested', p_qty
            );
        END IF;

        UPDATE preview.inventory
        SET quantity_available = quantity_available - p_qty,
        updated_at = NOW()
        WHERE sku = p_sku;
    END IF;

    INSERT INTO preview.inventory_transactions (sku, quantity_change, reason, reference_id)
    VALUES (p_sku, -p_qty, p_reason, p_ref_id)
    ON CONFLICT (sku, reference_id, reason) DO NOTHING;

    RETURN jsonb_build_object(
        'success', true,
        'sku', p_sku,
        'committed_qty', p_qty,
        'remaining_available', (v_available - p_qty),
        'remaining_reserved', (CASE WHEN p_is_reserved THEN (v_reserved - p_qty) ELSE v_reserved END)
    );
END;
$$;

DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY ARRAY[
        'profiles',
        'collections',
        'products',
        'festive_collections',
        'festive_collection_products',
        'carts',
        'cart_items',
        'addresses',
        'orders',
        'payment_sessions',
        'processed_webhook_events',
        'product_variants',
        'inventory',
        'inventory_transactions',
        'order_items',
        'wishlists',
        'reviews',
        'video_bookings',
        'chatbot_leads'
    ] LOOP
        EXECUTE format('ALTER TABLE preview.%I ENABLE ROW LEVEL SECURITY', table_name);
    END LOOP;
END $$;

DROP POLICY IF EXISTS preview_service_role_all_profiles ON preview.profiles;
CREATE POLICY preview_service_role_all_profiles
    ON preview.profiles FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS preview_users_read_own_profiles ON preview.profiles;
CREATE POLICY preview_users_read_own_profiles
    ON preview.profiles FOR SELECT
    USING (id = auth.uid()::text OR id = current_setting('request.jwt.claim.sub', true));

DROP POLICY IF EXISTS preview_public_read_active_collections ON preview.collections;
CREATE POLICY preview_public_read_active_collections
    ON preview.collections FOR SELECT
    USING (is_active = TRUE);

DROP POLICY IF EXISTS preview_public_read_active_products ON preview.products;
CREATE POLICY preview_public_read_active_products
    ON preview.products FOR SELECT
    USING (is_active = TRUE);

DROP POLICY IF EXISTS preview_public_read_active_festive_collections ON preview.festive_collections;
CREATE POLICY preview_public_read_active_festive_collections
    ON preview.festive_collections FOR SELECT
    USING (is_active = TRUE);

DROP POLICY IF EXISTS preview_public_read_variants ON preview.product_variants;
CREATE POLICY preview_public_read_variants
    ON preview.product_variants FOR SELECT
    USING (is_active = TRUE);

DROP POLICY IF EXISTS preview_public_read_inventory ON preview.inventory;
CREATE POLICY preview_public_read_inventory
    ON preview.inventory FOR SELECT
    USING (TRUE);

DROP POLICY IF EXISTS preview_users_read_own_addresses ON preview.addresses;
CREATE POLICY preview_users_read_own_addresses
    ON preview.addresses FOR SELECT
    USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true));

DROP POLICY IF EXISTS preview_users_write_own_addresses ON preview.addresses;
CREATE POLICY preview_users_write_own_addresses
    ON preview.addresses FOR ALL
    USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true))
    WITH CHECK (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true));

DROP POLICY IF EXISTS preview_users_read_own_carts ON preview.carts;
CREATE POLICY preview_users_read_own_carts
    ON preview.carts FOR SELECT
    USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true));

DROP POLICY IF EXISTS preview_users_read_own_cart_items ON preview.cart_items;
CREATE POLICY preview_users_read_own_cart_items
    ON preview.cart_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM preview.carts c
            WHERE c.id = cart_items.cart_id
              AND (c.user_id = auth.uid()::text OR c.user_id = current_setting('request.jwt.claim.sub', true))
        )
    );

DROP POLICY IF EXISTS preview_users_read_own_orders ON preview.orders;
CREATE POLICY preview_users_read_own_orders
    ON preview.orders FOR SELECT
    USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true));

DROP POLICY IF EXISTS preview_users_read_own_order_items ON preview.order_items;
CREATE POLICY preview_users_read_own_order_items
    ON preview.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM preview.orders o
            WHERE o.id = order_items.order_id
              AND (o.user_id = auth.uid()::text OR o.user_id = current_setting('request.jwt.claim.sub', true))
        )
    );

DROP POLICY IF EXISTS preview_users_read_own_wishlists ON preview.wishlists;
CREATE POLICY preview_users_read_own_wishlists
    ON preview.wishlists FOR SELECT
    USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true));

DROP POLICY IF EXISTS preview_users_read_reviews ON preview.reviews;
CREATE POLICY preview_users_read_reviews
    ON preview.reviews FOR SELECT
    USING (TRUE);

DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY ARRAY[
        'collections',
        'products',
        'festive_collections',
        'festive_collection_products',
        'carts',
        'cart_items',
        'addresses',
        'orders',
        'payment_sessions',
        'processed_webhook_events',
        'product_variants',
        'inventory',
        'inventory_transactions',
        'order_items',
        'wishlists',
        'reviews',
        'video_bookings',
        'chatbot_leads'
    ] LOOP
        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON preview.%I',
            'preview_service_role_all_' || table_name,
            table_name
        );
        EXECUTE format(
            'CREATE POLICY %I ON preview.%I FOR ALL USING ((auth.jwt() ->> %L) = %L OR auth.role() = %L) WITH CHECK ((auth.jwt() ->> %L) = %L OR auth.role() = %L)',
            'preview_service_role_all_' || table_name,
            table_name,
            'role',
            'service_role',
            'service_role',
            'role',
            'service_role',
            'service_role'
        );
    END LOOP;
END $$;

DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY ARRAY[
        'profiles',
        'collections',
        'products',
        'festive_collections',
        'carts',
        'cart_items',
        'addresses',
        'orders',
        'payment_sessions',
        'processed_webhook_events',
        'product_variants',
        'inventory',
        'video_bookings',
        'chatbot_leads'
    ] LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS %I ON preview.%I',
            'trg_preview_' || table_name || '_updated_at',
            table_name
        );
        EXECUTE format(
            'CREATE TRIGGER %I BEFORE UPDATE ON preview.%I FOR EACH ROW EXECUTE FUNCTION preview.set_updated_at()',
            'trg_preview_' || table_name || '_updated_at',
            table_name
        );
    END LOOP;
END $$;

REVOKE EXECUTE ON FUNCTION preview.increment_product_stock(UUID, INT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION preview.set_default_address(TEXT, UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION preview.delete_address_and_promote(TEXT, UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION preview.reserve_sku_stock(VARCHAR, INT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION preview.release_sku_stock(VARCHAR, INT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION preview.commit_sku_stock(VARCHAR, INT, VARCHAR, TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION preview.increment_product_stock(UUID, INT) TO service_role;
GRANT EXECUTE ON FUNCTION preview.set_default_address(TEXT, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION preview.delete_address_and_promote(TEXT, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION preview.reserve_sku_stock(VARCHAR, INT) TO service_role;
GRANT EXECUTE ON FUNCTION preview.release_sku_stock(VARCHAR, INT) TO service_role;
GRANT EXECUTE ON FUNCTION preview.commit_sku_stock(VARCHAR, INT, VARCHAR, TEXT, BOOLEAN) TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA preview TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA preview TO service_role;
GRANT SELECT ON preview.collections TO anon, authenticated;
GRANT SELECT ON preview.products TO anon, authenticated;
GRANT SELECT ON preview.festive_collections TO anon, authenticated;
GRANT SELECT ON preview.product_variants TO anon, authenticated;
GRANT SELECT ON preview.inventory TO anon, authenticated;
GRANT SELECT ON preview.reviews TO anon, authenticated;
