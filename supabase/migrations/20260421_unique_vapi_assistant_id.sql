-- Enforce 1:1 mapping between a Vapi assistant and a tenant.
-- n8n workflows look up the tenant (and therefore which client's Google
-- calendar to use) via tenants.vapi_assistant_id, so a duplicate would
-- route one client's call to another client's credentials.
--
-- Partial unique index so multiple NULLs are allowed (tenants that haven't
-- been paired with an assistant yet).

create unique index if not exists tenants_vapi_assistant_id_uidx
  on public.tenants (vapi_assistant_id)
  where vapi_assistant_id is not null;
