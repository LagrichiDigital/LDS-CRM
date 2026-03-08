# Appwrite setup checklist

Use this list when creating or updating your Appwrite project so the app works correctly. Copy `.env.example` to `.env.local` and fill in the IDs after creating each resource.

---

## 1. Environment variables

Set these in `.env.local` (see `.env.example` for the full list):

- **Appwrite**: `NEXT_PUBLIC_ENDPOINT`, `PROJECT_ID`, `API_KEY`, `DATABASE_ID`
- **Collection IDs** (create the collections below, then paste their IDs):
  - `BUSINESS_COLLECTION_ID`
  - `SERVICE_COLLECTION_ID`
  - `PROVIDER_COLLECTION_ID` (optional; provider feature is unused but collection can exist)
  - `PATIENT_COLLECTION_ID` (optional; for future patient-account flow)
  - `APPOINTMENT_COLLECTION_ID`
  - `BUSINESS_HOURS_COLLECTION_ID` (optional; for opening hours / availability)
  - `CHANGE_REQUEST_COLLECTION_ID` (optional; for "Request changes" on admin settings)
  - `CLIENT_COLLECTION_ID` (optional; for Business tier client profiles)
- **Storage** (optional): `NEXT_PUBLIC_BUCKET_ID`
- **Resend** (for email confirmations): `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- **Twilio** (for SMS/WhatsApp on confirm/cancel, Pro and Business tiers): `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

---

## 2. Database and collections

Create one database and the following collections inside it. Record each collection ID in `.env.local`.

---

## 3. Business collection

**Attributes to add:**

| Attribute        | Type    | Required | Notes                                                                 |
|-----------------|---------|----------|-----------------------------------------------------------------------|
| name            | string  | yes      | Business display name                                                 |
| slug            | string  | yes      | URL-friendly identifier (e.g. `test-salon`)                          |
| landingTitle    | string  | no       | Optional landing page title                                           |
| landingDescription | string | no     | Optional landing page description                                     |
| timezone        | string  | yes      | IANA timezone (e.g. `Europe/London`, `America/New_York`)             |
| requirePatientAccount | boolean | yes | For guest booking use `false`                                        |
| logoUrl         | string  | no       | Optional logo URL for header                                          |
| primaryColor    | string  | no       | Hex color for CTAs (e.g. `#24ae7c`)                                  |
| **adminPasscode** | string | no     | Legacy passcode for admin login (when `adminUserId` is not set). |
| **adminUserId**   | string | no     | **Appwrite User ID** of the admin. When set with adminUsername/adminEmail, login uses username + password (Appwrite Auth). |
| **adminUsername** | string | no     | Optional alternate login (when different from slug). Add an index for fast lookup. |
| **adminEmail**    | string | no     | Admin's Appwrite email (required for password login; used internally with slug). |
| **currency**    | string  | no       | **ISO 4217 code** (e.g. `GBP`, `USD`, `EUR`, `MAD`, `AED`). Defaults to USD if missing. |
| **plan**        | string  | no       | Subscription tier: `starter` (email only), `pro` (+ WhatsApp), `business` (+ client profiles). Omit = starter. |

---

## 4. Service collection

| Attribute        | Type    | Required | Notes                                      |
|-----------------|---------|----------|--------------------------------------------|
| businessId      | string  | yes      | ID of the Business document                 |
| name            | string  | yes      | Service name (e.g. Haircut)                |
| durationMinutes | integer | yes      | Appointment length in minutes              |
| description     | string  | no       | Optional description                       |
| **price**       | float   | no       | **Required for earnings.** Price in business currency (e.g. 30.00). |
| iconUrl         | string  | no       | Optional icon URL                          |

---

## 5. Appointment collection

| Attribute          | Type    | Required | Notes |
|-------------------|---------|----------|-------|
| businessId        | string  | yes      |       |
| guestName         | string  | yes      |       |
| guestEmail        | string  | yes      |       |
| guestPhone        | string  | yes      |       |
| patientId         | string  | no       | Optional; for future patient-account link |
| serviceId         | string  | yes      |       |
| providerId         | string  | no       | Optional; currently unused in UI |
| schedule          | string  | yes      | ISO date string (e.g. `2026-02-27T18:30:00.000Z`) |
| status            | string  | yes      | **See status enum below** |
| note              | string  | yes      | Guest note (can be empty string) |
| staffNotes        | string  | no       | Admin-only notes |
| cancellationReason | string | no     | Filled when status is `cancelled` |

**Status attribute:**  
If you use an enum in Appwrite, allow these values:

- `pending`
- `scheduled`
- `cancelled`
- **`completed`** ← add this so admins can mark appointments as completed.

---

## 6. BusinessHours collection (optional)

Used for opening hours and blocking closed days on the booking form.

| Attribute  | Type    | Required | Notes |
|------------|---------|----------|-------|
| businessId | string  | yes      |       |
| dayOfWeek  | integer | yes      | 0 = Sunday, 1 = Monday, … 6 = Saturday |
| isClosed   | boolean | yes      | `true` if closed that day |
| openTime   | string  | yes      | 24h time (e.g. `09:00`) |
| closeTime  | string  | yes      | 24h time (e.g. `17:30`) |

Create one document per day per business (7 per business if you set all days).

---

## 7. ChangeRequest collection (optional)

Used for the “Request a change” form on admin Settings (services, hours, pricing, etc.).

| Attribute        | Type   | Required | Notes |
|------------------|--------|----------|-------|
| businessId       | string | yes      |       |
| businessName     | string | yes      |       |
| changeType       | string | yes      | e.g. `services`, `hours`, `pricing`, `other` |
| details          | string | yes      | Description of requested change |
| preferredContact | string | no       | How to contact (e.g. email or phone) |

---

## 8. Provider collection (optional)

The app no longer shows a provider selector in the booking or admin UI, but the collection can exist for future use.

| Attribute  | Type   | Required |
|------------|--------|----------|
| businessId | string | yes      |
| name       | string | yes      |
| imageUrl   | string | no       |

---

## 9. Patient collection (optional)

For future “registered patient” flows. Not required for guest-only booking.

---

## 10. Client collection (Business tier)

For businesses on the **business** plan. Admin-created profiles from appointment guest details.

| Attribute  | Type   | Required | Notes |
|------------|--------|----------|-------|
| businessId | string | yes      | ID of the Business document |
| name       | string | yes      | Client name |
| email      | string | yes      | Client email |
| phone      | string | yes      | Client phone |
| notes      | string | no       | Admin notes about this client |
| imageUrl   | string | no       | Profile image URL (e.g. from Appwrite Storage) |

Add `CLIENT_COLLECTION_ID` to `.env.local` after creating this collection.

---

## 11. Admin login: slug + password (Appwrite Auth)

To use slug + password instead of passcode (you already have `slug` and `adminPasscode`):

1. **Enable Email/Password auth** in Appwrite Console → Auth → Settings.
2. **Create a user**: Appwrite Console → Auth → Users → Create user (email + password).
3. **Copy the user's ID** (e.g. `6742abc123...`).
4. **Add to the Business document** (e.g. `test-salon`):
   - `adminUserId` = the Appwrite user ID
   - `adminEmail` = the user's email in Appwrite (required for the API)
5. **API key scope**: ensure your `API_KEY` has `sessions.write`.

Admins sign in at `/admin` with **slug** (e.g. `test-salon`) and **password**. No need for `adminUsername` — the slug is used as the identifier. Passcode login still works for businesses that only have `adminPasscode` set.

---

## Quick checklist

- [ ] Database created; all collection IDs in `.env.local`
- [ ] **Business**: `adminPasscode` or **`adminEmail` + `adminUserId`** for slug+password login; **`currency`** set per business (GBP, USD, EUR, MAD, AED, etc.)
- [ ] **Service**: **`price`** set on each service (needed for earnings)
- [ ] **Appointment**: status enum includes **`completed`**
- [ ] **BusinessHours** (optional): created if you use opening hours
- [ ] **ChangeRequest** (optional): created if you use “Request changes” on Settings
- [ ] **Business**: **`plan`** set per business (`starter`, `pro`, or `business`)
- [ ] **Resend** env vars set for email confirmations (all tiers)
- [ ] Twilio env vars set for SMS/WhatsApp on confirm/cancel (Pro and Business tiers only)
- [ ] **Client** collection created if you use Business tier
