-- 1. Remove direct client access to google_tokens
drop policy if exists "tenant read" on google_tokens;

-- 2. Create a secure view for the client to read safe columns only
create or replace view google_tokens_public as
select tenant_id, google_email, scope, expires_at, updated_at
from google_tokens
where tenant_id = current_tenant_id() or current_user_role() = 'admin';

-- Make sure the view is accessible from the API
grant select on google_tokens_public to anon, authenticated;

-- 3. Protect sensitive profile columns from client-side updates
create or replace function protect_profile_columns() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if current_user_role() != 'admin' then
    if new.role is distinct from old.role then
      new.role = old.role;
    end if;
    if new.status is distinct from old.status then
      new.status = old.status;
    end if;
    if new.tenant_id is distinct from old.tenant_id then
      new.tenant_id = old.tenant_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_columns_trigger on profiles;
create trigger protect_profile_columns_trigger
  before update on profiles
  for each row execute function protect_profile_columns();

-- 4. Protect sensitive tenant columns from client-side updates
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
  end if;
  return new;
end;
$$;

drop trigger if exists protect_tenant_columns_trigger on tenants;
create trigger protect_tenant_columns_trigger
  before update on tenants
  for each row execute function protect_tenant_columns();
