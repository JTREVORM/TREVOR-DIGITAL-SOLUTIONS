-- ============================================================================
-- 0005 — Newsletter: subscribers, issues, send history
--
-- Idempotent: safe to run more than once.
--
-- The shape of this schema follows one rule: the public never touches these
-- tables directly. Anonymous visitors get EXECUTE on two SECURITY DEFINER
-- functions (subscribe, unsubscribe) and no table grants at all, so there is
-- no policy to get wrong and no way to read the list back. Staff reach the
-- tables normally, filtered by the same role helpers as the rest of the CMS.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- One definition of "normalised", used by the constraint, the subscribe
-- function and the unsubscribe function, so they can never disagree.
create or replace function public.normalize_email(p_email text)
returns text
language sql
immutable
as $$
  select lower(btrim(coalesce(p_email, '')));
$$;

-- Deliberately permissive. The authority on whether an address works is
-- whether mail to it is accepted; this only rejects what is obviously not an
-- address, so a valid-but-unusual mailbox is never silently refused.
create or replace function public.is_valid_email(p_email text)
returns boolean
language sql
immutable
as $$
  select p_email ~ '^[^@\s]+@[^@\s.]+\.[^@\s]+$'
     and length(p_email) between 6 and 320;
$$;

-- ---------------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------------

create table if not exists public.newsletter_subscribers (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null unique,
  status             text not null default 'active',
  source             text not null default 'website',
  -- Lets a newsletter link to an unsubscribe page without putting a guessable
  -- address in the URL.
  unsubscribe_token  uuid not null default gen_random_uuid() unique,
  subscribed_at      timestamptz not null default now(),
  unsubscribed_at    timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint newsletter_subscribers_status_check
    check (status in ('active', 'unsubscribed')),
  -- Normalisation is enforced by the database, not only by the function that
  -- happens to write today. Two spellings of one address cannot both exist.
  constraint newsletter_subscribers_email_normalized
    check (email = public.normalize_email(email)),
  constraint newsletter_subscribers_email_valid
    check (public.is_valid_email(email))
);

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);
create index if not exists newsletter_subscribers_subscribed_at_idx
  on public.newsletter_subscribers (subscribed_at desc);
create index if not exists newsletter_subscribers_email_idx
  on public.newsletter_subscribers (email text_pattern_ops);

drop trigger if exists newsletter_subscribers_set_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_set_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- newsletters — one row per issue
-- ---------------------------------------------------------------------------

create table if not exists public.newsletters (
  id               uuid primary key default gen_random_uuid(),
  subject          text not null,
  preview_text     text not null default '',
  content_html     text not null default '',
  category         text,
  status           text not null default 'draft',
  sent_at          timestamptz,
  recipient_count  integer not null default 0,
  last_error       text,
  created_by       uuid references auth.users (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint newsletters_status_check
    check (status in ('draft', 'sending', 'sent', 'failed'))
);

create index if not exists newsletters_status_idx on public.newsletters (status);
create index if not exists newsletters_created_at_idx
  on public.newsletters (created_at desc);

drop trigger if exists newsletters_set_updated_at on public.newsletters;
create trigger newsletters_set_updated_at
  before update on public.newsletters
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- newsletter_sends — an append-only log of every send attempt
--
-- Written only by the Edge Function (service role). Nothing in the CMS may
-- insert here, so the history cannot be edited to look better than it was.
-- ---------------------------------------------------------------------------

create table if not exists public.newsletter_sends (
  id               uuid primary key default gen_random_uuid(),
  newsletter_id    uuid references public.newsletters (id) on delete cascade,
  kind             text not null default 'broadcast',
  status           text not null default 'success',
  recipient_count  integer not null default 0,
  succeeded        integer not null default 0,
  failed           integer not null default 0,
  -- Only ever set for a test send, where the address is the admin's own.
  test_recipient   text,
  error            text,
  sent_by          uuid references auth.users (id) on delete set null,
  created_at       timestamptz not null default now(),
  constraint newsletter_sends_kind_check check (kind in ('test', 'broadcast')),
  constraint newsletter_sends_status_check
    check (status in ('success', 'partial', 'failed'))
);

create index if not exists newsletter_sends_newsletter_idx
  on public.newsletter_sends (newsletter_id, created_at desc);
create index if not exists newsletter_sends_created_at_idx
  on public.newsletter_sends (created_at desc);

-- ---------------------------------------------------------------------------
-- newsletter_signup_attempts — abuse protection for the public form
--
-- RLS on with no policies at all: unreachable by anon and by authenticated.
-- Only the SECURITY DEFINER subscribe function and the service role touch it.
-- ---------------------------------------------------------------------------

create table if not exists public.newsletter_signup_attempts (
  id          bigserial primary key,
  client_key  text not null,
  created_at  timestamptz not null default now()
);

create index if not exists newsletter_signup_attempts_key_idx
  on public.newsletter_signup_attempts (client_key, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.newsletter_subscribers      enable row level security;
alter table public.newsletters                 enable row level security;
alter table public.newsletter_sends            enable row level security;
alter table public.newsletter_signup_attempts  enable row level security;

-- subscribers: staff read and update, admins delete, the public never.
drop policy if exists newsletter_subscribers_staff_read on public.newsletter_subscribers;
create policy newsletter_subscribers_staff_read on public.newsletter_subscribers
  for select to authenticated
  using (public.is_editor());

drop policy if exists newsletter_subscribers_staff_update on public.newsletter_subscribers;
create policy newsletter_subscribers_staff_update on public.newsletter_subscribers
  for update to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists newsletter_subscribers_admin_delete on public.newsletter_subscribers;
create policy newsletter_subscribers_admin_delete on public.newsletter_subscribers
  for delete to authenticated
  using (public.is_admin());

-- There is deliberately no INSERT policy. Subscribing goes through
-- public.subscribe_to_newsletter(), which normalises, validates and
-- rate-limits, and a staff member adding someone by hand takes the same route.

-- newsletters: editors author, admins delete.
drop policy if exists newsletters_staff_read on public.newsletters;
create policy newsletters_staff_read on public.newsletters
  for select to authenticated
  using (public.is_editor());

drop policy if exists newsletters_staff_insert on public.newsletters;
create policy newsletters_staff_insert on public.newsletters
  for insert to authenticated
  with check (public.is_editor() and status = 'draft');

-- Staff may edit an issue while it is a draft or after a failure. Once a send
-- is in flight or complete the row is the record of what went out, and only
-- the Edge Function's service role may move it on.
drop policy if exists newsletters_staff_update on public.newsletters;
create policy newsletters_staff_update on public.newsletters
  for update to authenticated
  using (public.is_editor() and status in ('draft', 'failed'))
  with check (public.is_editor() and status in ('draft', 'failed'));

drop policy if exists newsletters_admin_delete on public.newsletters;
create policy newsletters_admin_delete on public.newsletters
  for delete to authenticated
  using (public.is_admin());

-- send history: staff may read it and nobody may write it.
drop policy if exists newsletter_sends_staff_read on public.newsletter_sends;
create policy newsletter_sends_staff_read on public.newsletter_sends
  for select to authenticated
  using (public.is_editor());

-- ---------------------------------------------------------------------------
-- subscribe_to_newsletter
--
-- The only way into newsletter_subscribers from outside the service role.
-- SECURITY DEFINER with a pinned search_path, so anon may call it without
-- holding any privilege on the table itself.
--
-- Returns one of:
--   invalid_email | rate_limited | subscribed | reactivated | already_subscribed
-- ---------------------------------------------------------------------------

create or replace function public.subscribe_to_newsletter(
  p_email      text,
  p_source     text default 'website',
  p_client_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email    text := public.normalize_email(p_email);
  v_source   text := coalesce(nullif(btrim(p_source), ''), 'website');
  v_attempts integer;
  v_existing public.newsletter_subscribers%rowtype;
  v_row      public.newsletter_subscribers%rowtype;
begin
  if not public.is_valid_email(v_email) then
    return jsonb_build_object('status', 'invalid_email');
  end if;

  -- Abuse protection. The key is a hash of the caller's IP computed by the
  -- application; this function never sees an address. Metering after the
  -- validity check keeps a typo from burning someone's allowance.
  if p_client_key is not null and btrim(p_client_key) <> '' then
    delete from public.newsletter_signup_attempts
     where created_at < now() - interval '24 hours';

    select count(*) into v_attempts
      from public.newsletter_signup_attempts
     where client_key = p_client_key
       and created_at > now() - interval '1 hour';

    if v_attempts >= 5 then
      return jsonb_build_object('status', 'rate_limited');
    end if;

    insert into public.newsletter_signup_attempts (client_key)
    values (p_client_key);
  end if;

  select * into v_existing
    from public.newsletter_subscribers
   where email = v_email;

  if found then
    if v_existing.status = 'active' then
      return jsonb_build_object('status', 'already_subscribed', 'email', v_email);
    end if;

    -- Coming back after unsubscribing reactivates the original row rather
    -- than creating a second one, so the history stays in one place.
    update public.newsletter_subscribers
       set status          = 'active',
           subscribed_at   = now(),
           unsubscribed_at = null,
           source          = v_source
     where id = v_existing.id
    returning * into v_row;

    return jsonb_build_object(
      'status', 'reactivated',
      'email', v_row.email,
      'unsubscribe_token', v_row.unsubscribe_token
    );
  end if;

  -- ON CONFLICT covers the race where two requests for one new address arrive
  -- at once: the loser reports the truth instead of raising.
  insert into public.newsletter_subscribers (email, source)
  values (v_email, v_source)
  on conflict (email) do nothing
  returning * into v_row;

  if v_row.id is null then
    return jsonb_build_object('status', 'already_subscribed', 'email', v_email);
  end if;

  return jsonb_build_object(
    'status', 'subscribed',
    'email', v_row.email,
    'unsubscribe_token', v_row.unsubscribe_token
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- unsubscribe_from_newsletter
--
-- Accepts either the token from a newsletter link or a plain address. The
-- record is never deleted: status flips and unsubscribed_at is stamped, so a
-- later resubscribe reactivates the same row.
--
-- Returns: unsubscribed | already_unsubscribed | not_found | invalid
-- ---------------------------------------------------------------------------

create or replace function public.unsubscribe_from_newsletter(
  p_token uuid default null,
  p_email text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := public.normalize_email(p_email);
  v_row   public.newsletter_subscribers%rowtype;
begin
  if p_token is not null then
    select * into v_row
      from public.newsletter_subscribers
     where unsubscribe_token = p_token;
  elsif public.is_valid_email(v_email) then
    select * into v_row
      from public.newsletter_subscribers
     where email = v_email;
  else
    return jsonb_build_object('status', 'invalid');
  end if;

  if v_row.id is null then
    return jsonb_build_object('status', 'not_found');
  end if;

  if v_row.status = 'unsubscribed' then
    return jsonb_build_object('status', 'already_unsubscribed', 'email', v_row.email);
  end if;

  update public.newsletter_subscribers
     set status = 'unsubscribed', unsubscribed_at = now()
   where id = v_row.id;

  return jsonb_build_object('status', 'unsubscribed', 'email', v_row.email);
end;
$$;

-- ---------------------------------------------------------------------------
-- begin_newsletter_send
--
-- Claims an issue for sending in a single atomic statement. A second click, a
-- double-submitted request, or two admins pressing Send at the same moment
-- all lose the race and get already_sending / already_sent back, so an issue
-- cannot go out twice.
--
-- Service role only: called by the Edge Function after it has checked the
-- caller's role, never by a browser.
-- ---------------------------------------------------------------------------

create or replace function public.begin_newsletter_send(p_newsletter_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_row    public.newsletters%rowtype;
begin
  select status into v_status from public.newsletters where id = p_newsletter_id;

  if v_status is null then
    return jsonb_build_object('status', 'not_found');
  end if;

  update public.newsletters
     set status = 'sending', last_error = null
   where id = p_newsletter_id
     and status in ('draft', 'failed')
  returning * into v_row;

  if v_row.id is null then
    return jsonb_build_object(
      'status',
      case when v_status = 'sending' then 'already_sending' else 'already_sent' end
    );
  end if;

  return jsonb_build_object('status', 'claimed', 'newsletter', to_jsonb(v_row));
end;
$$;

-- ---------------------------------------------------------------------------
-- Grants
--
-- The public gets exactly two verbs and no table access whatsoever.
-- ---------------------------------------------------------------------------

revoke all on function public.subscribe_to_newsletter(text, text, text) from public;
revoke all on function public.unsubscribe_from_newsletter(uuid, text) from public;
revoke all on function public.begin_newsletter_send(uuid) from public;

-- Revoking from PUBLIC is not enough on Supabase. The project's default
-- privileges grant EXECUTE on new functions to `anon` and `authenticated`
-- directly, and a grant held by a role is not removed by revoking the one
-- held by PUBLIC. Without these two lines an anonymous visitor could call
-- begin_newsletter_send and strand a draft in `sending`.
revoke execute on function public.begin_newsletter_send(uuid) from anon, authenticated;

grant execute on function public.subscribe_to_newsletter(text, text, text)
  to anon, authenticated;
grant execute on function public.unsubscribe_from_newsletter(uuid, text)
  to anon, authenticated;
-- Claiming an issue for sending is not something a browser may ask for.
grant execute on function public.begin_newsletter_send(uuid) to service_role;

grant select, update, delete on public.newsletter_subscribers to authenticated;
grant select, insert, update, delete on public.newsletters to authenticated;
grant select on public.newsletter_sends to authenticated;
