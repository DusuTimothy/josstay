# JosStay — Scope and Build Map

This document turns the brand guidelines into an explicit build scope. It is the
reference for what is finished, what is stubbed, and what is still an open
business decision. The step-by-step build order lives in [`README.md`](./README.md).

---

## Product in one sentence

JosStay lets guests search, book and pay for verified hotels in Jos, while hotels
manage their rooms and receive payouts through Paystack's split payment.

**Launch scope (from section 17):**

- Jos, Plateau State only
- Naira (₦) only
- Real, verified Jos listings — the current seed content is placeholder
- Hosted Paystack checkout; card details never touch the server
- Brevo email + WhatsApp confirmation after payment
- Verified badge only after business registration, a property visit and a photo check

**Not in launch scope:** deposits with balance paid at the hotel, holding hotel
money until check-in, and pay-at-hotel for first-time guests. Revisit after
launch with accountant/legal advice.

---

## Roles and permissions

| Role | Scope |
| --- | --- |
| **Guest** | Search, book, pay, cancel and review a completed stay |
| **Hotel manager** | Own listing, rooms, prices, policies, calendar, bookings and payouts |
| **Front desk** | Block/release rooms and record walk-in or phone bookings |
| **Admin** | Approve hotels, handle disputes, set commission, platform analytics |

Every protected route must check the role on the **server**, not just hide UI.

---

## Guest journey

```text
search by destination + dates + guests
  → results (only published hotels)
  → hotel detail + rooms + price for those dates
  → quote (server-side price + live availability)
  → short checkout hold
  → Paystack hosted checkout
  → verified webhook confirms payment
  → booking saved + Brevo email + WhatsApp message
```

## Hotel onboarding journey

```text
register account
  → submit business details + bank account in the business name
  → admin review and approval
  → JosStay creates Paystack subaccount, stores subaccount code
  → hotel completes listing, photos, rooms, prices, cancellation policy
  → admin publishes
  → only then appears in guest search
```

---

## Rules the server must enforce

These are not UI preferences. They belong in controllers, services and database
transactions.

### Visibility

- Only `status = published` hotels appear to guests.
- Unpublished hotels must not leak through search, detail or direct slug access.

### Availability

```text
available rooms =
    total rooms
  − confirmed bookings overlapping the dates
  − active (unexpired) checkout holds overlapping the dates
  − rooms blocked by the hotel overlapping the dates
```

- The read-only calculation is implemented in `services/availability.service.ts`.
- The final check must run **inside the payment transaction with a row lock**
  (`SELECT ... FOR UPDATE`) so two guests cannot take the last room.
- Expired holds must not count. Passed stays must not block future dates.

### Money

- Re-price on the server for quote and booking creation. Never trust a client total.
- Commission is stored per hotel and defaults to `DEFAULT_COMMISSION_RATE`.
- Paystack split: JosStay commission to the main account, remainder to the hotel
  subaccount. Set `bearer: "subaccount"` so the **hotel bears the Paystack fee**.
- Store `total`, `commissionAmount`, `hotelShare` and the Paystack reference on
  every booking for reconciliation.
- Tax treatment is **open**. `DEFAULT_TAX_RATE` stays `0` until an accountant
  confirms how collecting on behalf of hotels should be treated.

### Cancellations and refunds

- Hotel chooses `flexible`, `moderate` or `strict`; the policy and deadline must
  appear in results, on the hotel page and at checkout.
- Refunds go through Paystack's Refunds API and complete asynchronously.
- Only mark a booking `refunded` after Paystack confirms.
- **Open:** who funds a refund on a split transaction and how the hotel's share is
  recovered. Confirm with Paystack before promising instant refunds.

### Reviews

- Only a guest with a **completed stay** can review.
- One review per booking.
- Reviews are moderated (`pending` → `published`/`hidden`).

### Referrals

- Every user gets a referral code and shareable link.
- Reward the referrer once, after the referred guest's **first successful
  booking that is not cancelled or refunded**.
- Default: paid after checkout, out of JosStay's own commission.
- Cash payout via Paystack Transfers; bank account name must match the user.
- Block self-referral by phone, device, card or bank account.
- Single level only. The referrer sees only "1 successful referral", never the
  guest's booking details.
- **Open:** reward amount, caps, attribution window, Paystack transfer eligibility
  and OTP requirements.

### Trust and safety

- Show the overbooking guarantee on the hotel page and at checkout.
- Show the total with taxes/fees, the cancellation deadline and what is
  refundable before payment.
- Show a WhatsApp support line and phone number on every page.
- After payment, send the booking reference, hotel address, map pin and hotel
  phone by email and WhatsApp.

---

## Current implementation status

| Area | Status |
| --- | --- |
| Brand tokens, typography, component library | Done |
| Home, search, hotel detail, checkout, style guide | Home/search/hotel/checkout wired to live APIs; sample data only as a local fallback |
| Sign in / sign up | Wired to the real auth endpoints |
| Auth (register, login, me) | Done (bcrypt + JWT) |
| Google sign-in | Done: ID token verified, account linked or created, JWT issued |
| Hotel list + detail APIs | Done for published hotels |
| Search API | Done: destination, area, price, rating, distance, amenities, breakfast, cancellation, sort, pagination |
| Availability calculation | Done read-only |
| Booking quote | Done: live availability + server-side pricing |
| Booking creation | Done: transaction + room row lock + re-price + availability hold |
| Booking list/detail | Done for the signed-in user |
| Booking cancellation | Stub (`501`) |
| Paystack initialize/verify/refund | Stubs (`501`) |
| Paystack webhook | Signature verified; event handling still TODO |
| Email / WhatsApp / Cloudinary services | Shells; not called from the flow yet |
| Manager, front desk, admin dashboards | Not built |
| Reviews, referrals, payouts | Not built |
| UI polish (README step 7) | Backlog: dead links, self-hosted fonts, search pagination, loading skeletons, signed-in header state, map, guest reviews |
| Motion and art direction | Rules written in §23 of the brand guidelines; reveal primitive and scroll story not built yet |
| JSON-LD | Done for Organization, WebSite and hotel pages |
| Seed data | 5 placeholder hotels, 10 rooms, demo manager/admin accounts |

---

## Open business decisions (do not hard-code these)

| Decision | Current default |
| --- | --- |
| Commission percentage | `12%` placeholder — set after speaking to hotels |
| Tax treatment | `0%` until confirmed by an accountant/lawyer |
| Refunds on split payments | Must be confirmed and tested with Paystack |
| Hotel onboarding/bank requirements | Exact documents still to be defined |
| Paystack enabled methods | Card, bank transfer, USSD — confirm on the account |
| Referral reward, caps, attribution window | Undecided |
| Paystack Transfers eligibility and OTP | Must be confirmed |
| Google Maps cost controls | Usage limits still to be set |

---

## Definition of done for the first real booking

A booking is only launch-ready when all of these are true:

- [ ] A guest can search and see only published hotels
- [ ] The hotel detail page renders from the API, not `sample-data.ts`
- [ ] The quote total is computed on the server
- [ ] Two simultaneous requests cannot take the last room
- [ ] Payment initializes with the hotel subaccount and hotel-borne fee
- [ ] The webhook is signature-verified and idempotent
- [ ] A successful payment confirms the booking exactly once
- [ ] Brevo email and WhatsApp confirmation are sent
- [ ] Cancellation respects the policy and only refunds after Paystack confirms
- [ ] The guest can see the booking reference and hotel contact details afterwards

---

## Local development database

For development without Aiven:

```bash
docker run -d --name josstay-postgres \
  -e POSTGRES_USER=josstay \
  -e POSTGRES_PASSWORD=josstay \
  -e POSTGRES_DB=josstay_dev \
  -p 5433:5432 postgres:15
```

Then set `server/.env`:

```bash
DATABASE_URL=postgres://josstay:josstay@localhost:5433/josstay_dev
DB_SSL=false
```

```bash
npm run db:sync
npm run db:seed
npm run dev
```

Production still uses **Aiven PostgreSQL over TLS** with the CA certificate —
see [`AIVEN-SETUP.md`](./AIVEN-SETUP.md).
