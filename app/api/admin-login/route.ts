import { NextRequest, NextResponse } from "next/server";

import { getBusiness, resolveAdminBusinessId } from "@/lib/actions/business.actions";
import { createAdminAuthToken } from "@/lib/auth-token";

/**
 * POST /api/admin-login
 * Form body: identifier (slug or ID), passcode
 * On success: sets cookie and redirects to /b/[slug]/admin
 * On error: redirects back to /admin with error in query param
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const identifier = (formData.get("identifier") as string)?.trim() ?? "";
    const passcode = (formData.get("passcode") as string)?.trim() ?? "";

    if (!identifier || !passcode) {
      return NextResponse.redirect(
        new URL("/admin?error=Please+enter+both+slug+and+passcode", request.url),
        302
      );
    }

    const resolved = await resolveAdminBusinessId(identifier);
    if ("error" in resolved) {
      return NextResponse.redirect(
        new URL(`/admin?error=${encodeURIComponent(resolved.error)}`, request.url),
        302
      );
    }

    const business = await getBusiness(resolved.businessId);
    if (!business) {
      return NextResponse.redirect(
        new URL("/admin?error=Business+not+found", request.url),
        302
      );
    }

    const expected = (business as { adminPasscode?: string }).adminPasscode?.trim();
    if (!expected) {
      return NextResponse.redirect(
        new URL("/admin?error=Admin+access+not+configured", request.url),
        302
      );
    }

    if (passcode !== expected) {
      return NextResponse.redirect(
        new URL("/admin?error=Invalid+passcode", request.url),
        302
      );
    }

    const redirectId = business.slug || business.$id;
    const token = createAdminAuthToken(business.$id);
    const callbackUrl = new URL("/api/admin-auth-callback", request.url);
    callbackUrl.searchParams.set("token", token);
    callbackUrl.searchParams.set("redirect", `/b/${redirectId}/admin`);

    return NextResponse.redirect(callbackUrl, 302);
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.redirect(
      new URL("/admin?error=Something+went+wrong", request.url),
      302
    );
  }
}
