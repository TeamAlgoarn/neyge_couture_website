# Database Migration Design and SKU/Inventory Architecture

## 1. Overview
This document outlines the architecture for the SKU, inventory, and add-on management system. It details the transition from the current schema to the target schema to support complex product variations, inventory tracking, and add-ons (like Fall/In-skirt) in a scalable and non-destructive manner.

## 2. Current Schema Assumptions
Currently, the system assumes:
- Products have a flat structure (no explicit variants or SKUs).
- Inventory is likely tracked at the root product level.
- Cart items and order items do not have structured support for add-ons or selected variants.
- Lack of reserved stock mechanism, meaning inventory is only deducted upon payment confirmation, risking overselling.

## 3. Target Schema
The target schema will introduce structural support for variants, SKUs, inventory, and add-ons.

### Tables & Columns
- **`products`**:
  - `has_variants` (BOOLEAN, default: false)
  - `available_addons` (JSONB) - Defines the allowed add-ons (e.g., {"fall_inskirt": {"price": 200, "label": "Fall & In-skirt"}}).
- **`product_variants` (New)**:
  - `id` (UUID, primary key)
  - `product_id` (UUID, foreign key to products)
  - `sku` (VARCHAR, unique)
  - `attributes` (JSONB) - Key-value pair of variant options (e.g., {"color": "Red", "size": "M"})
  - `price_override` (DECIMAL, nullable)
- **`inventory` (New)**:
  - `sku` (VARCHAR, foreign key to product_variants.sku or product.sku)
  - `quantity_available` (INT)
  - `quantity_reserved` (INT) - Stock temporarily held in carts.
- **`cart_items`**:
  - `sku` (VARCHAR)
  - `addons` (JSONB) - User-selected add-ons (e.g., [{"type": "fall_inskirt", "price": 200}])
- **`order_items`**:
  - `sku` (VARCHAR)
  - `addons` (JSONB)
  - Snapshot fields: `price_at_purchase`, `product_name_at_purchase`, `variant_attributes_at_purchase`

## 4. SKU & Variant Strategy
- **Base SKU Pattern**: `[CATEGORY]-[DESIGN]-[COLOR]` (e.g., `SAR-KAN-RED`).
- **Variant SKU Pattern**: Base SKU appended with variant codes (e.g., `SAR-KAN-RED-BL`).
- For products without variants, a default SKU is generated representing the base product.

## 5. Inventory & Reservation Strategy
- **Stock Tracking**: Inventory is tracked at the SKU level. Total available stock for purchase is `quantity_available - quantity_reserved`.
- **Reservation**: When an item is added to a cart or during the checkout initiation, stock is moved to `quantity_reserved` for a configurable timeout (e.g., 15 minutes).
- **Commit/Release**: Upon successful payment, reserved stock is permanently deducted from `quantity_available`. If the timeout expires or checkout is cancelled, reserved stock is returned to available stock.

## 6. Order Snapshot Strategy
Order items will store the exact state of the product at the time of purchase (`price_at_purchase`, `variant_attributes`, `addons`). This prevents historical orders from changing if the underlying product or add-on prices change later.

## 7. Add-on Compatibility Design
Add-ons like Fall and In-skirt will be modeled via JSONB to allow dynamic configuration:
- `products.available_addons`: Specifies which add-ons are valid for a product and their prices.
  ```json
  {
    "fall_inskirt": { "enabled": true, "price": 250, "label": "Fall and In-skirt stitching" }
  }
  ```
- Validation on the backend will cross-check selected `cart_items.addons` against `products.available_addons` before allowing checkout.

## 8. Non-Destructive Migration Order
Migrations must be executed sequentially to ensure zero downtime and no data loss:
1. **Schema Additions**: Create `product_variants`, `inventory` tables. Add `sku`, `available_addons` to `products`. Add `addons` to `cart_items` and `order_items`.
2. **Backfill Data**: Populate `product_variants` and `inventory` using existing flat product data. Assign default SKUs.
3. **App Code Deployment**: Deploy application code that writes to both old and new structures but reads from the old.
4. **Read Cut-over**: Deploy application code that reads from the new schema structures.
5. **Cleanup (Optional/Future)**: Drop deprecated columns after verifying system stability.

## 9. Backfill Plan
- A one-time executable script (Python or Node) will iterate through all existing `products`.
- For each product, generate a base SKU based on its ID or title if none exists.
- Create a single default entry in `product_variants` and `inventory` mapping to the base product.
- Ensure all existing `cart_items` and `order_items` are safely mapped to the default SKU.

## 10. Staging Validation & Production Approval
- **Staging Validation**:
  - Run the migration sequence against a sanitized snapshot of production data in a staging environment.
  - Execute full E2E test suites covering adding to cart with add-ons, checkout, and inventory decrement.
  - Verify backfill script output for data consistency.
- **Production Approval**:
  - DBA and Lead Backend Engineer review the query execution plans for the migrations.
  - Scheduled maintenance window is communicated if necessary (though the non-destructive approach minimizes this need).

## 11. Rollback Plan
- **Migration Script Reversal**: `Down` migrations are provided to drop the newly created tables and columns.
- **Data Integrity**: Since the migration is additive, rolling back involves simply pointing the application back to the old columns/logic and dropping the new schema elements. No existing user or order data will be modified or lost during the rollout, making rollback safe.
