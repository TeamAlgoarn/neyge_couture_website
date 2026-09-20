# Issue #11 Regression Report

## Overview

This report documents the QA validation and regression testing evidence for
Issue #11. All test commands, outputs, and evidence files were generated from
the actual repository at the commit hash listed below.

**Test Execution Details:**
- **Test Date:** 2026-08-27
- **Tester:** QA Automation / AI Agent
- **Branch:** `feature/issue-11-regression-report`
- **Exact Commit Hash Tested:** `51191b2acd9d5d77ab0f81100cb59a05ecf7575b` (current HEAD of PR)
- **Previous Evidence Run Commit:** `6c87a843d7230fbc27f0ada90fd7d7e0880d81a2` (initial evidence; re-validated at current HEAD with identical results)
- **Target Branch for PRs:** `integration/neyge-15-day-sprint`
- **Total Backend Tests:** 171 collected, **171 passed**, 0 failed

**Environment Details:**
- **OS:** Windows (win32)
- **Node.js:** v24.14.1
- **Python:** 3.14.5
- **Backend Framework:** FastAPI (Python) with pytest for testing
- **Frontend Framework:** Vite + React + TypeScript + Tailwind CSS
- **Payment SDK:** razorpay==1.4.2 (Python, Test Mode)
- **Environment:** Local development, no live credentials used

## What is Good

- PR targets the correct integration branch (`integration/neyge-15-day-sprint`)
- Only documentation and evidence files are added; no code/config changes
- No secret, credential, or unsafe file matches found
- Backend tests (pytest, 171 tests) all pass
- Frontend lint (ESLint) and build (tsc + Vite) both pass cleanly



## QA Evidence & Execution Table

| # | Flow | Status | Evidence File |
|---|------|--------|---------------|
| 1 | Backend pytest (all 7 test modules) | **PASS** | [`evidence/backend_pytest_full.log`](evidence/backend_pytest_full.log) |
| 2 | Frontend ESLint + Vite build | **PASS** | [`evidence/frontend_lint_build.log`](evidence/frontend_lint_build.log) |
| 3 | Razorpay payment security (42 mocked tests) | **PASS** | [`evidence/razorpay_sandbox_payment.log`](evidence/razorpay_sandbox_payment.log) |
| 4 | Browser & mobile responsive testing | **PASS** | [`evidence/browser_mobile_testing.log`](evidence/browser_mobile_testing.log) |
| 5 | Add-ons (fall/in-skirt) processing | **PASS** | Covered in `backend_pytest_full.log` — `test_addons.py` (11 tests) |
| 6 | Cart quantity update & cross-user isolation | **PASS** | Covered in `backend_pytest_full.log` — `test_cart_api.py` (9 tests) |
| 7 | Address CRUD & ownership isolation | **PASS** | Covered in `backend_pytest_full.log` — `test_address_api.py` (9 tests) |
| 8 | Order status transitions & tracking | **PASS** | Covered in `backend_pytest_full.log` — `test_order_service.py` (7 tests) |
| 9 | Admin RBAC & endpoint security | **PASS** | Covered in `backend_pytest_full.log` — `test_security_and_settings.py` (83 tests) |
| 10 | Product add-on listing & validation | **PASS** | Covered in `backend_pytest_full.log` — `test_product_addons.py` (10 tests) |

### Validation Outputs

**Backend Validation — Python/pytest (Pass):**
```
$ cd HandloomSarees/server && python -m pytest tests/ -v --tb=short

platform win32 -- Python 3.14.5, pytest-9.1.1, pluggy-1.6.0
rootdir: HandloomSarees/server
configfile: pytest.ini
plugins: anyio-4.12.1
collected 171 items

tests/test_addons.py             11 passed
tests/test_address_api.py         9 passed
tests/test_cart_api.py            9 passed
tests/test_order_service.py       7 passed
tests/test_payment_security.py   42 passed
tests/test_product_addons.py     10 passed
tests/test_security_and_settings.py  83 passed

======================= 171 passed, 3 warnings in 2.10s =======================
```

**Frontend Lint (Pass):**
```
$ cd HandloomSarees/Ecommerce && npx eslint .
(0 errors, 0 warnings — exit code 0)
```

**Frontend Build — TypeScript + Vite (Pass):**
```
$ cd HandloomSarees/Ecommerce && npx tsc -b && npx vite build

vite v7.3.1 building for production...
✓ 75 modules transformed.
dist/assets/index-C6_P22kr.css    77.05 kB │ gzip:  13.73 kB
dist/assets/index-DQdNvbXi.js   823.89 kB │ gzip: 217.12 kB
✓ built in 5.26s
```

### Razorpay Payment Evidence

> **⚠️ Limitation:** All 42 payment tests use a **mocked Razorpay client** — no
> live or sandbox Razorpay API calls were made. These tests verify the
> application's server-side payment logic (signature validation, idempotency,
> tampering detection, webhook handling, refund RBAC) but do **not** constitute
> an end-to-end Razorpay sandbox checkout with real test API calls.
>
> **Post-merge task:** A full end-to-end Razorpay sandbox checkout (creating a
> real test order via Razorpay Dashboard, completing payment in the test
> checkout page, and verifying webhook delivery) should be performed before
> production deployment.

Payment flow testing is covered by 42 dedicated tests in
`tests/test_payment_security.py`. Key areas verified:

- **Signature verification:** HMAC-SHA256 validation of Razorpay callbacks (3 tests)
- **Idempotency:** Duplicate payment prevention and processing locks (5 tests)
- **Amount/currency tampering:** Server-side validation against order record (3 tests)
- **Payment failure handling:** Stock rollback on failed/partial payments (5 tests)
- **Webhook security:** Event deduplication, sequencing edge cases (5 tests)
- **Refund security:** Amount validation, concurrent refund locking, RBAC (6 tests)

All tests use mocked Razorpay client — no live API calls made. Test mode keys
are configured via `.env` (`key_id=rzp_test_*`, `key_secret=REDACTED`).

Full details: [`evidence/razorpay_sandbox_payment.log`](evidence/razorpay_sandbox_payment.log)

### Browser & Mobile Testing Evidence

Frontend was verified via local Vite dev server and Chrome DevTools device
emulation. **Evidence is text-based logs only** — no screenshot files are
included in this PR.

- **Viewports tested:** 1920×1080, 1440×900, 768×1024, 375×812, 360×640
- **Browsers:** Chrome 115+ (Desktop), Edge Chromium (Desktop)
- **Responsive stack:** Tailwind CSS v3.4.19 + react-responsive v10.0.1
- **Console errors:** None observed during navigation flows

#### Per-Page, Per-Viewport Verification

Detailed per-page results are in [`evidence/browser_mobile_testing.log`](evidence/browser_mobile_testing.log).
Key flows verified across all viewports:

| Page / Flow | Desktop (1920×1080, 1440×900) | Tablet (768×1024) | Mobile (375×812, 360×640) |
|-------------|-------------------------------|-------------------|---------------------------|
| Product listing (ShopPage) | Grid layout, filters, images load | 2-col grid, filter sidebar collapses | Single-column, stacked filters |
| Product detail page | Add-on selectors (fall/in-skirt), image gallery | Responsive image + stacked add-ons | Full-width layout, touch-friendly selectors |
| Blouse enquiry (add-on flow) | Fall/in-skirt selector renders, price updates live | Same as desktop, no overflow | Selector dropdowns usable, no clipping |
| Checkout / address selection | Address cards, "add new" form, selection radio | Cards stack vertically | Single-column cards, form fields full-width |
| Order summary | Line items, add-ons, totals table | Same layout, narrower | Scrollable summary, totals visible |
| Admin order details | Order info, status dropdown, tracking fields | Responsive table | Stacked layout, status controls accessible |
| Navigation / header | Full nav bar, cart icon, profile menu | Hamburger menu, logo visible | Hamburger menu, touch targets ≥44px |

Full details: [`evidence/browser_mobile_testing.log`](evidence/browser_mobile_testing.log)

## Evidence Files Committed

| File | Description |
|------|-------------|
| `evidence/backend_pytest_full.log` | Complete pytest output (171 tests) |
| `evidence/frontend_lint_build.log` | ESLint + Vite build output |
| `evidence/razorpay_sandbox_payment.log` | Razorpay mocked test coverage breakdown (not end-to-end sandbox) |
| `evidence/browser_mobile_testing.log` | Browser/viewport/responsive testing notes (text logs, no screenshots) |

## Known Issues & Remaining Risks

- **Known Issues:** None blocking the current flow.
- **Remaining Risks:**
  - The application uses Razorpay sandbox/test mode credentials; payment behavior should be re-verified with a full end-to-end sandbox checkout once production keys are swapped (post-merge task).
  - Browser testing is manual via DevTools device emulation; automated cross-browser testing (e.g., Playwright/Cypress) is recommended for future cycles.
- **Evidence Format:** All evidence is text-based log files. No screenshots or screen recordings are included in this PR.
- **Final QA Decision:** **APPROVED** for merge to the integration branch. This PR is documentation-only.
