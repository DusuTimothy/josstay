# JosStay

**Your city, your stay.**

Hotel booking platform for Jos, Plateau State. This repository is the build scaffold: the brand design system, the page shells and the API foundation are in place. Business logic and data wiring are intentionally left for the implementation pass.

---

## What is in here

```
josstay/
├── client/                   What guests see (Next.js 15 + React 19 + Tailwind CSS)
│   ├── app/                  Layout, home, search, hotel detail, checkout, booking status, sign-in, sign-up, style guide
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

**Auth** — `AuthForm` (sign in / create account, wired to `/auth/login` and `/auth/register`), `GoogleSignInButton` (Google Identity Services, wired to `/auth/google`)

**Home** — `DestinationCard`

Open `/styleguide` in the client to see every token and component state on one page.

### Server foundation

- Express app with Helmet, CORS allow-list, rate limiting and structured error handling
- Zod request validation middleware
- Sequelize models: `User`, `Hotel`, `HotelImage`, `Room`, `Booking`, `Payment`, `Review`, `AvailabilityHold`, `BlockedDate`
- Auth: register, login, me (bcrypt + JWT), Google sign-in (verified ID token, find-or-create)
- Hotels and search endpoints implemented for the basic published-listing flow
- Booking quote implemented (live availability, server-side pricing)
- Booking creation implemented in one transaction: room row lock, availability re-check, server re-pricing, commission split and 15-minute hold
- Booking cancellation, payments and refunds remain `501` stubs with the exact contract in the controller comments
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
| `POST` | `/api/v1/auth/google` | Done (verified ID token, account linked or created) |
| `GET` | `/api/v1/hotels` | Featured/published hotels |
| `GET` | `/api/v1/hotels/:slug` | Hotel detail + rooms |
| `GET` | `/api/v1/search` | Filters, sorting, pagination |
| `POST` | `/api/v1/bookings/quote` | Done |
| `POST` | `/api/v1/bookings` | Done (transaction + row lock + hold) |
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

### Placeholder photos

The seeded hotels and the destination cards use stock photos kept in
`client/public/images/photos`. They are served from the app itself so a page
never waits on a slow external host, and `SmartImage` swaps in a calm branded
placeholder if a photo ever fails to load. Replace them with the hotels' own
Cloudinary uploads — those return absolute URLs and work the same way.

### Google sign-in setup

Google sign-in stays hidden until you add the OAuth client ID to both env files.

1. In the [Google Cloud console](https://console.cloud.google.com/), pick a
   project, enable the **Google Identity** API and create an
   **OAuth 2.0 Client ID → Web application**.
2. Add `http://localhost:3000` to **Authorized JavaScript origins** (add the
   live domain later). The one-tap button does not use redirect URIs, but
   `http://localhost:3000` is a harmless placeholder.
3. Copy the **Client ID** into both env files:

```bash
# client/.env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1234567890-abc.apps.googleusercontent.com

# server/.env
GOOGLE_CLIENT_ID=1234567890-abc.apps.googleusercontent.com
```

4. Restart both apps (`npm run dev`).

The browser sends the ID token that Google Identity Services returns to
`POST /api/v1/auth/google`. The server verifies it against Google's public keys
and our client ID, then finds the account (linking it to an existing password
account with the same email) or creates one, and returns the usual JosStay JWT.
Leave `NEXT_PUBLIC_GOOGLE_CLIENT_ID` empty and the button is not rendered —
email and password keep working.

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

- [x] Write a seed script for **one** hotel, a few rooms and images
- [x] Confirm `/api/v1/hotels` and `/api/v1/hotels/:slug` return it
- [x] Replace the placeholder hotel on the detail page with the API response

**Done when:** the hotel page renders from PostgreSQL, not `client/lib/sample-data.ts`. Do not seed all of Jos yet.

### 3. Search on real data

- [x] Connect `SearchBar` and `FilterPanel` to `/api/v1/search`
- [x] Put search values in the URL so results can be shared
- [x] Keep client-side filtering only as a fallback when the API is unavailable

**Done when:** destination, price, rating, amenities, distance and sorting all work against the database.

### 4. Quote and booking creation

- [x] Confirm the quote endpoint prices the stay server-side (already implemented)
- [x] Implement `POST /api/v1/bookings` in one transaction
- [x] Lock the room row, re-check availability, then create the booking and hold
- [x] Test two simultaneous requests for the last room

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

### 7. UI polish (does not block the first booking)

The numbered steps above are ordered by revenue path. This one is the craft
that makes the site feel finished rather than generic — it lives here so it
does not get lost between sessions. The rules for motion and art direction are
in **§23 of the brand guidelines**.

**Do first (cheap, no dependency on other steps)**

- [ ] Remove the dead links: nav `Rewards` → `/rewards` (build it in step 6 or drop the link), footer `/about`, `/partners`, `/careers`, `/contact`
- [x] Self-host Fraunces and Inter with `next/font/local` so the brand type never silently falls back and the build no longer depends on Google Fonts
- [ ] Add pagination to `/search` — the API already returns `meta.total` and `page`, but the UI only ever shows the first 20 results
- [ ] Use the existing `Skeleton` component while search and hotel detail load (nothing uses it yet)
- [ ] Add the one reveal primitive from §23 — fade-up on scroll, no animation library, `prefers-reduced-motion` respected

**Do together with step 5 (Paystack)**

- [ ] Remove the card number / expiry / CVC fields from `PaymentForm` — the guest pays on Paystack's hosted page, so collecting card details that are never sent is misleading
- [ ] Make “Instant confirmation by email and WhatsApp” true, or soften the copy until Brevo and WhatsApp ship

**Do later, with the rest of the guidelines**

- [ ] Signed-in header state: an account menu instead of always showing “Sign in” (also listed in step 1)
- [ ] Google Maps embed, pin and directions link on the hotel page — `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is currently unused
- [ ] Guest reviews on the hotel page (step 6 builds the moderation side)
- [ ] `/rewards` page for the referral programme (step 6)
- [ ] Homepage scroll story — one sticky frame telling Discover → Compare → Commit (§23)

**Done when:** every link in the header and footer resolves, the search page
can reach every result, and no page shows an empty frame while it waits for
the API.

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

1. **Auth session** — Google one-tap is built; a signed-in header state, protected routes and token refresh are still open. The email/password pages are already wired.
2. **Search** — connect `SearchBar` + `FilterPanel` to `/search`; build URL state and use the server-side filters instead of filtering only in the browser.
3. **Hotel detail** — replace `lib/sample-data.ts` with API fetches from `/hotels/:slug`; wire room selection and dates into the booking panel and quote endpoint.
4. **Checkout and payments** — create the booking hold, initialize Paystack, verify on callback, handle the webhook inside a transaction.
5. **Availability locking** — the read-only calculation is implemented; add `SELECT ... FOR UPDATE` at payment time so two guests cannot take the last room.
6. **Hotel manager + admin dashboards** — listing editor, room/price management, block button, bookings, payouts, approvals.
7. **Cloudinary uploads** — wire `uploadHotelImages` + `uploadImage` to the hotel/room routes.
8. **Brevo + WhatsApp** — call `sendBookingConfirmation` from the verified webhook, not the browser.
9. **Referrals, reviews, refunds** — per sections 17, 18 and 21 of the brand guidelines.
10. **JSON-LD** — already wired for `Organization`, `WebSite` and hotel pages; extend it to other public pages and validate with Google's Rich Results Test.
11. **UI polish** — the checklist in step 7: dead links, self-hosted fonts, search pagination, loading skeletons, then the signed-in header state, the map and guest reviews.

> The sample hotels, destinations and photography URLs are placeholders. Replace them with real, verified Jos listings before launch.
# josstay
