"use server";

import { ID } from "node-appwrite";

import {
  CHANGE_REQUEST_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export type CreateChangeRequestParams = {
  businessId: string;
  businessName: string;
  changeType: "services" | "hours" | "pricing" | "other";
  details: string;
  preferredContact?: string;
};

export async function createChangeRequest(
  payload: CreateChangeRequestParams
): Promise<{ error?: string }> {
  if (!CHANGE_REQUEST_COLLECTION_ID) {
    console.error("CHANGE_REQUEST_COLLECTION_ID is not configured.");
    return { error: "Change requests are not configured. Please contact support." };
  }

  try {
    const doc = await databases.createDocument(
      DATABASE_ID!,
      CHANGE_REQUEST_COLLECTION_ID,
      ID.unique(),
      {
        businessId: payload.businessId,
        businessName: payload.businessName,
        changeType: payload.changeType,
        details: payload.details.trim(),
        preferredContact: payload.preferredContact?.trim() || null,
      }
    );
    parseStringify(doc);
    return {};
  } catch (error) {
    console.error("Error creating change request:", error);
    return { error: "We couldn't submit your request. Please try again." };
  }
}

