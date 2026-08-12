-- Migration to add product_price, selected_addons, and addons_total to cart_items table
-- and remove the old (cart_id, product_id) unique constraint to support distinct add-on cart lines.

ALTER TABLE public.cart_items
ADD COLUMN IF NOT EXISTS product_price NUMERIC(10, 2) DEFAULT 0.00 CHECK (product_price >= 0),
ADD COLUMN IF NOT EXISTS selected_addons JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS addons_total NUMERIC(10, 2) DEFAULT 0.00 CHECK (addons_total >= 0);

-- Drop old constraint that forced one row per (cart_id, product_id)
ALTER TABLE public.cart_items
DROP CONSTRAINT IF EXISTS cart_items_cart_id_product_id_key;

-- Add new unique index based on cart_id, product_id, and selected_addons combination
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_cart_product_addons_key
ON public.cart_items (cart_id, product_id, selected_addons);
