# Intern Development Readiness

Date: 2026-07-16

## Status

Ready for intern development on `integration/neyge-15-day-sprint`.

Not production ready.

## Verified Code Commit

- Branch: `integration/neyge-15-day-sprint`
- Verified code commit: `0eb8837`
- Merge commit: `0eb8837 merge: reconcile main and backend-feature for 15-day Neyge sprint`

## Branch Ancestry

- `origin/main` is included in the integration branch.
- `origin/backend-feature` is included in the integration branch.
- The integration branch is ahead of `origin/main` by 9 commits and ahead of `origin/backend-feature` by 10 commits at the verified code commit.

## Validation Evidence

Passed:

- `npm run build`
- `python -m compileall app`
- `python -c "from app.main import app; print(app.title)"`
- `python -m pytest -q`
- `python -m pip check`
- `git diff --check`

Known failing baseline:

- `npm run lint`: 84 errors, 1 warning.

Repository hygiene:

- No tracked dependency directories, virtualenvs, bytecode caches, frontend build output, or backend build output were found.
- `.env` remains ignored and was not printed.

## P0 Blockers

1. Frontend lint must be reduced to zero or formally waived before production.
2. Frontend API clients still have localhost fallback URLs that need a production-safe policy.
3. Legacy `server-sdk.js` contains localhost references and needs ownership or removal.
4. Production deployment variables, CORS origins, webhook secrets, and public URLs need final environment signoff.
5. Payment, messaging, checkout, and order flows still need supervised end-to-end QA.

## First Tasks

Frontend intern:

- Start with the lint baseline in `FRONTEND_LINT_BASELINE.md`.
- First target files: `chart.tsx`, `resizable.tsx`, `useCarts.ts`, `FestiveCollectionForm.tsx`, `ProductForm.tsx`, and `CheckoutPage.tsx`.

Backend intern:

- Start with production-safe URL and settings cleanup.
- First target files: `config.py`, settings tests, frontend API client fallbacks, and the ownership decision for `server-sdk.js`.

## Readiness Decision

The branch is safe to hand to interns for the 15-day cleanup sprint because it builds, imports, passes backend tests, includes both remote branches, and has documented remaining blockers. It should not be marketed as deployment-ready until P0 blockers are closed and a final supervised QA pass is complete.
