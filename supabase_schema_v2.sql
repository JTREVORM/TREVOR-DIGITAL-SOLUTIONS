-- ============================================================
-- Trevor Digital Solutions — Supabase Schema v2 (Production Upgraded)
-- This migration script upgrades the existing database to a secure, 
-- scalable, and performant production-ready schema without losing data.
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. AUTOMATED FUNCTIONS (TRIGGERS & GENERATORS)
-- ============================================================

-- Function: Auto-update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequence and Function: Auto-generate Reference Numbers for Contact Messages
CREATE SEQUENCE IF NOT EXISTS contact_message_ref_seq START WITH 1;

CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically generate reference number if not provided or empty
    IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
        NEW.reference_number := 'TDS-' || to_char(NOW(), 'YYYY') || '-' || LPAD(nextval('contact_message_ref_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 3. TABLES (CREATE IF NOT EXISTS)
-- ============================================================

-- TABLE: contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  service_required TEXT,
  budget TEXT,
  project_description TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  client_name TEXT,
  industry TEXT,
  technologies TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  project_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  icon TEXT,
  features TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  process_steps JSONB DEFAULT '[]',
  faq JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: gallery
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: team_members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  skills TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: website_settings
CREATE TABLE IF NOT EXISTS public.website_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. SCHEMA UPGRADE (ADD MISSING COLUMNS TO EXISTING TABLES)
-- ============================================================

-- Add 'updated_at' to tables that didn't have it in v1
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.website_settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Add Full Text Search (FTS) vector columns (populated by trigger — to_tsvector is STABLE, not IMMUTABLE)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS fts tsvector;

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS fts tsvector;

-- Function: update FTS vector for projects
CREATE OR REPLACE FUNCTION update_projects_fts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fts :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.industry, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.technologies, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: update FTS vector for services
CREATE OR REPLACE FUNCTION update_services_fts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fts :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.features, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 5. CONSTRAINTS & VALIDATIONS
-- ============================================================
DO $$ 
BEGIN
    -- Contact Messages valid email check
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_messages_email_check') THEN
        ALTER TABLE public.contact_messages ADD CONSTRAINT contact_messages_email_check CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');
    END IF;
    -- Testimonials valid rating check
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'testimonials_rating_check') THEN
        ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_rating_check CHECK (rating >= 1 AND rating <= 5);
    END IF;
END $$;

-- ============================================================
-- 6. INDEXES
-- ============================================================

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_fts ON public.projects USING GIN (fts);

-- Services
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_is_featured ON public.services(is_featured);
CREATE INDEX IF NOT EXISTS idx_services_is_published ON public.services(is_published);
CREATE INDEX IF NOT EXISTS idx_services_fts ON public.services USING GIN (fts);

-- Testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_published ON public.testimonials(is_published);

-- Contact Messages
CREATE INDEX IF NOT EXISTS idx_contact_messages_ref ON public.contact_messages(reference_number);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at);

-- Gallery
CREATE INDEX IF NOT EXISTS idx_gallery_project_id ON public.gallery(project_id);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category);

-- Website Settings
CREATE INDEX IF NOT EXISTS idx_website_settings_key ON public.website_settings(key);

-- ============================================================
-- 7. TRIGGERS
-- ============================================================

-- Function to drop and recreate triggers idempotently
DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN SELECT table_name FROM information_schema.columns WHERE column_name = 'updated_at' AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t_name);
        EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_modified_column()', t_name);
    END LOOP;
END $$;

-- FTS triggers for projects and services
DROP TRIGGER IF EXISTS update_projects_fts_trigger ON public.projects;
CREATE TRIGGER update_projects_fts_trigger
  BEFORE INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_projects_fts();

DROP TRIGGER IF EXISTS update_services_fts_trigger ON public.services;
CREATE TRIGGER update_services_fts_trigger
  BEFORE INSERT OR UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_services_fts();

-- Contact messages reference number generator trigger
DROP TRIGGER IF EXISTS generate_contact_ref ON public.contact_messages;
CREATE TRIGGER generate_contact_ref
BEFORE INSERT ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION generate_reference_number();

-- ============================================================
-- 8. DEFAULT SEED DATA
-- ============================================================

-- Ensure placeholder projects point to valid paths or dashboard placeholders
-- The existing image paths /project1.png and /project2.png will be kept as they represent the valid paths for this application.
INSERT INTO public.projects (slug, title, category, description, long_description, industry, technologies, features, benefits, image_url, is_featured, is_published)
VALUES
(
  'enterprise-analytics-dashboard',
  'Enterprise SaaS Analytics Dashboard',
  'Business Management System',
  'A comprehensive analytics platform for enterprise data visualization and reporting.',
  'We built a full-featured SaaS analytics dashboard for a fast-growing enterprise client. The platform aggregates data from multiple sources, provides real-time visualizations, and generates automated reports for decision makers at every level of the organization.',
  'Finance & Analytics',
  ARRAY['Next.js', 'Supabase', 'Tailwind CSS', 'Recharts', 'TypeScript'],
  ARRAY['Real-time data visualization', 'Automated report generation', 'Multi-user access control', 'Custom KPI dashboards', 'Data export (CSV, PDF)', 'Mobile responsive'],
  ARRAY['Reduced reporting time by 80%', 'Increased data accuracy to 99.9%', 'Saved 15+ hours per week in manual work'],
  '/project1.png',
  true,
  true
),
(
  'global-erp-inventory-system',
  'Global Inventory & ERP System',
  'ERP & Inventory Management',
  'A centralized ERP for managing global supply chains, inventory, and operations.',
  'This enterprise resource planning system was built for a client managing inventory across multiple warehouses and locations. It integrates procurement, stock management, order fulfillment, and financial tracking into one unified platform.',
  'Logistics & Supply Chain',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'],
  ARRAY['Multi-warehouse management', 'Real-time stock tracking', 'Purchase order automation', 'Supplier management', 'Barcode/QR scanning', 'Financial reporting'],
  ARRAY['Eliminated stockouts by 95%', 'Reduced procurement costs by 30%', 'Full audit trail and compliance'],
  '/project2.png',
  true,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Settings including Official Social Links
INSERT INTO public.website_settings (key, value, description) VALUES
  ('company_name', 'Trevor Digital Solutions', 'Company name'),
  ('company_tagline', 'Transforming Ideas Into Powerful Digital Solutions', 'Company tagline'),
  ('company_email', 'trevordigitalsolutions@gmail.com', 'Contact email'),
  ('company_phone', '+256740081305', 'Contact phone'),
  ('company_address', 'Kampala, Uganda', 'Physical address'),
  ('company_whatsapp', '256740081305', 'WhatsApp number without +'),
  ('founder_name', 'Mwesigwa Trevor Joseph', 'Founder name'),
  ('founder_title', 'Founder & CEO', 'Founder title'),
  ('social_linkedin', 'https://ug.linkedin.com/in/mwesigwa-trevor-joseph-722b0a33b', 'LinkedIn URL'),
  ('social_github', 'https://github.com/JTREVORM', 'GitHub URL'),
  ('social_facebook', 'https://www.facebook.com/profile.php?id=100093034717948', 'Facebook URL')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value, 
  updated_at = NOW();

-- ============================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- Contact Messages
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon insert contact messages" ON public.contact_messages;
CREATE POLICY "Allow anon insert contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access to contact messages" ON public.contact_messages;
CREATE POLICY "Allow authenticated full access to contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- Projects
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read published projects" ON public.projects;
CREATE POLICY "Allow public read published projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "Allow authenticated full access to projects" ON public.projects;
CREATE POLICY "Allow authenticated full access to projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- Services
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read published services" ON public.services;
CREATE POLICY "Allow public read published services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "Allow authenticated full access to services" ON public.services;
CREATE POLICY "Allow authenticated full access to services"
  ON public.services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- Testimonials
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read published testimonials" ON public.testimonials;
CREATE POLICY "Allow public read published testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "Allow authenticated full access to testimonials" ON public.testimonials;
CREATE POLICY "Allow authenticated full access to testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- Gallery
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read published gallery" ON public.gallery;
CREATE POLICY "Allow public read published gallery"
  ON public.gallery FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "Allow authenticated full access to gallery" ON public.gallery;
CREATE POLICY "Allow authenticated full access to gallery"
  ON public.gallery FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- Team Members
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read team members" ON public.team_members;
CREATE POLICY "Allow public read team members"
  ON public.team_members FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access to team members" ON public.team_members;
CREATE POLICY "Allow authenticated full access to team members"
  ON public.team_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- Website Settings
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read settings" ON public.website_settings;
CREATE POLICY "Allow public read settings"
  ON public.website_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access to settings" ON public.website_settings;
CREATE POLICY "Allow authenticated full access to settings"
  ON public.website_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 10. STORAGE CONFIGURATION
-- ============================================================

-- Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remove broad policies if they exist to tighten security
DROP POLICY IF EXISTS "Allow public read assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete assets" ON storage.objects;

-- Strict bucket-specific policies
CREATE POLICY "public_assets_select_policy"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'public-assets');

CREATE POLICY "public_assets_insert_policy"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public-assets');

CREATE POLICY "public_assets_update_policy"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public-assets');

CREATE POLICY "public_assets_delete_policy"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'public-assets');

-- END OF MIGRATION SCRIPT
