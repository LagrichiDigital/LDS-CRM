"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Client } from "@/types/appwrite.types";

import {
  CLIENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

/** Create a client from appointment guest details. */
export async function createClientFromAppointment({
  businessId,
  name,
  email,
  phone,
}: {
  businessId: string;
  name: string;
  email: string;
  phone: string;
}) {
  if (!CLIENT_COLLECTION_ID) {
    console.warn("CLIENT_COLLECTION_ID not set; client profiles unavailable.");
    return null;
  }
  try {
    const client = await databases.createDocument(
      DATABASE_ID!,
      CLIENT_COLLECTION_ID,
      ID.unique(),
      { businessId, name, email, phone }
    );
    revalidatePath(`/b/${businessId}/admin`);
    revalidatePath(`/b/${businessId}/admin/clients`);
    return parseStringify(client) as Client;
  } catch (error) {
    console.error("Error creating client:", error);
    return null;
  }
}

/** Get all clients for a business. */
export async function getClientsByBusiness(businessId: string): Promise<Client[]> {
  if (!CLIENT_COLLECTION_ID) return [];
  try {
    const { documents } = await databases.listDocuments(
      DATABASE_ID!,
      CLIENT_COLLECTION_ID,
      [
        Query.equal("businessId", [businessId]),
        Query.orderDesc("$createdAt"),
      ]
    );
    return parseStringify(documents) as Client[];
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

/** Get a single client by ID. */
export async function getClient(clientId: string): Promise<Client | null> {
  if (!CLIENT_COLLECTION_ID) return null;
  try {
    const doc = await databases.getDocument(
      DATABASE_ID!,
      CLIENT_COLLECTION_ID,
      clientId
    );
    return parseStringify(doc) as Client;
  } catch (error) {
    console.error("Error fetching client:", error);
    return null;
  }
}

/** Update client notes. */
export async function updateClientNotes(
  clientId: string,
  businessId: string,
  notes: string
) {
  if (!CLIENT_COLLECTION_ID) return null;
  try {
    const updated = await databases.updateDocument(
      DATABASE_ID!,
      CLIENT_COLLECTION_ID,
      clientId,
      { notes: notes.trim() || null }
    );
    revalidatePath(`/b/${businessId}/admin`);
    revalidatePath(`/b/${businessId}/admin/clients`);
    revalidatePath(`/b/${businessId}/admin/clients/${clientId}`);
    return parseStringify(updated) as Client;
  } catch (error) {
    console.error("Error updating client notes:", error);
    return null;
  }
}
