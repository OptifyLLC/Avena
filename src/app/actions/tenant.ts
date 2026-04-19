"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateWorkspaceAction(payload: {
  name: string;
  contact_phone: string | null;
  timezone: string;
}) {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth.user) {
    return { ok: false, error: "Not authenticated" };
  }

  // The client uses the anon key using `createClient()`, which enforces RLS.
  // Profiles "read" RLS: user can see profiles in their tenant.
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

  const { error } = await supabase
    .from("tenants")
    .update({
      name: payload.name.trim(),
      contact_phone: payload.contact_phone?.trim() || null,
      timezone: payload.timezone,
    })
    .eq("id", profile.tenant_id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  
  return { ok: true };
}
