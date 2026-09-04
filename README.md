# 🪡 Neyge Couture — Handloom Sarees

> *Woven by Hand, Worn by Soul.*

A full-stack luxury handloom saree e-commerce platform built with **React + TypeScript + Vite** on the frontend and a **FastAPI (Python)** backend with **Supabase** as the database. The platform connects conscious buyers directly with master weavers across India, preserving GI-tagged crafts and ensuring fair wages for artisan families. It also integrates directly with **WhatsApp**, **Instagram**, and **Razorpay** to automate customer communication and payments.

---

## 📁 Project Structure

```
HandloomSarees/
├── Ecommerce/                        # Frontend — React + TypeScript + Vite
│   ├── public/
│   ├── src/
│   │   ├── assets/                   # Images, icons, saree photography
│   │   ├── components/
│   │   │   ├── features/             # Domain-specific feature components
│   │   │   │   ├── ArtisanStory.tsx
│   │   │   │   ├── CalenderScheduler.tsx
│   │   │   │   ├── Chatbot.tsx
│   │   │   │   ├── FeaturedCollections.tsx
│   │   │   │   ├── FestiveCollectionsSection.tsx
│   │   │   │   ├── HeroBanner.tsx
│   │   │   │   ├── SareeCard.tsx
│   │   │   │   ├── SkinToneAnalyzer.tsx
│   │   │   │   ├── SkinTonePromoSection.tsx
│   │   │   │   └── TrustBadges.tsx
│   │   │   ├── layout/               # App shell
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── ui/                   # shadcn/ui component library
│   │   ├── api/                      # API call wrappers (client.ts, products.ts,
│   │   │   │                           orders.ts, instagram.ts, chatbot.ts, etc.)
│   │   ├── constants/
│   │   │   ├── advisors.ts           # Advisor / artisan static data
│   │   │   └── sarees.ts             # Saree product static data
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx
│   │   │   ├── use-toast.ts
│   │   │   ├── useCarts.ts
│   │   │   ├── useWishlist.ts
│   │   │   └── useVideoBooking.ts
│   │   ├── lib/
│   │   │   ├── auth.ts               # Authentication helpers
│   │   │   ├── token.ts
│   │   │   └── utils.ts              # Shared utility functions (cn, etc.)
│   │   ├── pages/
│   │   │   ├── collections/          # Collection sub-pages
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── FestiveCollectionPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── Index.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── OrderConfirmationPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── ShopPage.tsx
│   │   │   ├── SkinTonePage.tsx
│   │   │   ├── VideoShoppingPage.tsx
│   │   │   └── WishlistPage.tsx
│   │   ├── types/                    # TypeScript type definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
└── server/                           # Backend — FastAPI (Python)
    ├── app/
    │   ├── api/v1/                   # API route handlers
    │   │   ├── auth.py
    │   │   ├── cart.py
    │   │   ├── chatbot.py
    │   │   ├── collections.py
    │   │   ├── festive_collections.py
    │   │   ├── instagram.py          # Instagram integration
    │   │   ├── orders.py
    │   │   ├── payments.py           # Razorpay integration
    │   │   ├── products.py
    │   │   ├── reviews.py
    │   │   ├── router.py             # Registers all routers
    │   │   ├── uploads.py
    │   │   ├── video_bookings.py
    │   │   ├── whatsapp.py           # WhatsApp Cloud API integration
    │   │   └── wishlist.py
    │   ├── core/
    │   │   ├── config.py             # Settings — all env variables
    │   │   ├── database.py
    │   │   ├── dependencies.py       # Auth dependencies
    │   │   ├── exceptions.py
    │   │   ├── logging.py
    │   │   ├── rate_limit.py
    │   │   └── security.py
    │   ├── models/
    │   ├── repositories/             # Database query layer
    │   ├── schemas/                  # Pydantic request/response models
    │   ├── services/                 # Business logic layer
    │   └── utils/
    ├── main.py                       # App entry point
    ├── run.py
    ├── requirements.txt
    └── .env                          # Environment variables (not committed)
```

---

## ✨ Features

### 🛍️ Shopping Experience
- **Hero Banner** — Cinematic landing with animated transitions
- **Featured Collections & Festive Collections** — Curated saree showcases
- **Saree Card** — Rich product cards with hover interactions
- **Shop Page** — Full catalogue with filters and pagination
- **Product Detail Page** — High-res imagery, weave details, pricing, WhatsApp enquiry button
- **Cart & Wishlist** — Persistent state via custom hooks (`useCarts`, `useWishlist`)
- **Checkout Page** — Streamlined order flow with Razorpay payment
- **Order Confirmation Page** — Post-payment success screen with WhatsApp notification trigger

### 👘 Brand & Culture
- **Artisan Story** — Individual weaver profiles and narratives
- **Trust Badges** — GI certification, fair wage, zero power-loom badges
- **Collections Page** — Curated thematic collection sub-pages

### 🤖 Smart Features
- **Chatbot** — Multi-flow assistant for shopping, video booking, bulk enquiries and support, with a direct WhatsApp escalation option
- **Calendar Scheduler** — Book live video shopping / styling sessions
- **Skin Tone Analyzer** — AI-based saree colour matching based on skin tone
- **Instagram Feed** — Live posts pulled directly from the brand's Instagram account onto the homepage

### 👤 User Account
- **Login Page** — JWT-based authentication via `lib/auth.ts`
- **Profile Page** — Order history and account management

---

## 🔌 Platform Integrations

Neyge Couture connects directly with customers across three channels — WhatsApp, Instagram, and Razorpay — enabling automated customer support, order notifications, and secure payments without manual intervention.

### 💬 WhatsApp Business API (Cloud API)

Direct integration with Meta's WhatsApp Cloud API (not a third-party BSP) for two-way customer communication.

**What it does:**
- Receives customer messages via a webhook (`/api/v1/whatsapp/webhook`) and replies automatically based on keyword detection (greetings, pricing, order tracking, shop links)
- Sends automated order confirmation messages once a payment is verified
- Sends shipping notification messages with tracking details
- Uses a dedicated business phone number registered and verified through Meta Business Manager

**How it works technically:**
- Backend exposes a `GET` endpoint for Meta's webhook verification challenge and a `POST` endpoint that receives incoming message events
- Outbound messages are sent using the Graph API (`https://graph.facebook.com/{version}/{phone_number_id}/messages`)
- Authentication uses a permanent System User access token generated via Meta Business Manager (does not expire, unlike personal user tokens)
- Credentials (Phone Number ID, WhatsApp Business Account ID, Access Token, Webhook Verify Token) are stored in `.env` and read via `app/core/config.py`

**Setup location:** `app/api/v1/whatsapp.py`

---

### 📸 Instagram Messaging API

Integration with Meta's Instagram Graph API for direct message automation and live content display.

**What it does:**
- Auto-replies to Instagram DMs sent to the business account, using the same keyword-based logic as WhatsApp
- Pulls the business account's latest Instagram posts and displays them live on the website homepage (replacing static gallery images)
- Built to support comment auto-replies (`reply_to_comment` function ready, not yet activated)

**How it works technically:**
- Same webhook verification + receiver pattern as WhatsApp, but scoped to Instagram messaging events (`/api/v1/instagram/webhook`)
- Requires the Instagram account to be a Business/Creator account, linked to a Facebook Page, and connected inside Meta Business Manager
- Media fetching uses the Graph API's `/media` endpoint with fields for caption, media URL, permalink, and timestamp
- **Current limitation:** auto-replies only work for Meta App testers/admins until Meta's App Review process is approved — required before real customers can receive automated replies

**Setup location:** `app/api/v1/instagram.py`, `src/api/instagram.ts`

---

### 💳 Razorpay Payment Gateway

Secure payment processing integrated directly into the checkout flow.

**What it does:**
- Creates a Razorpay order when a customer proceeds to checkout
- Verifies payment signature server-side after the customer completes payment (prevents payment tampering)
- Triggers an automatic WhatsApp order confirmation message to the customer once payment is verified
- Designed to support webhook-based events (`payment.captured`, `payment.failed`, `order.paid`, `refund.created`) for real-time payment status updates

**How it works technically:**
- Payment creation and verification logic lives in `payment_service.py`, called from `payments.py` and `orders.py` route handlers
- Signature verification uses Razorpay's official SDK to confirm the payment came from Razorpay and wasn't forged
- Live API keys (Key ID + Key Secret) are generated from the Razorpay Dashboard after business KYC approval

**Setup location:** `app/api/v1/payments.py`, `app/api/v1/orders.py`, `app/services/payment_service.py`

---

### Integration Status Summary

| Integration | Status |
|---|---|
| WhatsApp Business API | ✅ Fully integrated, webhook verified, auto-reply and order notifications working |
| Instagram API | ⚠️ Integrated and webhook verified — pending Meta App Review approval for production-level auto-replies to real users |
| Razorpay | ⚠️ Backend code complete — pending client KYC approval and Live API key generation |

---

## 🛠️ Tech Stack

### Frontend (`/Ecommerce`)

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + custom CSS |
| Component Library | shadcn/ui |
| Routing | React Router v6 |
| Cart / Wishlist State | Custom hooks |
| Notifications | Sonner + Toast |
| Linting | ESLint + Stylelint |
| Type Checking | TypeScript (strict) |

### Backend (`/server`)

| Layer | Technology |
|---|---|
| Framework | FastAPI (Python) |
| Entry Point | `main.py` |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (JSON Web Tokens) |
| Architecture | Layered — API routes → Services → Repositories |
| File Uploads | Cloudinary |
| Payments | Razorpay |
| Messaging | WhatsApp Cloud API + Instagram Graph API |
| Config | `.env` (Pydantic Settings) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- npm
- A Supabase project (URL + keys)

### 1. Frontend

```bash
cd Ecommerce
npm install
npm run dev
```

Runs at `http://localhost:5173`

### 2. Backend

```bash
cd server
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
# Add your credentials to .env
uvicorn main:app --reload
```

Runs at `http://localhost:8000` — interactive API docs available at `http://localhost:8000/docs`

### 3. Production Build

```bash
cd Ecommerce
npm run build     # TypeScript compile + Vite build → /dist
npm run preview   # Serve the build locally
```

---

## 📄 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | `HomePage.tsx` | Landing — hero, collections, artisans, Instagram feed |
| `/shop` | `ShopPage.tsx` | Full product catalogue |
| `/product/:id` | `ProductDetailPage.tsx` | Individual saree detail |
| `/collections` | `collections/` | Themed collection sub-pages |
| `/festive-collection` | `FestiveCollectionPage.tsx` | Festive-themed saree collection |
| `/cart` | `CartPage.tsx` | Shopping cart |
| `/wishlist` | `WishlistPage.tsx` | Saved / wishlisted sarees |
| `/checkout` | `CheckoutPage.tsx` | Order checkout with Razorpay |
| `/order-confirmation` | `OrderConfirmationPage.tsx` | Post-payment order success page |
| `/video-shopping` | `VideoShoppingPage.tsx` | Live video styling session booking |
| `/skin-tone-match` | `SkinTonePage.tsx` | AI-based skin tone saree colour matching |
| `/login` | `LoginPage.tsx` | User authentication |
| `/profile` | `ProfilePage.tsx` | User account & orders |
| `*` | `NotFound.tsx` | 404 fallback |

---

## 🧩 Feature Components

| Component | Purpose |
|---|---|
| `HeroBanner.tsx` | Animated homepage hero section |
| `FeaturedCollections.tsx` / `FestiveCollectionsSection.tsx` | Curated collection grids |
| `SareeCard.tsx` | Product card — image, name, region, price |
| `ArtisanStory.tsx` | Weaver profile narrative block |
| `TrustBadges.tsx` | GI tag, fair wage, handloom certifications |
| `Chatbot.tsx` | Multi-flow shopping/support assistant with WhatsApp escalation |
| `CalenderScheduler.tsx` | Live video session booking calendar |
| `SkinToneAnalyzer.tsx` / `SkinTonePromoSection.tsx` | AI skin tone colour matching |
| `Header.tsx` | Navigation bar with cart, wishlist, account icons |
| `Footer.tsx` | Brand links, social, WhatsApp button, legal |

---

## 🪝 Custom Hooks

| Hook | Purpose |
|---|---|
| `useCarts.ts` | Add, remove, update, clear cart items |
| `useWishlist.ts` | Save and manage wishlisted sarees |
| `useVideoBooking.ts` | Manage video shopping session bookings |
| `use-toast.ts` | Trigger toast notifications |
| `use-mobile.tsx` | Responsive breakpoint detection |

---

## 📦 Constants & Static Data

| File | Purpose |
|---|---|
| `constants/sarees.ts` | Saree product data — name, price, region, craft type, images |
| `constants/advisors.ts` | Artisan/advisor profiles — name, craft, location, biography |

---

## 🎨 UI Components (shadcn/ui)

All shadcn components live in `components/ui/` and are fully customised to the Neyge brand theme:

`accordion` · `alert` · `alert-dialog` · `aspect-ratio` · `avatar` · `badge` · `breadcrumb` · `button` · `calendar` · `card` · `carousel` · `chart` · `checkbox` · `collapsible` · `command` · `context-menu` · `dialog` · `drawer` · `dropdown-menu` · `form` · `hover-card` · `input` · `input-otp` · `label` · `menubar` · `navigation-menu` · `pagination` · `popover` · `progress` · `radio-group` · `resizable` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` · `skeleton` · `slider` · `sonner` · `switch` · `table` · `tabs` · `textarea` · `toast` · `toaster` · `toggle` · `toggle-group` · `tooltip`

---

## 🎨 Brand Identity

### Colour Palette

| Name | Hex | Usage |
|---|---|---|
| Maroon | `#800020` | Primary headings, CTAs, accents |
| Navy | `#1B2A6B` | Secondary sections, dark backgrounds |
| Forest Green | `#14402A` | Logo wordmark colour, feature tags |
| Gold | `#C4980A` | Eyebrows, dividers, shimmer text |
| Gold Vibrant | `#D4AF37` | On dark backgrounds |
| Blush | `#F2C4CE` | Soft accent, palette bar |
| Cream Light | `#FFF9F0` | Page backgrounds |
| Cream | `#F5E6D3` | Card and panel backgrounds |
| Warm Grey | `#4a3828` | Body text |

### Typography
- **Display / Headings:** `Cinzel` (Copperplate replacement) — geometric all-caps serif used in premium luxury branding
- **Body Text:** `Josefin Sans`
- **Editorial Italic Quotes:** `Cormorant Garamond`

> Brand tagline: *"Woven by Hand, Worn by Soul"* — Crafted Elegance · Est. 2026

---

## 🔐 Authentication

Authentication uses JWT (JSON Web Tokens), issued by the FastAPI backend after validating credentials through Supabase. The frontend stores the token in localStorage and sends it as a Bearer token in the Authorization header for all protected routes. Auth logic on the frontend is centralised in `src/lib/auth.ts`, consumed directly by `LoginPage.tsx` and `ProfilePage.tsx`. Admin-only backend routes are protected via the `require_admin` dependency in `app/core/dependencies.py`.

---

## 🌐 Environment Variables

Create `server/.env`:

```env
# App
APP_ENV=development
DEBUG=True
FRONTEND_URL=http://localhost:5173

# Database (Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# Auth
JWT_SECRET=your_jwt_secret
JWT_ALGORITHM=HS256

# Razorpay
PAYMENTS_ENABLED=false
RAZORPAY_ENABLED=false
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Cloudinary (file/image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WhatsApp Business API (Cloud API)
WHATSAPP_ENABLED=false
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_waba_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_API_VERSION=v25.0

# Instagram API
INSTAGRAM_ENABLED=false
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_account_id
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_ig_webhook_verify_token
INSTAGRAM_API_VERSION=v25.0
```

Payment flag semantics:

- `PAYMENTS_ENABLED` controls whether customers can initiate new online payment checkout.
- `RAZORPAY_ENABLED` controls whether Razorpay integration is configured for callbacks, signed webhooks, reconciliation, and refunds.
- `PAYMENTS_ENABLED=true` requires `RAZORPAY_ENABLED=true`.
- `PAYMENTS_ENABLED=false` with `RAZORPAY_ENABLED=true` is valid for reconciliation-only production: new checkout stays blocked, but existing signed Razorpay payment/refund webhooks can still be processed.

> ⚠️ Never commit `.env` to version control. It is already listed in `.gitignore`.

---

## 📦 Scripts

### Frontend
```bash
npm run dev        # Vite dev server with HMR
npm run build      # Production build → /dist
npm run preview    # Preview the production build
npm run lint       # Run ESLint
```

### Backend
```bash
uvicorn main:app --reload    # Start the FastAPI dev server
```

---

<p align="center">
  Made with ♥ for the weavers of India
  <br/>
  <em>"Handmade is not a trend. It is a truth."</em>
</p>
