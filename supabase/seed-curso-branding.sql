-- ============================================================
-- SEED: Curso "Branding Imobiliário: Do Briefing à Entrega"
-- Execute via Supabase SQL Editor para popular o curso de demo
-- ============================================================

-- 1. Criar o curso
INSERT INTO academy_courses (id, title, slug, description, category, instructor, thumbnail_url, level, status, sort_order, tags)
VALUES (
  'c1000000-0000-0000-0000-000000000001',
  'Branding Imobiliário: Do Briefing à Entrega',
  'branding-imobiliario-do-briefing-a-entrega',
  '{"text": "Curso completo que percorre toda a jornada de branding para empreendimentos imobiliários — do primeiro contato com o cliente até a entrega final. Aprenda a construir marcas que posicionam, diferenciam e vendem."}',
  'Branding',
  'Marco Andolfato',
  NULL,
  'intermediario',
  'published',
  1,
  ARRAY['branding', 'imobiliário', 'briefing', 'identidade visual', 'naming']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Módulo 1: Fundamentos do Branding Imobiliário
INSERT INTO academy_modules (id, course_id, title, description, sort_order)
VALUES (
  'm1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'Fundamentos do Branding Imobiliário',
  '{"text": "Entenda o que diferencia branding imobiliário de branding convencional e por que incorporadoras precisam de posicionamento estratégico."}',
  0
)
ON CONFLICT (id) DO NOTHING;

-- Aulas do Módulo 1
INSERT INTO academy_lessons (id, module_id, title, video_url, video_duration_sec, sort_order, is_free, status) VALUES
  ('l1000000-0000-0000-0000-000000000001', 'm1000000-0000-0000-0000-000000000001', 'O que é Branding Imobiliário?', NULL, 720, 0, true, 'published'),
  ('l1000000-0000-0000-0000-000000000002', 'm1000000-0000-0000-0000-000000000001', 'Diferenças entre marca de produto e marca de empreendimento', NULL, 900, 1, false, 'published'),
  ('l1000000-0000-0000-0000-000000000003', 'm1000000-0000-0000-0000-000000000001', 'O papel do branding no funil de vendas imobiliário', NULL, 840, 2, false, 'published'),
  ('l1000000-0000-0000-0000-000000000004', 'm1000000-0000-0000-0000-000000000001', 'Cases de sucesso: Cyrela, JHSF, Lavvi', NULL, 1080, 3, false, 'published')
ON CONFLICT (id) DO NOTHING;

-- 3. Módulo 2: Briefing Criativo
INSERT INTO academy_modules (id, course_id, title, description, sort_order)
VALUES (
  'm1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000001',
  'Briefing Criativo',
  '{"text": "Como conduzir uma reunião de briefing, quais perguntas fazer e como documentar as decisões que vão guiar todo o projeto."}',
  1
)
ON CONFLICT (id) DO NOTHING;

-- Aulas do Módulo 2
INSERT INTO academy_lessons (id, module_id, title, video_url, video_duration_sec, sort_order, is_free, status) VALUES
  ('l1000000-0000-0000-0000-000000000005', 'm1000000-0000-0000-0000-000000000002', 'Anatomia de um briefing eficaz', NULL, 660, 0, false, 'published'),
  ('l1000000-0000-0000-0000-000000000006', 'm1000000-0000-0000-0000-000000000002', 'As 20 perguntas essenciais para o cliente', NULL, 780, 1, false, 'published'),
  ('l1000000-0000-0000-0000-000000000007', 'm1000000-0000-0000-0000-000000000002', 'Mapeando o público-alvo: perfil psicográfico do comprador', NULL, 960, 2, false, 'published'),
  ('l1000000-0000-0000-0000-000000000008', 'm1000000-0000-0000-0000-000000000002', 'Template TBO: Documento de Briefing', NULL, 540, 3, false, 'published')
ON CONFLICT (id) DO NOTHING;

-- 4. Módulo 3: Pesquisa e Posicionamento
INSERT INTO academy_modules (id, course_id, title, description, sort_order)
VALUES (
  'm1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000001',
  'Pesquisa e Posicionamento',
  '{"text": "Análise de concorrência, mapeamento de mercado e definição do posicionamento estratégico do empreendimento."}',
  2
)
ON CONFLICT (id) DO NOTHING;

-- Aulas do Módulo 3
INSERT INTO academy_lessons (id, module_id, title, video_url, video_duration_sec, sort_order, is_free, status) VALUES
  ('l1000000-0000-0000-0000-000000000009', 'm1000000-0000-0000-0000-000000000003', 'Análise de concorrência: como mapear o mercado local', NULL, 840, 0, false, 'published'),
  ('l1000000-0000-0000-0000-000000000010', 'm1000000-0000-0000-0000-000000000003', 'Posicionamento: onde seu empreendimento se encaixa?', NULL, 720, 1, false, 'published'),
  ('l1000000-0000-0000-0000-000000000011', 'm1000000-0000-0000-0000-000000000003', 'Arquétipos de marca aplicados ao mercado imobiliário', NULL, 900, 2, false, 'published')
ON CONFLICT (id) DO NOTHING;

-- 5. Módulo 4: Naming e Identidade Verbal
INSERT INTO academy_modules (id, course_id, title, description, sort_order)
VALUES (
  'm1000000-0000-0000-0000-000000000004',
  'c1000000-0000-0000-0000-000000000001',
  'Naming e Identidade Verbal',
  '{"text": "Processo criativo de naming, taglines e tom de voz para empreendimentos de diferentes segmentos."}',
  3
)
ON CONFLICT (id) DO NOTHING;

-- Aulas do Módulo 4
INSERT INTO academy_lessons (id, module_id, title, video_url, video_duration_sec, sort_order, is_free, status) VALUES
  ('l1000000-0000-0000-0000-000000000012', 'm1000000-0000-0000-0000-000000000004', 'Metodologia de naming: do brainstorm à shortlist', NULL, 1020, 0, false, 'published'),
  ('l1000000-0000-0000-0000-000000000013', 'm1000000-0000-0000-0000-000000000004', 'Verificação de disponibilidade: INPI e domínios', NULL, 600, 1, false, 'published'),
  ('l1000000-0000-0000-0000-000000000014', 'm1000000-0000-0000-0000-000000000004', 'Taglines que vendem: técnicas de copywriting imobiliário', NULL, 780, 2, false, 'published'),
  ('l1000000-0000-0000-0000-000000000015', 'm1000000-0000-0000-0000-000000000004', 'Tom de voz por segmento: econômico, médio, alto e AAA', NULL, 900, 3, false, 'published')
ON CONFLICT (id) DO NOTHING;

-- 6. Módulo 5: Identidade Visual
INSERT INTO academy_modules (id, course_id, title, description, sort_order)
VALUES (
  'm1000000-0000-0000-0000-000000000005',
  'c1000000-0000-0000-0000-000000000001',
  'Identidade Visual',
  '{"text": "Direção de arte, paleta cromática, tipografia e construção do sistema visual do empreendimento."}',
  4
)
ON CONFLICT (id) DO NOTHING;

-- Aulas do Módulo 5
INSERT INTO academy_lessons (id, module_id, title, video_url, video_duration_sec, sort_order, is_free, status) VALUES
  ('l1000000-0000-0000-0000-000000000016', 'm1000000-0000-0000-0000-000000000005', 'Moodboard: como traduzir o briefing em direção visual', NULL, 840, 0, false, 'published'),
  ('l1000000-0000-0000-0000-000000000017', 'm1000000-0000-0000-0000-000000000005', 'Paleta cromática: psicologia das cores no imobiliário', NULL, 960, 1, false, 'published'),
  ('l1000000-0000-0000-0000-000000000018', 'm1000000-0000-0000-0000-000000000005', 'Tipografia e hierarquia visual', NULL, 720, 2, false, 'published'),
  ('l1000000-0000-0000-0000-000000000019', 'm1000000-0000-0000-0000-000000000005', 'Logotipo do empreendimento: processo criativo', NULL, 1200, 3, false, 'published'),
  ('l1000000-0000-0000-0000-000000000020', 'm1000000-0000-0000-0000-000000000005', 'Manual de marca: o que entregar e como documentar', NULL, 660, 4, false, 'published')
ON CONFLICT (id) DO NOTHING;

-- 7. Módulo 6: Entrega e Desdobramentos
INSERT INTO academy_modules (id, course_id, title, description, sort_order)
VALUES (
  'm1000000-0000-0000-0000-000000000006',
  'c1000000-0000-0000-0000-000000000001',
  'Entrega e Desdobramentos',
  '{"text": "Como estruturar a entrega final, apresentar ao cliente e desdobrar a marca em peças de comunicação."}',
  5
)
ON CONFLICT (id) DO NOTHING;

-- Aulas do Módulo 6
INSERT INTO academy_lessons (id, module_id, title, video_url, video_duration_sec, sort_order, is_free, status) VALUES
  ('l1000000-0000-0000-0000-000000000021', 'm1000000-0000-0000-0000-000000000006', 'Montando a apresentação de entrega', NULL, 780, 0, false, 'published'),
  ('l1000000-0000-0000-0000-000000000022', 'm1000000-0000-0000-0000-000000000006', 'Desdobramentos: papelaria, sinalização e digital', NULL, 900, 1, false, 'published'),
  ('l1000000-0000-0000-0000-000000000023', 'm1000000-0000-0000-0000-000000000006', 'Handoff para o time de campanha e archviz', NULL, 720, 2, false, 'published'),
  ('l1000000-0000-0000-0000-000000000024', 'm1000000-0000-0000-0000-000000000006', 'Aula final: revisão e próximos passos', NULL, 600, 3, false, 'published')
ON CONFLICT (id) DO NOTHING;

-- 8. Atualizar total_modules no curso
UPDATE academy_courses
SET total_modules = 6,
    updated_at = now()
WHERE id = 'c1000000-0000-0000-0000-000000000001';

-- ============================================================
-- Resultado esperado:
-- 1 Curso: "Branding Imobiliário: Do Briefing à Entrega"
-- 6 Módulos com 24 aulas no total (~3h20 de conteúdo)
--
-- Módulo 1: Fundamentos do Branding Imobiliário (4 aulas)
-- Módulo 2: Briefing Criativo (4 aulas)
-- Módulo 3: Pesquisa e Posicionamento (3 aulas)
-- Módulo 4: Naming e Identidade Verbal (4 aulas)
-- Módulo 5: Identidade Visual (5 aulas)
-- Módulo 6: Entrega e Desdobramentos (4 aulas)
-- ============================================================
