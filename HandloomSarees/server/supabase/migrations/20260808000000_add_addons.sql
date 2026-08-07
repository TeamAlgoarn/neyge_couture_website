-- Up Migration
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS addons JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_addons JSONB DEFAULT '{}'::jsonb;

-- Down Migration (for rollback purposes, not executed by default)
-- ALTER TABLE cart_items DROP COLUMN IF EXISTS addons;
-- ALTER TABLE products DROP COLUMN IF EXISTS available_addons;
