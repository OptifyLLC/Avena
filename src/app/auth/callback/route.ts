import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";

// Handles Supabase email redirects (email confirmation + password recovery).
// Supabase sends users here with either `?code=...` (PKCE) or
// `?token_hash=...&type=...` (legacy OTP links). We exchange it for a
// session cookie and redirect to `next` (or a sensible default).
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next") || "/dashboard";
  const errorParam = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (errorParam) {
    return NextResponse.redirect(
      errorUrl(req, errorDescription || errorParam)
    );
  }

  if (!code && !tokenHash) {
    return NextResponse.redirect(errorUrl(req, "Missing verification code."));
  }

  const response = NextResponse.redirect(new URL(next, req.url));
  const supabase = createRouteClient(req, response);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(errorUrl(req, error.message));
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as
        | "signup"
        | "email"
        | "recovery"
        | "invite"
        | "magiclink"
        | "email_change",
    });
    if (error) {
      return NextResponse.redirect(errorUrl(req, error.message));
    }
  }

  return response;
}

function errorUrl(req: NextRequest, message: string) {
  const url = new URL("/login", req.url);
  url.searchParams.set("auth_error", message);
  return url;
}
