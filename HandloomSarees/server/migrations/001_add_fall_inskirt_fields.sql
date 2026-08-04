-- Migration to add Fall and In-skirt product add-ons fields
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS has_fall BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fall_price NUMERIC(10, 2) DEFAULT 0.00 CHECK (fall_price >= 0),
ADD COLUMN IF NOT EXISTS has_in_skirt BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS in_skirt_price NUMERIC(10, 2) DEFAULT 0.00 CHECK (in_skirt_price >= 0);
