# Neyge Deployment Environments

This repository is prepared for two isolated deployment environments:

1. Preview / staging
2. Production

Do not point preview/staging at production Supabase data or live Razorpay credentials.

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

SUPABASE_URL=https://<isolated-project>.supabase.co
SUPABASE_ANON_KEY=<environment-specific-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<environment-specific-service-role-key>

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

## Payment flag matrix

```text
Preview test mode:
APP_ENV=staging
PAYMENTS_ENABLED=true
RAZORPAY_ENABLED=true
Use Razorpay TEST credentials and preview/disposable Supabase only.

Fresh pre-approval production:
APP_ENV=production
PAYMENTS_ENABLED=false
RAZORPAY_ENABLED=false
No new checkout and no Razorpay reconciliation.

Reconciliation-only production:
APP_ENV=production
PAYMENTS_ENABLED=false
RAZORPAY_ENABLED=true
New checkout disabled. Existing signed Razorpay payment/refund webhooks and reconciliation stay active.

Live production:
APP_ENV=production
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

- Use a separate Supabase project for staging or a disposable Supabase project
  for dry-run validation.
- Do not run migrations against the production Supabase project until they pass
  on the staging/disposable project and rollback behavior is understood.
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
