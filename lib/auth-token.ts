import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_SECONDS = 120; // 2 minutes
const ADMIN_COOKIE_NAME = "lds-admin-business-id";

function getSecret(): string {
  const secret = process.env.LDS_AUTH_SECRET || process.env.PROJECT_ID;
  if (!secret) throw new Error("LDS_AUTH_SECRET or PROJECT_ID must be set for admin auth");
  return secret;
}

/** Create a signed one-time auth token for admin access. */
export function createAdminAuthToken(businessId: string): string {
  const secret = getSecret();
  const expiry = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = `${businessId}:${expiry}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

/** Verify token and return businessId, or null if invalid. */
export function verifyAdminAuthToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [businessId, expiryStr, sig] = decoded.split(":");
    if (!businessId || !expiryStr || !sig) return null;
    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry) || Date.now() / 1000 > expiry) return null;
    const payload = `${businessId}:${expiryStr}`;
    const expectedSig = createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expectedSig, "hex"))) return null;
    return businessId;
  } catch {
    return null;
  }
}

export { ADMIN_COOKIE_NAME };
