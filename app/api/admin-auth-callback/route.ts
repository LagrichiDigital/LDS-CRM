import { NextRequest, NextResponse } from "next/server";

import { verifyAdminAuthToken, ADMIN_COOKIE_NAME } from "@/lib/auth-token";

/**
 * GET /api/admin-auth-callback?token=xxx&redirect=/b/test-salon/admin
 * Verifies the one-time auth token, sets the admin cookie, and redirects.
 * Used after login to set the cookie in a normal GET request (avoids redirect+cookie issues).
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/admin";

  if (!token) {
    return NextResponse.redirect(new URL("/admin?error=Invalid+link", request.url), 302);
  }

  const businessId = verifyAdminAuthToken(token);
  if (!businessId) {
    return NextResponse.redirect(new URL("/admin?error=Link+expired+or+invalid", request.url), 302);
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url), 302);
  response.cookies.set(ADMIN_COOKIE_NAME, businessId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
