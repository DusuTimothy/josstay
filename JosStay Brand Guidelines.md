# JosStay Brand Guidelines

*Your city, your stay.*

## 1. Brand Overview

**Product:** JosStay is a hotel booking website and app.

**Name:** JosStay, renamed from the working name "stay." used in the original deck. The deck's wordmark and logo are replaced by the JosStay logo in section 22, and its Lagos sample content is swapped for Jos.

**Tagline:** Your city, your stay.

**Brand promise:** Better stays. Better experiences.

**Core idea:** A hotel booking website is not just a booking engine. Users don't just book rooms. They buy confidence.

**The bottom line:** We are not building a website that simply lets people book hotels. We are building an experience that makes people WANT to book.

### The three outcomes

| Outcome | What it means |
| --- | --- |
| Desire | Make destinations irresistible. |
| Trust | Remove booking anxiety. |
| Conversion | Make the final decision effortless. |

## 2. Brand Personality

The deck's guiding line is: **"Luxury comes from restraint."**

- **Calm:** clean layouts, generous whitespace, nothing crowded.
- **Premium, not decorative:** quiet typography, warm natural colours, no ornament for its own sake.
- **Trustworthy:** transparent pricing, clear policies, visible reassurance at every decision point.
- **Warm and human:** hospitality-led imagery and human-centred detail.
- **Intelligent:** structured, searchable, fast, and ready for AI discovery.

## 3. Design North Star

Every screen should accomplish three things:

| Step | Goal |
| --- | --- |
| 01 Discover | Make the destination desirable. |
| 02 Compare | Make the decision easy. |
| 03 Commit | Remove booking anxiety. |

A screen that does not advance at least one of these should be questioned.

## 4. UX Principles

### What to avoid (generic experience)

- Crowded interface
- Poor photography
- Hidden fees
- Confusing navigation
- Weak call to action
- Poor mobile experience

### What to deliver (world-class experience)

- Calm, clean design
- Beautiful photography
- Transparent pricing
- Easy to compare
- Clear policies and trust signals
- Excellent mobile UX

### Benchmarks

The deck's rule: **borrow proven UX principles, not someone else's identity.**

| Platform | Principles to borrow |
| --- | --- |
| Booking.com | Search efficiency, filtering and choice, reviews and ratings, price transparency, availability clarity |
| Expedia / Hotels.com | Brand consistency, rewards and value, flexible options, strong design system, trust and reliability |
| Airbnb | Stunning photography, storytelling, discovery experience, human-centred detail, whitespace and simplicity |

## 5. Colour System

*A colour system designed to make guests feel at ease.* All seven values are **Exact**.

| Name | Hex | Meaning | Suggested role |
| --- | --- | --- | --- |
| Deep Ocean | `#173B4D` | Trust, strength, sophistication | Primary brand colour, headings, primary buttons, logo |
| Sage Green | `#7F9C8D` | Nature, freshness, wellbeing | Secondary buttons, rating badge, success and positive states |
| Soft Sage | `#DCE7E0` | Balance, freshness, clarity | Tinted panels, chips, subtle backgrounds |
| Warm Ivory | `#F7F4ED` | Hospitality, warmth, comfort | Main page background |
| Sand | `#E9DFCF` | Warmth, neutral, versatility | Secondary backgrounds, dividers, cards |
| Muted Gold | `#B99A62` | Premium, rewards, exclusivity | Star ratings, rewards, small accents |
| Charcoal | `#283238` | Text, icons, readability | Body text and icons |

### Usage guidance

- Ivory is the default canvas. Deep Ocean carries authority and actions. Everything else supports.
- Use Muted Gold sparingly. It signals premium and rewards, so overuse weakens it.
- Keep Charcoal for text and icons to protect readability.
- **Muted text floor (measured):** on Ivory, White and Sand, Charcoal at **75 %** is the lowest muted tone that still passes WCAG AA — 5.6:1 on Ivory, 5.9:1 on White, 5.1:1 on Sand. Below that, text must be full Charcoal. Use the brand's **Sage Deep `#3F6B58`** for icons and labels on light surfaces; plain Sage `#7F9C8D` is only 2.7–3.0:1 and fails the 3:1 rule for meaningful icons.
- **Text over photography:** the scrim must carry the contrast, not the text colour. Deep Ocean at 85–95 % under the copy, Ivory text at 90 % or above. Never ivory at 65 % over a photo.
- **Proposed (not in the deck):** white for card and input surfaces, a red for error states (the deck shows an error state but no value). Choose and document these before build, and test every text and background pairing for WCAG contrast.

## 6. Typography

*Typography should feel premium, not decorative.*

**Typefaces:** Inter for everything — interface, body text, headings and the wordmark (**Exact**, from the deck).

**Pairing rule:** one family, weight does the work. H1 and H2 are Bold (700), H3 and hotel names are Semi-bold (600), body and secondary are Regular (400), metadata is Medium (500), buttons are Semi-bold (600). The wordmark is the same family at Bold with tight tracking.

| Style | Size | Weight |
| --- | --- | --- |
| H1 | 40 to 48 px | Bold |
| H2 | 28 to 32 px | Bold |
| H3 | 20 to 24 px | Semi-bold |
| Hotel name | 18 to 22 px | Semi-bold |
| Body | 16 px | Regular |
| Secondary | 14 px | Regular |
| Metadata | 12 to 14 px | Medium |
| Buttons | 14 to 16 px | Semi-bold |

Use the lower end of each range on mobile and the upper end on desktop.

## 7. Design Foundation

All values in this section are **Approximate**; verify against Figma.

- **Spacing:** 8pt grid. Steps seen: 4, 8, 12, 16, 24, 32, 48, 64, 96 px.
- **Border radius:** small 8 px, then 12, 16 and 24 px for larger elements.
- **Shadows:** three levels, soft, medium and large, all low-opacity and tinted toward Deep Ocean.
- **Breakpoints:** mobile 320 to 767 px, tablet 768 to 1024 px, desktop 1280 to 1440 px.

## 8. Components

### Buttons

Primary (Deep Ocean fill), Secondary (Sage Green fill), Ghost (outline or text only), Disabled (muted).

### Inputs

Four states: Default, Focused, Success, Error.

### Chips and badges

Free cancellation, Breakfast included, Guest favourite, Limited availability.

### Rating

Score badge (for example **9.2**) with the label **Excellent**, five gold stars, and review count in brackets, for example (1,284 reviews).

### Icons

Simple line icons for amenities and utility: Wi-Fi, pool, spa, gym, parking, breakfast, and more.

## 9. Imagery and Photography

Photography is the main driver of **Desire**.

- Warm, golden-hour and interior hospitality photography. Waterfront and pool scenes feature heavily in the deck.
- Show the destination and the room, not just the building.
- Use human moments sparingly, such as a guest looking out over the view or holding a phone showing a confirmed booking.
- Always optimise: responsive images, lazy loading, served from a CDN.

## 10. Key Screens

### Homepage

- **Navigation:** JosStay logo, Hotels, Destinations, Deals, Rewards, Sign in, Create account.
- **Hero headline:** "Find somewhere that feels like home."
- **Hero subline:** "Discover hotels designed around the way you travel."
- **Search bar:** Where are you going? (e.g. Jos, Nigeria), Check-in, Check-out, Guests, Search button.
- **Popular destinations:** Jos City Centre, Rayfield, Bukuru, Terminus, Shere Hills (areas to be confirmed), with a View all link.

### Search results

- **Filters (left):** Price range (₦0 to ₦500,000+), Guest rating, Property type, Amenities, Breakfast included (toggle), Free cancellation (toggle), Distance from centre. A "Show 124 results" button and a Clear all link.
- **Results header:** "124 properties found" with Sort by (Recommended).
- **Result card:** photo, favourite heart, hotel name, location and distance from centre, rating with review count, amenity chips, price per night with "Taxes included", and a View rooms button.

### Hotel detail

- Large hero gallery with thumbnail strip.
- Hotel name, location, rating, amenity icons (Pool, Wi-Fi, Breakfast, Spa, Gym, Parking).
- Short descriptive paragraph.
- Sticky **Your stay** panel: dates, guests, room type, total price, Reserve button, and "Free cancellation until" reassurance.

### Checkout

- **Guest information:** Full name, Email address, Phone number.
- **Payment details:** Card number, Expiry, CVC, with a Secure payment indicator.
- **Your reservation summary:** hotel and room, room cost for the nights, taxes and fees, total, free cancellation date, instant confirmation.
- **Primary action:** Confirm & Pay.

### Mobile

Four core mobile views: Homepage, Search results, Hotel detail, Checkout. The same hierarchy as desktop, with a single column and large touch targets.

## 11. Trust Patterns

Trust is built into the interface, not added at the end.

- Prices always show whether taxes and fees are included.
- Free cancellation deadline shown near every Reserve and Confirm action.
- Instant confirmation and secure payment indicators at checkout.
- Ratings always paired with review counts.
- Limited availability labelled clearly and honestly.

## 12. Performance and Accessibility

### Performance targets

- 90+ performance score (the deck shows 92)
- Optimised and responsive images
- Lazy loading
- Minimal JavaScript
- CDN and caching
- Core Web Vitals monitored

### Accessibility

- WCAG-conscious colour contrast
- Full keyboard navigation
- Screen-reader support
- Visible focus states
- Accessible form labels and errors
- Large touch targets
- Semantic HTML

## 13. AI-Ready Hotel Discovery

*Better structure = better discoverability.*

Hotel content should be stored as structured data so search engines and AI assistants can understand it.

**Data flow:** Hotel database, then structured content, then website, then search engines and AI assistants, then customer.

**Fields shown in the deck's example record:** name, location, rating, price, amenities, cancellation policy, room type, availability.

Implement this with schema.org markup and a consistent hotel data model.

## 14. Voice and Tone

*Derived from the deck's own copy; **Proposed** as guidance.*

- Warm, calm and confident. Short sentences.
- Reassuring at decision moments: "Free cancellation until 15 Sep", "Instant confirmation".
- Aspirational but not flowery: "Find somewhere that feels like home."
- Never pushy or urgent for its own sake. Say "Limited availability" only when it is true.

## 15. Verification Checklist

Before building, confirm these against the original Figma file:

- [ ] Hex values (sample swatches to confirm the seven colours)
- [ ] Spacing, radius, shadow and breakpoint values
- [ ] Error and success colours
- [ ] Logo files, clear space and minimum size (not shown in the deck)
- [ ] Contrast ratios for every text and background pairing

## 16. Technology Stack

The stack below is the one chosen for building JosStay. Items marked **Proposed** are suggestions for how to apply each tool to the brand and are not part of the original deck.

### Frontend

| Tool | Role in JosStay |
| --- | --- |
| HTML | Semantic markup for accessibility and SEO (headings, landmarks, labelled forms). |
| JavaScript | Core language across frontend and backend. |
| React.js | Component-based UI for the design system (buttons, inputs, chips, rating, cards). |
| Next.js | Routing, server rendering and image optimisation for fast pages and discoverability. |
| Tailwind CSS | Utility styling; brand colours, type scale, spacing, radius and shadows live in the Tailwind theme. |
| Axios | HTTP client for calls to the Express API. |

### Backend

| Tool | Role in JosStay |
| --- | --- |
| Node.js | Runtime for the API. |
| Express.js | REST API framework (hotels, search, bookings, users, payments). |
| Zod | Validate request bodies, search filters and checkout forms; share schemas with the frontend where possible. |
| Multer | Receives hotel and room photo uploads before they go to Cloudinary. |
| Helmet | Secure HTTP headers. |
| CORS | Restrict API access to the JosStay frontend origins. |
| bcrypt | Hash passwords for email sign-ups. |
| dotenv | Environment configuration and secrets. |

### Data

| Tool | Role in JosStay |
| --- | --- |
| PostgreSQL | Primary database for hotels, rooms, availability, bookings, users. |
| Sequelize ORM | Models, migrations and queries against PostgreSQL. |
| Supabase | Managed PostgreSQL hosting and file storage. |
| Redis | **Proposed:** cache popular searches and destinations, rate limiting, short-lived booking holds. |

### Authentication and access

- **Google sign-up:** one-tap account creation for guests.
- **RBAC:** role-based access control. **Proposed roles:** Guest, Hotel Manager, Admin.
- **Email and password:** hashed with bcrypt.

### Integrations

| Tool | Role in JosStay |
| --- | --- |
| Cloudinary | Storage, optimisation and fast delivery of hotel and room photography. |
| Google Maps | Hotel location pins, embedded maps and directions links (see section 19). |
| Paystack | Payments in naira at checkout (**Confirm & Pay**). |
| Brevo | Transactional email: booking confirmations, cancellation notices, receipts. |
| WhatsApp integration | Booking confirmations and updates sent over WhatsApp. |
| AI / LLM integration | **Proposed:** natural-language hotel search and a trip assistant. |
| Data analysis | **Proposed:** track the Discover, Compare, Commit funnel and drop-off at checkout. |

### Hosting and deployment

| Service | Hosts |
| --- | --- |
| Vercel | Next.js frontend. |
| Render | Express API. |
| Supabase | Database and storage. |

### How the stack serves the brand

| Brand requirement | Stack answer (Proposed) |
| --- | --- |
| 90+ performance score | Next.js server rendering and image optimisation, Cloudinary image delivery, Redis caching, lazy-loaded images. |
| Consistent design system | React components styled through a single Tailwind theme built from the brand tokens. |
| Trust and security | Helmet, CORS, bcrypt, Zod validation, Paystack for secure payment. |
| AI-ready discovery | Hotel data stored in PostgreSQL and output as structured data (schema.org JSON-LD) on every hotel page. |
| Remove booking anxiety | Instant email (Brevo) and WhatsApp confirmations after payment. |
| Accessibility | Semantic HTML, keyboard-friendly React components, visible focus states. |

### Tailwind theme mapping

| Brand token | Tailwind theme key (Proposed) | Value |
| --- | --- | --- |
| Deep Ocean | `ocean` | `#173B4D` |
| Sage Green | `sage` | `#7F9C8D` |
| Soft Sage | `sage-soft` | `#DCE7E0` |
| Warm Ivory | `ivory` | `#F7F4ED` |
| Sand | `sand` | `#E9DFCF` |
| Muted Gold | `gold` | `#B99A62` |
| Charcoal | `charcoal` | `#283238` |
| Font family | `sans` | Inter |
| Display font family | — | Inter (one family, weight-led) |

## 17. Problem Statement and Operations

Status labels used in this section: **Decided** (chosen by the founder), **Default** (my suggested default, change if needed) and **Open** (still to be decided or confirmed).

### The problem JosStay solves

Hotels register their hotels on the JosStay platform. Guests then book those hotels and pay online. Each payment is split automatically: JosStay's commission is deducted first and the hotel receives the rest.

### Launch scope

- **Decided:** launch in Jos, Plateau State.
- **Default:** naira (₦) only.
- **Note:** the deck's Lagos sample content has been swapped for Jos areas in this guide. Replace the deck's remaining sample hotels, photos and prices with real Jos listings in the build.

### Roles (RBAC)

| Role | Can do |
| --- | --- |
| Guest | Search, book, pay, cancel and review a completed stay. |
| Hotel Manager | Manage the hotel's listing, rooms, prices, policies and calendar; view bookings and payouts. |
| Front Desk | Block and release rooms and record walk-in or phone bookings. |
| Admin | Approve hotels, handle disputes, set commission, view platform-wide analytics. |

Status: **Default**.

### Hotel onboarding

1. The hotel registers an account.
2. It submits business details and a bank account in the business's name.
3. An admin reviews and approves the hotel.
4. JosStay creates a Paystack subaccount for the hotel and saves its subaccount code.
5. The hotel completes its listing (details, photos, rooms, prices, cancellation policy).
6. Admin publishes the listing. Only published hotels appear to guests.

Status: **Default**.

### What guests see

After publishing, the hotel's data appears across the product: result cards (photo, name, area, rating, amenity chips, price per night), the hotel page (gallery, description, amenity icons, room options, price for the chosen dates) and structured data for search engines and AI assistants. Photos are uploaded through Multer and delivered by Cloudinary.

### Booking and payment flow

1. The guest searches by destination, dates and guests.
2. They compare and choose a room.
3. The API places a short hold on the room while the guest pays.
4. The guest pays through Paystack.
5. Paystack splits the payment: JosStay's commission goes to the main account and the remainder goes to the hotel's subaccount.
6. The Paystack webhook confirms payment (signature verified), the booking is saved, and confirmations are sent by Brevo email and WhatsApp.

Each booking record stores the total, JosStay's commission, the hotel's share and the Paystack reference, so payments can be reconciled.

### Commission and fees

- **Commission:** one platform-wide percentage, stored per hotel so it can change later. Status: **Default**; the percentage itself is **Open**.
- **Paystack transaction fee:** **Decided**: the hotel bears it, taken from the hotel's share, so JosStay's commission stays clean. Configure Paystack's fee bearer setting so the hotel's subaccount carries the fee.

### Cancellations and refunds

- **Default:** each hotel chooses one of three platform templates: flexible, moderate or strict. The chosen policy and its deadline are shown on the hotel page, in search results and at checkout.
- Refunds are made through Paystack's Refunds API and complete asynchronously, so the guest is told "refunded" only after Paystack confirms.
- **Open:** confirm with Paystack support, and in test mode, who funds a refund on a split transaction and how the hotel's share is recovered, before promising instant refunds.

### Room availability

Availability is calculated, not toggled: rooms available = total rooms − confirmed bookings for those dates − temporary checkout holds − dates blocked by the hotel. Online bookings, cancellations, expired holds and passed stay dates update this automatically.

**Offline and walk-in bookings (Decided):** hotels get a quick **Block** button on the dashboard (usable by Front Desk staff) to take a room off sale in seconds, and JosStay sends the hotel notifications to prompt them to keep availability current. The booking system re-checks availability inside a database transaction at the moment of payment so two guests cannot take the last room.

### Overbooking rule

**Default:** if a hotel cannot honour a paid online booking, it must provide an equivalent room or cover the refund. This rule is part of the hotel agreement, because the hotel controls its offline sales.

### Reviews

**Default:** only guests with a completed stay can leave a review.

### Open questions

- The commission percentage.
- How Paystack refunds work on split transactions (confirm with Paystack and test).
- Exact business and bank requirements for onboarding hotels.
- The tax and regulatory treatment of collecting payments on behalf of hotels. Confirm with an accountant or lawyer.

## 18. Trust and Payment Safety

Many Nigerian guests hesitate to pay online. They fear that the hotel is fake, that the room will not be there, or that the money cannot be recovered. Each measure below answers one of those fears directly in the product. Status: **Decided** for launch.

### 1. Prove the hotels are real

Launching in one city (Jos) makes in-person checks possible. A hotel receives a **Verified by JosStay** badge only after JosStay has checked its business registration, visited the property and confirmed that its photos match. This makes the Admin approval step visible to guests.

### 2. Back every booking with a visible guarantee

Show one plain sentence on the hotel page and at checkout: if the hotel cannot honour the booking, the guest gets a refund or an equivalent room. This is the overbooking rule from section 17, shown to guests.

**Open:** only publish this promise after Paystack refunds on split payments have been confirmed and tested.

### 3. Show the full price and cancellation terms before payment

Show the total with taxes and fees included, the free-cancellation deadline and what is refundable, early in the journey and again at checkout. Hidden fees are one of the failures the deck names, and surprises at checkout damage trust faster than anything else.

### 4. Use payment methods people already trust

Use Paystack's hosted checkout, so card details never touch JosStay's servers. Show the secure-payment indicator at checkout.

**Open:** check which payment methods are enabled on the Paystack account (card, bank transfer, USSD), since many guests prefer bank transfer.

### 5. Give instant proof after paying

Immediately after payment, send a Brevo email and a WhatsApp message containing the booking reference, the hotel's address, a map pin and the hotel's phone number.

### 6. Make support a real person

Show a WhatsApp support line and a phone number on every page, and only promise reply times that can be kept.

### 7. Verified reviews only

Only guests with a completed stay can leave a review (see section 17).

### Deferred until after launch

The following options are not part of launch and should be revisited once guest behaviour in Jos is known: a deposit now with the balance paid at the hotel, holding the hotel's money until check-in, and pay-at-hotel for first-time guests. Holding funds means holding customers' money, so take advice from an accountant or lawyer before choosing it.

## 19. Maps and Location

**Provider:** Google Maps. Status: **Decided**.

Every hotel has a map location. The deck already depends on it: result cards show an area and a distance from the centre, and the Distance from centre filter needs coordinates for every hotel.

### What is stored for each hotel

A written address plus latitude and longitude. Typed addresses in a city like Jos are often too vague for a map service to find reliably, so the pin is the source of truth.

### How the pin is set

During onboarding, the hotel manager drops a pin on an interactive map. JosStay confirms the pin during the in-person verification visit (see section 18, measure 1).

### Where maps appear

| Place | What guests see |
| --- | --- |
| Hotel page | An embedded map with the hotel's pin and the surrounding area. |
| Search results | Distance from centre on each card. A results map view can be added later. |
| Distance filter | Distance calculated from stored coordinates in PostgreSQL, so it does not use Google calls. |
| Booking confirmation | A map pin and an **Open in Google Maps** link in the Brevo email and the WhatsApp message. |

### Cost control

- Use standard embedded maps on hotel pages, which are free, and keep the interactive map for the hotel onboarding pin.
- Google replaced its old monthly credit with free monthly usage per service. Each service has its own allowance and they do not pool. Confirm current limits and prices on Google's official pricing page before launch.
- Billing must be enabled to use the service, so set budget alerts and usage limits in the Google Cloud console and restrict the API key to JosStay's own domains.

### Open items

- **Open:** check Google's map data coverage for Jos by searching ten or more Jos hotels and landmarks before committing.
- **Open:** if the data is poor, or if matching the map to the brand palette becomes a priority, test Mapbox as the alternative.
- **Later:** a results map view, where guests browse hotels as pins on a map.

## 20. Positioning and Differentiation

Status: **Proposed**. These are hypotheses to test with real hotels and guests in Jos before they are treated as final.

### What is no longer unique

Verified listings and secure Paystack payments are already marketing promises on other Nigerian platforms. Trust still matters a great deal, but claiming it is not enough. JosStay wins by delivering trust in ways guests can see.

### Where JosStay can differ

| # | Difference | What it means in practice |
| --- | --- | --- |
| 1 | Depth in Jos, not breadth | Every hotel is visited, its photos checked and its map pin confirmed in person. National platforms cannot match that accuracy in one city. |
| 2 | Availability guests can rely on | The Block button, notifications, checkout holds and a last-second availability check, backed by a plain guarantee: if the hotel cannot honour a booking, JosStay makes it right. |
| 3 | WhatsApp as a main channel | Confirmations, support and hotel alerts through WhatsApp, with chat-based booking as a possible later step. |
| 4 | Filters for what matters locally | Power supply (generator or inverter), water, security, Wi-Fi, parking and distance to places guests actually go, using Google Maps data. |
| 5 | AI search that understands local requests | For example: "quiet hotel near the university with steady power". This puts the LLM integration to work as a real product feature. |
| 6 | A calmer, more transparent experience | Clear prices, visible policies and no hidden fees, as set out in the design principles of this guide. |
| 7 | A better deal for hotels | Direct payouts through Paystack's split, a simple dashboard and a competitive commission. **Open:** competitor commission rates were not found, so the rate must be set after speaking to hotels. |

### Positioning line to test

*The most dependable way to book a hotel in Jos.*

One difference should lead the message, and the rest support it. Reliability (differences 1 and 2) is the strongest candidate because it answers the main fear guests have about paying online.

### Validate before building

Ask 10 hotel managers and 10 guests in Jos what went wrong the last time they booked or took bookings. Their answers show which differences matter most and which can wait.

## 21. Referral Program

Status labels: **Decided** (chosen by the founder), **Default** (suggested, change if needed) and **Open** (still to be decided or confirmed).

### Purpose

Reward people who bring new guests to the platform. In a one-city launch, word of mouth is the most trusted way to grow.

### How it works

1. Every registered user gets a personal referral code and link that is easy to share on WhatsApp.
2. A new user signs up through the link, and the referral is attached to their account.
3. The referrer is paid **cash** once the referred user has a **successful booking without cancellation**. **Decided.**

### What counts as a successful booking

**Default:** the guest has checked out, and the booking was not cancelled or refunded. Paying only at this point means JosStay never pays for a booking that falls through.

### Funding

**Default:** the reward is paid out of JosStay's own commission on the booking, never added to the hotel's costs. **Open:** the reward amount. It must be comfortably smaller than the commission earned on the booking.

### Cash payouts

- **Method:** bank transfer to the referrer's own bank account using Paystack Transfers. Paystack describes Transfers as sending money from the Paystack balance to bank accounts in the same country.
- **Open:** Transfers are only available to registered businesses on Paystack, so confirm that JosStay's Paystack account is eligible.
- **Open:** transfers carry a fee per payout, plus stamp duty on larger transfers. Confirm current fees with Paystack and include them in the reward calculation.
- **Default:** referrers add and verify a bank account before their first payout, and the account name must match the user's name.
- **Default:** set a minimum payout amount and pay in batches, because Paystack supports bulk transfers.
- **Open:** Paystack asks for OTP confirmation on transfers by default. Ask Paystack what is required to automate payouts safely.

### Rules

| Rule | Setting |
| --- | --- |
| Who earns | The referrer, once, for each referred guest. **Default:** the first successful booking only. |
| Reward amount | **Open.** |
| Cap per referrer | **Default:** set a monthly or lifetime cap. **Open:** the number. |
| Attribution window | **Default:** a fixed period after signup. **Open:** how long. |
| Self-referral and fake accounts | **Default:** block rewards when the phone number, device, card or bank account matches the referrer. |
| Levels | **Default:** single level only. No rewards for the referrals of referred people. Confirm with a lawyer. |
| Privacy | **Default:** the referrer sees only "1 successful referral", never the guest's booking details. |
| Rules shown to users | **Default:** the programme terms are published in plain language and agreed to at sign-up. |

### Hotel referrals (later)

**Proposed:** reward people who bring in a hotel that is approved and takes its first booking. In a one-city launch, hotel supply may matter more than guests.

### Open questions

- Reward amount, cap and attribution window.
- Whether the Paystack account can send payouts, and what they cost.
- How referral rewards are taxed and recorded. Confirm with an accountant.
- Programme terms and the single-level rule. Confirm with a lawyer.

## 22. Logo

Status: **Proposed**, first version. [View the logo board](https://claude.ai/artifact/3QSFarwXqEN1Bk7oT2HetC) to see every version.

### Concept

A map pin with a doorway cut into it and a small gold light in the doorway. The pin says location, the doorway says a place to stay, and the light says a lamp left on for you in Jos.

### Parts

| Part | Specification |
| --- | --- |
| Mark | Map pin in Deep Ocean `#173B4D`, with an arched doorway in Warm Ivory `#F7F4ED` and a Muted Gold `#B99A62` dot. Used as the app icon and favicon. |
| Wordmark | **josstay.** — the name in lower case, set in the interface face at Bold weight with tight tracking (-0.045em), closed with a full stop. Reversed to Warm Ivory on Deep Ocean. |
| Tagline | "Your city, your stay." in Inter Regular, Charcoal `#283238`. Used under the wordmark on larger sizes. |

### Versions

| Version | Use |
| --- | --- |
| Primary | Deep Ocean mark and wordmark on Warm Ivory. The default for the website header, documents and print. |
| Reversed | Ivory mark and wordmark on Deep Ocean, with the doorway in Deep Ocean. For dark backgrounds and photo overlays. |
| App icon and favicon | Ivory pin on a Deep Ocean rounded square. Use the mark alone, never the wordmark. |
| One colour | Charcoal mark and wordmark on Sand, for stamps, receipts and single-colour print. |

### Clear space and size (Proposed)

- Keep clear space on every side equal to the height of the letter J in the wordmark.
- Do not show the full lockup below 120 px wide on screen. Drop the tagline below 200 px wide.
- Use the mark alone for favicons and small icons.

### Do not

- Change the weights or recolour Stay.
- Stretch, rotate or add shadows or effects.
- Place the logo on a busy photo without a Deep Ocean overlay.
- Use the tagline on its own beside the icon.

### Open

- The wordmark is set live in the interface face. Before production, convert it to outlines so it looks identical everywhere, and export the final SVG and PNG files.
- Test the pin at 16 px for the favicon.
- CAC name registration and trademark checks: to be handled at production.


## 23. Motion and Art Direction

Status: **Proposed** addendum, November 2026. Written after reviewing a high-craft fintech site (tokkenly.com) to extract principles rather than identity, per §4 Benchmarks: "borrow proven UX principles, not someone else's identity."

### The principle

Motion must advance **Discover → Compare → Commit** (§3). If an animation does not help a guest understand, decide or trust, it is decoration and it is removed.

JosStay should feel like a well-made guesthouse: calm, editorial, generous whitespace. The rules below are a floor, not a ceiling.

### Motion budget

| Surface | Motion allowed | Not allowed |
| --- | --- | --- |
| Home hero | One fade-up on load | Delaying or obscuring the search bar |
| Home scroll story | Sticky frame with a changing step | Scroll hijacking, scroll snapping |
| Hotel detail | Fade-up for section headings; one pulse on live availability | Animating price, dates or availability text |
| Search results | Filter chip transitions | Anything that delays the result list |
| Checkout | Button state and total change | Animating money, dates or the cancellation deadline |
| Toasts, dialogs | Fade or slide, 150–200 ms | Loops, parallax |

### The one reveal primitive

A single recipe, used everywhere, CSS-first:

| Property | Value |
| --- | --- |
| Trigger | `IntersectionObserver`, once, at 15–20 % visible |
| Transform | `translateY(8px)` → `0` |
| Opacity | `0` → `1` |
| Duration | 300–400 ms |
| Easing | `cubic-bezier(0.22, 1, 0.36, 1)` (the `calm` token) |
| Stagger | 60–80 ms between siblings, four items maximum |
| Never | blur, scale, rotation, parallax |

One small client component using the platform `IntersectionObserver` to toggle a class. **No animation library** for this. With `prefers-reduced-motion: reduce`, render the final state and no transition.

### Ambient loops

At most one per page, and only where it means "live": availability, a pending payment, a live rate. A loop must be slow (three seconds or more), low contrast, and pause when scrolled out of view. Never loop over photography, over a form, or next to the price.

### The scroll story

The homepage gets **one** sticky frame telling the brand's own three-step story — Discover, Compare, Commit — with a single sentence and one photograph per step. Sticky height around 80 vh, the step changes as the guest scrolls, native scrolling only.

### Art direction: what to borrow

1. **Self-hosted fonts.** Variable woff2 files in the repository, loaded with `next/font/local`, plus a metric-matched local fallback (`size-adjust`, `ascent-override`). The brand type must never depend on a font CDN, and the fallback must not shift the layout.
2. **Quiet depth.** Soft shadow, a hairline ring in Sand at low opacity, and one blurred warm glow behind hero imagery. One glow per surface, never two.
3. **Texture.** A light grain overlay (6 % opacity or less) over large brand panels. It is what makes a flat block feel like paper instead of a div.
4. **Honest imagery.** Real hotel photography and real product screenshots, never generic stock. The placeholder photos in `client/public/images/photos` are a launch blocker, not a look.

### Art direction: what to refuse

1. **A dark neon identity.** JosStay is ivory, sand and ocean. No lime or "volt" accent, no dark-first marketing pages.
2. **Scroll hijacking** (Lenis-style inertia). It breaks scroll predictability and keyboard navigation, and §12 asks for minimal JavaScript.
3. **A motion library** for a handful of effects. `motion` (Framer Motion) is only justified if the scroll story needs shared layout transitions.
4. **Motion on money, dates or availability.** Those must appear instantly and stay readable.
5. **Decorative motion** anywhere on the transactional path: search, hotel detail, checkout, payment.

### Accessibility rules

- `prefers-reduced-motion: reduce` means no transitions, no loops and no sticky pinning.
- Nothing revealed by scrolling may be the only place a piece of information exists.
- Touch targets stay at 44 px or more, and animated elements never shift layout while moving.
- The price, the dates and the cancellation deadline are never animated and never sit inside a moving element.
- Every text pairing is measured, not eyeballed — see the muted text floor and the photography rule in §5.

### Performance budget

- Motion must not add a client-side dependency larger than 5 KB gzipped.
- Prefer CSS transitions and keyframes; JavaScript only toggles a class.
- Every page still works with JavaScript disabled — search, checkout and sign-in stay server-rendered and progressively enhanced.

### Open

- Whether the hotel detail page wants a sticky gallery, or whether one gallery and one sticky summary is enough.
- Whether the scroll story ships at launch, or waits for real hotel photography to carry it.
