# Issue #11 Regression Report

## Overview

This report documents the QA validation and regression testing evidence for
Issue #11. All test commands, outputs, and evidence files were generated from
the actual repository at the commit hash listed below.

**Test Execution Details:**
- **Test Date:** 2026-08-27
- **Tester:** QA Automation / AI Agent
- **Branch:** `feature/issue-11-regression-report`
- **Exact Commit Hash Tested:** `6c87a843d7230fbc27f0ada90fd7d7e0880d81a2` (HEAD of PR)
- **Target Branch for PRs:** `integration/neyge-15-day-sprint`

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
| 3 | Razorpay sandbox payment security (42 tests) | **PASS** | [`evidence/razorpay_sandbox_payment.log`](evidence/razorpay_sandbox_payment.log) |
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

### Razorpay Sandbox Evidence

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

Frontend was verified via local Vite dev server and Chrome DevTools:

- **Viewports tested:** 1920×1080, 1440×900, 768×1024, 375×812, 360×640
- **Browsers:** Chrome 115+ (Desktop), Edge Chromium (Desktop)
- **Responsive stack:** Tailwind CSS v3.4.19 + react-responsive v10.0.1
- **Console errors:** None observed during navigation flows

Full details: [`evidence/browser_mobile_testing.log`](evidence/browser_mobile_testing.log)

## Evidence Files Committed

| File | Description |
|------|-------------|
| `evidence/backend_pytest_full.log` | Complete pytest output (171 tests) |
| `evidence/frontend_lint_build.log` | ESLint + Vite build output |
| `evidence/razorpay_sandbox_payment.log` | Razorpay test coverage breakdown |
| `evidence/browser_mobile_testing.log` | Browser/viewport/responsive testing notes |

## Known Issues & Remaining Risks

- **Known Issues:** None blocking the current flow.
- **Remaining Risks:** The application uses Razorpay sandbox/test mode credentials; payment behavior should be re-verified once production keys are swapped (post-merge task).
- **Final QA Decision:** **APPROVED** for merge to the integration branch. This PR is documentation-only.
