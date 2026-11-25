# Địa Trung Tín — E-commerce Storefront

Customer-facing website for **Trầm Hương Địa Trung Tín**, an online store selling agarwood (trầm hương) jewelry and incense. Built from a Figma design and connected to a real REST API.

Backend: [diatrungtin-backend](https://github.com/NHQAdev/diatrungtin-backend)

> 🚧 **Status: in development.** Browsing, product details, sign-up/login and the account area are working against the real API. Cart and checkout are being built; the admin area has not started. See [Progress](#progress).

## Tech stack

- **React 19** + **TypeScript** (strict) + **Vite**
- **Tailwind CSS 4** with design tokens (colors, fonts) taken from Figma
- **React Router 7** with Vietnamese URLs, **TanStack Query** for server state, **Zod**
- ESLint, Node test runner for unit tests

## Progress

### ✅ Done
- **Layout**: responsive header and footer from Figma; desktop search, cart and category dropdown menu; mobile drawer menu.
- **Home page**: hero, "What are you looking for?" section, tabbed product blocks, banners, care guide section.
- **Product list** (`/san-pham`): filter by category, collection and keyword; sorting and pagination; loading, empty and error states.
- **Product detail** (`/san-pham/:slug`): image gallery with zoom, variant selection (out-of-stock options disabled, price and stock update per variant), "extra beads" option for bracelets, quantity, Add to cart / Buy now, specs table, accordions, related products.
- **Content pages** (`/trang/:slug`) for store policies.
- **Auth**: login, individual and business registration, **email OTP verification**, redirect back after login.
- **Account area**: profile, order history, change password, business account upgrade and approval status.
- **Tests** for variant selection, masking and redirect logic.

### 🔄 In progress
- Cart page and checkout steps (prices always come from the server-side quote API).

### 🔜 Next
- Checkout, order confirmation and order lookup
- Forgot / reset password pages
- Admin area (`/admin`): products, orders, customers, store settings
- Replace temporary low-resolution images with original photos
- Deployment

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Requires the backend running at `http://localhost:4000`. Vite proxies `/api` and `/uploads` to the backend, so no CORS setup is needed in development. For a different backend port, set `VITE_DEV_BACKEND=http://localhost:xxxx`.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Project structure

```
src/
  app/            router and route table
  components/     shared UI (layout, buttons, inputs, product card…)
  features/       business logic by feature (auth, account, cart, product…)
  lib/            API client, money/date formatting, shared queries
  pages/          one screen per route
  types/          API response types
  index.css       design tokens (colors, fonts)
```

## Conventions

- Vietnamese URLs without diacritics: `/san-pham/:slug`, `/gio-hang`, `/thanh-toan`… Two paths used in backend emails must not change: `/don-hang/:code?token=…` and `/dat-lai-mat-khau?token=…`.
- Prices always come from the API (`/api/checkout/quote`); the cart only stores the customer's selections.
- Store information that is not available yet is shown as **[Cập nhật]**.
