import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { googleAuthUrl } from "@/lib/google-oauth";

const STATE_COOKIE = "google_oauth_state";
const TENANT_COOKIE = "google_oauth_tenant";
const COOKIE_MAX_AGE_SECONDS = 600;

export async function GET() {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("tenant_id, status, role")
    .eq("id", auth.user.id)
    .maybeSingle<{ tenant_id: string; status: string; role: string }>();

  if (!profile?.tenant_id) {
    return NextResponse.json({ ok: false, error: "No tenant" }, { status: 400 });
  }

  if (profile.role !== "admin" && profile.status !== "approved") {
    return NextResponse.json({ ok: false, error: "Not approved" }, { status: 403 });
  }

  const state = randomBytes(16).toString("hex");
  const res = NextResponse.redirect(googleAuthUrl(state));
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  };
  res.cookies.set(STATE_COOKIE, state, cookieOpts);
  res.cookies.set(TENANT_COOKIE, profile.tenant_id, cookieOpts);
  return res;
}
