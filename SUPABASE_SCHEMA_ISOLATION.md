# Neyge Supabase Schema Isolation Runbook

Neyge uses one Supabase project with logical schema isolation.

```text
public schema  -> Production ecommerce application data
preview schema -> Preview/Staging ecommerce application data
auth schema    -> Shared Supabase Auth
storage schema -> Shared Supabase Storage metadata
```

This is not separate-infrastructure isolation. Anyone with broad database or
service-role access to the shared Supabase project can affect both Preview and
Production if they bypass the application safeguards.

## Backend configuration

Allowed application schemas:

- `public`
- `preview`

Preview / staging:

```env
APP_ENV=staging
SUPABASE_DB_SCHEMA=preview
SUPABASE_STORAGE_BUCKET=neyge-preview
```

Production:

```env
APP_ENV=production
SUPABASE_DB_SCHEMA=public
```

The backend fails startup for unsafe combinations:

- `APP_ENV=staging` with any schema other than `preview`.
- `APP_ENV=production` with any schema other than `public`.

## Manual Supabase Dashboard steps

Do these only after reviewing the SQL locally. Do not run them from Codex during
source-code preparation.

1. Open the approved Neyge Supabase project.
2. Confirm this is the single shared project intentionally used for both
   Preview and Production.
3. Open SQL Editor.
4. Review and run:
   `HandloomSarees/server/migrations/preview/001_preview_schema_bootstrap.sql`
5. Open Project Settings -> API.
6. Add `preview` to the exposed schemas list.
7. Do not expose unrelated schemas.
8. Keep `public` exposed only for Production if the Production service needs
   PostgREST access.
9. Confirm the Preview Render service has:
   `SUPABASE_DB_SCHEMA=preview`.
10. Confirm the Production Render service has:
    `SUPABASE_DB_SCHEMA=public`.

## Required grants

The Preview bootstrap grants:

- `USAGE` on schema `preview` to `anon`, `authenticated`, and `service_role`.
- table DML privileges on `preview.*` to `service_role`.
- read access to public catalogue-style Preview tables for `anon` and
  `authenticated`.
- execute access on Preview RPC functions only to `service_role`.

The backend currently uses the service-role key server-side. Do not put the
service-role key in frontend/Vercel variables.

## Shared Auth rules

Supabase Auth remains shared. Do not duplicate `auth.users`.

Create dedicated Preview test users, for example:

- preview customer
- preview admin

Those users may exist in shared Auth, but their application rows must live only
in `preview.profiles`, `preview.carts`, `preview.addresses`,
`preview.payment_sessions`, `preview.orders`, and related `preview.*` tables.

## Storage rules

The current backend writes uploads through Supabase Storage. Preview should use
the configured bucket override:

```env
SUPABASE_STORAGE_BUCKET=neyge-preview
```

If unset, the app keeps the existing production-compatible bucket defaults:

- `product-images`
- `collection-images`

## Razorpay Preview rules

Preview Razorpay TEST transactions must use:

```env
APP_ENV=staging
SUPABASE_DB_SCHEMA=preview
PAYMENTS_ENABLED=true
RAZORPAY_ENABLED=true
```

After a TEST payment, verify changes exist only in:

- `preview.payment_sessions`
- `preview.orders`
- `preview.order_items`
- `preview.inventory`
- `preview.inventory_transactions`
- `preview.processed_webhook_events`

Verify there are no corresponding TEST rows in:

- `public.payment_sessions`
- `public.orders`
- `public.inventory`

## Remaining risks of one-project isolation

- Service-role credentials can bypass RLS and access both schemas.
- A manually executed SQL script can still modify Production if it targets
  `public`.
- Shared Auth means Preview users and Production users live in the same Auth
  tenant.
- Supabase project-level outages, quotas, and configuration mistakes affect both
  environments.
- Storage remains project-level; use dedicated Preview buckets or strict path
  conventions.
