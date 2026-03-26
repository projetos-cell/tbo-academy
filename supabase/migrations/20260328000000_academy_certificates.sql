-- Academy Certificates table
-- Stores certificate records when users complete all modules of a course

create table if not exists public.academy_certificates (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  course_id   text        not null,
  course_title text       not null,
  pdf_url     text,
  created_at  timestamptz default now(),
  unique (user_id, course_id)
);

alter table public.academy_certificates enable row level security;

create policy "Usuários leem seus próprios certificados"
  on public.academy_certificates for select
  using (auth.uid() = user_id);

create policy "Usuários inserem seus próprios certificados"
  on public.academy_certificates for insert
  with check (auth.uid() = user_id);

create policy "Usuários atualizam seus próprios certificados"
  on public.academy_certificates for update
  using (auth.uid() = user_id);
