-- The google_tokens_public view in 20260420_tighten_rls.sql defaulted to
-- security_invoker = true in modern Supabase, so it inherited RLS from
-- google_tokens. Since we dropped the SELECT policy on google_tokens in that
-- same migration, the view returned 0 rows for every authenticated user —
-- the settings page couldn't tell that Google Calendar was connected even
-- though the row existed.
--
-- Recreate the view with security_invoker = off so it runs as the view owner
-- (postgres) and bypasses RLS on google_tokens. Tenant isolation is still
-- enforced by the view's own WHERE clause, which uses auth.uid() via
-- current_tenant_id() / current_user_role() and therefore still reflects the
-- authenticated caller.

drop view if exists google_tokens_public;

create view google_tokens_public
with (security_invoker = off) as
select tenant_id, google_email, scope, expires_at, updated_at
from google_tokens
where tenant_id = current_tenant_id() or current_user_role() = 'admin';

grant select on google_tokens_public to anon, authenticated;
