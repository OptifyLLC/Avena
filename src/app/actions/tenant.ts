"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateWorkspaceAction(payload: {
  name: string;
  contact_phone: string | null;
  timezone: string;
  full_name?: string | null;
}) {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    return { ok: false, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id, role, status")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (!profile?.tenant_id) {
    return { ok: false, error: "No associated profile found" };
  }

  if (profile.role !== "admin" && profile.status !== "approved") {
    return { ok: false, error: "Insufficient permissions to update workspace" };
  }

  const { error: tenantError } = await supabase
    .from("tenants")
    .update({
      name: payload.name.trim(),
      contact_phone: payload.contact_phone?.trim() || null,
      timezone: payload.timezone,
    })
    .eq("id", profile.tenant_id);

  if (tenantError) {
    return { ok: false, error: tenantError.message };
  }

  if (payload.full_name !== undefined) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: payload.full_name?.trim() || null })
      .eq("id", auth.user.id);

    if (profileError) {
      return { ok: false, error: profileError.message };
    }
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");

  return { ok: true };
}
