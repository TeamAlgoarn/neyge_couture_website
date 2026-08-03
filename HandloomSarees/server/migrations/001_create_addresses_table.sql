-- Migration: 001_create_addresses_table.sql
-- Description: Create addresses table for customer address management with atomic default toggling, partial unique index, and RLS.

CREATE TABLE IF NOT EXISTS public.addresses (
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
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user lookup performance
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses (user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_default ON public.addresses (user_id, is_default);

-- Partial Unique Index: Strictly enforce at PostgreSQL engine level that a user can have at most ONE default address.
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_default_address_per_user
ON public.addresses (user_id)
WHERE is_default = true;

-- Enable Row Level Security (RLS)
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only select their own addresses
CREATE POLICY addresses_select_policy ON public.addresses
    FOR SELECT USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- RLS Policy: Users can only insert their own addresses
CREATE POLICY addresses_insert_policy ON public.addresses
    FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- RLS Policy: Users can only update their own addresses
CREATE POLICY addresses_update_policy ON public.addresses
    FOR UPDATE USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- RLS Policy: Users can only delete their own addresses
CREATE POLICY addresses_delete_policy ON public.addresses
    FOR DELETE USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- Stored Procedure: Atomic Default Address Switching
-- Ensures only one address is default per user in a single atomic database operation.
CREATE OR REPLACE FUNCTION set_default_address(
    target_user_id TEXT,
    target_address_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Unset all default flags for the user
    UPDATE public.addresses
    SET is_default = false, updated_at = NOW()
    WHERE user_id = target_user_id AND is_default = true;

    -- Set the specified address as default
    UPDATE public.addresses
    SET is_default = true, updated_at = NOW()
    WHERE id = target_address_id AND user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored Procedure: Atomic Address Deletion & Promotion
-- Deletes target address and promotes remaining address atomically in one single database procedure.
CREATE OR REPLACE FUNCTION delete_address_and_promote(
    target_user_id TEXT,
    target_address_id UUID
) RETURNS VOID AS $$
DECLARE
    was_def BOOLEAN;
    next_id UUID;
BEGIN
    SELECT is_default INTO was_def FROM public.addresses WHERE id = target_address_id AND user_id = target_user_id;
    
    DELETE FROM public.addresses WHERE id = target_address_id AND user_id = target_user_id;
    
    IF was_def THEN
        SELECT id INTO next_id FROM public.addresses WHERE user_id = target_user_id ORDER BY created_at DESC LIMIT 1;
        IF next_id IS NOT NULL THEN
            UPDATE public.addresses SET is_default = true, updated_at = NOW() WHERE id = next_id;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
