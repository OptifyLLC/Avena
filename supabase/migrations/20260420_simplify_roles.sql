-- Simplify role model: only 'admin' and 'client'.
-- The existing admin row is preserved. Every other profile becomes 'client',
-- and new signups are stamped 'client' by the handle_new_user trigger.

set search_path = public;

------------------------------------------------------------------------------
-- 1. Relax the old check constraint so we can migrate the values
------------------------------------------------------------------------------
alter table profiles drop constraint if exists profiles_role_check;

------------------------------------------------------------------------------
-- 2. Collapse any non-admin role into 'client'
------------------------------------------------------------------------------
update profiles
   set role = 'client'
 where role <> 'admin';

------------------------------------------------------------------------------
-- 3. Reinstate the constraint with the new, narrower set
------------------------------------------------------------------------------
alter table profiles
  add constraint profiles_role_check
  check (role in ('admin', 'client'));

alter table profiles
  alter column role set default 'client';

------------------------------------------------------------------------------
-- 4. New signups land as 'client' / 'pending'
------------------------------------------------------------------------------
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  new_tenant_id uuid;
begin
  insert into tenants (name)
  values (coalesce(new.raw_user_meta_data->>'company', new.email))
  returning id into new_tenant_id;

  insert into profiles (id, tenant_id, full_name, email, role, status)
  values (
    new.id,
    new_tenant_id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    'client',
    'pending'
  );
  return new;
end;
$$;
