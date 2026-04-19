-- Per-tenant settings: timezone + editable business profile fields.
-- Timezone is used by the Vapi/n8n voice-agent stack (Nodes A, B, C) for
-- all calendar math so "2pm" from a caller is interpreted in the tenant's zone.

alter table tenants
  add column if not exists timezone text not null default 'America/New_York',
  add column if not exists contact_email text,
  add column if not exists contact_phone text,
  add column if not exists voice_agent_name text;

-- Let tenant members update their own row (owner/admin check happens in app).
drop policy if exists "owners update own tenant" on tenants;
create policy "tenant members update own tenant" on tenants
  for update using (id = current_tenant_id())
  with check (id = current_tenant_id());
