# Neyge Production Readiness Notes

Current branch: `integration/neyge-15-day-sprint`

## Current readiness position

The codebase is prepared for preview/staging deployment with production-risky
integrations disabled by default in example env files.

Production deployment is not complete until the business approves:

- dedicated production Supabase project and credentials;
- dedicated staging/disposable Supabase dry-run project;
- Razorpay sandbox E2E evidence;
- live Razorpay activation;
- production domain/DNS;
- final CORS allowlist;
- final operational ownership for refunds, failed payments, webhook retries, and support.

## What is now production-safe in code

- Public compliance pages and routes exist.
- Vercel SPA rewrites exist for direct-route refreshes.
- Backend new-checkout creation is blocked when `PAYMENTS_ENABLED=false`.
- Razorpay callbacks, signed webhooks, refunds, and reconciliation are blocked only
  when `RAZORPAY_ENABLED=false`.
- `PAYMENTS_ENABLED=false` with `RAZORPAY_ENABLED=true` is supported for
  reconciliation-only production.
- Frontend checkout does not load Razorpay or call checkout APIs when payment
  flags are disabled.
- WhatsApp and Instagram outbound sends are skipped when their flags are disabled.
- Production start command is documented without reload.
- Canonical public domain is normalized to `www.neygecouture.com` in changed
  customer-facing code and SEO files.

## Remaining before real production traffic

- Deploy preview frontend/backend with staging/disposable Supabase.
- Run migrations in staging/disposable Supabase and verify rollback plan.
- Execute real Razorpay sandbox checkout from deployed preview.
- Run full smoke test: home, shop, product, cart, checkout disabled/enabled,
  order confirmation, profile orders, admin orders, public policy routes.
- Confirm dependency audit remediation strategy for frontend high findings.
- Configure production monitoring/log retention/error alerting.
