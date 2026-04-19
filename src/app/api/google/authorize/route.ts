import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";
import { createAdminClient } from "@/lib/supabase/admin";
import { googleAuthUrl } from "@/lib/google-oauth";

const STATE_COOKIE = "google_oauth_state";
const TENANT_COOKIE = "google_oauth_tenant";
const COOKIE_MAX_AGE_SECONDS = 600;

export async function GET(req: NextRequest) {
  const state = randomBytes(16).toString("hex");
  const response = NextResponse.redirect(googleAuthUrl(state));
  const supabase = createRouteClient(req, response);

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", "/dashboard/settings");
    return NextResponse.redirect(loginUrl);
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("tenant_id, status, role")
    .eq("id", auth.user.id)
    .maybeSingle<{ tenant_id: string; status: string; role: string }>();

  if (!profile?.tenant_id) {
    return redirectToSettingsError(req, response, "missing_tenant");
  }

  if (profile.role !== "admin" && profile.status !== "approved") {
    return redirectToSettingsError(req, response, "account_not_approved");
  }

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  };
  response.cookies.set(STATE_COOKIE, state, cookieOpts);
  response.cookies.set(TENANT_COOKIE, profile.tenant_id, cookieOpts);
  return response;
}

function redirectToSettingsError(
  req: NextRequest,
  sessionResponse: NextResponse,
  message: string
) {
  const url = new URL("/dashboard/settings", req.url);
  url.searchParams.set("google", "error");
  url.searchParams.set("message", message);
  const res = NextResponse.redirect(url);
  sessionResponse.cookies.getAll().forEach((c) => {
    res.cookies.set(c.name, c.value, c);
  });
  return res;
}
