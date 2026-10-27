# First Intern Assignments

Date: 2026-07-16

Branch: `integration/neyge-15-day-sprint`

## First Frontend Task

Task: Reduce the frontend lint baseline without changing product behavior.

Primary files:

- `HandloomSarees/Ecommerce/src/components/ui/chart.tsx`
- `HandloomSarees/Ecommerce/src/components/ui/resizable.tsx`
- `HandloomSarees/Ecommerce/src/hooks/useCarts.ts`
- `HandloomSarees/Ecommerce/src/admin/pages/FestiveCollectionForm.tsx`
- `HandloomSarees/Ecommerce/src/admin/pages/ProductForm.tsx`
- `HandloomSarees/Ecommerce/src/pages/CheckoutPage.tsx`

Acceptance criteria:

- `npm run build` still passes.
- `npm run lint` error count is lower than 84.
- No API shape is guessed; reusable types are added only when supported by existing code.
- No visual redesign or unrelated refactor is included.

Suggested first PR:

- Replace unsafe `any` in `chart.tsx` and `resizable.tsx`.
- Keep UI behavior unchanged.
- Update `FRONTEND_LINT_BASELINE.md` with the new count.

## First Backend Task

Task: Remove production-facing local URL assumptions while keeping local development ergonomic.

Primary files:

- `HandloomSarees/server/app/core/config.py`
- `HandloomSarees/server/tests/test_security_and_settings.py`
- `HandloomSarees/Ecommerce/src/api/client.ts`
- `HandloomSarees/Ecommerce/src/admin/lib/adminApi.ts`
- `HandloomSarees/server/server-sdk.js`

Acceptance criteria:

- `python -m compileall app` passes.
- `python -m pytest -q` passes.
- `python -m pip check` passes.
- `npm run build` passes.
- `rg "localhost|127\\.0\\.0\\.1|ngrok" .` only returns docs, examples, tests, or explicitly development-only files.
- Production mode fails fast if required public URLs or secrets are missing.

Suggested first PR:

- Keep `.env.example` local-friendly.
- Make production URL requirements explicit in settings validation and docs.
- Decide whether `server-sdk.js` is retained as a development helper or removed from the active backend surface.

## Subsequent Order

1. Frontend lint baseline reduction.
2. Production URL and CORS cleanup.
3. Admin and customer API response typing.
4. Cart, wishlist, checkout, and order flow smoke tests.
5. WhatsApp, Instagram, and payment webhook validation tests.
6. Deployment checklist and environment template pass.
7. Accessibility and responsive UI QA.
8. Final production hardening pass.

## Days 13-15 Supervised Phase

Days 13-15 should be treated as supervised stabilization, not feature expansion.

- Day 13: QA the critical commerce flows and review all intern PRs for behavior drift.
- Day 14: Fix release blockers only; freeze new feature work.
- Day 15: Final build, lint, backend tests, environment review, deployment readiness signoff, and rollback notes.
