-- ============================================================================
-- 0003 — Storage bucket and policies for TDS media
--
-- One public-read bucket. Reads are open because these are images published on
-- a marketing site; writes are restricted to signed-in editors and deletes to
-- admins. Anonymous write access is never granted.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tds-media',
  'tds-media',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml', 'image/gif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Object policies
--
-- The bucket is flagged public, which makes object URLs readable; these
-- policies govern the API surface. Write paths are checked against the
-- caller's role, not merely against being authenticated.
-- ---------------------------------------------------------------------------

drop policy if exists "tds_media_public_read" on storage.objects;
create policy "tds_media_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'tds-media');

drop policy if exists "tds_media_editor_insert" on storage.objects;
create policy "tds_media_editor_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'tds-media'
    and public.is_editor()
    and owner = auth.uid()
  );

drop policy if exists "tds_media_editor_update" on storage.objects;
create policy "tds_media_editor_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'tds-media' and public.is_editor())
  with check (bucket_id = 'tds-media' and public.is_editor());

drop policy if exists "tds_media_admin_delete" on storage.objects;
create policy "tds_media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'tds-media' and public.is_admin());
