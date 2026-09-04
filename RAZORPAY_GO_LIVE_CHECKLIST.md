# Razorpay Go-Live Checklist

Use this before enabling live Razorpay keys.

## Public website requirements

- `/terms`
- `/privacy`
- `/shipping`
- `/cancellation-refund`
- `/returns`
- `/contact`
- `/faq`

These routes are public React routes and are included in the sitemap.

## Sandbox validation required

Before production keys are configured:

- Deploy Preview with `APP_ENV=staging`, `PAYMENTS_ENABLED=true`,
  `RAZORPAY_ENABLED=true`, Razorpay TEST credentials, and preview/disposable
  Supabase.
- Run a real Razorpay sandbox checkout from the deployed preview frontend.
- Confirm `/orders/create` creates exactly one Razorpay order for the cart.
- Confirm the checkout modal opens with the expected amount and currency.
- Complete a successful sandbox payment.
- Confirm `/payments/verify` finalizes exactly one order.
- Confirm duplicate verify attempts do not create duplicate orders.
- Confirm `payment.captured` webhook finalization is idempotent.
- Confirm `payment.failed` leaves inventory untouched.
- Confirm refund initiation works only for admin and does not allow duplicate refunds.
- Confirm webhook signature failures are rejected.

## Production activation

Only after sandbox evidence is accepted:

1. Configure production Razorpay keys in backend hosting secrets.
2. Configure the production Razorpay webhook URL:
   `https://<production-backend>/api/v1/webhooks/razorpay`
3. Set backend:
   `PAYMENTS_ENABLED=true`
   `RAZORPAY_ENABLED=true`
4. Set frontend:
   `VITE_PAYMENTS_ENABLED=true`
   `VITE_RAZORPAY_ENABLED=true`
5. Run one low-value live transaction and refund test with business approval.

Do not commit Razorpay keys or webhook secrets to Git.

## Reconciliation-only production mode

If online checkout must be paused after earlier Razorpay transactions exist:

```env
APP_ENV=production
PAYMENTS_ENABLED=false
RAZORPAY_ENABLED=true
```

This blocks new customer checkout while keeping signed `payment.captured`,
`payment.failed`, `refund.created`, and `refund.processed` webhooks active for
existing transactions.
