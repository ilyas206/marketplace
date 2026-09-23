# Tradezy — Multi-Vendor Marketplace

Tradezy is a full-stack multi-vendor e-commerce platform built with **Laravel** and **React**, connecting independent sellers with buyers in a single, trust-driven marketplace. Sellers apply and are approved by an admin before they can sell, buyers browse and check out through a stock-safe transactional flow, and admins moderate the entire ecosystem — categories, products, users, and disputes.

The project was built to demonstrate real-world e-commerce architecture decisions: role-based access control, multi-vendor order splitting, race-condition-safe checkout, and a full audit trail from product listing to delivery.

---

## Live Demo & Repo

- **Demo:** _add link_
- **Repo:** _add link_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), React Router, Zustand, TanStack Query, Tailwind CSS, shadcn/ui, Recharts |
| Backend | Laravel 11, Laravel Sanctum (token auth), Spatie Laravel-Permission (RBAC) |
| Database | MySQL |
| Other | Axios, Laravel Breeze (API scaffold, customized) |

---

## Features by Role

### Buyer
- Browse full product catalog without an account (guest-friendly, SEO-safe)
- Search, filter by category, sort by price/rating, paginated listing
- Product detail page: image gallery, stock status, seller info, reviews, related products
- Guest cart with automatic merge into account cart on login
- Stock-safe checkout (Cash on Delivery) with transactional, race-condition-proof stock deduction
- Order history and per-item delivery tracking (each seller's item progresses independently)
- Wishlist, product reviews (only after delivery), order cancellation (while still pending)
- Direct chat with sellers, complaint filing (order-specific or general)
- Apply to become a seller and track application status

### Seller
- Apply for seller access with business info + supporting document, reviewed by admin
- Full product CRUD with image upload, stock, pricing, and discount management
- Soft-delete products (preserves order history integrity)
- Order fulfillment dashboard: confirm → ship → deliver, with enforced valid status transitions
- Sales analytics: best-selling products, top categories, income over time
- Direct chat with buyers, and a dedicated support channel to message admin
- View complaints filed against them (read-only — resolution is admin-only)

### Admin
- Review and approve/reject seller applications
- Full category management (nested subcategories, safe-delete guards)
- Product moderation (activate/deactivate any listing)
- User management with account suspension (immediately revokes active sessions)
- Complaint resolution with response tracking
- Full financial visibility for commission/reporting purposes

---

## Architecture Highlights

**Role-based access control** — Implemented with Spatie Laravel-Permission, layered on two levels: route-level middleware for role gating, and Laravel Policies for ownership checks (e.g., a seller can only edit their own products, enforced independently of their role).

**Multi-vendor order splitting** — A single checkout can contain products from multiple sellers. Orders and order items are modeled separately: each `order_item` tracks its own fulfillment status per seller, and the parent order's status is derived from the aggregate state of all its items.

**Stock-safe checkout** — Checkout runs inside a database transaction with row-level locking (`lockForUpdate`) to prevent overselling when multiple buyers attempt to purchase the last units of a product simultaneously.

**Guest-to-user continuity** — Guests can browse and build a cart via a client-generated identifier; on login, the guest cart is automatically merged into the authenticated user's cart with no data loss.

**Consistent authorization boundary** — Every authenticated route enforces both token validity (Sanctum) and account status (suspended accounts are rejected at both login and on every subsequent request, with immediate token revocation).

---

## Project Structure

```
marketplace/
├── laravel-api/          # Laravel backend (REST API)
│   ├── app/
│   │   ├── Http/Controllers/Api/    # Public, Seller, Admin controller namespaces
│   │   ├── Http/Requests/           # Form validation
│   │   ├── Http/Resources/          # API response shaping
│   │   ├── Models/                  # Eloquent models + relationships
│   │   └── Policies/                # Ownership-based authorization
│   └── database/migrations/
└── react-app/             # React frontend (Vite)
    └── src/
        ├── api/            # Axios request functions
        ├── hooks/          # TanStack Query hooks
        ├── store/          # Zustand global state (auth, cart)
        ├── components/     # Shared + layout components
        └── pages/          # Route-level pages, split by role
```

---

## Getting Started

### Prerequisites
- PHP 8.2+, Composer
- Node 18+, npm
- MySQL

### Backend setup
```bash
cd laravel-api
composer install
cp .env.example .env
php artisan key:generate
# Configure DB_* variables in .env
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### Frontend setup
```bash
cd react-app
npm install
npm run dev
```

### Test accounts (seeded)
| Role | Email | Password |
|---|---|---|
| Admin | admin@marketplace.test | password |
| Seller (approved) | seller0@marketplace.test | password |
| Seller (pending) | pending-seller@marketplace.test | password |
| Buyer | buyer0@marketplace.test | password |

---

## Known Limitations

- Payment is Cash on Delivery only — no live payment gateway integration
- Chat uses polling (not WebSockets) — a deliberate tradeoff to avoid extra infrastructure at this scale
- Product images use placeholder assets in seed data
- Category creation is admin-only; sellers select from existing categories

## Possible Future Improvements

- WebSocket-based real-time chat (Laravel Echo + Pusher/Soketi)
- Payment gateway integration (Stripe/CMI)
- Seller-requested category submissions
- Email notifications for order status changes and seller approval

## Screenshots
  <img width="1348" height="632" alt="image" src="https://github.com/user-attachments/assets/8b50a2f5-15cc-4e2b-b3ff-8ad4f04a5222" />
  <img width="1353" height="629" alt="image" src="https://github.com/user-attachments/assets/f8c4dc0e-82a3-4b48-832e-dd0163d4cf3c" />
  <img width="1366" height="627" alt="image" src="https://github.com/user-attachments/assets/fe2b60aa-9be4-441c-9bb4-6c2dd36a6fb2" />
  <img width="1366" height="628" alt="image" src="https://github.com/user-attachments/assets/74029e84-b993-4193-a594-3941a25e94a2" />
  <img width="1348" height="627" alt="image" src="https://github.com/user-attachments/assets/cb76c38b-4ab2-4917-8970-bb446a36a9a2" />
  <img width="1366" height="633" alt="image" src="https://github.com/user-attachments/assets/12ebca74-787b-4003-813d-2fb26bfd9aee" />
  <img width="1351" height="629" alt="image" src="https://github.com/user-attachments/assets/3856ee01-7e1a-485c-9f26-8db4b8ae87a5" />



