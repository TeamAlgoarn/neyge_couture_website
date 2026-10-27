# Neyge Production Readiness Notes

Current branch: `integration/neyge-15-day-sprint`

## Current readiness position

The codebase is prepared for preview/staging deployment with production-risky
integrations disabled by default in example env files.

Production deployment is not complete until the business approves:

- one shared Supabase project configuration with `public` for Production data
  and `preview` for Preview/Staging data;
- reviewed Preview schema bootstrap and successful Preview migration validation;
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
- Backend Supabase Data API access is schema-configurable through
  `SUPABASE_DB_SCHEMA`.
- Allowed backend application schemas are only `public` and `preview`.
- `APP_ENV=staging` fails fast unless `SUPABASE_DB_SCHEMA=preview`.
- `APP_ENV=production` fails fast unless `SUPABASE_DB_SCHEMA=public`.

## Supabase isolation model

Neyge uses one Supabase project with logical schema isolation:

```text
public schema  -> Production ecommerce application data
preview schema -> Preview/Staging ecommerce application data
auth schema    -> Shared Supabase Auth
storage schema -> Shared Supabase Storage metadata
```

Preview and Production share Supabase Auth users, but their ecommerce data must
not share an application schema. Preview users should be dedicated test users;
their profiles, carts, addresses, payment sessions, orders, inventory movement,
and webhook dedupe records must live in `preview.*`.

This model does not provide the blast-radius reduction of separate Supabase
projects. A service-role key for the shared project can still access both
schemas outside the app, so host secret access and SQL execution privileges must
be tightly controlled.

## Remaining before real production traffic

- Create/review the `preview` schema in the shared Supabase project using the
  Preview-only bootstrap script.
- Configure Preview with `SUPABASE_DB_SCHEMA=preview` and Production with
  `SUPABASE_DB_SCHEMA=public`.
- Deploy preview frontend/backend against the shared Supabase project with the
  Preview schema.
- Run Preview migration/bootstrap validation and rollback review.
- Execute real Razorpay sandbox checkout from deployed preview.
- Run full smoke test: home, shop, product, cart, checkout disabled/enabled,
  order confirmation, profile orders, admin orders, public policy routes.
- Confirm dependency audit remediation strategy for frontend high findings.
- Configure production monitoring/log retention/error alerting.
