# Sprint Issue Creation Queue

Date: 2026-07-16

Milestone: `Neyge 15-Day Completion Sprint`

Created immediately:

- #3 `[P0] Resolve Frontend Lint Baseline`
- #4 `[P0] Expand Admin and Integration Route Security Tests`

Create the remaining issues only after the first two issues are confirmed and assigned.

## Issue 3

Title: `[P1] Build Customer Address CRUD and Connect Profile/Checkout`

Owner: Backend intern primary, Frontend intern support

Labels: `priority:P1`, `team:fullstack`, `feature:address`, `intern-safe`

Summary:

- Persist customer addresses
- Add create/list/update/delete APIs
- Add default address support
- Connect Profile page
- Connect Checkout page
- Enforce ownership
- Add tests

## Issue 4

Title: `[P1] Add Cart Quantity Update API and UI Integration`

Owner: Backend intern primary, Frontend intern support

Labels: `priority:P1`, `team:fullstack`, `feature:cart`, `intern-safe`

Summary:

- Add backend quantity update endpoint
- Validate stock
- Replace remove-and-readd logic
- Update cart UI
- Add tests

## Issue 5

Title: `[P2] Add Fall and In-skirt Product Add-ons`

Owner: Backend intern primary, Frontend intern support

Labels: `priority:P2`, `team:fullstack`, `feature:addons`, `intern-safe`

Summary:

- Add product fields for fall availability/price
- Add product fields for in-skirt availability/price
- Admin can configure add-ons
- Product page displays add-ons
- Backend validates availability and price

## Issue 6

Title: `[P2] Carry Add-ons Through Cart, Checkout and Order Summary`

Owner: Backend intern primary, Frontend intern support

Labels: `priority:P2`, `team:fullstack`, `feature:addons`, `feature:checkout`, `feature:orders`, `intern-safe`

Summary:

- Persist selected add-ons in cart
- Backend calculates add-on prices
- Show selected add-ons in checkout
- Snapshot add-ons in order items
- Show selected add-ons in customer and admin order summary

## Issue 7

Title: `[P2] Add Blouse Stitching Enquiry via Call and WhatsApp`

Owner: Frontend intern primary, Backend intern support

Labels: `priority:P2`, `team:frontend`, `feature:blouse-enquiry`, `intern-safe`

Summary:

- Add Call button
- Add WhatsApp button
- Prefilled message with product name, URL, ID/SKU, colour
- Do not include measurements
- Do not include blouse stitching price
- Optional enquiry indicator only if needed

## Issue 8

Title: `[P1] Add Admin Order Status and Tracking Workflow`

Owner: Backend intern primary, Frontend intern support

Labels: `priority:P1`, `team:fullstack`, `feature:orders`, `feature:admin`

Summary:

- Admin can update order status
- Admin can add courier/tracking info
- Customer can view tracking
- Add tests
- Do not implement refunds here

## Issue 9

Title: `[P2] Add Regression Testing for Add-ons, Cart, Checkout and Orders`

Owner: Both interns

Labels: `priority:P2`, `team:qa`, `testing`

Summary:

- Test product add-ons
- Test cart quantity
- Test checkout total
- Test order snapshot
- Test WhatsApp link generation
- Test mobile layout
- Test admin views

## Issue 10

Title: `[P3] SEO, Accessibility and Documentation Cleanup`

Owner: Frontend intern primary

Labels: `priority:P3`, `team:frontend`, `team:docs`

Summary:

- Page titles
- Descriptions
- Sitemap
- Robots
- Alt text
- Basic accessibility
- README status update

## Issue 11

Title: `[SUPERVISED] Database Migration Design and SKU Inventory Architecture`

Owner: Project owner primary, backend intern assists

Labels: `supervised`, `senior-review`, `team:backend`

Summary:

- Migration design
- Existing schema capture
- Add-on field migration
- SKU/inventory architecture
- Rollback plan
- No destructive production operation without approval

## Issue 12

Title: `[SUPERVISED] Razorpay Verification, Webhooks, Refunds and Idempotency`

Owner: Project owner primary, backend intern assists

Labels: `supervised`, `senior-review`, `security`

Summary:

- Verify frontend callback
- Razorpay webhook signature
- Webhook event handling
- Payment idempotency
- Refund lifecycle
- Transaction-safe payment/order flow
- Use sandbox only

## Issue 13

Title: `[SUPERVISED] WhatsApp and Instagram Webhook Security`

Owner: Project owner primary, interns assist

Labels: `supervised`, `senior-review`, `security`

Summary:

- WhatsApp signature verification
- Instagram signature verification
- Webhook deduplication
- Error sanitization
- Production Meta configuration
- No live credentials in code or logs

## Issue 14

Title: `[SUPERVISED] Production Deployment, DNS, SSL, Backup and Rollback`

Owner: Project owner primary, interns assist

Labels: `supervised`, `senior-review`, `team:devops`

Summary:

- Production deployment
- Environment variables
- DNS
- SSL
- Health checks
- Backup
- Rollback
- Final smoke testing
