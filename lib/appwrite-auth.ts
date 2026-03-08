import { Account, Client } from "node-appwrite";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "lds-appwrite-session";

function getEndpoint() {
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
  if (!endpoint) throw new Error("NEXT_PUBLIC_ENDPOINT must be set");
  return endpoint;
}

function getProjectId() {
  const id = process.env.PROJECT_ID;
  if (!id) throw new Error("PROJECT_ID must be set");
  return id;
}

/** Admin client for creating users and sessions (uses API key). */
export function createAdminClient() {
  const key = process.env.API_KEY;
  if (!key) throw new Error("API_KEY must be set");
  const client = new Client()
    .setEndpoint(getEndpoint())
    .setProject(getProjectId())
    .setKey(key);
  return {
    get account() {
      return new Account(client);
    },
  };
}

/** Session client for verifying logged-in users (uses session cookie). */
export async function createSessionClient() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) {
    return null;
  }
  const client = new Client()
    .setEndpoint(getEndpoint())
    .setProject(getProjectId())
    .setSession(sessionCookie.value);
  return {
    get account() {
      return new Account(client);
    },
  };
}

/** Get the currently logged-in user, or null. */
export async function getLoggedInUser() {
  try {
    const sessionClient = await createSessionClient();
    if (!sessionClient) return null;
    const user = await sessionClient.account.get();
    return user;
  } catch {
    return null;
  }
}

/** Set the session cookie (call after successful login). */
export async function setSessionCookie(sessionSecret: string) {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionSecret, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** Clear the session cookie (logout). */
export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export { SESSION_COOKIE_NAME };
