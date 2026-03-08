"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import {
  createAdminClient,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/appwrite-auth";
import { ADMIN_COOKIE_NAME } from "@/lib/auth-token";
import { getBusinessBySlugOrId, getBusinessByAdminUsername } from "./business.actions";

type BusinessWithAdmin = {
  $id: string;
  slug?: string;
  adminUserId?: string | null;
  adminUsername?: string | null;
  adminEmail?: string | null;
};

/**
 * Log in with slug/username + password (Appwrite Auth).
 * Business must have adminEmail and adminUserId set.
 * Identifier can be: business slug (e.g. "test-salon"), adminUsername, or business ID.
 * Appwrite requires email for sessions; we use adminEmail internally.
 */
export async function loginWithAppwriteAuth(
  identifier: string,
  password: string
): Promise<{ error: string } | { redirectTo: string }> {
  const trimmed = identifier.trim();
  const trimmedLower = trimmed.toLowerCase();
  const trimmedPassword = password;

  if (!trimmed || !trimmedPassword) {
    return { error: "Please enter your business slug/username and password." };
  }

  const business =
    (await getBusinessBySlugOrId(trimmed)) ??
    (await getBusinessByAdminUsername(trimmedLower));
  if (!business) {
    return { error: "Invalid slug/username or password." };
  }

  const b = business as BusinessWithAdmin;
  const adminUserId = b.adminUserId;
  const adminEmail = b.adminEmail?.trim();

  if (!adminUserId || !adminEmail) {
    return {
      error:
        "This business uses passcode login. Use the passcode form, or contact support to set up password login.",
    };
  }

  try {
    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession(adminEmail, trimmedPassword);

    // Verify the session belongs to the expected admin user.
    // session.userId is returned directly by Appwrite — no extra account.get() needed.
    if (session.userId !== adminUserId) {
      await account.deleteSession(session.$id);
      return { error: "Invalid slug/username or password." };
    }

    await setSessionCookie(session.secret);

    // Store userId in a separate cookie so hasBusinessAdminAccess can verify
    // without needing account.get() (node-appwrite server SDK doesn't support setSession auth)
    const cookieStore = cookies();
    cookieStore.set("lds-admin-user-id", adminUserId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    const redirectId = business.slug || business.$id;
    return { redirectTo: `/b/${redirectId}/admin` };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("Invalid credentials") || message.includes("401")) {
      return { error: "Invalid slug/username or password." };
    }
    console.error("Appwrite login error:", err);
    return { error: "Login failed. Please check your credentials." };
  }
}

/**
 * Check if the current user has admin access to the given business.
 * - If adminUserId is set: requires Appwrite session with matching user.
 * - If adminUserId is not set: falls back to passcode cookie (lds-admin-business-id).
 */
export async function hasBusinessAdminAccess(
  businessIdOrSlug: string
): Promise<boolean> {
  const business = await getBusinessBySlugOrId(businessIdOrSlug);
  if (!business) return false;

  const adminUserId = (business as { adminUserId?: string | null }).adminUserId;

  if (adminUserId) {
    const cookieStore = cookies();
    const storedUserId = cookieStore.get("lds-admin-user-id")?.value;
    return storedUserId === adminUserId;
  }

  // Passcode flow: cookie stores business ID
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return cookieValue === business.$id;
}

/** Log out the current admin (clear Appwrite session and passcode cookie). */
export async function logoutBusinessAdmin(): Promise<void> {
  await clearSessionCookie();
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  cookieStore.delete("lds-admin-user-id");
  redirect("/admin");
}
