"use server";

import { unstable_cache } from "next/cache";
import { Query } from "node-appwrite";

import { Business } from "@/types/appwrite.types";

import {
  BUSINESS_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

async function getBusinessUncached(businessId: string) {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID!,
      BUSINESS_COLLECTION_ID!,
      businessId
    );
    return parseStringify(doc) as Business;
  } catch (error) {
    console.error("Error fetching business:", error);
    return null;
  }
}

export async function getBusiness(businessId: string) {
  return unstable_cache(
    () => getBusinessUncached(businessId),
    ["business", businessId],
    { tags: [`business-${businessId}`], revalidate: 60 }
  )();
}

export async function getBusinessBySlug(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const { documents } = await databases.listDocuments(
          DATABASE_ID!,
          BUSINESS_COLLECTION_ID!,
          [Query.equal("slug", [slug])]
        );
        return documents[0] ? (parseStringify(documents[0]) as Business) : null;
      } catch (error) {
        console.error("Error fetching business by slug:", error);
        return null;
      }
    },
    ["business-by-slug", slug],
    { tags: [`business-slug-${slug}`], revalidate: 60 }
  )();
}

/** Appwrite document IDs are typically 20-24 characters. */
const APPEWRITE_ID_REGEX = /^[a-f0-9]{20,24}$/i;

/**
 * Get a business by either its Appwrite document ID or its slug (e.g. "atelier-9").
 * Use this for public routes like /b/[businessId] so URLs can use the slug.
 */
export async function getBusinessBySlugOrId(
  identifier: string
): Promise<Business | null> {
  const raw = identifier?.trim().replace(/\s/g, "") ?? "";
  if (!raw) return null;
  if (APPEWRITE_ID_REGEX.test(raw)) return getBusiness(raw);
  return getBusinessBySlug(raw);
}

/**
 * Resolve an admin login identifier to a business ID.
 * Accepts either the Appwrite business $id or the business slug (e.g. "test-salon").
 * Use this so businesses can log in with a memorable slug instead of the long ID.
 */
export async function resolveAdminBusinessId(
  identifier: string
): Promise<{ businessId: string } | { error: string }> {
  const raw = identifier.trim().replace(/\s/g, "");
  if (!raw) return { error: "Please enter your business slug or ID." };

  if (APPEWRITE_ID_REGEX.test(raw)) {
    const business = await getBusiness(raw);
    if (business) return { businessId: business.$id };
    return { error: "Business not found. Check the ID and try again." };
  }

  const business = await getBusinessBySlug(raw);
  if (business) return { businessId: business.$id };
  return { error: "Business not found. Check the slug and try again." };
}

/**
 * Get a business by admin username (for username+password login).
 * adminUsername must be unique across businesses.
 */
export async function getBusinessByAdminUsername(
  username: string
): Promise<Business | null> {
  const raw = username?.trim().toLowerCase() ?? "";
  if (!raw) return null;
  return unstable_cache(
    async () => {
      try {
        const { documents } = await databases.listDocuments(
          DATABASE_ID!,
          BUSINESS_COLLECTION_ID!,
          [Query.equal("adminUsername", [raw])]
        );
        return documents[0] ? (parseStringify(documents[0]) as Business) : null;
      } catch (error) {
        console.error("Error fetching business by adminUsername:", error);
        return null;
      }
    },
    ["business-by-admin-username", raw],
    { tags: [`business-admin-username-${raw}`], revalidate: 60 }
  )();
}
