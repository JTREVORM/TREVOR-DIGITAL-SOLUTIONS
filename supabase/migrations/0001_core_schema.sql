-- ============================================================================
-- 0001 — Core schema for the Trevor Digital Solutions website and Insights CMS
--
-- Idempotent: safe to run more than once. Creates nothing that already exists
-- and drops nothing.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.user_role as enum ('admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.article_status as enum ('draft', 'scheduled', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.message_status as enum ('new', 'read', 'replied', 'archived');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — one row per auth user. Holds the role.
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  email       text,
  avatar_url  text,
  role        public.user_role not null default 'viewer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create a profile automatically whenever an auth user is created. New users
-- get the lowest role; promotion to admin is a deliberate, separate action.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'viewer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text not null default '',
  icon_name   text not null default 'newspaper',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists categories_slug_idx on public.categories (slug);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- authors — bylines. Separate from profiles: an author is editorial identity,
-- a profile is a login. Optionally linked to a profile.
-- ---------------------------------------------------------------------------

create table if not exists public.authors (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references public.profiles (id) on delete set null,
  name        text not null,
  title       text not null default '',
  company     text not null default 'Trevor Digital Solutions',
  bio         text not null default '',
  avatar_url  text,
  profile_url text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists authors_set_updated_at on public.authors;
create trigger authors_set_updated_at
  before update on public.authors
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------

create table if not exists public.tags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists tags_slug_idx on public.tags (slug);

-- ---------------------------------------------------------------------------
-- articles
--
-- `content` is the typed block array the public renderer already consumes,
-- stored as jsonb so it is queryable and cannot contain raw markup.
-- ---------------------------------------------------------------------------

create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  excerpt         text not null default '',
  content         jsonb not null default '[]'::jsonb,
  featured_image  text,
  featured_image_alt text,
  category_id     uuid references public.categories (id) on delete set null,
  author_id       uuid references public.authors (id) on delete set null,
  reading_time    integer not null default 1,
  status          public.article_status not null default 'draft',
  published_date  timestamptz,
  seo_title       text,
  seo_description text,
  created_by      uuid references public.profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint articles_reading_time_positive check (reading_time > 0),
  -- A published or scheduled article must say when it goes live.
  constraint articles_published_needs_date
    check (status = 'draft' or published_date is not null)
);

create index if not exists articles_slug_idx on public.articles (slug);
create index if not exists articles_status_idx on public.articles (status);
create index if not exists articles_category_idx on public.articles (category_id);
create index if not exists articles_author_idx on public.articles (author_id);
-- The index the public site hits on every page: live articles, newest first.
create index if not exists articles_public_feed_idx
  on public.articles (published_date desc)
  where status = 'published';

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- article_tags — many-to-many join
-- ---------------------------------------------------------------------------

create table if not exists public.article_tags (
  article_id uuid not null references public.articles (id) on delete cascade,
  tag_id     uuid not null references public.tags (id) on delete cascade,
  primary key (article_id, tag_id)
);

create index if not exists article_tags_tag_idx on public.article_tags (tag_id);

-- ---------------------------------------------------------------------------
-- media — metadata for files in Supabase Storage
-- ---------------------------------------------------------------------------

create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  file_name   text not null,
  file_path   text not null unique,
  file_url    text not null,
  file_type   text not null,
  file_size   bigint not null default 0,
  width       integer,
  height      integer,
  alt_text    text not null default '',
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),

  constraint media_size_sane check (file_size >= 0 and file_size <= 10485760),
  constraint media_type_is_image check (file_type like 'image/%')
);

create index if not exists media_created_idx on public.media (created_at desc);

-- ---------------------------------------------------------------------------
-- contact_messages — enquiries from the public contact form
-- ---------------------------------------------------------------------------

create table if not exists public.contact_messages (
  id               uuid primary key default gen_random_uuid(),
  reference_number text unique,
  name             text not null,
  email            text not null,
  phone            text,
  company          text,
  subject          text,
  budget           text,
  message          text not null,
  status           public.message_status not null default 'new',
  created_at       timestamptz not null default now(),

  constraint contact_name_length check (char_length(name) between 2 and 200),
  constraint contact_email_shape check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint contact_message_length check (char_length(message) between 10 and 5000)
);

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx
  on public.contact_messages (status);

-- ---------------------------------------------------------------------------
-- projects — portfolio entries
-- ---------------------------------------------------------------------------

create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  description    text not null default '',
  category       text not null default '',
  industry       text not null default '',
  technologies   text[] not null default '{}',
  featured_image text,
  content        jsonb not null default '{}'::jsonb,
  status         public.project_status not null default 'draft',
  featured       boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_status_idx on public.projects (status);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();
