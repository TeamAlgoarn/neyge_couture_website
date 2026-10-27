-- ============================================================================
-- Rollback Migration 004: SKU & Inventory Architecture (Down Migration)
-- Reverts tables, columns, constraints, and RPC functions introduced in 004.
--
-- CAUTION: Drops newly introduced SKU tables and RPCs. Existing legacy tables
-- (products, cart_items, orders, payment_sessions) remain fully intact.
-- ============================================================================

-- 1. Drop Concurrency RPC Functions
DROP FUNCTION IF EXISTS public.commit_sku_stock(VARCHAR, INT, VARCHAR, TEXT, BOOLEAN);
DROP FUNCTION IF EXISTS public.commit_sku_stock(VARCHAR, INT, VARCHAR, TEXT);
DROP FUNCTION IF EXISTS public.commit_sku_stock;
DROP FUNCTION IF EXISTS public.release_sku_stock(VARCHAR, INT);
DROP FUNCTION IF EXISTS public.release_sku_stock;
DROP FUNCTION IF EXISTS public.reserve_sku_stock(VARCHAR, INT);
DROP FUNCTION IF EXISTS public.reserve_sku_stock;

-- 2. Drop Added Columns & Indexes from Existing Tables
DROP INDEX IF EXISTS public.idx_cart_items_sku;
ALTER TABLE public.cart_items DROP COLUMN IF EXISTS sku;

ALTER TABLE public.products DROP COLUMN IF EXISTS has_variants;

-- 3. Drop New Tables in Reverse Dependency Order
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.inventory_transactions CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
