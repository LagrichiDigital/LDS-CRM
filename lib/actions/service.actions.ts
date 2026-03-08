"use server";

import { unstable_cache } from "next/cache";
import { Query } from "node-appwrite";

import { Service } from "@/types/appwrite.types";

import {
  DATABASE_ID,
  SERVICE_COLLECTION_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

async function getServicesByBusinessUncached(businessId: string) {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID!,
      SERVICE_COLLECTION_ID!,
      [Query.equal("businessId", [businessId]), Query.orderAsc("name")]
    );
    return parseStringify(result.documents) as Service[];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export async function getServicesByBusiness(businessId: string) {
  return unstable_cache(
    () => getServicesByBusinessUncached(businessId),
    ["services", businessId],
    { tags: [`services-${businessId}`], revalidate: 60 }
  )();
}

export async function getService(serviceId: string) {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID!,
      SERVICE_COLLECTION_ID!,
      serviceId
    );
    return parseStringify(doc) as Service;
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}
