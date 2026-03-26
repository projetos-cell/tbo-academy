-- ─── Academy: Courses, Modules & Progress ───────────────────────

-- Courses table
CREATE TABLE IF NOT EXISTS academy_courses (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text        NOT NULL,
  description   text,
  category      text,
  instructor    text,
  duration      text,
  total_modules int,
  level         text,
  thumbnail     text,
  sort_order    int,
  created_at    timestamptz DEFAULT now()
);

-- Modules table
CREATE TABLE IF NOT EXISTS academy_modules (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid        NOT NULL REFERENCES academy_courses(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  duration    text,
  sort_order  int,
  video_url   text,
  created_at  timestamptz DEFAULT now()
);

-- User progress table
CREATE TABLE IF NOT EXISTS academy_user_progress (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id    uuid        NOT NULL REFERENCES academy_modules(id) ON DELETE CASCADE,
  status       text        NOT NULL DEFAULT 'not_started'
                             CHECK (status IN ('completed', 'in_progress', 'not_started')),
  completed_at timestamptz,
  updated_at   timestamptz DEFAULT now(),
  UNIQUE (user_id, module_id)
);

-- ─── Row Level Security ──────────────────────────────────────────

ALTER TABLE academy_courses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_modules       ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_user_progress ENABLE ROW LEVEL SECURITY;

-- Courses: readable by all authenticated users
CREATE POLICY "courses_read_authenticated"
  ON academy_courses FOR SELECT
  TO authenticated
  USING (true);

-- Modules: readable by all authenticated users
CREATE POLICY "modules_read_authenticated"
  ON academy_modules FOR SELECT
  TO authenticated
  USING (true);

-- Progress: each user can only read/write their own records
CREATE POLICY "progress_read_own"
  ON academy_user_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "progress_insert_own"
  ON academy_user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "progress_update_own"
  ON academy_user_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "progress_delete_own"
  ON academy_user_progress FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ─── Seed: Courses ───────────────────────────────────────────────

INSERT INTO academy_courses (id, title, description, category, instructor, duration, total_modules, level, thumbnail, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Introdução ao Mercado Imobiliário',        'Conhecimento geral do mercado, segmentos (MCMV, Médio e Alto Padrão) e jornada do consumidor.',            'Introdução', 'Marco Andolfato',            '4h 30min', 3,  'iniciante',     'intro',        1),
  ('00000000-0000-0000-0000-000000000002', 'O Lançamento Imobiliário',                  'Etapas do lançamento: planejamento, cronograma, teaser, pré-lançamento, lançamento e sustentação.',         'Lançamento', 'Ruy Lima',                   '8h 00min', 7,  'intermediario', 'lancamento',   2),
  ('00000000-0000-0000-0000-000000000003', 'Branding para Lançamentos',                 'Storytelling do produto, critérios de marca, enxoval de vendas e identidade de empreendimento.',            'Branding',   'Marco Andolfato',            '6h 15min', 4,  'avancado',      'branding',     3),
  ('00000000-0000-0000-0000-000000000004', 'Marketing Imobiliário',                     'Princípios de Kotler (5P''s), pesquisa e análise de mercado, plano de marketing e mídias.',                 'Marketing',  'Ruy Lima',                   '10h 00min',6,  'intermediario', 'marketing',    4),
  ('00000000-0000-0000-0000-000000000005', 'Digital 3D e Renders',                      'A importância do render, como utilizar imagens para vendas e análise de storytelling 3D.',                  'Digital 3D', 'Equipe TBO',                 '5h 30min', 4,  'intermediario', '3d',           5),
  ('00000000-0000-0000-0000-000000000006', 'Audiovisual Imobiliário',                   'Cinema no mercado imobiliário, processo criativo, impacto dos filmes e set de filmagem.',                   'Audiovisual','Equipe TBO',                 '6h 00min', 4,  'avancado',      'audiovisual',  6),
  ('00000000-0000-0000-0000-000000000007', 'Processos do Lançamento',                   'Arquitetura e interiores, jurídico, vendas/comercial e incorporação imobiliária.',                          'Processos',  'Especialistas Convidados',   '7h 30min', 4,  'avancado',      'processos',    7),
  ('00000000-0000-0000-0000-000000000008', 'Metodologia TBO Core',                      'O framework proprietário da TBO para gestão completa de lançamentos imobiliários.',                         'Metodologia','Marco Andolfato & Ruy Lima', '12h 00min',6,  'avancado',      'tbocore',      8)
ON CONFLICT (id) DO NOTHING;

-- ─── Seed: Modules ───────────────────────────────────────────────

INSERT INTO academy_modules (id, course_id, title, duration, sort_order, video_url) VALUES
  -- Curso 1: Introdução ao Mercado Imobiliário
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Conhecimento Geral do Mercado Imobiliário',              '1h 30min', 1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Segmentos de Mercado: MCMV, Médio e Alto Padrão',        '1h 30min', 2, 'https://www.youtube.com/embed/LXb3EKWsInQ'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Jornada do Consumidor sob a Ótica do Consumidor',        '1h 30min', 3, NULL),

  -- Curso 2: O Lançamento Imobiliário
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Introdução: Etapas do Lançamento',                       '1h 00min', 1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Preparação: Checklist para Cada Etapa',                  '1h 15min', 2, 'https://www.youtube.com/embed/LXb3EKWsInQ'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Planejamento de Cronograma e Orçamento',                 '1h 15min', 3, NULL),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Teaser',                                                 '1h 00min', 4, NULL),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Pré-Lançamento',                                         '1h 00min', 5, NULL),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'Lançamento',                                             '1h 15min', 6, NULL),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'Sustentação',                                            '1h 15min', 7, NULL),

  -- Curso 3: Branding para Lançamentos
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Por que Branding é Importante para o Lançamento?',       '1h 30min', 1, NULL),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Como Criar Storytelling de um Produto Imobiliário?',     '1h 45min', 2, NULL),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Critérios para Identificar se a Marca Representa o Produto', '1h 30min', 3, NULL),
  ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Enxoval de Vendas — O que Compõe?',                      '1h 30min', 4, NULL),

  -- Curso 4: Marketing Imobiliário
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'Princípios do Marketing — Philip Kotler e os 5P''s',    '1h 45min', 1, NULL),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'Pesquisa de Mercado',                                    '1h 30min', 2, NULL),
  ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'Análise de Mercado e Público Alvo',                      '1h 45min', 3, NULL),
  ('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'Plano de Marketing',                                     '1h 45min', 4, NULL),
  ('40000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 'Plano de Mídias',                                        '1h 30min', 5, NULL),
  ('40000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', 'Show Time',                                              '1h 45min', 6, NULL),

  -- Curso 5: Digital 3D e Renders
  ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'A Importância do Render no Lançamento Imobiliário',      '1h 15min', 1, NULL),
  ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'Como Utilizar as Imagens em Favor das Vendas',           '1h 30min', 2, NULL),
  ('50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'Como é Criado um Render 3D?',                            '1h 15min', 3, NULL),
  ('50000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'Análise de Imagem 3D como Storytelling do Produto',      '1h 30min', 4, NULL),

  -- Curso 6: Audiovisual Imobiliário
  ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'O Cinema no Mercado Imobiliário',                        '1h 30min', 1, NULL),
  ('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 'O Processo Criativo de um Filme',                        '1h 30min', 2, NULL),
  ('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', 'O Impacto dos Filmes na Aquisição do Imóvel',            '1h 30min', 3, NULL),
  ('60000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 'O Set de Filmagem',                                      '1h 30min', 4, NULL),

  -- Curso 7: Processos do Lançamento
  ('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 'Arquitetura e Interiores',                               '1h 45min', 1, NULL),
  ('70000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', 'Jurídico',                                               '2h 00min', 2, NULL),
  ('70000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', 'Vendas e Comercial',                                     '2h 00min', 3, NULL),
  ('70000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000007', 'Incorporação Imobiliária',                               '1h 45min', 4, NULL),

  -- Curso 8: Metodologia TBO Core
  ('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000008', 'Fundamentos do Framework TBO',                           '2h 00min', 1, NULL),
  ('80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000008', 'Diagnóstico e Planejamento',                             '2h 00min', 2, NULL),
  ('80000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 'Execução e Gestão de Entregas',                          '2h 00min', 3, NULL),
  ('80000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000008', 'Métricas e Performance',                                 '2h 00min', 4, NULL),
  ('80000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000008', 'Escala e Replicação',                                    '2h 00min', 5, NULL),
  ('80000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000008', 'Cases TBO — Aplicação Real',                             '2h 00min', 6, NULL)
ON CONFLICT (id) DO NOTHING;
