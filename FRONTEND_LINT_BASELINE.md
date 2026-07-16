# Frontend Lint Baseline

Date: 2026-07-16

Command:

```bash
cd HandloomSarees/Ecommerce
npm run lint
```

Branch: `integration/neyge-15-day-sprint`

Result on the integration branch after the `origin/main` / `backend-feature` reconciliation:

- 84 errors
- 1 warning

## Error Categories

- `@typescript-eslint/no-explicit-any`: broad typing debt across admin pages, API clients, hooks, and customer pages.
- React Compiler: `set-state-in-effect`, `static-components`, and render purity issues.
- Fast Refresh: UI component modules export non-component values next to components.
- Type hygiene: empty interfaces, unused values, and type-only value usage.
- Hook dependency warning: one missing dependency in `AdminChatbotLeads`.

## Top Five Files By Lint Count

1. `src/components/ui/chart.tsx`: 11 errors.
2. `src/components/ui/resizable.tsx`: 8 errors.
3. `src/hooks/useCarts.ts`: 7 errors.
4. `src/admin/pages/FestiveCollectionForm.tsx`: 4 errors.
5. `src/admin/pages/ProductForm.tsx`: 4 errors.

`src/pages/CheckoutPage.tsx` also has 4 errors and should be handled in the same first lint cleanup pass.

## Remaining Files

- `src/admin/pages/AdminChatbotLeads.tsx`: missing hook dependency warning.
- `src/admin/pages/AdminCollections.tsx`: `any` typing.
- `src/admin/pages/AdminDashboard.tsx`: `any` typing.
- `src/admin/pages/AdminLogin.tsx`: `any` typing.
- `src/admin/pages/AdminOrderDetail.tsx`: `any` typing.
- `src/admin/pages/AdminOrders.tsx`: `any` typing.
- `src/admin/pages/AdminProducts.tsx`: `any` typing.
- `src/admin/pages/AdminVideoBookingsPage.tsx`: `any` typing.
- `src/admin/pages/CollectionForm.tsx`: `any` typing.
- `src/admin/pages/FestiveCollectionForm.tsx`: `any` typing.
- `src/admin/pages/ProductForm.tsx`: `any` typing.
- `src/api/chatbot.ts`: `any` typing.
- `src/api/festiveCollections.ts`: `any` typing.
- `src/components/features/FestiveCollectionsSection.tsx`: `any` typing.
- `src/components/features/FestivePopup.tsx`: `any` typing.
- `src/components/features/HeroBanner.tsx`: React Compiler `set-state-in-effect`.
- `src/components/features/ReviewSection.tsx`: `any` typing.
- `src/components/ui/badge.tsx`: fast-refresh mixed export.
- `src/components/ui/button.tsx`: fast-refresh mixed export.
- `src/components/ui/chart.tsx`: `any` typing and unused parameter.
- `src/components/ui/command.tsx`: empty interface.
- `src/components/ui/form.tsx`: fast-refresh mixed export.
- `src/components/ui/navigation-menu.tsx`: fast-refresh mixed export.
- `src/components/ui/resizable.tsx`: `any` typing.
- `src/components/ui/sidebar.tsx`: React Compiler purity and fast-refresh mixed export.
- `src/components/ui/sonner.tsx`: fast-refresh mixed export.
- `src/components/ui/textarea.tsx`: empty interface.
- `src/components/ui/toggle.tsx`: fast-refresh mixed export.
- `src/hooks/use-toast.ts`: type-only value usage.
- `src/hooks/useCarts.ts`: `any` typing.
- `src/hooks/useWishlist.ts`: `any` typing.
- `src/pages/CheckoutPage.tsx`: `any` typing.
- `src/pages/FestiveCollectionPage.tsx`: `any` typing.
- `src/pages/HomePage.tsx`: React Compiler static component and `any` typing.
- `src/pages/LoginPage.tsx`: `any` typing.
- `src/pages/ProductDetailPage.tsx`: `any` typing.
- `src/pages/ProfilePage.tsx`: `any` typing.
- `src/pages/VideoShoppingPage.tsx`: `any` typing.
- `src/pages/collections/CollectionDetailPage.tsx`: `any` typing.
- `src/pages/collections/CollectionsPage.tsx`: `any` typing.

## Why Not Fully Resolved In This Pass

The remaining errors are mostly broad typing debt across admin/customer pages and component-library patterns. Fixing them safely requires reviewing API response contracts and UI component exports across many files. That is appropriate for the intern cleanup sprint, not an immediate merge stabilization patch.

## Production Blocker

Yes. `npm run lint` remains a production readiness blocker until resolved or formally relaxed by the project owner.

## Recommended First Fixes

1. Define shared API response types for admin/product/cart/wishlist/order data.
2. Replace local `any` error handlers with `unknown` plus narrowers.
3. Move shadcn-style variant exports or relax `react-refresh/only-export-components` intentionally.
4. Fix the React Compiler errors in `HeroBanner`, `HomePage`, and `sidebar`.
