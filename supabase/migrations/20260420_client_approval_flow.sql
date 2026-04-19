-- Client approval workflow.
-- New signups start with status='pending'. An admin approves them, which
-- also provisions a dedicated tab in the master Google Sheet for their
-- call logs (handled by the n8n Provision Client Tab workflow).

set search_path = public;

------------------------------------------------------------------------------
-- 1. Per-tenant sheet tab name (nullable — set by the provision workflow)
------------------------------------------------------------------------------
alter table tenants
  add column if not exists sheet_tab_name text;

------------------------------------------------------------------------------
-- 2. Approval status on profiles
------------------------------------------------------------------------------
alter table profiles
  add column if not exists status text not null default 'pending'
    check (status in ('pending','approved','rejected','unapproved')),
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references profiles(id) on delete set null;

create index if not exists profiles_status_idx on profiles(status);

------------------------------------------------------------------------------
-- 3. Helper: current user's role (security-definer to avoid RLS recursion)
------------------------------------------------------------------------------
create or replace function current_user_role() returns text
language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid()
$$;

------------------------------------------------------------------------------
-- 4. Signup trigger: keep default tenant creation but stamp status='pending'
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
    'owner',
    'pending'
  );
  return new;
end;
$$;

------------------------------------------------------------------------------
-- 5. Widen RLS so admins can see pending signups across all tenants
------------------------------------------------------------------------------
-- Tenants: admins see all, members see own
drop policy if exists "members read own tenant" on tenants;
drop policy if exists "tenant members update own tenant" on tenants;
drop policy if exists "owners update own tenant" on tenants;

create policy "read tenants" on tenants
  for select using (
    id = current_tenant_id()
    or current_user_role() = 'admin'
  );

create policy "update tenants" on tenants
  for update using (
    id = current_tenant_id()
    or current_user_role() = 'admin'
  )
  with check (
    id = current_tenant_id()
    or current_user_role() = 'admin'
  );

-- Profiles: admins see + update all, members see + update own tenant/self
drop policy if exists "read tenant profiles" on profiles;
drop policy if exists "update own profile" on profiles;

create policy "read profiles" on profiles
  for select using (
    tenant_id = current_tenant_id()
    or current_user_role() = 'admin'
  );

create policy "update profiles" on profiles
  for update using (
    id = auth.uid()
    or current_user_role() = 'admin'
  )
  with check (
    id = auth.uid()
    or current_user_role() = 'admin'
  );
