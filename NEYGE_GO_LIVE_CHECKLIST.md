# Neyge Go-Live Checklist

## Must Pass Before Go-Live

| Area | Check | Current evidence | Status |
|---|---|---|---|
| Branch | Create a reconciled branch from `origin/main` plus `origin/backend-feature` | Branches diverge by `3 3` commits | Blocked |
| Frontend build | `cmd /c npm run build` succeeds | Fails: `tsconfig.app.json:24` invalid `ignoreDeprecations` | Blocked |
| Frontend lint | `npm run lint` clean or documented exceptions | 90 errors, 1 warning | Blocked |
| Backend import | FastAPI imports with production-like env | Import works only after overriding invalid local `DEBUG` | Blocked |
| API docs | `/docs` reachable after backend start | Import verified, server not started due env issue | Needs verification |
| Tests | Unit/API/e2e tests pass | No test suites found | Blocked |
| Database | Migrations and schema tracked | No migrations found; schema inferred from Supabase table names | Blocked |
| Secrets | No secrets in source or history | `.env` is ignored and present locally; hardcoded webhook token defaults exist in `config.py` | Needs remediation |
| CORS | Production domain allowlist configured | `main.py:115-118` only localhost origins | Blocked |
| Frontend env | `VITE_API_BASE_URL` configured for production | `api/client.ts:4` defaults to localhost | Blocked |
| Admin env | `VITE_API_URL` configured for production | `adminApi.ts:5` defaults to `127.0.0.1` | Blocked |
| Domain spelling | Single canonical domain used | `neygecouture.com`, `negyecouture.com`, and `neyge_couture` appear | Blocked |
| Razorpay | Test order, signature verify, idempotent webhook, refund tested | Only frontend callback verification exists; no webhook/refund routes | Blocked |
| WhatsApp | Webhook GET/POST, signature validation, templates approved | GET/POST exists; no signature verification | Blocked |
| Instagram | App Review permissions, token lifecycle, webhook signature | Basic webhook/media exists; no signature/token refresh | Blocked |
| Inventory | Variant/SKU stock and transactional decrement | Single product `stock`, non-transactional update | Blocked |
| Orders | Status workflow, shipping, cancellation, refunds | Read/list only plus payment-created order | Blocked |
| Uploads | File signature validation and storage lifecycle | MIME/size checks only; Supabase Storage upload | Needs hardening |
| Monitoring | Runtime logging/error monitoring configured | Print statements and no monitoring config | Blocked |
| Backup | Database backup and restore tested | No backup docs/config found | Blocked |
| Rollback | Previous frontend/backend versions deployable | No deployment/versioning config found | Blocked |

## Production Environment Variables

Do not reuse local values. Configure these in the deployment platform:

`APP_ENV`, `DEBUG`, `FRONTEND_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `JWT_SECRET`, `JWT_ALGORITHM`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `WHATSAPP_API_VERSION`, `INSTAGRAM_BUSINESS_ACCOUNT_ID`, `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET`, `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`, `INSTAGRAM_API_VERSION`, `VITE_API_BASE_URL`, `VITE_API_URL`.

## Final Manual Smoke Tests

1. Register and log in as customer.
2. Add a product to wishlist.
3. Add product to cart and update quantity.
4. Add and persist address.
5. Start Razorpay test checkout.
6. Verify successful payment creates exactly one order.
7. Confirm inventory is reduced once.
8. Verify failed/cancelled payment does not create paid order.
9. Verify duplicate payment callback is idempotent.
10. Confirm customer order history shows the new order.
11. Admin logs in and sees the order.
12. Admin updates shipping/tracking.
13. WhatsApp order confirmation sends after verified payment only.
14. WhatsApp webhook signature rejection test.
15. Instagram feed loads with loading/empty/error states.
16. Instagram webhook signature rejection test.
17. Upload product images and validate file restrictions.
18. Mobile smoke test for home, shop, product, cart, checkout, profile, admin.
19. SEO smoke test for title, description, Open Graph, sitemap, robots.
20. Backup and rollback drill.
