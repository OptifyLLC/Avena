-- Extend google_tokens_public so admins can see whether each tenant still has
-- a usable refresh_token without exposing the token value itself. Used by the
-- admin Clients page to flag "reconnect needed" rows.

drop view if exists google_tokens_public;

create view google_tokens_public
with (security_invoker = off) as
select
  tenant_id,
  google_email,
  scope,
  expires_at,
  updated_at,
  (refresh_token is not null) as has_refresh_token
from google_tokens
where tenant_id = current_tenant_id() or current_user_role() = 'admin';

grant select on google_tokens_public to anon, authenticated;
