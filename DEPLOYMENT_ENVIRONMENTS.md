# Neyge Deployment Environments

This repository is prepared for two isolated deployment environments:

1. Preview / staging
2. Production

Neyge uses one Supabase project with logical schema isolation:

```text
public schema  -> Production ecommerce data
preview schema -> Preview/Staging ecommerce data
auth schema    -> Shared Supabase Auth
storage schema -> Shared Supabase Storage metadata
```

This is logical isolation, not separate-infrastructure isolation. Preview must
never run with `SUPABASE_DB_SCHEMA=public`, and Production must never run with
`SUPABASE_DB_SCHEMA=preview`.

Allowed backend application schema values are only `public` and `preview`.

## Frontend

Location: `HandloomSarees/Ecommerce`

Recommended host: Vercel.

Required build settings:

```text
Framework preset: Vite
Build command: npm ci && npm run build
Output directory: dist
Install command: npm ci
```

Required environment variables:

```env
VITE_SITE_ENV=staging
VITE_API_BASE_URL=https://<backend-preview-or-production-host>/api/v1
VITE_PAYMENTS_ENABLED=false
VITE_RAZORPAY_ENABLED=false
```

Preview Razorpay Test Mode should use:

```env
VITE_SITE_ENV=staging
VITE_API_BASE_URL=https://api-preview.neygecouture.com/api/v1
VITE_PAYMENTS_ENABLED=true
VITE_RAZORPAY_ENABLED=true
```

Production should use:

```env
VITE_SITE_ENV=production
VITE_API_BASE_URL=https://api.neygecouture.com/api/v1
VITE_PAYMENTS_ENABLED=true
VITE_RAZORPAY_ENABLED=true
```

The frontend includes `vercel.json` rewrites so direct SPA URLs such as `/terms`,
`/privacy`, `/checkout`, and `/order-confirmation/:id` return `index.html`.
Preview/staging builds must set `VITE_SITE_ENV=staging`; the app inserts
`<meta name="robots" content="noindex,nofollow">`. Production must set
`VITE_SITE_ENV=production` and remains indexable.

## Backend

Location: `HandloomSarees/server`

Recommended host: Render.

Production start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Do not use `--reload` outside local development.

Required common backend variables:

```env
APP_ENV=staging
DEBUG=false
FRONTEND_URL=https://<frontend-preview-or-production-host>
CORS_ORIGINS=https://<frontend-preview-or-production-host>

SUPABASE_URL=https://<shared-neyge-project>.supabase.co
SUPABASE_ANON_KEY=<shared-project-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<shared-project-service-role-key>
SUPABASE_DB_SCHEMA=<preview-or-public>
SUPABASE_STORAGE_BUCKET=<optional-environment-specific-bucket>

JWT_SECRET=<long-random-environment-specific-secret>
JWT_ALGORITHM=HS256

CLOUDINARY_CLOUD_NAME=<environment-specific-cloud>
CLOUDINARY_API_KEY=<environment-specific-key>
CLOUDINARY_API_SECRET=<environment-specific-secret>

PAYMENTS_ENABLED=false
RAZORPAY_ENABLED=false
WHATSAPP_ENABLED=false
INSTAGRAM_ENABLED=false
```

For production, set `APP_ENV=production`.

`render.yaml` models two persistent backend services:

- `neyge-api-preview`: branch `integration/neyge-15-day-sprint`, `APP_ENV=staging`, intended custom domain `api-preview.neygecouture.com`.
- `neyge-api-production`: branch `main`, `APP_ENV=production`, intended custom domain `api.neygecouture.com`.

Both services use `/api/v1/health` as the health check and require environment-specific non-synced secrets.

Preview backend must set:

```env
APP_ENV=staging
SUPABASE_DB_SCHEMA=preview
SUPABASE_STORAGE_BUCKET=neyge-preview
```

Production backend must set:

```env
APP_ENV=production
SUPABASE_DB_SCHEMA=public
```

## Payment flag matrix

```text
Preview test mode:
APP_ENV=staging
SUPABASE_DB_SCHEMA=preview
PAYMENTS_ENABLED=true
RAZORPAY_ENABLED=true
Use Razorpay TEST credentials only. Razorpay TEST transactions must only write
to preview schema application tables.

Fresh pre-approval production:
APP_ENV=production
SUPABASE_DB_SCHEMA=public
PAYMENTS_ENABLED=false
RAZORPAY_ENABLED=false
No new checkout and no Razorpay reconciliation.

Reconciliation-only production:
APP_ENV=production
SUPABASE_DB_SCHEMA=public
PAYMENTS_ENABLED=false
RAZORPAY_ENABLED=true
New checkout disabled. Existing signed Razorpay payment/refund webhooks and reconciliation stay active.

Live production:
APP_ENV=production
SUPABASE_DB_SCHEMA=public
PAYMENTS_ENABLED=true
RAZORPAY_ENABLED=true
Use Razorpay LIVE credentials only after approval.
```

## Integration activation

Only enable integrations after credentials, callbacks, and evidence are approved
for that specific environment.

```env
PAYMENTS_ENABLED=true
RAZORPAY_ENABLED=true
RAZORPAY_KEY_ID=<rzp_test_or_live_key_for_environment>
RAZORPAY_KEY_SECRET=<razorpay_secret_for_environment>
RAZORPAY_WEBHOOK_SECRET=<razorpay_webhook_secret_for_environment>

WHATSAPP_ENABLED=true
WHATSAPP_PHONE_NUMBER_ID=<meta_phone_number_id>
WHATSAPP_BUSINESS_ACCOUNT_ID=<meta_waba_id>
WHATSAPP_ACCESS_TOKEN=<meta_token>
WHATSAPP_WEBHOOK_VERIFY_TOKEN=<random_verify_token>
WHATSAPP_APP_SECRET=<meta_app_secret>
WHATSAPP_API_VERSION=v25.0

INSTAGRAM_ENABLED=true
INSTAGRAM_BUSINESS_ACCOUNT_ID=<instagram_business_account_id>
INSTAGRAM_ACCESS_TOKEN=<instagram_token>
INSTAGRAM_APP_ID=<meta_app_id>
INSTAGRAM_APP_SECRET=<meta_app_secret>
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=<random_verify_token>
INSTAGRAM_API_VERSION=v25.0
```

## Database safety

- Use the same Supabase project with schema-level isolation.
- Production ecommerce data lives in `public.*`.
- Preview ecommerce data lives in `preview.*`.
- Supabase Auth is shared through `auth.*`; create dedicated Preview test users
  such as `preview customer` and `preview admin`.
- Do not run the existing `public.*` migrations for Preview. Use the explicit
  Preview-only bootstrap script in
  `HandloomSarees/server/migrations/preview/001_preview_schema_bootstrap.sql`.
- In Supabase Dashboard, expose only the `preview` schema for Preview Data API
  access; do not expose unrelated schemas.
- Confirm RLS policies, service-role usage, webhook event dedupe tables, payment
  sessions, order tables, and inventory fields before enabling real payments.
- Keep production service-role keys only in backend hosting secrets.

## Pre-production gates

- CI passes for frontend lint/build and backend tests.
- `git diff --check` is clean.
- No live secrets are committed.
- Public pages exist: `/terms`, `/privacy`, `/shipping`,
  `/cancellation-refund`, `/returns`, `/contact`, `/faq`, `/cookies`, `/track`.
- Payment checkout remains disabled until Razorpay sandbox real checkout evidence
  is produced.
- Production domain is consistently `www.neygecouture.com`.
