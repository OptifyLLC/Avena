import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
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

  const { data, error } = await admin
    .from("newsletter_subscribers")
    .select("id, email, source, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("newsletter list failed", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, subscribers: data });
}
