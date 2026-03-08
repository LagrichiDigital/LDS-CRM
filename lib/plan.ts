import { Business, BusinessPlan } from "@/types/appwrite.types";

/** Default plan when not set. */
export const DEFAULT_PLAN: BusinessPlan = "starter";

/** Get the effective plan for a business (defaults to starter). */
export function getBusinessPlan(business: Business | null | undefined): BusinessPlan {
  const plan = business?.plan;
  if (plan === "starter" || plan === "pro" || plan === "business") return plan;
  return DEFAULT_PLAN;
}

/** Pro and Business tiers get WhatsApp/SMS on confirm/cancel. */
export function canSendWhatsApp(business: Business | null | undefined): boolean {
  const plan = getBusinessPlan(business);
  return plan === "pro" || plan === "business";
}

/** Only Business tier gets client profiles (CRM). */
export function canUseClientProfiles(business: Business | null | undefined): boolean {
  const plan = getBusinessPlan(business);
  return plan === "business";
}
