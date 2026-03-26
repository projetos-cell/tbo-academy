-- ============================================================
-- TBO Academy Admin Tables
-- Created: 2026-03-26
-- ============================================================

-- ============================================================
-- COURSES
-- ============================================================
CREATE TABLE IF NOT EXISTS academy_courses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   jsonb,
  category      text,
  instructor    text,
  thumbnail_url text,
  level         text CHECK (level IN ('iniciante', 'intermediario', 'avancado')),
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order    int NOT NULL DEFAULT 0,
  tags          text[] DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academy_courses_status ON academy_courses (status);
CREATE INDEX IF NOT EXISTS idx_academy_courses_sort ON academy_courses (sort_order);
CREATE INDEX IF NOT EXISTS idx_academy_courses_slug ON academy_courses (slug);

-- ============================================================
-- MODULES
-- ============================================================
CREATE TABLE IF NOT EXISTS academy_modules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid NOT NULL REFERENCES academy_courses (id) ON DELETE CASCADE,
  title       text NOT NULL,
  description jsonb,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academy_modules_course ON academy_modules (course_id, sort_order);

-- ============================================================
-- LESSONS
-- ============================================================
CREATE TABLE IF NOT EXISTS academy_lessons (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id            uuid NOT NULL REFERENCES academy_modules (id) ON DELETE CASCADE,
  title                text NOT NULL,
  description          jsonb,
  video_url            text,
  video_duration_sec   int,
  sort_order           int NOT NULL DEFAULT 0,
  is_free              boolean NOT NULL DEFAULT false,
  status               text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academy_lessons_module ON academy_lessons (module_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_academy_lessons_status ON academy_lessons (status);

-- ============================================================
-- LEARNING PATHS
-- ============================================================
CREATE TABLE IF NOT EXISTS academy_learning_paths (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text,
  thumbnail_url text,
  sort_order    int NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academy_learning_paths_status ON academy_learning_paths (status);
CREATE INDEX IF NOT EXISTS idx_academy_learning_paths_sort ON academy_learning_paths (sort_order);

-- ============================================================
-- LEARNING PATH COURSES (join table)
-- ============================================================
CREATE TABLE IF NOT EXISTS academy_learning_path_courses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id uuid NOT NULL REFERENCES academy_learning_paths (id) ON DELETE CASCADE,
  course_id        uuid NOT NULL REFERENCES academy_courses (id) ON DELETE CASCADE,
  sort_order       int NOT NULL DEFAULT 0,
  UNIQUE (learning_path_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_academy_lpc_path ON academy_learning_path_courses (learning_path_id, sort_order);

-- ============================================================
-- ENROLLMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS academy_enrollments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  course_id    uuid NOT NULL REFERENCES academy_courses (id) ON DELETE CASCADE,
  enrolled_at  timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_academy_enrollments_user ON academy_enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_course ON academy_enrollments (course_id);

-- ============================================================
-- LESSON PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS academy_lesson_progress (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id         uuid NOT NULL REFERENCES academy_lessons (id) ON DELETE CASCADE,
  completed         boolean NOT NULL DEFAULT false,
  progress_pct      int NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  last_position_sec int NOT NULL DEFAULT 0,
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_academy_lesson_progress_user ON academy_lesson_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_academy_lesson_progress_lesson ON academy_lesson_progress (lesson_id);

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS academy_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id  uuid NOT NULL REFERENCES academy_lessons (id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  parent_id  uuid REFERENCES academy_comments (id) ON DELETE CASCADE,
  body       text NOT NULL,
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academy_comments_lesson ON academy_comments (lesson_id);
CREATE INDEX IF NOT EXISTS idx_academy_comments_status ON academy_comments (status);
CREATE INDEX IF NOT EXISTS idx_academy_comments_parent ON academy_comments (parent_id);

-- ============================================================
-- ANALYTICS EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS academy_analytics_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  event_type  text NOT NULL,
  entity_type text,
  entity_id   uuid,
  metadata    jsonb DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academy_analytics_user ON academy_analytics_events (user_id);
CREATE INDEX IF NOT EXISTS idx_academy_analytics_event ON academy_analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_academy_analytics_created ON academy_analytics_events (created_at DESC);

-- ============================================================
-- UPDATED_AT triggers
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'academy_courses',
    'academy_modules',
    'academy_lessons',
    'academy_learning_paths',
    'academy_comments',
    'academy_lesson_progress'
  ] LOOP
    EXECUTE format(
      'CREATE OR REPLACE TRIGGER trg_%I_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      tbl, tbl
    );
  END LOOP;
END $$;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE academy_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_learning_path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_analytics_events ENABLE ROW LEVEL SECURITY;

-- Helper: is current user a founder/diretoria?
CREATE OR REPLACE FUNCTION is_academy_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM tenant_members tm
    JOIN roles r ON r.id = tm.role_id
    WHERE tm.user_id = auth.uid()
      AND tm.is_active = true
      AND r.slug IN ('founder', 'diretoria')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Courses: public read for published, admin full access
CREATE POLICY "courses_public_read" ON academy_courses
  FOR SELECT USING (status = 'published' OR is_academy_admin());

CREATE POLICY "courses_admin_write" ON academy_courses
  FOR ALL USING (is_academy_admin());

-- Modules: readable if course is published or admin
CREATE POLICY "modules_read" ON academy_modules
  FOR SELECT USING (
    is_academy_admin() OR
    EXISTS (SELECT 1 FROM academy_courses c WHERE c.id = course_id AND c.status = 'published')
  );

CREATE POLICY "modules_admin_write" ON academy_modules
  FOR ALL USING (is_academy_admin());

-- Lessons: readable if module's course is published or admin; free lessons always readable
CREATE POLICY "lessons_read" ON academy_lessons
  FOR SELECT USING (
    is_academy_admin() OR
    is_free = true OR
    EXISTS (
      SELECT 1 FROM academy_modules m
      JOIN academy_courses c ON c.id = m.course_id
      WHERE m.id = module_id AND c.status = 'published'
    )
  );

CREATE POLICY "lessons_admin_write" ON academy_lessons
  FOR ALL USING (is_academy_admin());

-- Learning paths
CREATE POLICY "learning_paths_public_read" ON academy_learning_paths
  FOR SELECT USING (status = 'published' OR is_academy_admin());

CREATE POLICY "learning_paths_admin_write" ON academy_learning_paths
  FOR ALL USING (is_academy_admin());

CREATE POLICY "lpc_read" ON academy_learning_path_courses
  FOR SELECT USING (
    is_academy_admin() OR
    EXISTS (SELECT 1 FROM academy_learning_paths lp WHERE lp.id = learning_path_id AND lp.status = 'published')
  );

CREATE POLICY "lpc_admin_write" ON academy_learning_path_courses
  FOR ALL USING (is_academy_admin());

-- Enrollments: users see their own, admins see all
CREATE POLICY "enrollments_own" ON academy_enrollments
  FOR SELECT USING (user_id = auth.uid() OR is_academy_admin());

CREATE POLICY "enrollments_insert_own" ON academy_enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid() OR is_academy_admin());

CREATE POLICY "enrollments_admin_write" ON academy_enrollments
  FOR ALL USING (is_academy_admin());

-- Lesson progress: users manage their own
CREATE POLICY "lesson_progress_own" ON academy_lesson_progress
  FOR ALL USING (user_id = auth.uid() OR is_academy_admin());

-- Comments: users see approved + their own; admins see all
CREATE POLICY "comments_read" ON academy_comments
  FOR SELECT USING (
    status = 'approved' OR user_id = auth.uid() OR is_academy_admin()
  );

CREATE POLICY "comments_insert_auth" ON academy_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "comments_update_own" ON academy_comments
  FOR UPDATE USING (user_id = auth.uid() OR is_academy_admin());

CREATE POLICY "comments_admin_delete" ON academy_comments
  FOR DELETE USING (is_academy_admin());

-- Analytics: users insert their own, admins read all
CREATE POLICY "analytics_insert_own" ON academy_analytics_events
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "analytics_admin_read" ON academy_analytics_events
  FOR SELECT USING (is_academy_admin());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('academy-videos',     'academy-videos',     false, 5368709120, ARRAY['video/mp4', 'video/webm', 'video/ogg']),
  ('academy-thumbnails', 'academy-thumbnails', true,  10485760,   ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "academy_videos_admin_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'academy-videos' AND is_academy_admin()
  );

CREATE POLICY "academy_videos_auth_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'academy-videos' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "academy_thumbnails_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'academy-thumbnails');

CREATE POLICY "academy_thumbnails_admin_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'academy-thumbnails' AND is_academy_admin()
  );
