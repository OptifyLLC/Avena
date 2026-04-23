-- Newsletter subscribers captured from the public landing page.
-- Writes come from the n8n workflow (after the Google Sheets append step)
-- via the /api/newsletter/ingest endpoint using the service role key.
-- Reads are admin-only via the /api/admin/newsletter/list endpoint.

set search_path = public;

create table if not exists newsletter_subscribers (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  source       text,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_email_key
  on newsletter_subscribers (lower(email));

create index if not exists newsletter_subscribers_created_at_idx
  on newsletter_subscribers (created_at desc);

alter table newsletter_subscribers enable row level security;

-- No anon/authenticated policies — only the service role (admin client) and
-- the admin dashboard API (which uses the service role) can read or write.
-- Admins querying through the app go through createAdminClient(), which
-- bypasses RLS. Anon/authenticated clients are denied by default.
create policy "admins read newsletter subscribers" on newsletter_subscribers
  for select using (current_user_role() = 'admin');
