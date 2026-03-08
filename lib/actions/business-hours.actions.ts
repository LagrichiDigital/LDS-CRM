"use server";

import { Query } from "node-appwrite";

import {
  DATABASE_ID,
  BUSINESS_HOURS_COLLECTION_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export type BusinessHours = {
  businessId: string;
  /** 0 = Sunday, 1 = Monday, ... 6 = Saturday */
  dayOfWeek: number;
  isClosed: boolean;
  /** 24h time string, e.g. "09:00" */
  openTime: string;
  /** 24h time string, e.g. "17:30" */
  closeTime: string;
};

export async function getBusinessHoursByBusiness(
  businessId: string
): Promise<BusinessHours[]> {
  if (!BUSINESS_HOURS_COLLECTION_ID) return [];

  try {
    const result = await databases.listDocuments(
      DATABASE_ID!,
      BUSINESS_HOURS_COLLECTION_ID,
      [Query.equal("businessId", [businessId])]
    );
    return parseStringify(result.documents) as BusinessHours[];
  } catch (error) {
    console.error("Error fetching business hours:", error);
    return [];
  }
}

