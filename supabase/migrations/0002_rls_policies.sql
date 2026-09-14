-- ============================================================================
-- 0002 — Row Level Security
--
-- Every table below denies by default and is opened only by the policies here.
-- Policies are keyed on the caller's role, read server-side from `profiles`,
-- never from anything the client can set.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Role helpers
--
-- SECURITY DEFINER so they can read `profiles` without being re-filtered by
-- the policies on `profiles` itself — a policy that queried that table
-- directly would recurse forever. search_path is pinned so the function body
-- cannot be redirected by a caller-controlled path.
-- ---------------------------------------------------------------------------

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'viewer'::public.user_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Editors and admins may both work on editorial content.
create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

revoke all on function public.current_role() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_editor() from public;
grant execute on function public.current_role() to authenticated;
grant execute on function public.is_admin() to authenticated, anon;
grant execute on function public.is_editor() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere
-- ---------------------------------------------------------------------------

alter table public.profiles         enable row level security;
alter table public.categories       enable row level security;
alter table public.authors          enable row level security;
alter table public.tags             enable row level security;
alter table public.articles         enable row level security;
alter table public.article_tags     enable row level security;
alter table public.media            enable row level security;
alter table public.contact_messages enable row level security;
alter table public.projects         enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  -- A user may edit their own name and avatar but not award themselves a role.
  with check (id = auth.uid() and role = public.current_role());

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- categories — world readable, admin writable
-- ---------------------------------------------------------------------------

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select to anon, authenticated
  using (true);

drop policy if exists categories_admin_write on public.categories;
create policy categories_admin_write on public.categories
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- authors — world readable, admin writable
-- ---------------------------------------------------------------------------

drop policy if exists authors_public_read on public.authors;
create policy authors_public_read on public.authors
  for select to anon, authenticated
  using (true);

drop policy if exists authors_admin_write on public.authors;
create policy authors_admin_write on public.authors
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- tags — world readable; editors may add, only admins may remove
-- ---------------------------------------------------------------------------

drop policy if exists tags_public_read on public.tags;
create policy tags_public_read on public.tags
  for select to anon, authenticated
  using (true);

drop policy if exists tags_editor_insert on public.tags;
create policy tags_editor_insert on public.tags
  for insert to authenticated
  with check (public.is_editor());

drop policy if exists tags_editor_update on public.tags;
create policy tags_editor_update on public.tags
  for update to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists tags_admin_delete on public.tags;
create policy tags_admin_delete on public.tags
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- articles
--
-- The public sees an article only when it is published AND its publication
-- moment has passed. A scheduled article is therefore invisible until its
-- date arrives without any cron job: the policy itself enforces the embargo.
-- ---------------------------------------------------------------------------

drop policy if exists articles_public_read on public.articles;
create policy articles_public_read on public.articles
  for select to anon, authenticated
  using (
    status = 'published'
    and published_date is not null
    and published_date <= now()
  );

drop policy if exists articles_staff_read on public.articles;
create policy articles_staff_read on public.articles
  for select to authenticated
  using (public.is_editor());

drop policy if exists articles_editor_insert on public.articles;
create policy articles_editor_insert on public.articles
  for insert to authenticated
  with check (public.is_editor());

drop policy if exists articles_editor_update on public.articles;
create policy articles_editor_update on public.articles
  for update to authenticated
  using (public.is_editor())
  with check (public.is_editor());

-- Deleting published work is an administrator's decision.
drop policy if exists articles_admin_delete on public.articles;
create policy articles_admin_delete on public.articles
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- article_tags — readable only for articles the caller may already read
-- ---------------------------------------------------------------------------

drop policy if exists article_tags_public_read on public.article_tags;
create policy article_tags_public_read on public.article_tags
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.articles a
      where a.id = article_id
        and (
          public.is_editor()
          or (
            a.status = 'published'
            and a.published_date is not null
            and a.published_date <= now()
          )
        )
    )
  );

drop policy if exists article_tags_editor_write on public.article_tags;
create policy article_tags_editor_write on public.article_tags
  for all to authenticated
  using (public.is_editor())
  with check (public.is_editor());

-- ---------------------------------------------------------------------------
-- media — world readable (images are served publicly), editors may upload,
-- only admins may delete
-- ---------------------------------------------------------------------------

drop policy if exists media_public_read on public.media;
create policy media_public_read on public.media
  for select to anon, authenticated
  using (true);

drop policy if exists media_editor_insert on public.media;
create policy media_editor_insert on public.media
  for insert to authenticated
  with check (public.is_editor() and uploaded_by = auth.uid());

drop policy if exists media_editor_update on public.media;
create policy media_editor_update on public.media
  for update to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists media_admin_delete on public.media;
create policy media_admin_delete on public.media
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- contact_messages
--
-- Anyone may submit one. Nobody unauthenticated may read them back — an
-- enquiry contains a name, an email and a description of someone's business.
-- ---------------------------------------------------------------------------

drop policy if exists contact_public_insert on public.contact_messages;
create policy contact_public_insert on public.contact_messages
  for insert to anon, authenticated
  with check (status = 'new');

drop policy if exists contact_admin_read on public.contact_messages;
create policy contact_admin_read on public.contact_messages
  for select to authenticated
  using (public.is_admin());

drop policy if exists contact_admin_update on public.contact_messages;
create policy contact_admin_update on public.contact_messages
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists contact_admin_delete on public.contact_messages;
create policy contact_admin_delete on public.contact_messages
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------

drop policy if exists projects_public_read on public.projects;
create policy projects_public_read on public.projects
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists projects_staff_read on public.projects;
create policy projects_staff_read on public.projects
  for select to authenticated
  using (public.is_editor());

drop policy if exists projects_admin_write on public.projects;
create policy projects_admin_write on public.projects
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Table grants. RLS filters rows; grants decide whether the role may reach
-- the table at all. Both are required.
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on public.categories, public.authors, public.tags,
               public.articles, public.article_tags, public.media,
               public.projects
  to anon, authenticated;

grant insert on public.contact_messages to anon, authenticated;

grant select, insert, update, delete on
  public.articles, public.article_tags, public.tags, public.media,
  public.categories, public.authors, public.projects, public.contact_messages,
  public.profiles
  to authenticated;
