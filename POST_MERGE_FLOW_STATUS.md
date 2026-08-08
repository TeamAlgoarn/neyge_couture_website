# Post-Merge Flow Status

## Customer Flows

| Flow | Status | Evidence | Known issue |
|---|---|---|---|
| Login | Partially working | `app/api/v1/auth.py`, `src/pages/LoginPage.tsx` | Depends on Supabase auth and profile row consistency. |
| Registration | Partially working | `auth_service.py`, `LoginPage.tsx` | Needs live Supabase validation. |
| Product listing | Working | `GET /api/v1/products`, `ShopPage.tsx`, `products.ts` | Backend mocked only in tests; DB not validated. |
| Product detail | Working | `GET /api/v1/products/{id}`, `GET /slug/{slug}` | Slug/id behavior should be regression tested against real data. |
| Cart | Partially working | `cart.py`, `useCarts.ts`, `CartPage.tsx` | Quantity/update behavior needs backend tests beyond route protection. |
| Wishlist | Partially working | `wishlist.py`, `useWishlist.ts`, `WishlistPage.tsx` | Duplicate handling needs repository-level test. |
| Checkout | Partially working | `CheckoutPage.tsx`, `orders.py`, `payments.py` | Payment and address persistence are not production-ready. |
| Order creation | Partially working | `orders.py`, `order_service.py` | Needs transaction and inventory handling. |
| Customer order history | Partially working | `GET /orders/my`, `ProfilePage.tsx` | Needs authenticated DB test. |

## Admin And Integration Flows

| Flow | Status | Evidence | Known issue |
|---|---|---|---|
| Admin product CRUD | Partially working | `products.py`, `AdminProducts.tsx`, `ProductForm.tsx` | Admin protection tested; live DB not tested. |
| Admin collection CRUD | Partially working | `collections.py`, `AdminCollections.tsx` | Admin protection present; DB not tested. |
| Admin order view | Partially working | `orders.py`, `AdminOrders.tsx`, `AdminOrderDetail.tsx` | Needs order data fixtures. |
| Chatbot lead creation | Working | `POST /chatbot/leads` | Public by design. |
| Chatbot lead list/update | Working | `GET /chatbot/leads`, `PATCH /chatbot/leads/{id}/status` | Admin protection now tested. |
| Razorpay order creation | Externally blocked | `payments.py` | Do not mark production-ready until webhook, refund, idempotency, and transaction tests exist. |
| Razorpay callback verification | Externally blocked | `payment_service.py` | Requires test keys and supervised validation. |
| WhatsApp notifications | Externally blocked | `whatsapp.py` | Manual sends now admin-protected; signature verification remains supervised. |
| Instagram feed | Externally blocked | `instagram.py`, `instagram.ts`, `HomePage.tsx` | Depends on Meta credentials and permissions. |
| Instagram manual send | Externally blocked | `instagram.py` | Now admin-protected; no live credential use. |
