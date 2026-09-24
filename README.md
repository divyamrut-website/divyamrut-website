# Divyamrut Website (by Precious Ayurveda)

A single-product, mobile-first website built with **Next.js 14 (App Router) +
TypeScript + Tailwind CSS**, ready for Vercel deployment. It covers product
education, lead capture, a two-step order flow, WhatsApp lead notification
(server-side), SEO, and an analytics event layer.

---

## 1. What's actually working vs. what needs your setup

This scaffold is fully functional for **development and demoing the flow**.
Three things are intentionally left as configuration, not code, because they
need real business credentials that shouldn't live in this repo:

| Piece | Status | What you need to do |
|---|---|---|
| Website, forms, validation, SEO, analytics event calls | ✅ Working now | Nothing — review copy and launch |
| Lead storage | ⚠️ Demo only (JSON file in `/data`) | Point `lib/leadStore.ts` at a real database before launch — **Vercel's filesystem is ephemeral, so the JSON file will not reliably persist in production.** See §7. |
| WhatsApp business notification | ⚠️ Wired, but no-ops until configured | Add `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_NOTIFY_TO` env vars (Meta WhatsApp Cloud API). See `lib/whatsapp.ts`. |
| GA4 / GTM / Meta Pixel / Clarity | ⚠️ Event layer ready, scripts not injected | `lib/analytics.ts` pushes to `window.dataLayer`. Add your GTM container script tag to `app/layout.tsx` once you have a container ID, then map events in GTM. |

Several product facts are marked **"to be confirmed"** throughout the site
(price, exact ingredients, license numbers, manufacturer address, net
quantity). This is deliberate — the brief explicitly says not to invent
these. Search `UNVERIFIED_CLAIMS` in `lib/constants.ts` for the full list.

---

## 2. Architecture

```
app/
  layout.tsx          Root layout, SEO metadata, JSON-LD structured data
  page.tsx             Home page — assembles all sections
  order/page.tsx        Two-step order flow (client component)
  thank-you/page.tsx    Post-order confirmation
  support/page.tsx      Contact page
  policies/*/page.tsx    Privacy / Terms / Shipping / Returns placeholders
  api/leads/route.ts     POST endpoint: validates, saves lead, notifies WhatsApp
  sitemap.ts / robots.ts  Auto-generated SEO files
components/            One component per section (Header, Hero, Benefits, …)
lib/
  constants.ts          Brand copy, phone/email, usage instructions
  validation.ts          Indian mobile & PIN validators
  types.ts               Lead / form types
  leadStore.ts            Demo JSON-file storage (swap for real DB)
  whatsapp.ts              WhatsApp Cloud API notification
  analytics.ts             dataLayer event helper
public/images/           Precious logo, Divyamrut logo, product packaging
```

## 3. User journey

```
Instagram / Google / Social → Website → Hero (0–3s: brand + product + CTA)
  → Scroll: what it is → why → ingredients → how to use → product details
  → trust → FAQ → Order CTA
  → Step 1: Name + Mobile (Lead Capture)
  → Step 2: Delivery address + quantity
  → Confirm Order → Thank-you page (not "order confirmed" — verification pending)
  → Lead saved with a unique ID (DV000001…) → WhatsApp alert to sales team
  → Telecaller verifies → status moves through the workflow in §5
```

## 4. Lead capture — two-step design

- **Step 1 (`components/LeadForm.tsx`)**: Name + mobile only, to keep friction
  low before the customer has committed. Headline is "Order Divyamrut", not
  "Login" — there is no account system.
- **Step 2 (`components/DeliveryForm.tsx`)**: Full delivery address +
  quantity. No DOB, gender, occupation, or health data is collected.
- Validation is inline, Indian-format-aware (`lib/validation.ts`), and never
  clears already-entered fields on error.
- On submit, `POST /api/leads` validates server-side again (never trust the
  client), assigns a `DVxxxxxx` Lead ID, stores the lead, and fires a
  WhatsApp alert to the business — all before the customer sees the
  thank-you page.

## 5. Telecaller workflow (status values)

Defined in `lib/types.ts` as `LeadStatus`:

```
New Lead → Call Pending → Call Attempted → Customer Contacted
  → Details Verified → Order Confirmed → Processing → Shipped → Delivered
  (or Cancelled)
```

This is data-model-ready for a future admin dashboard (see §9) where a
telecaller updates status after confirming name, mobile, product, quantity,
address, PIN and order amount.

## 6. WhatsApp notification

`lib/whatsapp.ts` sends the lead to the **business's** WhatsApp using the
official WhatsApp Cloud API — the customer never receives an automated
WhatsApp message claiming their order is confirmed. Message format matches
the brief:

```
NEW DIVYAMRUT ORDER LEAD
Lead ID: DV000001
Customer Name: ...
Mobile: ...
Address: ...
PIN: ...
Product: Divyamrut
Quantity: 1
Source: Website
Status: New Lead
```

No credentials are hardcoded — they're read from environment variables and
the function no-ops safely if they're missing, so local development works
without a WhatsApp account.

## 7. Database — replace before launch

`lib/leadStore.ts` currently writes to `data/leads.json` so the flow works
immediately with `npm run dev`. **This will not work reliably on Vercel**
because serverless functions get a fresh, mostly-read-only filesystem per
invocation. Before launch, replace `saveLead` / `getNextLeadNumber` with
calls to a real database — recommended options on Vercel:

- **Vercel Postgres / Neon** — relational, easiest to query for a future
  dashboard, generous free tier.
- **Supabase** — Postgres + built-in auth if you later want telecaller
  logins.
- **MongoDB Atlas** — if you prefer a document store.

Suggested lead table/columns match `Lead` in `lib/types.ts` and the field
list in the brief (§30): Lead ID, Name, Mobile, WhatsApp, Address, PIN,
District, State, Product, Quantity, Source, Campaign, Date, Time, Status,
Telecaller, Call status, Verification status, Order status.

## 8. UTM / source tracking

`/order?utm_source=instagram&utm_medium=reel&utm_campaign=launch` — the
order page reads these query params and stores them with the lead
(`source`, `utmSource`, `utmMedium`, `campaign` in `Lead`), so you can trace
Instagram Reel → Website → Lead → Call → Verified → Order once a dashboard
exists.

## 9. Future dashboard (not built here)

The data model already supports a dashboard showing visitors, leads,
conversion rate, form completion, WhatsApp/call clicks, verified leads,
confirmed/delivered/cancelled orders, by source/campaign/location/date. This
would be a separate authenticated `/admin` app reading from the database in
§7 — out of scope for this single-product customer-facing site, but the
lead schema was designed with it in mind.

## 10. Analytics events

`lib/analytics.ts` exposes `track(event, params)`, pushing to
`window.dataLayer`. Events already called from the UI: `lead_form_open`,
`lead_form_start`, `lead_form_complete`, `delivery_form_start`,
`order_submit`, `whatsapp_click`, `order_cta_click`. The full event list from
the brief (scroll depth, section views, timers) is typed in
`AnalyticsEvent` — wire the remaining ones with `useEffect` + `IntersectionObserver`
per section once you confirm which sections you want tracked, to avoid
over-instrumenting before there's a GTM container to receive them.

To activate: create a GTM container, add its snippet to `app/layout.tsx`,
then map `dataLayer` events to GA4/Meta Pixel/Clarity tags inside GTM — no
further code changes needed.

## 11. SEO

- Per-page metadata via Next.js Metadata API (`app/layout.tsx`,
  per-route `metadata` exports).
- Organization + Product JSON-LD structured data in `app/layout.tsx`.
- Auto-generated `sitemap.xml` (`app/sitemap.ts`) and `robots.txt`
  (`app/robots.ts`).
- Semantic HTML (`<h1>`/`<h2>` hierarchy, `<details>` for FAQ — which also
  reads well to screen readers).
- **Malayalam/local SEO**: not implemented by default. The brief asks to
  research actual search intent before committing to a translation
  strategy — recommend starting English-only, watching Search Console
  queries after launch, and adding Malayalam copy only where real search
  demand shows up, rather than machine-translating the whole site upfront.

## 12. Design system

Colors (`tailwind.config.ts`) were estimated from the attached packaging and
Precious logo:

| Token | Hex | Source |
|---|---|---|
| `cream` | `#F6EFDD` | Packaging background |
| `forest` | `#1F4B34` | Deep green droplet / "DIVYAMRUT" wordmark |
| `sage` | `#6E8F6C` | Lighter green accents |
| `bronze` | `#B08A4E` | Warm accent for labels/CTAs |
| `plum` | `#7A2A5E` | Precious logo accent — used sparingly, not as a primary color |

Typography: **Playfair Display** (serif, headings) + **Inter** (sans, body)
— loaded via Google Fonts in `app/layout.tsx`. Only these two families are
used, per the "premium, not overloaded" direction.

The actual uploaded logos and packaging photo are used as-is in
`public/images/` — not redrawn or recreated.

## 13. Accessibility

Labeled form fields, `aria-invalid`/`aria-describedby` on errors, visible
focus states (`:focus-visible` in `globals.css`), semantic landmarks
(`header`, `main`, `footer`), sufficient color contrast between `forest` text
and `cream` backgrounds, and a native `<details>`-based FAQ that's keyboard-
and screen-reader-friendly without extra JS.

## 14. Security

- No API keys or secrets in frontend code — `lib/whatsapp.ts` only runs
  server-side (inside the `app/api` route handler).
- Server-side re-validation of every field in `app/api/leads/route.ts`
  (never trusts client-side validation alone).
- Security headers set in `next.config.js` (`X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`).
- Add rate limiting (e.g. Vercel's built-in or `@upstash/ratelimit`) to
  `/api/leads` before launch to prevent spam submissions.

## 15. Local development

```bash
npm install
cp .env.example .env.local   # fill in what you have; WhatsApp/DB can stay empty for now
npm run dev
```

Visit `http://localhost:3000`. Submitting an order writes to
`data/leads.json` for local testing.

## 16. Deploying to Vercel

1. Push this project to a GitHub/GitLab repo.
2. In Vercel: **New Project → Import** the repo. Framework preset
   `Next.js` is auto-detected.
3. Add environment variables from `.env.example` under **Project →
   Settings → Environment Variables** (Production + Preview).
4. **Before the first real launch**, complete §7 (swap the demo JSON store
   for a real database) — otherwise leads can be lost between deployments.
5. Deploy. Vercel will build and give you a `*.vercel.app` URL; attach your
   custom domain under **Project → Settings → Domains**, then update
   `SITE.url` in `lib/constants.ts` to match (this feeds canonical URLs,
   Open Graph tags, and the sitemap).

## 17. Pre-launch checklist

- [ ] Replace all "to be confirmed" fields in `lib/constants.ts` and
      `components/ProductDetails.tsx` (price, net quantity, license,
      manufacturer address) with verified values
- [ ] Confirm ingredient list with the brand; update `components/Ingredients.tsx`
- [ ] Legal review of all four policy pages (`app/policies/*`) — currently placeholders
- [ ] Swap `lib/leadStore.ts` for a real database (§7)
- [ ] Configure WhatsApp Cloud API env vars and send a test lead (§6)
- [ ] Set up GTM/GA4/Meta Pixel/Clarity and confirm events fire (§10)
- [ ] Update `SITE.url` in `lib/constants.ts` to the real production domain
- [ ] Add rate limiting to `/api/leads`
- [ ] Run Lighthouse / PageSpeed Insights on mobile and fix any Core Web
      Vitals regressions
- [ ] Test the full order flow end-to-end on an actual phone, on
      Instagram's in-app browser and WhatsApp's in-app browser specifically
- [ ] Confirm FSSAI/AYUSH regulatory position on all on-site claims before
      go-live
