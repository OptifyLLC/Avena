import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  exchangeCodeForTokens,
  expiresAtFromNow,
  fetchGoogleUserinfo,
} from "@/lib/google-oauth";

const STATE_COOKIE = "google_oauth_state";
const TENANT_COOKIE = "google_oauth_tenant";
const SAFE_GOOGLE_MESSAGES = new Set([
  "account_not_approved",
  "connection_failed",
  "insufficient_permissions",
  "missing_code_or_state",
  "missing_tenant",
  "not_authenticated",
  "oauth_cancelled",
  "save_failed",
  "state_mismatch",
  "tenant_mismatch",
  "token_exchange_failed",
]);

function settingsUrl(
  req: NextRequest,
  status: "connected" | "error",
  message?: string
) {
  const url = new URL("/dashboard/settings", req.url);
  url.searchParams.set("google", status);
  if (message && SAFE_GOOGLE_MESSAGES.has(message)) {
    url.searchParams.set("message", message);
  }
  return url;
}

// Rebuild the response's Location header while preserving any cookies
// (including Supabase session refresh cookies) already attached.
// Always clears the OAuth state/tenant cookies so abandoned or errored flows
// don't leave stale state behind.
function redirectWithCookies(existing: NextResponse, target: URL) {
  const res = NextResponse.redirect(target);
  existing.cookies.getAll().forEach((c) => {
    res.cookies.set(c.name, c.value, c);
  });
  res.cookies.delete(STATE_COOKIE);
  res.cookies.delete(TENANT_COOKIE);
  return res;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const googleError = url.searchParams.get("error");

  if (googleError) {
    const res = NextResponse.redirect(settingsUrl(req, "error", "oauth_cancelled"));
    res.cookies.delete(STATE_COOKIE);
    res.cookies.delete(TENANT_COOKIE);
    return res;
  }

  if (!code || !returnedState) {
    const res = NextResponse.redirect(
      settingsUrl(req, "error", "missing_code_or_state")
    );
    res.cookies.delete(STATE_COOKIE);
    res.cookies.delete(TENANT_COOKIE);
    return res;
  }

  // Create the response up-front so the Supabase client can propagate
  // refreshed session cookies onto it. Without this, the browser loses the
  // session during the OAuth round-trip and the user gets logged out.
  const response = NextResponse.redirect(settingsUrl(req, "connected"));
  const supabase = createRouteClient(req, response);

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    return redirectWithCookies(
      response,
      settingsUrl(req, "error", "not_authenticated")
    );
  }

  const cookieState = req.cookies.get(STATE_COOKIE)?.value;
  const cookieTenant = req.cookies.get(TENANT_COOKIE)?.value;

  if (!cookieState || cookieState !== returnedState) {
    return redirectWithCookies(
      response,
      settingsUrl(req, "error", "state_mismatch")
    );
  }
  if (!cookieTenant) {
    return redirectWithCookies(
      response,
      settingsUrl(req, "error", "missing_tenant")
    );
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("tenant_id, status, role")
    .eq("id", auth.user.id)
    .maybeSingle<{ tenant_id: string; status: string; role: string }>();

  if (!profile?.tenant_id || profile.tenant_id !== cookieTenant) {
    return redirectWithCookies(
      response,
      settingsUrl(req, "error", "tenant_mismatch")
    );
  }

  if (profile.role !== "admin" && profile.status !== "approved") {
    return redirectWithCookies(
      response,
      settingsUrl(req, "error", "account_not_approved")
    );
  }

  let tokens;
  try {
    tokens = await exchangeCodeForTokens(code);
  } catch (err) {
    console.error("Google token exchange failed", err);
    return redirectWithCookies(
      response,
      settingsUrl(req, "error", "token_exchange_failed")
    );
  }

  let email: string | null = null;
  try {
    const info = await fetchGoogleUserinfo(tokens.access_token);
    email = info.email ?? null;
  } catch {
    // non-fatal; still save tokens
  }

  const { error: upsertError } = await admin.from("google_tokens").upsert(
    {
      tenant_id: profile.tenant_id,
      google_email: email,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? null,
      scope: tokens.scope,
      expires_at: expiresAtFromNow(tokens.expires_in),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "tenant_id" }
  );

  if (upsertError) {
    console.error("Saving Google tokens failed", upsertError);
    return redirectWithCookies(response, settingsUrl(req, "error", "save_failed"));
  }

  response.cookies.delete(STATE_COOKIE);
  response.cookies.delete(TENANT_COOKIE);
  return response;
}
