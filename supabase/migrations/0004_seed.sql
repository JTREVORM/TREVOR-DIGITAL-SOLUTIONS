-- ============================================================================
-- 0004 — Seed data
--
-- Only what the site genuinely needs to function: the five Insights categories
-- already published on the public website, and the one real author.
--
-- No articles, no clients, no testimonials, no statistics. Editorial content
-- is written in the admin portal, not invented in a migration.
--
-- Idempotent on slug/name, so re-running will not duplicate rows.
-- ============================================================================

insert into public.categories (name, slug, description, icon_name) values
  ('Technology & News', 'technology-news',
   'Changes in the tools and platforms we build on, and what they mean in practice.',
   'newspaper'),
  ('Software Engineering', 'software-engineering',
   'How systems are designed, built and kept running once real people depend on them.',
   'cpu'),
  ('Financial Markets', 'financial-markets',
   'Trading technology, automation and the engineering behind market systems.',
   'line-chart'),
  ('Artificial Intelligence', 'artificial-intelligence',
   'Where AI earns its cost in ordinary businesses, and where it does not.',
   'brain'),
  ('Business & Digital', 'business-digital',
   'Operations, digitisation and the decisions behind buying or building software.',
   'building')
on conflict (slug) do update
  set name        = excluded.name,
      description = excluded.description,
      icon_name   = excluded.icon_name;

-- The founder, as already described on the public website. Biography text is
-- the same wording the site already uses; nothing here is new or invented.
insert into public.authors (name, title, company, bio, avatar_url, profile_url)
select
  'Mwesigwa Trevor Joseph',
  'Founder & CEO',
  'Trevor Digital Solutions',
  'Software engineer and technology entrepreneur in Kampala, Uganda. He works across the full software lifecycle - business systems, web and mobile applications, AI and automation, and MetaTrader expert advisor development - and founded Trevor Digital Solutions to do client work the way he thought it should be done.',
  '/founder.png',
  '/founder'
where not exists (
  select 1 from public.authors where name = 'Mwesigwa Trevor Joseph'
);
