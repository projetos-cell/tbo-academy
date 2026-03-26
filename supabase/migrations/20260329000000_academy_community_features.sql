-- ============================================================
-- Community features: Feed, Comunidade, Biblioteca, Aulas ao Vivo, Suporte
-- ============================================================

-- =========================
-- 1. FEED (activity events)
-- =========================
create table if not exists academy_feed_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('conquista', 'conclusao', 'comentario', 'ranking', 'novo_curso')),
  content text not null,
  detail text,
  metadata jsonb default '{}',
  likes_count int not null default 0,
  comments_count int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_feed_posts_created on academy_feed_posts(created_at desc);
create index idx_feed_posts_type on academy_feed_posts(type);

create table if not exists academy_feed_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references academy_feed_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

-- =========================
-- 2. COMUNIDADE (forum)
-- =========================
create table if not exists academy_forum_topics (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  category text not null default 'Geral',
  is_pinned boolean not null default false,
  is_hot boolean not null default false,
  replies_count int not null default 0,
  views_count int not null default 0,
  likes_count int not null default 0,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_forum_topics_last_activity on academy_forum_topics(last_activity_at desc);
create index idx_forum_topics_category on academy_forum_topics(category);

create table if not exists academy_forum_replies (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references academy_forum_topics(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  likes_count int not null default 0,
  created_at timestamptz not null default now()
);

-- =========================
-- 3. BIBLIOTECA (resources)
-- =========================
create table if not exists academy_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null check (type in ('template', 'guia', 'video', 'checklist', 'apresentacao', 'imagem')),
  category text not null default 'Geral',
  file_url text,
  external_url text,
  thumbnail_url text,
  downloads_count int not null default 0,
  is_featured boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_resources_type on academy_resources(type);
create index idx_resources_featured on academy_resources(is_featured) where is_featured = true;

-- =========================
-- 4. AULAS AO VIVO
-- =========================
create table if not exists academy_live_classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  instructor_id uuid references auth.users(id) on delete set null,
  instructor_name text not null,
  instructor_role text,
  category text not null default 'Geral',
  scheduled_at timestamptz not null,
  duration_minutes int not null default 60,
  max_attendees int not null default 100,
  meeting_url text,
  recording_url text,
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'recorded', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_live_classes_scheduled on academy_live_classes(scheduled_at desc);
create index idx_live_classes_status on academy_live_classes(status);

create table if not exists academy_live_class_registrations (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references academy_live_classes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  registered_at timestamptz not null default now(),
  unique(class_id, user_id)
);

-- =========================
-- 5. SUPORTE (tickets + FAQ)
-- =========================
create table if not exists academy_faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'Geral',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_faq_sort on academy_faq_items(sort_order);

create table if not exists academy_support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  body text not null,
  category text not null default 'Geral',
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_support_tickets_user on academy_support_tickets(user_id);
create index idx_support_tickets_status on academy_support_tickets(status);

-- =========================
-- RLS Policies
-- =========================

alter table academy_feed_posts enable row level security;
alter table academy_feed_likes enable row level security;
alter table academy_forum_topics enable row level security;
alter table academy_forum_replies enable row level security;
alter table academy_resources enable row level security;
alter table academy_live_classes enable row level security;
alter table academy_live_class_registrations enable row level security;
alter table academy_faq_items enable row level security;
alter table academy_support_tickets enable row level security;

-- Feed: authenticated can read all, insert own
create policy "feed_posts_read" on academy_feed_posts for select to authenticated using (true);
create policy "feed_posts_insert" on academy_feed_posts for insert to authenticated with check (auth.uid() = user_id);
create policy "feed_likes_read" on academy_feed_likes for select to authenticated using (true);
create policy "feed_likes_insert" on academy_feed_likes for insert to authenticated with check (auth.uid() = user_id);
create policy "feed_likes_delete" on academy_feed_likes for delete to authenticated using (auth.uid() = user_id);

-- Forum: authenticated can read all, insert own
create policy "forum_topics_read" on academy_forum_topics for select to authenticated using (true);
create policy "forum_topics_insert" on academy_forum_topics for insert to authenticated with check (auth.uid() = author_id);
create policy "forum_replies_read" on academy_forum_replies for select to authenticated using (true);
create policy "forum_replies_insert" on academy_forum_replies for insert to authenticated with check (auth.uid() = author_id);

-- Resources: authenticated can read published
create policy "resources_read" on academy_resources for select to authenticated using (status = 'published');

-- Live classes: authenticated can read all, register self
create policy "live_classes_read" on academy_live_classes for select to authenticated using (true);
create policy "live_registrations_read" on academy_live_class_registrations for select to authenticated using (true);
create policy "live_registrations_insert" on academy_live_class_registrations for insert to authenticated with check (auth.uid() = user_id);
create policy "live_registrations_delete" on academy_live_class_registrations for delete to authenticated using (auth.uid() = user_id);

-- FAQ: authenticated can read published
create policy "faq_read" on academy_faq_items for select to authenticated using (is_published = true);

-- Support tickets: user can read/insert own
create policy "tickets_read" on academy_support_tickets for select to authenticated using (auth.uid() = user_id);
create policy "tickets_insert" on academy_support_tickets for insert to authenticated with check (auth.uid() = user_id);
