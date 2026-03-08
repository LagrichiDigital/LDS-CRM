# LDS-CRM

Booking and lightweight CRM for small businesses (salons, opticians, clinics). Multi-tenant: each business gets a custom landing page, guest booking, and a private admin dashboard.

**By [Lagrichi Digital](https://lagrichidigital.com).**

## Tech stack

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, **shadcn/ui**
- **Appwrite** — database, auth (admin per business)
- **Resend** — transactional email (confirm/cancel)
- **Twilio** — WhatsApp notifications (confirm/cancel, sandbox for testing)

## Features

- **Multi-tenant**: One app, many businesses. Each business has a `slug` (e.g. `chez-rim`) and its own landing, services, and admin.
- **Guest booking**: No login. Clients book via landing → choose service & time → submit name/email/phone. Request is **pending** until the business confirms.
- **Business admin**: Per-business login (Appwrite). Dashboard shows pending/scheduled/cancelled appointments; confirm or cancel with one click. Email + WhatsApp sent on confirm/cancel (Pro/Business plan).
- **Custom landings**: Business-specific templates (e.g. Palmaria, Chez Rim), brand colour, hero image, bilingual notifications (EN/FR).
- **Responsive**: Landing, booking flow, and admin work on mobile and desktop.

## Quick start

**Prerequisites:** Node.js, npm (or yarn/pnpm).

```bash
git clone https://github.com/LagrichiDigital/LDS-CRM.git
cd LDS-CRM
npm install
```

**Environment:** Copy `.env.example` to `.env.local` and fill in your values.

- **Appwrite**: Endpoint, project ID, API key, database ID, collection IDs. See `APPWRITE_SETUP.md` for schema and setup.
- **Resend**: `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (use a verified domain or `onboarding@resend.dev` for testing).
- **Twilio**: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`. For WhatsApp confirmations we use the Twilio WhatsApp Sandbox; no `TWILIO_PHONE_NUMBER` needed for that flow.

**Run:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `/b/[slug]` for a business (e.g. `/b/chez-rim`) and `/b/[slug]/admin` for the admin dashboard (login required).

## Repo

- **Code:** [github.com/LagrichiDigital/LDS-CRM](https://github.com/LagrichiDigital/LDS-CRM)
- **Docs:** `APPWRITE_SETUP.md`, `.env.example`

---

*This project was adapted from a healthcare-style template; the codebase has been heavily customised for multi-tenant booking and CRM.*
