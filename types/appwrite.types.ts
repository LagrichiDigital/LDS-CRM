import { Models } from "node-appwrite";

/** Subscription plan tier. Starter = email only; Pro = + WhatsApp; Business = + client profiles. */
export type BusinessPlan = "starter" | "pro" | "business";

/** Multi-tenant: each business is a subscribing client (e.g. salon, dentist). */
export interface Business extends Models.Document {
  name: string;
  slug: string;
  landingTitle?: string;
  landingDescription?: string;
  timezone: string;
  requirePatientAccount: boolean;
  /** Optional logo URL for landing and booking header. */
  logoUrl?: string;
  /** Optional hero image URL for Palmaria-style landing (full-bleed background). */
  heroImageUrl?: string;
  /** Optional primary brand color (hex, e.g. #24ae7c). Used for CTAs and accents. */
  primaryColor?: string;
  /** Optional admin passcode used to protect this business's dashboard. Plain string for now. */
  adminPasscode?: string;
  /** Appwrite User ID of the admin. When set, only this user can access the dashboard (Appwrite Auth). */
  adminUserId?: string | null;
  /** Admin login username (what they type). Must be unique across businesses. */
  adminUsername?: string | null;
  /** Admin's Appwrite email (required for Appwrite API; admin uses username in UI). */
  adminEmail?: string | null;
  /** ISO 4217 currency code for display and earnings (e.g. GBP, USD, EUR, MAD, AED). Defaults to USD if not set. */
  currency?: string;
  /** Which landing page template to use for this business. Omit or "classic" = dark theme; "palmaria" = light Palmaria-style; "chezrim" = warm Moroccan salon. */
  landingTemplate?: "classic" | "palmaria" | "chezrim";
  /** Subscription tier. Omit or "starter" = email only; "pro" = + WhatsApp; "business" = + client profiles. */
  plan?: BusinessPlan;
  /** Language for outbound notifications (email + SMS). Defaults to "en". Set "fr" for French-speaking clients (e.g. Morocco). */
  notificationLanguage?: "en" | "fr";
  /** City / location shown on the landing page (e.g. "Berkane, Maroc"). */
  city?: string;
}

/** Configurable service per business (e.g. "Haircut", "Check-up"). */
export interface Service extends Models.Document {
  businessId: string;
  name: string;
  durationMinutes: number;
  description?: string;
  /** Optional price in the business's main currency (e.g. 25.00 for $25). Used for earnings analytics. */
  price?: number;
  /** Optional icon image URL for services listing page. */
  iconUrl?: string;
}

/** Optional provider per business (e.g. specific doctor, stylist). */
export interface Provider extends Models.Document {
  businessId: string;
  name: string;
  imageUrl?: string;
}

export interface Patient extends Models.Document {
  businessId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

/** Guest contact for bookings without a user account. */
export interface GuestContact {
  name: string;
  email: string;
  phone: string;
}

export interface Appointment extends Models.Document {
  businessId: string;
  /** For guest bookings: plain name, email, phone. No patient document. */
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  /** Optional link to registered patient when business uses patient accounts. */
  patientId?: string | null;
  /** Optional link to Client profile (Business tier). */
  clientId?: string | null;
  serviceId: string;
  providerId?: string | null;
  schedule: string; // ISO date string
  status: Status;
  note: string;
  /** Staff-only internal notes (not sent to guest). */
  staffNotes?: string | null;
  cancellationReason: string | null;
}

/** Client profile (Business tier). Admin-created from appointment guest details. */
export interface Client extends Models.Document {
  businessId: string;
  name: string;
  email: string;
  phone: string;
  /** Admin notes about this client. */
  notes?: string | null;
  /** Optional profile image URL (Appwrite Storage). */
  imageUrl?: string | null;
}
