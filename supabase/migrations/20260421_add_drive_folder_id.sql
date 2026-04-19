-- Per-tenant Google Drive folder for call recordings + transcripts.
-- Set by the n8n Provision Client workflow after folder creation.

set search_path = public;

alter table tenants
  add column if not exists drive_folder_id text;

-- Extend the existing tenant column guard to also lock drive_folder_id
-- against client-side updates (written once by the provision workflow
-- via the service role key, like sheet_tab_name).
create or replace function protect_tenant_columns() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if current_user_role() != 'admin' then
    if new.vapi_assistant_id is distinct from old.vapi_assistant_id then
      new.vapi_assistant_id = old.vapi_assistant_id;
    end if;
    if new.twilio_phone_number is distinct from old.twilio_phone_number then
      new.twilio_phone_number = old.twilio_phone_number;
    end if;
    if new.sheet_tab_name is distinct from old.sheet_tab_name then
      new.sheet_tab_name = old.sheet_tab_name;
    end if;
    if new.drive_folder_id is distinct from old.drive_folder_id then
      new.drive_folder_id = old.drive_folder_id;
    end if;
  end if;
  return new;
end;
$$;
