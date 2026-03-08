"use server";

import { unstable_cache } from "next/cache";
import { Query } from "node-appwrite";

import { Provider } from "@/types/appwrite.types";

import {
  DATABASE_ID,
  PROVIDER_COLLECTION_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

async function getProvidersByBusinessUncached(businessId: string) {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID!,
      PROVIDER_COLLECTION_ID!,
      [Query.equal("businessId", [businessId]), Query.orderAsc("name")]
    );
    return parseStringify(result.documents) as Provider[];
  } catch (error) {
    console.error("Error fetching providers:", error);
    return [];
  }
}

export async function getProvidersByBusiness(businessId: string) {
  return unstable_cache(
    () => getProvidersByBusinessUncached(businessId),
    ["providers", businessId],
    { tags: [`providers-${businessId}`], revalidate: 60 }
  )();
}
