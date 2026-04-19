import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ApproveBody = {
  userId: string;
  status: "pending" | "approved" | "rejected" | "unapproved";
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: caller } = await admin
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (!caller || caller.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Admins only" }, { status: 403 });
  }

  let body: ApproveBody;
  try {
    body = (await req.json()) as ApproveBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.userId || !body.status) {
    return NextResponse.json(
      { ok: false, error: "Missing userId or status" },
      { status: 400 }
    );
  }

  const allowed = new Set(["pending", "approved", "rejected", "unapproved"]);
  if (!allowed.has(body.status)) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  const { data: targetProfile, error: targetError } = await admin
    .from("profiles")
    .select("id, tenant_id, status, email")
    .eq("id", body.userId)
    .maybeSingle();

  if (targetError || !targetProfile) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
  }

  let provisionResJson: Record<string, unknown> | null = null;
  let provisionOk = false;

  if (body.status === "approved" && targetProfile.status !== "approved") {
    const webhookUrl = process.env.N8N_PROVISION_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { ok: false, error: "Configuration error: N8N_PROVISION_WEBHOOK_URL is not set" },
        { status: 500 }
      );
    }
    
    try {
      const provisionRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tenant_id: targetProfile.tenant_id,
          email: targetProfile.email,
        }),
      });
      
      provisionOk = provisionRes.ok;
      provisionResJson = (await provisionRes.json().catch(() => ({}))) as Record<string, unknown>;
      
      if (!provisionOk) {
        return NextResponse.json({
          ok: false,
          error: "Provisioning failed before approval",
          details: provisionResJson
        }, { status: 500 });
      }
    } catch (err) {
      return NextResponse.json({
        ok: false,
        error: "Provisioning error before approval",
        details: err instanceof Error ? err.message : String(err)
      }, { status: 500 });
    }
  }

  const patch: Record<string, unknown> = { status: body.status };
  if (body.status === "approved") {
    patch.approved_at = new Date().toISOString();
    patch.approved_by = authData.user.id;
  }

  const { data: updated, error: updateError } = await admin
    .from("profiles")
    .update(patch)
    .eq("id", body.userId)
    .select("id, tenant_id, status")
    .maybeSingle();

  if (updateError || !updated) {
    return NextResponse.json(
      { ok: false, error: updateError?.message ?? "Update failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    profile: updated,
    ...(provisionResJson ? { provision: provisionResJson } : {})
  });
}
