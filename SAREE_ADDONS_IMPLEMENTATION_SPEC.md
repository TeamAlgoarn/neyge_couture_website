# Saree Add-ons Implementation Specification

## Scope

Blouse stitching is enquiry-only. Fall and in-skirt are paid product add-ons.

Excluded: measurements, standard blouse size, neck style, sleeve style, padding, lining, reference images, tailor assignment, tailoring status, alteration flow, measurement history, and blouse design customization.

## Schema

Products:

- `fall_available boolean default false`
- `fall_price numeric default 0`
- `inskirt_available boolean default false`
- `inskirt_price numeric default 0`

Cart item snapshot:

- `selected_addons: { fall: boolean, inskirt: boolean }`
- `addon_price_snapshot: { fall_price: number, inskirt_price: number, total: number }`

Order item snapshot:

- `product_id`, `product_name`, `sku`, `base_price`
- `selected_addons`
- `addon_price_snapshot`
- `line_total`

## API Changes

- Product list/detail returns add-on availability and prices.
- Admin product create/update accepts add-on fields.
- Cart add accepts selected add-on booleans only.
- Backend loads product, validates availability, calculates prices, and stores snapshots.
- Checkout/order creation revalidates add-ons from backend state and stores immutable order snapshots.

## Frontend Changes

- Product detail shows fall and in-skirt selectors only when available.
- Product detail shows blouse enquiry buttons: call and WhatsApp.
- WhatsApp enquiry message includes product name, product URL, product ID/SKU if available, color if available, and customer enquiry text.
- Cart, checkout, customer order summary, and admin order detail display selected add-ons and price snapshots.
- Admin product form exposes add-on enable toggles and price fields.

## Validation Rules

- Frontend-provided add-on prices are ignored.
- Unavailable selected add-ons return `400`.
- Negative add-on prices are rejected.
- Existing order snapshots never recalculate after product price changes.

## Tests Required

- Product add-on fields serialize correctly.
- Cart add with valid add-ons calculates backend price.
- Cart add with unavailable add-on is rejected.
- Checkout stores order item add-on snapshot.
- Admin product update protects add-on fields behind admin auth.
- Customer/admin order summaries show snapshot data.

## Intern Ownership

- Frontend intern: product selectors, enquiry buttons, cart/checkout/order/admin displays.
- Backend intern: schema migration plan, API fields, validation, pricing, cart/order snapshots, tests.

## Acceptance Criteria

- No blouse stitching price enters checkout.
- Fall and in-skirt prices are backend-calculated.
- All selected add-ons are visible from product through admin order detail.
- Existing orders remain immutable.
