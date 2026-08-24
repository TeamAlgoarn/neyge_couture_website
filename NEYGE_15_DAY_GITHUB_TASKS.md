# Neyge 15-Day GitHub Task Plan

Rules: two interns, one frontend-focused and one backend-focused. Pull requests are mandatory. No direct pushes to integration. Days 13-15 are supervised final phase only.

## Day 1

Title: Confirm integration branch baseline
Owner: Project owner with both interns
Priority: P0
Planned days: 1
Dependencies: Stabilization branch
Scope: Verify branch contains `origin/main` and `origin/backend-feature`.
Acceptance criteria: merge report updated; no intern starts from an unverified branch.
Tests required: build/import smoke checks.
Definition of done: owner approves branch name and commit.
Senior supervision required: Yes

## Days 1-3 Frontend

Title: Frontend lint baseline cleanup
Owner: Frontend intern
Priority: P0
Planned days: 3
Dependencies: build passes
Scope: Resolve remaining ESLint errors without visual redesign.
Acceptance criteria: `npm run lint` passes or exceptions are documented by file.
Tests required: `npm run build`, `npm run lint`
Definition of done: PR includes before/after lint count.
Senior supervision required: Yes

Title: API client normalization
Owner: Frontend intern
Priority: P0
Planned days: 1
Dependencies: `VITE_API_BASE_URL`
Scope: Ensure customer/admin/Instagram calls use shared base URL.
Acceptance criteria: no hardcoded localhost/ngrok in app source except examples/docs.
Tests required: build and source search.
Definition of done: PR includes `rg` evidence.
Senior supervision required: Yes

## Days 1-5 Backend

Title: Backend env and CORS hardening
Owner: Backend intern
Priority: P0
Planned days: 2
Dependencies: current settings baseline
Scope: Extend tests for env validation and CORS edge cases.
Acceptance criteria: production missing secrets fail clearly; local dev works.
Tests required: `pytest -q`
Definition of done: env docs and tests updated.
Senior supervision required: Yes

Title: Admin endpoint security audit
Owner: Backend intern
Priority: P0
Planned days: 3
Dependencies: auth dependency tests
Scope: Verify product, order, upload, collection, chatbot, messaging, and video-booking admin access.
Acceptance criteria: no token -> 401, customer -> 403, admin -> allowed.
Tests required: pytest route tests with mocked services.
Definition of done: all protected routes covered.
Senior supervision required: Yes

## Days 4-8

Title: Address persistence and cart quantity API
Owner: Backend intern
Priority: P1
Planned days: 3
Dependencies: auth tests
Scope: Persist addresses and support cart quantity changes.
Acceptance criteria: customer can save default address and update cart quantity.
Tests required: service and route tests with mocks.
Definition of done: frontend contract documented.
Senior supervision required: Yes

Title: Frontend loading/error states and regression pass
Owner: Frontend intern
Priority: P1
Planned days: 3
Dependencies: API client cleanup
Scope: Normalize visible loading/error behavior on product, cart, checkout, wishlist, admin.
Acceptance criteria: no blank failed states in core flows.
Tests required: manual screenshots and build.
Definition of done: PR includes screenshots.
Senior supervision required: No

## Days 6-12 Add-ons

Title: Backend fall and in-skirt add-on support
Owner: Backend intern
Priority: P1
Planned days: 4
Dependencies: migration design approved
Scope: Product fields, cart validation, price calculation, order snapshots.
Acceptance criteria: backend rejects unavailable add-ons and ignores frontend prices.
Tests required: product/cart/order add-on tests.
Definition of done: API docs and tests pass.
Senior supervision required: Yes

Title: Frontend add-on UI and blouse enquiry
Owner: Frontend intern
Priority: P1
Planned days: 4
Dependencies: backend add-on contract
Scope: Product selectors, call enquiry, WhatsApp enquiry, cart/checkout/order/admin displays.
Acceptance criteria: blouse is enquiry-only; fall/in-skirt appear with prices.
Tests required: build, lint, responsive screenshots.
Definition of done: PR includes product-to-order evidence.
Senior supervision required: Yes

Title: SEO and accessibility basics
Owner: Frontend intern
Priority: P2
Planned days: 1
Dependencies: core UI stable
Scope: Titles, alt text, button labels, focus states for core pages.
Acceptance criteria: obvious accessibility gaps resolved.
Tests required: manual keyboard pass.
Definition of done: screenshots and notes.
Senior supervision required: No

## Days 13-15: SUPERVISED - INTERN ASSISTS, PROJECT OWNER APPROVES

Tasks:

- Branch reconciliation verification
- Git-history secret cleanup
- Database migration design
- Razorpay payment verification
- Razorpay webhook handling
- Refund processing
- Payment idempotency
- Transaction-safe inventory reduction
- WhatsApp webhook signature verification
- Instagram webhook signature verification
- Production Meta configuration
- Live credentials
- Production deployment
- DNS and SSL
- Database backup and rollback
- Inventory and SKU architecture

Acceptance criteria: project owner approves each live-service or production operation before execution. Interns assist but do not independently own these tasks.
