# 🪡 Neyge Couture — Handloom Sarees

> *Woven by Hand, Worn by Soul.*

A full-stack luxury handloom saree e-commerce platform built with **React + TypeScript + Vite** on the frontend and a **Node.js** backend. The platform connects conscious buyers directly with master weavers across India, preserving GI-tagged crafts and ensuring fair wages for artisan families.

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
│   │   │   │   ├── HeroBanner.tsx
│   │   │   │   ├── SareeCard.tsx
│   │   │   │   └── TrustBadges.tsx
│   │   │   ├── layout/               # App shell
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── ui/                   # shadcn/ui component library (40+ components)
│   │   ├── constants/
│   │   │   ├── advisors.ts           # Advisor / artisan static data
│   │   │   └── sarees.ts             # Saree product static data
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx
│   │   │   ├── use-toast.ts
│   │   │   ├── useCarts.ts
│   │   │   └── useWishlist.ts
│   │   ├── lib/
│   │   │   ├── auth.ts               # Authentication helpers
│   │   │   └── utils.ts              # Shared utility functions (cn, etc.)
│   │   ├── pages/
│   │   │   ├── collections/          # Collection sub-pages
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── Index.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── OurArtician.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── ShopPage.tsx
│   │   ├── types/                    # TypeScript type definitions
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── postcss.config.js
│   ├── eslint.config.js
│   └── .stylelintrc.json
│
└── server/                           # Backend — Node.js
    ├── server-sdk.js                 # Main server entry / SDK setup
    ├── .env                          # Environment variables (not committed)
    ├── package.json
    └── package-lock.json
```

---

## ✨ Features

### 🛍️ Shopping Experience
- **Hero Banner** — Cinematic landing with animated transitions
- **Featured Collections** — Curated saree collection showcase
- **Saree Card** — Rich product cards with hover interactions
- **Shop Page** — Full catalogue with filters and pagination
- **Product Detail Page** — High-res imagery, weave details, pricing
- **Cart & Wishlist** — Persistent state via custom hooks (`useCarts`, `useWishlist`)
- **Checkout Page** — Streamlined order flow

### 👘 Brand & Culture
- **Artisan Story** — Individual weaver profiles and narratives
- **Our Artisans Page** — Gallery of all partner artisan profiles
- **Trust Badges** — GI certification, fair wage, zero power-loom badges
- **Collections Page** — Curated thematic collection sub-pages

### 🤖 Smart Features
- **Chatbot** — AI-powered styling and product assistant
- **Calendar Scheduler** — Book live video shopping / styling sessions

### 👤 User Account
- **Login Page** — Authentication via `lib/auth.ts`
- **Profile Page** — Order history and account management

---

## 🛠️ Tech Stack

### Frontend (`/Ecommerce`)

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Component Library | shadcn/ui (40+ components) |
| Routing | React Router v6 |
| Cart / Wishlist State | Custom hooks |
| Notifications | Sonner + Toast |
| Linting | ESLint + Stylelint |
| Type Checking | TypeScript (strict) |

### Backend (`/server`)

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Entry Point | `server-sdk.js` |
| Config | `.env` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm

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
npm install
# Add your credentials to .env
node server-sdk.js
```

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
| `/` | `HomePage.tsx` | Landing — hero, collections, artisans |
| `/shop` | `ShopPage.tsx` | Full product catalogue |
| `/product/:id` | `ProductDetailPage.tsx` | Individual saree detail |
| `/collections` | `collections/` | Themed collection sub-pages |
| `/cart` | `CartPage.tsx` | Shopping cart |
| `/checkout` | `CheckoutPage.tsx` | Order checkout |
| `/artisans` | `OurArtician.tsx` | Artisan profiles |
| `/login` | `LoginPage.tsx` | User authentication |
| `/profile` | `ProfilePage.tsx` | User account & orders |
| `*` | `NotFound.tsx` | 404 fallback |

---

## 🧩 Feature Components

| Component | Purpose |
|---|---|
| `HeroBanner.tsx` | Animated homepage hero section |
| `FeaturedCollections.tsx` | Curated collection grid |
| `SareeCard.tsx` | Product card — image, name, region, price |
| `ArtisanStory.tsx` | Weaver profile narrative block |
| `TrustBadges.tsx` | GI tag, fair wage, handloom certifications |
| `Chatbot.tsx` | AI styling assistant chat widget |
| `CalenderScheduler.tsx` | Live video session booking calendar |
| `Header.tsx` | Navigation bar with cart & wishlist icons |
| `Footer.tsx` | Brand links, social, legal |

---

## 🪝 Custom Hooks

| Hook | Purpose |
|---|---|
| `useCarts.ts` | Add, remove, update, clear cart items |
| `useWishlist.ts` | Save and manage wishlisted sarees |
| `use-toast.ts` | Trigger toast notifications |
| `use-mobile.tsx` | Responsive breakpoint detection |

---

## 📦 Constants & Static Data

| File | Purpose |
|---|---|
| `constants/sarees.ts` | Saree product data — name, price, region, craft type, images |
| `constants/advisors.ts` | Artisan/advisor profiles — name, craft, location, biography |

These act as the local data layer. Replace with API calls when connecting to a live backend or CMS.

---

## 🎨 UI Components (shadcn/ui)

All 40+ shadcn components live in `components/ui/` and are fully customised to the Neyge brand theme:

`accordion` · `alert` · `alert-dialog` · `aspect-ratio` · `avatar` · `badge` · `breadcrumb` · `button` · `calendar` · `card` · `carousel` · `chart` · `checkbox` · `collapsible` · `command` · `context-menu` · `dialog` · `drawer` · `dropdown-menu` · `form` · `hover-card` · `input` · `input-otp` · `label` · `menubar` · `navigation-menu` · `pagination` · `popover` · `progress` · `radio-group` · `resizable` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` · `skeleton` · `slider` · `sonner` · `switch` · `table` · `tabs` · `textarea` · `toast` · `toaster` · `toggle` · `toggle-group` · `tooltip`

---

## 🎨 Brand Identity

### Colour Palette

| Name | Hex | Usage |
|---|---|---|
| Maroon | `#800020` | Primary headings, CTAs, accents |
| Gold | `#C4980A` | Eyebrows, dividers, shimmer text |
| Gold Vibrant | `#D4AF37` | On dark backgrounds |
| Cream Light | `#FFF9F0` | Page backgrounds |
| Cream | `#F5E6D3` | Card and panel backgrounds |
| Warm Grey | `#4a3828` | Body text |

### Typography
- **Display / Headings:** `Cormorant Garamond` — elegant serif
- **UI / Body:** `Jost` — geometric sans-serif

---

## 🔐 Authentication

Auth logic is centralised in `src/lib/auth.ts`. Configure your preferred provider (JWT, OAuth, Supabase, Firebase, etc.) there. `LoginPage.tsx` and `ProfilePage.tsx` consume this module directly.

---

## 🌐 Environment Variables

Create `server/.env`:

```env
PORT=3000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
# Add other keys required by server-sdk.js
```

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
node server-sdk.js    # Start the Node.js server
```


<p align="center">
  Made with ♥ for the weavers of India
  <br/>
  <em>"Handmade is not a trend. It is a truth."</em>
</p>
