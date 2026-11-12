# JosStay

**Your city, your stay.**

Hotel booking platform for Jos, Plateau State. This repository is the build scaffold: the brand design system, the page shells and the API foundation are in place. Business logic and data wiring are intentionally left for the implementation pass.

---

## What is in here

```
josstay/
├── client/                   What guests see (Next.js 15 + React 19 + Tailwind CSS)
│   ├── app/                  Layout, home, search, hotel detail, checkout, sign-in, sign-up, style guide
│   ├── components/           Brand component library (ui, layout, search, hotel, checkout, home)
│   └── lib/                  Types, formatting, API client, constants, SEO helpers, sample data
├── server/                   What powers it (Express + TypeScript + Sequelize + Aiven)
│   ├── certs/                Place the Aiven CA certificate here
│   └── src/                  Config, models, routes, controllers, services, middleware
├── AIVEN-SETUP.md            Step-by-step Aiven TLS + connection setup
├── SCOPE.md                  Roles, rules, open decisions and launch definition of done
└── package.json              npm workspaces + combined dev script
```

### Client vs server, in plain words

- **`client/` = client side.** This is the browser and phone experience: pages, buttons, forms, the hotel gallery. It runs on the guest's device and never touches the database or secret keys. It asks the server for data through HTTP.
- **`server/` = server side.** This is the Express API. It owns the Aiven PostgreSQL connection, passwords, Paystack keys, availability checks and booking records. It decides what the client is allowed to see and do.
- **The flow:** browser (`client/`) → HTTP request → Express (`server/`) → Aiven PostgreSQL → response → screen.


### The brand system

| Token | Value | Tailwind key |
| --- | --- | --- |
| Deep Ocean | `#173B4D` | `ocean` |
| Sage Green | `#7F9C8D` | `sage` |
| Soft Sage | `#DCE7E0` | `sage-soft` |
| Warm Ivory | `#F7F4ED` | `ivory` |
| Sand | `#E9DFCF` | `sand` |
| Muted Gold | `#B99A62` | `gold` |
| Charcoal | `#283238` | `charcoal` |
| Error (proposed) | `#B42318` | `error` |
| Success (proposed) | `#3F6B58` | `success` |

Type: **Fraunces** for the logo, H1 and H2; **Inter** for everything else. The type scale in `client/tailwind.config.ts` uses the brand ranges (`text-h1` = 40–48 px, `text-h2` = 28–32 px, etc.).

### Components built

**UI** — `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Toggle`, `FormField`, `FieldError`, `Chip`, `Badge`, `Stars`, `Rating`, `Card`, `Container`, `Skeleton`, `EmptyState`

**Layout** — `Header` (mobile drawer), `Footer`, `Logo` (mark, wordmark, reversed, tagline), `TrustStrip`

**Search** — `SearchBar`, `FilterPanel`, `ResultsHeader`

**Hotel** — `HotelCard`, `HotelGallery`, `AmenityList`, `RoomOptionCard`, `BookingPanel`

**Checkout** — `GuestForm`, `PaymentForm`, `ReservationSummary`

**Auth** — `AuthForm` (sign in / create account, wired to `/auth/login` and `/auth/register`)

**Home** — `DestinationCard`

Open `/styleguide` in the client to see every token and component state on one page.

### Server foundation

- Express app with Helmet, CORS allow-list, rate limiting and structured error handling
- Zod request validation middleware
- Sequelize models: `User`, `Hotel`, `HotelImage`, `Room`, `Booking`, `Payment`, `Review`, `AvailabilityHold`, `BlockedDate`
- Auth: register, login, me (bcrypt + JWT), Google endpoint stubbed
- Hotels and search endpoints implemented for the basic published-listing flow
- Booking quote implemented (live availability, server-side pricing)
- Booking creation/cancellation, payments and refunds are `501` stubs with the exact contract in the controller comments
- Paystack webhook verifies the HMAC-SHA512 signature against the raw body
- Availability service: total rooms − confirmed bookings − active holds − blocked dates
- Integration service shells: Paystack, Brevo, WhatsApp Cloud API, Cloudinary
- **Aiven PostgreSQL over TLS** using `AIVEN_CA_CERT_PATH` (see below)

### API routes

| Method | Route | Status |
| --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Done |
| `POST` | `/api/v1/auth/login` | Done |
| `GET` | `/api/v1/auth/me` | Done |
| `POST` | `/api/v1/auth/google` | Stub (`501`) |
| `GET` | `/api/v1/hotels` | Featured/published hotels |
| `GET` | `/api/v1/hotels/:slug` | Hotel detail + rooms |
| `GET` | `/api/v1/search` | Filters, sorting, pagination |
| `POST` | `/api/v1/bookings/quote` | Done |
| `POST` | `/api/v1/bookings` | Stub (`501`) |
| `GET` | `/api/v1/bookings` | My bookings |
| `GET` | `/api/v1/bookings/:reference` | Single booking |
| `POST` | `/api/v1/bookings/:reference/cancel` | Stub (`501`) |
| `POST` | `/api/v1/payments/initialize` | Stub (`501`) |
| `GET` | `/api/v1/payments/verify/:reference` | Stub (`501`) |
| `POST` | `/api/v1/payments/refund` | Stub (`501`) |
| `POST` | `/api/v1/webhooks/paystack` | Signature verified |

---

## Quick start

This is **step 0** of the checklist below. Stop here until the health check passes.

```bash
# 1. Install (from the repo root, npm workspaces)
npm install

# 2. Environment
cp client/.env.example client/.env.local
cp server/.env.example server/.env

# 3. Add the Aiven CA certificate (see AIVEN-SETUP.md)
#    server/certs/aiven-ca.pem

# 4. Create the schema and add placeholder Jos hotels
npm run db:sync
npm run db:seed

# 5. Run client and server together
npm run dev
# client → http://localhost:3000
# server → http://localhost:4000
# server health → http://localhost:4000/health
```

### Aiven database (important)

The server **requires TLS with certificate verification** in production. `server/src/config/database.ts` reads the CA from `AIVEN_CA_CERT_PATH` (default `./certs/aiven-ca.pem` relative to the `server/` package root) and passes it to `pg`:

```ts
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: true,
    ca: fs.readFileSync(certPath, "utf8"),
  },
}
```

Full steps, including where to download the CA and how to handle Render deployments, are in [`AIVEN-SETUP.md`](./AIVEN-SETUP.md).

### Local database (no Aiven yet)

For development, run PostgreSQL in Docker and set `DB_SSL=false`:

```bash
docker run -d --name josstay-postgres \
  -e POSTGRES_USER=josstay \
  -e POSTGRES_PASSWORD=josstay \
  -e POSTGRES_DB=josstay_dev \
  -p 5433:5432 postgres:15
```

```bash
# server/.env
DATABASE_URL=postgres://josstay:josstay@localhost:5433/josstay_dev
DB_SSL=false
```

Then run `npm run db:sync && npm run db:seed`. The seed creates five placeholder
Jos hotels and demo accounts (`manager@josstay.local` / `admin@josstay.local`,
password `JosStay123!`) and refuses to run in production. The full scope map is
in [`SCOPE.md`](./SCOPE.md).

---

## Build it step by step (recommended)

Build one complete journey at a time — **database → API → screen** — instead of finishing every model before any page works. Each step should end with something you can run and verify. Tick the box only when the “Done when” line is true.

### 0. Get the scaffold running

- [ ] `npm install`
- [ ] Create `client/.env.local` and `server/.env` from the examples
- [ ] Add the Aiven CA at `server/certs/aiven-ca.pem`
- [ ] Set `DATABASE_URL` and run `npm run db:sync`
- [ ] Run `npm run dev`

**Done when:** `GET http://localhost:4000/health` returns `database: connected`, and the client loads at `http://localhost:3000`.

Also run `git init` now and commit after every step.

### 1. Auth end-to-end

- [ ] Sign up, sign out, sign in
- [ ] Call `/api/v1/auth/me` with the stored token
- [ ] Surface the signed-in user in the header

**Done when:** the token persists across reloads and `me` returns the correct user. The forms and endpoints already exist; this step is verification plus the session UI.

### 2. One real hotel

- [ ] Write a seed script for **one** hotel, a few rooms and images
- [ ] Confirm `/api/v1/hotels` and `/api/v1/hotels/:slug` return it
- [ ] Replace the placeholder hotel on the detail page with the API response

**Done when:** the hotel page renders from PostgreSQL, not `client/lib/sample-data.ts`. Do not seed all of Jos yet.

### 3. Search on real data

- [ ] Connect `SearchBar` and `FilterPanel` to `/api/v1/search`
- [ ] Put search values in the URL so results can be shared
- [ ] Remove the client-only filtering in `search-results.tsx`

**Done when:** destination, price, rating, amenities, distance and sorting all work against the database.

### 4. Quote and booking creation

- [ ] Confirm the quote endpoint prices the stay server-side (already implemented)
- [ ] Implement `POST /api/v1/bookings` in one transaction
- [ ] Lock the room row, re-check availability, then create the booking and hold
- [ ] Test two simultaneous requests for the last room

**Done when:** two guests can never book the same last room, and the client shows the pending booking.

### 5. Paystack

- [ ] Initialize the transaction with the hotel's subaccount and `bearer: "subaccount"`
- [ ] Verify the callback
- [ ] Handle `charge.success` in the webhook idempotently
- [ ] Send the Brevo email and WhatsApp confirmation

**Done when:** a test payment confirms the booking **exactly once**, even when the webhook is delivered twice.

### 6. Everything else

- [ ] Manager dashboard: listing editor, rooms, prices, block dates
- [ ] Admin approvals, refunds, reviews, referrals
- [ ] Cloudinary photo uploads
- [ ] Production migrations, backups and monitoring

None of these should block the first real booking.

### Rules for every step

1. Make the smallest change that completes the step.
2. Run `npm run typecheck` before moving on.
3. Test the API with `curl` or an API client before touching the UI.
4. Commit with a clear message, e.g. `feat: booking creation with availability lock`.
5. Never run `db:sync` with `alter` against production — use versioned migrations once real data exists.
6. Keep a separate Aiven database for development.

---

## Reference: remaining work for the implementation pass

The checklist above is the order to build in. This list explains what each area needs.

1. **Auth session** — Google one-tap, a signed-in header state, protected routes and token refresh. The email/password pages are already wired.
2. **Search** — connect `SearchBar` + `FilterPanel` to `/search`; build URL state and use the server-side filters instead of filtering only in the browser.
3. **Hotel detail** — replace `lib/sample-data.ts` with API fetches from `/hotels/:slug`; wire room selection and dates into the booking panel and quote endpoint.
4. **Checkout and payments** — create the booking hold, initialize Paystack, verify on callback, handle the webhook inside a transaction.
5. **Availability locking** — the read-only calculation is implemented; add `SELECT ... FOR UPDATE` at payment time so two guests cannot take the last room.
6. **Hotel manager + admin dashboards** — listing editor, room/price management, block button, bookings, payouts, approvals.
7. **Cloudinary uploads** — wire `uploadHotelImages` + `uploadImage` to the hotel/room routes.
8. **Brevo + WhatsApp** — call `sendBookingConfirmation` from the verified webhook, not the browser.
9. **Referrals, reviews, refunds** — per sections 17, 18 and 21 of the brand guidelines.
10. **JSON-LD** — already wired for `Organization`, `WebSite` and hotel pages; extend it to other public pages and validate with Google's Rich Results Test.

> The sample hotels, destinations and photography URLs are placeholders. Replace them with real, verified Jos listings before launch.
