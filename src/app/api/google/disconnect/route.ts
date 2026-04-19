import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revokeGoogleToken } from "@/lib/google-oauth";

export async function POST() {
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

  if (profile.status !== "approved") {
    return NextResponse.json({ ok: false, error: "Account not approved" }, { status: 403 });
  }

  if (profile.role !== "admin" && profile.role !== "owner") {
    return NextResponse.json({ ok: false, error: "Insufficient permissions" }, { status: 403 });
  }

  const { data: row } = await admin
    .from("google_tokens")
    .select("refresh_token, access_token")
    .eq("tenant_id", profile.tenant_id)
    .maybeSingle<{ refresh_token: string | null; access_token: string | null }>();

  const tokenToRevoke = row?.refresh_token ?? row?.access_token;
  if (tokenToRevoke) {
    try {
      await revokeGoogleToken(tokenToRevoke);
    } catch {
      // best-effort; continue to delete the row
    }
  }

  const { error: deleteError } = await admin
    .from("google_tokens")
    .delete()
    .eq("tenant_id", profile.tenant_id);

  if (deleteError) {
    return NextResponse.json({ ok: false, error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
