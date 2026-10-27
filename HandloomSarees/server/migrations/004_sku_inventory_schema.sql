-- ============================================================================
-- Migration 004: SKU & Inventory Architecture (Issue #13)
-- Introduces variants, SKUs, transactional inventory, normalized order items,
-- and concurrency-safe row-level locking RPC functions.
--
-- Pattern: Expand & Contract (Strictly Additive, Zero-Downtime Safe)
-- Run on Supabase PostgreSQL BEFORE deploying variant-aware application code.
-- ============================================================================

-- 1. Product Variants Table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    price_override NUMERIC(10, 2) DEFAULT NULL CHECK (price_override IS NULL OR price_override >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast variant lookup
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id
    ON public.product_variants (product_id);

CREATE INDEX IF NOT EXISTS idx_product_variants_sku
    ON public.product_variants (sku);


-- 2. Inventory Table (Per-SKU Stock & Reservations)
CREATE TABLE IF NOT EXISTS public.inventory (
    sku VARCHAR(100) PRIMARY KEY REFERENCES public.product_variants(sku) ON DELETE CASCADE,
    quantity_available INT NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
    quantity_reserved INT NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_inventory_reserved_lte_available CHECK (quantity_reserved <= quantity_available)
);


-- 3. Inventory Transactions Table (Audit Ledger & Idempotency)
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) NOT NULL REFERENCES public.inventory(sku) ON DELETE CASCADE,
    quantity_change INT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    reference_id TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_inventory_tx_idempotency UNIQUE (sku, reference_id, reason)
);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_sku
    ON public.inventory_transactions (sku);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_ref
    ON public.inventory_transactions (reference_id) WHERE reference_id IS NOT NULL;


-- 4. Normalized Order Items Table (Historical Snapshot Preservation)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    sku VARCHAR(100) REFERENCES public.product_variants(sku) ON DELETE SET NULL,
    selected_addons JSONB NOT NULL DEFAULT '[]'::jsonb,
    price_at_purchase NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price_at_purchase >= 0),
    addons_price_at_purchase NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (addons_price_at_purchase >= 0),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    line_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (line_total >= 0),
    product_name_at_purchase TEXT NOT NULL DEFAULT '',
    variant_attributes_at_purchase JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
    ON public.order_items (order_id);

CREATE INDEX IF NOT EXISTS idx_order_items_product_id
    ON public.order_items (product_id);

CREATE INDEX IF NOT EXISTS idx_order_items_sku
    ON public.order_items (sku) WHERE sku IS NOT NULL;


-- 5. Additive Columns to Existing Tables
ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS has_variants BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.cart_items
    ADD COLUMN IF NOT EXISTS sku VARCHAR(100) REFERENCES public.product_variants(sku) ON DELETE SET NULL;

ALTER TABLE public.order_items
    ADD COLUMN IF NOT EXISTS line_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (line_total >= 0);

CREATE INDEX IF NOT EXISTS idx_cart_items_sku
    ON public.cart_items (sku) WHERE sku IS NOT NULL;


-- ============================================================================
-- 6. Concurrency-Safe Inventory RPC Functions (Row-Level Locking & Fixed search_path)
-- ============================================================================

-- A. Reserve SKU Stock (Temporary Hold during Checkout Initiation)
CREATE OR REPLACE FUNCTION public.reserve_sku_stock(p_sku VARCHAR, p_qty INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_available INT;
    v_reserved INT;
BEGIN
    IF p_qty <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Quantity must be greater than zero');
    END IF;

    -- Lock row for update
    SELECT quantity_available, quantity_reserved
    INTO v_available, v_reserved
    FROM public.inventory
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

    UPDATE public.inventory
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


-- B. Release SKU Stock (Checkout Expired / Cancelled / Failed)
CREATE OR REPLACE FUNCTION public.release_sku_stock(p_sku VARCHAR, p_qty INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_reserved INT;
BEGIN
    IF p_qty <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Quantity must be greater than zero');
    END IF;

    SELECT quantity_reserved
    INTO v_reserved
    FROM public.inventory
    WHERE sku = p_sku
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'SKU not found in inventory');
    END IF;

    UPDATE public.inventory
    SET quantity_reserved = GREATEST(0, quantity_reserved - p_qty),
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


-- C. Commit SKU Stock (Payment Captured / Order Finalized)
-- Validates stock, verifies matching reservation, and checks idempotency BEFORE mutating inventory
CREATE OR REPLACE FUNCTION public.commit_sku_stock(
    p_sku VARCHAR,
    p_qty INT,
    p_reason VARCHAR DEFAULT 'purchase',
    p_ref_id TEXT DEFAULT NULL,
    p_is_reserved BOOLEAN DEFAULT TRUE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_available INT;
    v_reserved INT;
BEGIN
    IF p_qty <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Quantity must be greater than zero');
    END IF;

    -- Lock row for update
    SELECT quantity_available, quantity_reserved
    INTO v_available, v_reserved
    FROM public.inventory
    WHERE sku = p_sku
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'SKU not found in inventory');
    END IF;

    -- 1. Check idempotency FIRST before any stock mutation
    IF p_ref_id IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM public.inventory_transactions
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

    -- 2. Explicitly validate available stock before deducting
    IF v_available < p_qty THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Insufficient available stock to commit',
            'available', v_available,
            'requested', p_qty
        );
    END IF;

    -- 3. Validate reservation-safe semantics
    IF p_is_reserved THEN
        -- When committing a reserved checkout, ensure enough quantity was actually reserved
        -- to prevent consuming stock reserved for other concurrent checkouts
        IF v_reserved < p_qty THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Insufficient reserved stock to commit',
                'reserved', v_reserved,
                'requested', p_qty
            );
        END IF;

        UPDATE public.inventory
        SET quantity_available = quantity_available - p_qty,
            quantity_reserved = quantity_reserved - p_qty,
            updated_at = NOW()
        WHERE sku = p_sku;
    ELSE
        -- When committing directly without prior reservation, ensure unreserved stock is sufficient
        IF (v_available - v_reserved) < p_qty THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Insufficient unreserved stock to commit',
                'available_unreserved', (v_available - v_reserved),
                'requested', p_qty
            );
        END IF;

        UPDATE public.inventory
        SET quantity_available = quantity_available - p_qty,
            updated_at = NOW()
        WHERE sku = p_sku;
    END IF;

    -- 4. Record transaction in audit ledger
    INSERT INTO public.inventory_transactions (sku, quantity_change, reason, reference_id)
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


-- ============================================================================
-- 7. Row Level Security (RLS) Configuration
-- ============================================================================

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Product Variants: Public read, Service Role write
DROP POLICY IF EXISTS "Public variants read access" ON public.product_variants;
CREATE POLICY "Public variants read access"
    ON public.product_variants FOR SELECT
    USING (is_active = TRUE);

DROP POLICY IF EXISTS "Service role full access to variants" ON public.product_variants;
CREATE POLICY "Service role full access to variants"
    ON public.product_variants FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

-- Inventory: Public read availability, Service Role full access
DROP POLICY IF EXISTS "Public inventory read access" ON public.inventory;
CREATE POLICY "Public inventory read access"
    ON public.inventory FOR SELECT
    USING (TRUE);

DROP POLICY IF EXISTS "Service role full access to inventory" ON public.inventory;
CREATE POLICY "Service role full access to inventory"
    ON public.inventory FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

-- Inventory Transactions: Service Role only
DROP POLICY IF EXISTS "Service role full access to inventory_transactions" ON public.inventory_transactions;
CREATE POLICY "Service role full access to inventory_transactions"
    ON public.inventory_transactions FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

-- Order Items: Users read their own order items, Service Role full access
DROP POLICY IF EXISTS "Users can read own order items" ON public.order_items;
CREATE POLICY "Users can read own order items"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = public.order_items.order_id
            AND (o.user_id = auth.uid()::text OR o.user_id = current_setting('request.jwt.claim.sub', true))
        )
    );

DROP POLICY IF EXISTS "Service role full access to order_items" ON public.order_items;
CREATE POLICY "Service role full access to order_items"
    ON public.order_items FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');


-- ============================================================================
-- 8. Lock Down RPC Execution Permissions (Security Hardening)
-- ============================================================================

REVOKE EXECUTE ON FUNCTION public.reserve_sku_stock(VARCHAR, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_sku_stock(VARCHAR, INT) TO service_role;

REVOKE EXECUTE ON FUNCTION public.release_sku_stock(VARCHAR, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.release_sku_stock(VARCHAR, INT) TO service_role;

REVOKE EXECUTE ON FUNCTION public.commit_sku_stock(VARCHAR, INT, VARCHAR, TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.commit_sku_stock(VARCHAR, INT, VARCHAR, TEXT, BOOLEAN) TO service_role;
