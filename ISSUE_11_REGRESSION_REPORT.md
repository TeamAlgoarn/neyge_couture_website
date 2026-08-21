# Issue #11 Regression Report

## Overview
This report documents the manual QA and browser testing evidence for Issue #11.

**Important Context:**
- Integration is NOT merged into `main` yet.
- This codebase is NOT marked production-ready.
- NO live credentials were used during testing.
- Target branch for PRs: `integration/neyge-15-day-sprint`.

## QA Evidence Checklist

Please attach screenshots, screen recordings, or descriptive logs for each of the following flows:

### 1. Product Page
- [ ] Product details load correctly (images, descriptions, price).
- [ ] Responsive layout verifies correctly.
- **Evidence:** (Attach evidence here)

### 2. Add-ons
- [ ] Add-ons (e.g., fall, in-skirt) can be selected.
- [ ] Add-on prices correctly update the total product price.
- **Evidence:** (Attach evidence here)

### 3. Blouse Enquiry
- [ ] Blouse enquiry form opens correctly.
- [ ] Form submission captures required user details and sends request.
- **Evidence:** (Attach evidence here)

### 4. Cart
- [ ] Items are correctly added to the cart from the product page.
- [ ] Cart reflects selected add-ons and accurate total pricing.
- **Evidence:** (Attach evidence here)

### 5. Quantity Update
- [ ] Quantity can be increased/decreased in the cart.
- [ ] Price totals update dynamically upon quantity change.
- **Evidence:** (Attach evidence here)

### 6. Checkout
- [ ] Checkout flow initiates without errors.
- [ ] Order details are correctly passed from cart to checkout.
- **Evidence:** (Attach evidence here)

### 7. Address Selection
- [ ] Existing addresses can be selected.
- [ ] New addresses can be added and selected.
- **Evidence:** (Attach evidence here)

### 8. Order Summary
- [ ] Final order summary displays correct items, add-ons, quantities, taxes, and total prices before payment.
- **Evidence:** (Attach evidence here)

### 9. Payment Flow
- [ ] Payment gateway initiates successfully (using test credentials).
- [ ] Successful payment redirects to order confirmation.
- [ ] Failed/cancelled payment handles gracefully.
- **Evidence:** (Attach evidence here)

### 10. Admin Order Details
- [ ] New order appears in the admin dashboard.
- [ ] Admin view accurately displays item, add-ons, address, user details, and payment status.
- **Evidence:** (Attach evidence here)

### 11. Mobile View
- [ ] End-to-end flow is fully responsive on mobile devices (Product -> Cart -> Checkout -> Payment).
- **Evidence:** (Attach evidence here)

## Next Steps
1. Remove all current blockers.
2. Prepare staging deployment once verification is complete.
