-- The ingest endpoint normalizes email to lowercase before insert, so the
-- functional unique index on lower(email) is unnecessary and also prevents
-- PostgREST upsert (ON CONFLICT needs a constraint matching the target
-- column exactly). Replace it with a plain unique constraint on email.

set search_path = public;

drop index if exists newsletter_subscribers_email_key;

alter table newsletter_subscribers
  add constraint newsletter_subscribers_email_key unique (email);
