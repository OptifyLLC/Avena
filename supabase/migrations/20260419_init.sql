-- Avena / Optify Dashboard — initial schema
-- Multi-tenant voice-agent data model with Row-Level Security

set search_path = public;

create extension if not exists "pgcrypto";

------------------------------------------------------------------------------
-- 1. Core tenancy
------------------------------------------------------------------------------
create table tenants (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  vapi_assistant_id     text,
  twilio_phone_number   text,
  created_at            timestamptz not null default now()
);

create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  tenant_id   uuid not null references tenants(id) on delete cascade,
  role        text not null default 'owner' check (role in ('owner','admin','member')),
  full_name   text,
  email       text,
  created_at  timestamptz not null default now()
);
create index profiles_tenant_idx on profiles(tenant_id);

-- Helper: resolve the current user's tenant
create or replace function current_tenant_id() returns uuid
language sql stable security definer set search_path = public as $$
  select tenant_id from profiles where id = auth.uid()
$$;

-- Auto-provision a tenant + profile on signup
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  new_tenant_id uuid;
begin
  insert into tenants (name)
  values (coalesce(new.raw_user_meta_data->>'company', new.email))
  returning id into new_tenant_id;

  insert into profiles (id, tenant_id, full_name, email)
  values (
    new.id,
    new_tenant_id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

------------------------------------------------------------------------------
-- 2. Call + automation data (written by n8n, read by dashboard)
------------------------------------------------------------------------------
create table calls (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references tenants(id) on delete cascade,
  vapi_call_id      text unique,
  caller_phone      text,
  caller_name       text,
  started_at        timestamptz,
  ended_at          timestamptz,
  duration_seconds  integer,
  intent            text,
  outcome           text,
  lead_score        text check (lead_score in ('hot','warm','cold')),
  next_action       text,
  transcript        text,
  summary           text,
  raw_payload       jsonb,
  created_at        timestamptz not null default now()
);
create index calls_tenant_started_idx on calls(tenant_id, started_at desc);

create table appointments (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references tenants(id) on delete cascade,
  call_id           uuid references calls(id) on delete set null,
  google_event_id   text,
  title             text,
  attendee_name     text,
  attendee_phone    text,
  attendee_email    text,
  service           text,
  scheduled_for     timestamptz not null,
  duration_minutes  integer default 30,
  status            text not null default 'confirmed'
                    check (status in ('confirmed','pending','cancelled')),
  created_at        timestamptz not null default now()
);
create index appointments_tenant_time_idx on appointments(tenant_id, scheduled_for desc);

create table leads (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  call_id       uuid references calls(id) on delete set null,
  name          text,
  phone         text,
  email         text,
  company       text,
  score         text check (score in ('hot','warm','cold')),
  notes         text,
  source        text,
  last_call_at  timestamptz,
  created_at    timestamptz not null default now()
);
create index leads_tenant_score_idx on leads(tenant_id, score, last_call_at desc);

create table sms_logs (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  call_id     uuid references calls(id) on delete set null,
  to_phone    text not null,
  body        text,
  status      text,
  sent_at     timestamptz not null default now()
);
create index sms_logs_tenant_idx on sms_logs(tenant_id, sent_at desc);

create table knowledge_base (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  question    text not null,
  answer      text not null,
  created_at  timestamptz not null default now()
);
create index kb_tenant_idx on knowledge_base(tenant_id);

------------------------------------------------------------------------------
-- 3. Google OAuth tokens (per tenant, one row)
------------------------------------------------------------------------------
create table google_tokens (
  tenant_id      uuid primary key references tenants(id) on delete cascade,
  google_email   text,
  access_token   text,
  refresh_token  text,
  scope          text,
  expires_at     timestamptz,
  updated_at     timestamptz not null default now()
);

------------------------------------------------------------------------------
-- 4. Row-Level Security
------------------------------------------------------------------------------
alter table tenants         enable row level security;
alter table profiles        enable row level security;
alter table calls           enable row level security;
alter table appointments    enable row level security;
alter table leads           enable row level security;
alter table sms_logs        enable row level security;
alter table knowledge_base  enable row level security;
alter table google_tokens   enable row level security;

-- Tenants: members can see/update only their tenant row
create policy "members read own tenant" on tenants
  for select using (id = current_tenant_id());
create policy "owners update own tenant" on tenants
  for update using (id = current_tenant_id());

-- Profiles: user sees profiles in their tenant
create policy "read tenant profiles" on profiles
  for select using (tenant_id = current_tenant_id());
create policy "update own profile" on profiles
  for update using (id = auth.uid());

-- Per-tenant data: uniform policy across all business tables
create policy "tenant read" on calls
  for select using (tenant_id = current_tenant_id());
create policy "tenant read" on appointments
  for select using (tenant_id = current_tenant_id());
create policy "tenant read" on leads
  for select using (tenant_id = current_tenant_id());
create policy "tenant read" on sms_logs
  for select using (tenant_id = current_tenant_id());
create policy "tenant read" on knowledge_base
  for select using (tenant_id = current_tenant_id());
create policy "tenant read" on google_tokens
  for select using (tenant_id = current_tenant_id());

-- Knowledge base is editable from the dashboard; everything else is read-only
-- to end users. n8n writes using the service_role key which bypasses RLS.
create policy "tenant write kb" on knowledge_base
  for all using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());
