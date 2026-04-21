import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  expiresAtFromNow,
  refreshGoogleAccessToken,
} from "@/lib/google-oauth";

// Refresh window: refresh if the current token expires in under 5 minutes.
const REFRESH_WINDOW_MS = 5 * 60 * 1000;

type TokenRow = {
  tenant_id: string;
  google_email: string | null;
  access_token: string | null;
  refresh_token: string | null;
  scope: string | null;
  expires_at: string | null;
};

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

function bad(reason: string, status = 400) {
  return NextResponse.json({ ok: false, error: reason }, { status });
}

export async function POST(req: NextRequest) {
  const sharedSecret = process.env.N8N_SHARED_SECRET;
  if (!sharedSecret) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: N8N_SHARED_SECRET not set" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const presented = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  if (presented !== sharedSecret) {
    return unauthorized();
  }

  let body: { tenant_id?: string; assistant_id?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return bad("Invalid JSON body");
  }

  if (!body.tenant_id && !body.assistant_id) {
    return bad("Provide tenant_id or assistant_id");
  }

  const admin = createAdminClient();

  // Resolve tenant_id via vapi_assistant_id if that's what n8n sent.
  let tenantId = body.tenant_id;
  if (!tenantId && body.assistant_id) {
    const { data: tenant, error: tenantErr } = await admin
      .from("tenants")
      .select("id")
      .eq("vapi_assistant_id", body.assistant_id)
      .maybeSingle<{ id: string }>();
    if (tenantErr) {
      console.error("tenant lookup failed", tenantErr);
      return bad("Tenant lookup failed", 500);
    }
    if (!tenant) {
      return NextResponse.json(
        {
          ok: true,
          hasCalendar: false,
          result: "No tenant found for this assistant.",
        },
        { status: 200 }
      );
    }
    tenantId = tenant.id;
  }

  const { data: row, error: rowErr } = await admin
    .from("google_tokens")
    .select("tenant_id, google_email, access_token, refresh_token, scope, expires_at")
    .eq("tenant_id", tenantId!)
    .maybeSingle<TokenRow>();

  if (rowErr) {
    console.error("google_tokens read failed", rowErr);
    return bad("Token lookup failed", 500);
  }

  if (!row || !row.access_token) {
    return NextResponse.json({
      ok: true,
      hasCalendar: false,
      tenant_id: tenantId,
      result:
        "This business has not connected their calendar yet. I will pass your request to the team.",
    });
  }

  const now = Date.now();
  const expiresAtMs = row.expires_at ? new Date(row.expires_at).getTime() : 0;
  const needsRefresh = !expiresAtMs || expiresAtMs - now < REFRESH_WINDOW_MS;

  if (!needsRefresh) {
    return NextResponse.json({
      ok: true,
      hasCalendar: true,
      tenant_id: tenantId,
      access_token: row.access_token,
      expires_at: row.expires_at,
      google_email: row.google_email,
      scope: row.scope,
      refreshed: false,
    });
  }

  if (!row.refresh_token) {
    return NextResponse.json({
      ok: true,
      hasCalendar: false,
      tenant_id: tenantId,
      result:
        "Calendar token expired and cannot be refreshed. Please ask the business to reconnect Google Calendar.",
    });
  }

  let refreshed;
  try {
    refreshed = await refreshGoogleAccessToken(row.refresh_token);
  } catch (err) {
    console.error("Google refresh failed", err);
    return NextResponse.json({
      ok: true,
      hasCalendar: false,
      tenant_id: tenantId,
      result:
        "Calendar token refresh failed. Please ask the business to reconnect Google Calendar.",
    });
  }

  const newExpiresAt = expiresAtFromNow(refreshed.expires_in);

  const { error: updateErr } = await admin
    .from("google_tokens")
    .update({
      access_token: refreshed.access_token,
      scope: refreshed.scope ?? row.scope,
      expires_at: newExpiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq("tenant_id", tenantId!);

  if (updateErr) {
    console.error("google_tokens update failed", updateErr);
    // Still return the fresh token so the call can proceed.
  }

  return NextResponse.json({
    ok: true,
    hasCalendar: true,
    tenant_id: tenantId,
    access_token: refreshed.access_token,
    expires_at: newExpiresAt,
    google_email: row.google_email,
    scope: refreshed.scope ?? row.scope,
    refreshed: true,
  });
}
