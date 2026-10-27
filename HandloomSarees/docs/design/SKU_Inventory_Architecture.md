# Database Migration Design and SKU/Inventory Architecture

## 1. Overview
This document outlines the architecture for the SKU, inventory, and add-on management system. It details the transition from the current schema to the target schema to support complex product variations, inventory tracking, and add-ons (like Fall/In-skirt) in a scalable and non-destructive manner.

## 2. Current Schema
Currently, the system uses a flat structure without explicit variants or SKUs:
- **`products`**: Contains `id` (UUID, PK), `name`, `slug`, `price`, `discount_price`, `stock` (INT), `color`, `fabric`, `has_fall`, `fall_price`, `has_in_skirt`, `in_skirt_price`, `created_at`, `updated_at`. Inventory is tracked at the root product level.
- **`cart_items`**: Store references to the `product_id`, `quantity`, `product_price`, `addons_total`, and `selected_addons`. They currently lack SKU integration for granular inventory tracking.
- **`orders`**: Currently stores order line snapshots in `orders.items` as a JSON array, not as a separate normalized `order_items` table.
- **Limitation**: Lack of reserved stock mechanism and concurrency control risks overselling, and mutable fields make historical order items vulnerable to product changes.

## 3. Target Schema
The target schema will introduce structural support for variants, SKUs, inventory, and add-ons.

### Tables & Columns
- **`products`**:
  - `id` (UUID, PK), `name`, `slug`, `price`, `discount_price`, `created_at`, `updated_at`
  - `has_variants` (BOOLEAN, default: false)
  - `has_fall` (BOOLEAN), `fall_price` (DECIMAL)
  - `has_in_skirt` (BOOLEAN), `in_skirt_price` (DECIMAL)
  - *Indexes*: Unique index on `slug`.

- **`product_variants` (New)**:
  - `id` (UUID, PK)
  - `product_id` (UUID, FK to `products.id` ON DELETE CASCADE)
  - `sku` (VARCHAR, UNIQUE) - Stable immutable identifier.
  - `attributes` (JSONB) - Key-value pair of variant options (e.g., `{"color": "Red", "size": "M"}`)
  - `price_override` (DECIMAL, nullable)
  - `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ)
  - *Indexes*: Index on `product_id`, Unique index on `sku`.

- **`inventory` (New)**:
  - `sku` (VARCHAR, PK, FK to `product_variants.sku` ON DELETE CASCADE)
  - `quantity_available` (INT) - Must have a CHECK constraint (`quantity_available >= 0`).
  - `quantity_reserved` (INT, default: 0) - Stock temporarily held in carts.
  - `updated_at` (TIMESTAMPTZ)

- **`inventory_transactions` (New)**:
  - `id` (UUID, PK)
  - `sku` (VARCHAR, FK to `inventory.sku`)
  - `quantity_change` (INT)
  - `reason` (VARCHAR) - e.g., 'purchase', 'restock', 'return', 'reconciliation'.
  - `reference_id` (UUID, nullable) - FK to order_id or idempotency_key for uniqueness.
  - `created_at` (TIMESTAMPTZ)
  - *Constraints*: Unique constraint on `(sku, reference_id, reason)` to ensure idempotency and prevent duplicate stock movements.
  - *Indexes*: Index on `sku`.

- **`cart_items`**:
  - `id` (UUID, PK), `cart_id` (UUID, FK), `product_id` (UUID, FK)
  - `sku` (VARCHAR, FK to `product_variants.sku`)
  - `selected_addons` (JSONB) - e.g., `{"fall": true, "in_skirt": false}`

- **`order_items` (New Normalized Table)**:
  - Migrating from `orders.items` JSON snapshot to a standalone table.
  - `id` (UUID, PK), `order_id` (UUID, FK to `orders.id`), `product_id` (UUID, FK)
  - `sku` (VARCHAR, FK to `product_variants.sku`)
  - `selected_addons` (JSONB)
  - `price_at_purchase` (DECIMAL) - Snapshot of base item price.
  - `addons_price_at_purchase` (DECIMAL) - Snapshot of total add-on cost.
  - `product_name_at_purchase` (VARCHAR)
  - `variant_attributes_at_purchase` (JSONB)

## 4. SKU & Variant Strategy
- **Stable SKUs**: SKUs will use stable, immutable codes to avoid issues when display properties (like color or category) change.
- **Pattern**: `PRD-[UUID_PREFIX]-VAR-[INT_INDEX]` or an internal alphanumeric hash sequence.
- For products without variants, a single default variant entry will be generated mapping to the base product.

## 5. Inventory & Concurrency Strategy
- **Concurrency Control**: Updates to inventory will use RPCs with database-level row locking (`SELECT ... FOR UPDATE`) to prevent race conditions during concurrent checkouts.
- **Oversell Prevention**: Enforced at the database level using the CHECK constraint (`quantity_available >= 0`). Transactions resulting in negative availability will automatically rollback.
- **Stock Tracking**: Inventory is tracked at the SKU level. Total available stock for purchase is `quantity_available - quantity_reserved`.
- **Reservation**: When an item is added to a cart or during checkout initiation, stock is moved to `quantity_reserved` for a configurable timeout (e.g., 15 minutes). The reservation owner (e.g., user session ID or order intent ID) and expiration time must be tracked (e.g., in a temporary Redis cache or a lightweight `reservations` DB table). A background cron job will periodically clean up expired reservations, releasing stock back to `quantity_available`.
- **Commit/Release**: Payment sessions (e.g., Stripe/Razorpay) will use webhooks to permanently deduct reserved stock upon success, or immediately release it upon cancellation/failure. The webhook handler must match the payment session to the specific reservation owner to securely finalize the transaction.
- **Reconciliation Queries**: Cron jobs will periodically sum `inventory_transactions` and verify against `inventory.quantity_available` to detect discrepancies.

## 6. Order Snapshot Strategy
Order items will store the exact state of the product at the time of purchase (`price_at_purchase`, `addons_price_at_purchase`, `variant_attributes`, `selected_addons`). The backend/database is the ultimate source of truth for pricing. Prices provided by the client are strictly ignored; the backend recalculates total order amounts based on the DB values at checkout.

## 7. Add-on Compatibility Design
Add-ons align with existing product fields (`has_fall`, `fall_price`, `has_in_skirt`, `in_skirt_price`):
- `products` stores whether fall/in-skirt are available and their specific prices.
- Validation on the backend will cross-check `cart_items.selected_addons` against the product's allowed add-ons before allowing checkout.

## 8. Non-Destructive Migration Order
Migrations must be executed sequentially to ensure zero downtime and no data loss:
1. **Schema Additions**: Create `product_variants`, `inventory`, `inventory_transactions`, and the new normalized `order_items` tables. Add snapshot/addon columns to `cart_items`.
2. **Backfill Data**:
   - Populate `product_variants` and `inventory` using existing flat `products` data. Assign default SKUs. Generate initial `inventory_transactions`.
   - Backfill the new `order_items` table by extracting data from the existing `orders.items` JSON array.
3. **App Code Deployment**: Deploy application code that writes to both old (`orders.items` JSON) and new (`order_items` table) structures but reads from the old.
4. **Read Cut-over**: Deploy application code that exclusively reads from the new schema structures.
5. **Cleanup (Optional/Future)**: Drop `orders.items` and other deprecated columns after verifying system stability.

## 9. Backfill Plan
- A one-time executable script (Python or Node) will iterate through all existing `products`.
- For each product, generate a base immutable SKU.
- Create a single default entry in `product_variants` and `inventory` mapping to the base product.
- Ensure all existing `cart_items` and existing `orders.items` JSON snapshots are safely mapped/backfilled to default SKUs in the new `order_items` table.

## 10. Staging Validation & Production Approval
- **Staging Validation**:
  - Run the migration sequence against a sanitized snapshot of production data in a staging environment.
  - Execute full E2E test suites covering adding to cart with add-ons, checkout, and inventory decrement.
  - Verify backfill script output for data consistency and concurrency test behavior.
- **Production Approval**:
  - DBA and Lead Backend Engineer review the query execution plans and transaction blocks.
  - Require formal sign-off from the product owner.

## 11. Rollback & Disaster Recovery Plan
- **Pre-migration Backup**: A full automated snapshot/backup of the production database must be captured right before executing the migration.
- **Migration Script Reversal**: `Down` migrations are provided to drop newly created tables/columns.
- **Rollback Decision Criteria**: Rollback is initiated if E2E health checks fail post-deployment, if inventory constraint violations spike, or if order creation success rate drops below 99% within the first hour.
- **Restore Plan**: Since the migration is purely additive, rolling back typically involves reverting the app version and running the `down` migration. If production data was corrupted, the system will be restored from the pre-migration backup, and any delta orders captured in the interim will be manually reconciled.
