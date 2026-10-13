# Frontend & Future Backend Architecture Boundary Specification
**Rowan & Hound Pet Supply Co.**

This document defines and enforces the architectural separation of concerns between the **Frontend Application** (Next.js App Router, React, Tailwind CSS) and the **Future Authoritative Backend** (Laravel / Node.js / Express, PostgreSQL / MySQL, Redis, Worker Queues).

---

## 1. Architectural Principles

1. **Strict Division of Authority**: The frontend is a presentation, configuration, and user experience engine. The backend is the single source of truth for money, inventory, security, customer records, and side-effects.
2. **Never Fake Backend Functionality**: The frontend must never pretend that real-world operations occurred when they did not. Specifically:
   - Do **not** pretend a credit card was charged without a live payment gateway.
   - Do **not** pretend transactional emails were delivered without a mail service.
   - Do **not** pretend warehouse inventory was locked without a persistent database transaction.
   - Do **not** pretend recurring cron renewals executed on a schedule without a background queue worker.
3. **Transparent Boundaries**: When operating in prototype or client-side mode, interfaces must explicitly declare their delegation boundary rather than simulating mock server persistence.

---

## 2. Division of Responsibilities

### Frontend Responsibilities

| Domain | Frontend Scope | What Frontend Does NOT Do |
| :--- | :--- | :--- |
| **UI & Presentation** | Rendering responsive views, typography, design system tokens, empty states, loading skeletons. | Does not define business logic rules in isolation. |
| **Product Presentation** | Displaying product imagery, nutrition analyses, ingredients, pack sizes, benefits. | Does not determine real-time warehouse availability. |
| **Catalog Filtering** | Instant client-side filtering by pet type (dog/cat), category, needs, price sort. | Does not perform database-level full-text indexing or fuzzy indexing. |
| **Forms & Input** | Client-side format validation (email format, zip code length, required field checks). | Does not verify identity or perform fraud scoring. |
| **Cart Interface** | In-memory and local session basket state, add/remove line items, cadence selection. | Does not lock inventory or guarantee stock holds across browser tabs. |
| **Subscription UI** | Selecting delivery frequencies (2, 4, 6, 8, 12 weeks), calculating preview discounts (10%). | Does not trigger recurring credit card rebilling schedules. |
| **Price Display** | Currency formatting (`$XX.XX`), strikethrough compare-at savings, visual math previews. | Does not authorize transactions or calculate tax liabilities legally. |
| **Validation Feedback** | Instant visual cues, error banners, accessible aria-invalid flags, disable states. | Does not replace authoritative server-side model validation. |
| **Animations & Transitions** | Framer Motion slide-overs, drawer opens, smooth accordion expansions. | Does not run business side-effects in render transitions. |
| **Responsive Behavior** | Mobile drawer menus, sticky mobile bars, adaptive breakpoint layouts. | Does not alter business domain rules based on screen width. |

---

### Future Backend Responsibilities

| Domain | Backend Scope | Required Backend Technology |
| :--- | :--- | :--- |
| **Authentication & Accounts** | Password hashing (Argon2/bcrypt), session JWT tokens, OAuth token verification, MFA, session invalidation. | Redis sessions, OAuth2 server, Auth middleware. |
| **Customer Accounts** | Master customer records, encrypted billing profiles, default shipping addresses, GDPR deletion requests. | Relational DB (Users table, Profiles table). |
| **Pets Master Record** | Persistent companion animal profiles (species, weight, allergies, birthday) linked to customer ID. | Database CRUD, multi-tenant relational schema. |
| **Product Inventory** | Master stock levels, safety stock thresholds, multi-warehouse allocations, SKU tracking. | Warehouse Management System (WMS), DB row locks (`SELECT FOR UPDATE`). |
| **Real Availability** | Real-time stock status (`in_stock`, `low_stock`, `backorder`, `discontinued`), reserve timeouts. | Redis atomic decrement, distributed locks. |
| **Authoritative Pricing** | Validating unit prices, applying business rules, calculating line-item totals before payment. | Server-side price calculation pipeline. |
| **Subscription Creation** | Storing recurring contracts, tokenizing payment mandates, establishing next delivery timestamps. | Recurring billing engine, database contracts. |
| **Recurring Billing** | Executing scheduled renewal invoices on midnight cron, charging saved payment tokens. | Background worker queues (Laravel Horizon / BullMQ), Celery. |
| **Payment Processing** | Communicating with payment gateways (Stripe, Adyen), 3D Secure verification, PCI-DSS compliance. | Stripe SDK, PCI-compliant tokenization vault. |
| **Subscription Renewals** | Generating renewal orders from active subscriptions based on scheduled delivery cadence. | Automated cron jobs, idempotency keys. |
| **Failed Payments** | Dunning management, retry strategies (Day 1, 3, 5), card updater webhooks, grace periods. | Webhook listeners, event-driven state machine. |
| **Pause / Skip / Cancel** | Authoritative schedule updates, preventing next billing cycle charges, logging churn reasons. | Database status transitions, cancellation audits. |
| **Order Creation** | Generating unique authoritative order numbers, creating order records, decrementing stock. | Atomic DB transactions (`BEGIN ... COMMIT`). |
| **Order History** | Immutable order records, packing slips, PDF invoices, tracking numbers, fulfillment history. | Historical database storage, blob storage (S3/GCS). |
| **Reorder Eligibility** | Checking if previous products remain active, valid in current inventory, and priced accurately. | Inventory verification query. |
| **Coupons & Promotions** | Server-side promo code verification, single-use limits, customer qualification checks, expirations. | Promotional rule engine, database promo tables. |
| **Shipping Calculation** | Carrier rate API integrations (FedEx, UPS, USPS), dimensional weight computation, zone tiers. | Shipping carrier SDKs / EasyPost / Shippo. |
| **Tax Calculation** | Authoritative sales tax calculation based on destination address, nexus rules, state exemptions. | Avalara AvaTax / TaxJar / Stripe Tax API. |
| **Notifications & Email** | Sending transactional order receipts, shipment notifications, auto-ship renewal reminders (3 days before). | SendGrid, Postmark, AWS SES, queue-based dispatch. |
| **Subscription Status** | Authoritative lifecycle states (`active`, `paused`, `skipped`, `delinquent`, `cancelled`). | State machine pattern with strict transition guards. |
| **Product Replacement** | Algorithmic substitution recommendations when an ingredient or flavor is discontinued. | Recommendation service / product catalog rules. |
| **Out-of-Stock Handling** | Partial fulfillment splits, backorder notifications, automatic refund or credit generation. | Inventory fulfillment state machine. |

---

## 3. Communication Contract (Endpoints Specification)

The frontend communicates with the backend via pure JSON REST endpoints. The frontend never accesses databases or background queues directly.

```
┌─────────────────────────────────────────────────────────────┐
│                       Next.js Frontend                      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP JSON (Bearer Token)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Controller                 │
├─────────────────────────────────────────────────────────────┤
│  GET    /api/products               GET    /api/products/:slug│
│  GET    /api/categories             GET    /api/pets          │
│  GET    /api/subscriptions          POST   /api/subscriptions │
│  PATCH  /api/subscriptions/:id      POST   /api/subscriptions/:id/skip
│  POST   /api/subscriptions/:id/pause                          │
│  DELETE /api/subscriptions/:id      GET    /api/orders        │
│  POST   /api/orders                 POST   /api/orders/:id/reorder
│  GET    /api/bundles                GET    /api/reviews       │
│  GET    /api/blog                                           │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
      ┌───────────┐      ┌───────────┐      ┌───────────┐
      │  Database │      │  Stripe   │      │ Email/SMS │
      │  (MySQL)  │      │  Payment  │      │ (SendGrid)│
      └───────────┘      └───────────┘      └───────────┘
```

---

## 4. Boundary Enforcement Patterns in Code

1. **`ProviderFactory`**: The frontend switches data providers with zero UI code alterations.
2. **`BoundaryEnforcer` (`src/lib/boundary/boundaryEnforcer.ts`)**:
   - Inspects outgoing checkout payloads and flags when an operation is executed in a client prototype environment vs an authoritative backend.
   - Annotates order responses with explicit `boundaryStatus` objects indicating that payment processing, email notifications, and inventory allocation are delegated to the future backend API.
3. **No Fake Confirmations**:
   - The UI explicitly states when an order is created within the client demonstration environment, referencing the future `POST /api/orders` endpoint for live payment and dispatch.
