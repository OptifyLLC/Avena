import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  exchangeCodeForTokens,
  expiresAtFromNow,
  fetchGoogleUserinfo,
} from "@/lib/google-oauth";

const STATE_COOKIE = "google_oauth_state";
const TENANT_COOKIE = "google_oauth_tenant";

function redirectToSettings(origin: string, status: "connected" | "error", message?: string) {
  const url = new URL("/dashboard/settings", origin);
  url.searchParams.set("google", status);
  if (message) url.searchParams.set("message", message);
  return NextResponse.redirect(url);
}

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const googleError = url.searchParams.get("error");

  if (googleError) {
    return redirectToSettings(origin, "error", googleError);
  }

  if (!code || !returnedState) {
    return redirectToSettings(origin, "error", "missing_code_or_state");
  }

  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    return redirectToSettings(origin, "error", "not_authenticated");
  }

  const cookieState = req.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${STATE_COOKIE}=`))
    ?.split("=")[1];
  const cookieTenant = req.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${TENANT_COOKIE}=`))
    ?.split("=")[1];

  if (!cookieState || cookieState !== returnedState) {
    return redirectToSettings(origin, "error", "state_mismatch");
  }
  if (!cookieTenant) {
    return redirectToSettings(origin, "error", "missing_tenant");
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("tenant_id, role")
    .eq("id", auth.user.id)
    .maybeSingle<{ tenant_id: string; role: string }>();

  if (!profile?.tenant_id || profile.tenant_id !== cookieTenant) {
    return redirectToSettings(origin, "error", "tenant_mismatch");
  }

  let tokens;
  try {
    tokens = await exchangeCodeForTokens(code);
  } catch (err) {
    return redirectToSettings(
      origin,
      "error",
      err instanceof Error ? err.message : "token_exchange_failed"
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
    return redirectToSettings(origin, "error", upsertError.message);
  }

  const res = redirectToSettings(origin, "connected");
  res.cookies.delete(STATE_COOKIE);
  res.cookies.delete(TENANT_COOKIE);
  return res;
}
