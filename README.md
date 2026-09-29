# OmniRexa Logistics &amp; Security

Premium shipping, logistics, cargo security, and shipment tracking **platform prototype** for **OmniRexa Logistics &amp; Security** — a static, multi-page HTML/CSS/JS website and functional demo built with a premium dark-tech visual system (deep navy, midnight, electric blue, gold/orange accents).

This is a **front-end prototype**. There is no real backend, database, authentication, GPS/mapping, payment, or carrier integration. All shipment, tracking, customer, fleet, and financial data shown in the app is **mock/demo data** generated client-side, clearly labeled as such throughout the UI (look for "Demo data" badges and prototype notices).

## Quick start

Requirements: Node.js 18+ and npm.

```bash
npm install
npm start
```

The app is served at **http://localhost:8080**. The site must be served over HTTP (not opened directly via `file://`) because shared header/footer navigation is loaded via `fetch()` from `assets/partials/`.

Alternative dev command with the same behavior: `npm run dev`.

### Linting

```bash
npm run lint        # runs HTML validation + CSS linting
npm run lint:html    # html-validate against every .html page
npm run lint:css     # stylelint against assets/css/**/*.css
npm test             # alias for npm run lint
```

## Demo data

| Item | Value |
| --- | --- |
| Demo tracking number | `GSL-2026-847291-XP` (try it on the homepage tracking widget or `tracking.html`) |
| Other demo tracking numbers | `GSL-2026-203841-RD` (delayed), `GSL-2026-556120-QK` (delivered), `GSL-2026-771403-MP` (pending pickup) — see `assets/js/mock-data.js` for the full list |
| Login (customer/admin) | Any email + password of 6+ characters is accepted on `login.html`. This is a **prototype-only** stand-in, not real authentication. |
| Quote calculator | Fully client-side estimate using fixed rate tables in `assets/js/mock-data.js` — not connected to a real rating engine or carrier API. |
| Create Shipment | Generates a new demo tracking number in the browser and shows a mock cost/date estimate. Nothing is persisted to a server; refreshing the page resets state. |

Every dashboard, tracking, security, and admin screen that shows shipment status, GPS/location, ETA, revenue, or fleet data is populated from this same mock dataset and is visually marked as demo/prototype content — it must not be mistaken for live operational data.

## Project structure

```
index.html               Homepage (hero, tracking widget, trust/stat blocks, features)
tracking.html             Dedicated tracking portal
shipping.html             Shipping methods + quote calculator
security.html             Cargo security status panel + services
dashboard.html             Customer dashboard (overview, shipments, create shipment, quotes,
                            documents, invoices, notifications, addresses, support, settings)
admin.html                 Admin dashboard (shipments, customers, drivers, vehicles, warehouses,
                            routes, tracking, security, payments, invoices, notifications, reports,
                            support, settings)
about.html, services.html, contact.html, support.html, faq.html,
locations.html, careers.html, login.html, policies.html, 404.html
                            Supporting marketing/informational pages

assets/css/base.css         Design tokens (colors, type, spacing) + base components
assets/css/layout.css       Header/nav/hero/footer layout
assets/css/dashboard.css    Dashboard/admin shells, charts, timeline, route panel, quote cards

assets/partials/header.html, footer.html   Shared nav/footer markup, injected via include.js

assets/js/include.js       Loads shared header/footer partials, active-nav highlighting, mobile nav
assets/js/mock-data.js      Single source of truth for all demo/mock data (see below)
assets/js/main.js           Toast notifications, animated counters, homepage tracking widget
assets/js/tracking.js       Tracking lookup, timeline, animated route visualization
assets/js/quote.js          Quote calculator logic
assets/js/dashboard.js       Customer dashboard tabs, stats, create-shipment flow, settings
assets/js/admin.js          Admin dashboard tabs, stats, shipment/fleet tables, audit trail
```

## Mocked-data boundaries (what to replace for production)

All mock/demo data lives in **`assets/js/mock-data.js`**, exposed as `window.OmniRexaMock`. This isolation is intentional so it can be swapped for real API calls without touching page markup or UI logic. It currently provides:

- Sample shipments (with tracking numbers, statuses, timelines, origin/destination, carrier, package details)
- `findShipmentByTrackingNumber()` — replace with a real tracking/carrier API call
- `generateTrackingNumber()` — replace with a server-generated, guaranteed-unique tracking number
- `estimateQuote()` — replace with a real rating engine / carrier rate API
- Customer dashboard stats, monthly activity, invoices, notifications, saved addresses
- Admin dashboard stats, driver/vehicle fleet data, audit trail entries
- Security status panel values (GPS, tamper, temperature, driver, last check)

Any UI copy referencing certifications, industry partnerships, awards, testimonials, customer logos, or business statistics (About, Services, Locations, Careers, FAQ, footer) is a **clearly marked placeholder** and must be replaced with real, verified content before production use — no real credentials, partners, or statistics have been invented.

## Suggested backend/database entities

To evolve this prototype into a production system, a backend could expose REST/GraphQL APIs backed by entities such as:

- **User** / **Customer** / **Admin** (with role-based permissions, encrypted passwords, session management, optional 2FA)
- **Shipment** (unique tracking number, status, origin/destination, carrier, shipping method, cost, dates)
- **Package** (weight, dimensions, quantity, declared value, package type)
- **TrackingEvent** (timestamped location + status updates that build a shipment's timeline)
- **Location** / **Warehouse** / **Route**
- **Driver** / **Vehicle** (status, current location, assigned shipment/route)
- **Payment** / **Invoice**
- **Notification** (email/SMS/push preferences and delivery log)
- **SecurityIncident** (GPS/tamper/route alerts, resolution status)
- **Document** / **ProofOfDelivery** (uploads, signature/photo confirmation)

Integration points designed to be added later without restructuring the front end:

- Real GPS/mapping providers (replacing the animated SVG route panel)
- SMS and email delivery providers (replacing in-app toast notifications)
- Payment gateway (replacing the static invoice/payment mock data)
- Shipping carrier APIs (replacing `findShipmentByTrackingNumber`/`estimateQuote`)
- Customer/admin authentication service (replacing the demo login form)
- A persistent database (replacing `mock-data.js`)

## Accessibility &amp; responsiveness

- Semantic HTML, labeled form fields, `<th scope>` on data tables, keyboard-operable navigation and tabs.
- `prefers-reduced-motion` is respected: animations/transitions are shortened or disabled for users who request reduced motion.
- Fully responsive layouts for desktop, laptop, tablet, and mobile, with tracking, status, ETA, notifications, and support surfaced first on small screens.

## Security notes

- No real customer or shipment data is stored or transmitted; everything runs in the browser from static mock data.
- The login flow is a UI demonstration only and must not be treated as a real authentication boundary.
- Forms include basic client-side input validation (required fields, patterns) as a UX baseline; a production system must add server-side validation, authentication, authorization, and rate limiting.
