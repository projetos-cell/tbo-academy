import type { Course, CourseModule, LearningPath, LeaderboardEntry } from "../types"

// ─── Módulos de Mercado Imobiliário ─────────────────────────────

export const MOCK_COURSES: Course[] = [
  // ── MÓDULO 1 — Introdução ──
  {
    id: "c1",
    title: "Introdução ao Mercado Imobiliário",
    description:
      "Conhecimento geral do mercado, segmentos (MCMV, Médio e Alto Padrão) e jornada do consumidor.",
    category: "Introdução",
    instructor: "Marco Andolfato",
    thumbnail: "intro",
    duration: "4h 30min",
    totalModules: 3,
    completedModules: 3,
    progress: 100,
    rating: 4.9,
    students: 87,
    level: "iniciante",
    status: "concluido",
    tags: ["mercado imobiliário", "segmentos", "MCMV", "alto padrão"],
  },
  // ── MÓDULO 2 — Lançamento ──
  {
    id: "c2",
    title: "O Lançamento Imobiliário",
    description:
      "Etapas do lançamento: planejamento, cronograma, teaser, pré-lançamento, lançamento e sustentação.",
    category: "Lançamento",
    instructor: "Ruy Lima",
    thumbnail: "lancamento",
    duration: "8h 00min",
    totalModules: 7,
    completedModules: 5,
    progress: 71,
    rating: 4.8,
    students: 64,
    level: "intermediario",
    status: "em_andamento",
    tags: ["lançamento", "cronograma", "teaser", "pré-lançamento"],
  },
  // ── MÓDULO 3 — Bastidores: Branding ──
  {
    id: "c3",
    title: "Branding para Lançamentos",
    description:
      "Storytelling do produto, critérios de marca, enxoval de vendas e identidade de empreendimento.",
    category: "Branding",
    instructor: "Marco Andolfato",
    thumbnail: "branding",
    duration: "6h 15min",
    totalModules: 4,
    completedModules: 4,
    progress: 100,
    rating: 4.9,
    students: 52,
    level: "avancado",
    status: "concluido",
    tags: ["branding", "storytelling", "enxoval de vendas", "marca"],
  },
  // ── MÓDULO 3 — Bastidores: Marketing ──
  {
    id: "c4",
    title: "Marketing Imobiliário",
    description:
      "Princípios de Kotler (5P's), pesquisa e análise de mercado, plano de marketing e mídias.",
    category: "Marketing",
    instructor: "Ruy Lima",
    thumbnail: "marketing",
    duration: "10h 00min",
    totalModules: 6,
    completedModules: 2,
    progress: 33,
    rating: 4.7,
    students: 71,
    level: "intermediario",
    status: "em_andamento",
    tags: ["marketing", "5Ps", "plano de mídias", "público alvo"],
  },
  // ── MÓDULO 3 — Bastidores: Digital 3D ──
  {
    id: "c5",
    title: "Digital 3D e Renders",
    description:
      "A importância do render, como utilizar imagens para vendas e análise de storytelling 3D.",
    category: "Digital 3D",
    instructor: "Equipe TBO",
    thumbnail: "3d",
    duration: "5h 30min",
    totalModules: 4,
    completedModules: 0,
    progress: 0,
    rating: 4.8,
    students: 39,
    level: "intermediario",
    status: "nao_iniciado",
    tags: ["render 3D", "visualização", "storytelling visual"],
  },
  // ── MÓDULO 3 — Bastidores: Audiovisual ──
  {
    id: "c6",
    title: "Audiovisual Imobiliário",
    description:
      "Cinema no mercado imobiliário, processo criativo, impacto dos filmes e set de filmagem.",
    category: "Audiovisual",
    instructor: "Equipe TBO",
    thumbnail: "audiovisual",
    duration: "6h 00min",
    totalModules: 4,
    completedModules: 1,
    progress: 25,
    rating: 4.9,
    students: 33,
    level: "avancado",
    status: "em_andamento",
    tags: ["audiovisual", "cinema", "filme imobiliário", "filmagem"],
  },
  // ── MÓDULO 4 — Processos do Lançamento ──
  {
    id: "c7",
    title: "Processos do Lançamento",
    description:
      "Arquitetura e interiores, jurídico, vendas/comercial e incorporação imobiliária.",
    category: "Processos",
    instructor: "Especialistas Convidados",
    thumbnail: "processos",
    duration: "7h 30min",
    totalModules: 4,
    completedModules: 0,
    progress: 0,
    rating: 4.6,
    students: 28,
    level: "avancado",
    status: "nao_iniciado",
    tags: ["arquitetura", "jurídico", "vendas", "incorporação"],
  },
  // ── Metodologia TBO Core ──
  {
    id: "c8",
    title: "Metodologia TBO Core",
    description:
      "O framework proprietário da TBO para gestão completa de lançamentos imobiliários.",
    category: "Metodologia",
    instructor: "Marco Andolfato & Ruy Lima",
    thumbnail: "tbocore",
    duration: "12h 00min",
    totalModules: 6,
    completedModules: 3,
    progress: 50,
    rating: 5.0,
    students: 45,
    level: "avancado",
    status: "em_andamento",
    tags: ["TBO Core", "metodologia", "framework", "gestão"],
  },
]

// ─── Módulos (aulas) de cada curso ──────────────────────────────

export const MOCK_MODULES: CourseModule[] = [
  // ── Módulo 1: Introdução ao Mercado Imobiliário ──
  { id: "m1-1", courseId: "c1", title: "Conhecimento Geral do Mercado Imobiliário", duration: "1h 30min", order: 1, status: "completed", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "m1-2", courseId: "c1", title: "Segmentos de Mercado: MCMV, Médio e Alto Padrão", duration: "1h 30min", order: 2, status: "completed", videoUrl: "https://www.youtube.com/embed/LXb3EKWsInQ" },
  { id: "m1-3", courseId: "c1", title: "Jornada do Consumidor sob a Ótica do Consumidor", duration: "1h 30min", order: 3, status: "completed" },

  // ── Módulo 2: O Lançamento Imobiliário ──
  { id: "m2-1", courseId: "c2", title: "Introdução: Etapas do Lançamento", duration: "1h 00min", order: 1, status: "completed", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "m2-2", courseId: "c2", title: "Preparação: Checklist para Cada Etapa", duration: "1h 15min", order: 2, status: "completed", videoUrl: "https://www.youtube.com/embed/LXb3EKWsInQ" },
  { id: "m2-3", courseId: "c2", title: "Planejamento de Cronograma e Orçamento", duration: "1h 15min", order: 3, status: "completed" },
  { id: "m2-4", courseId: "c2", title: "Teaser", duration: "1h 00min", order: 4, status: "completed" },
  { id: "m2-5", courseId: "c2", title: "Pré-Lançamento", duration: "1h 00min", order: 5, status: "completed" },
  { id: "m2-6", courseId: "c2", title: "Lançamento", duration: "1h 15min", order: 6, status: "in_progress" },
  { id: "m2-7", courseId: "c2", title: "Sustentação", duration: "1h 15min", order: 7, status: "locked" },

  // ── Módulo 3a: Branding para Lançamentos ──
  { id: "m3-1", courseId: "c3", title: "Por que Branding é Importante para o Lançamento?", duration: "1h 30min", order: 1, status: "completed" },
  { id: "m3-2", courseId: "c3", title: "Como Criar Storytelling de um Produto Imobiliário?", duration: "1h 45min", order: 2, status: "completed" },
  { id: "m3-3", courseId: "c3", title: "Critérios para Identificar se a Marca Representa o Produto", duration: "1h 30min", order: 3, status: "completed" },
  { id: "m3-4", courseId: "c3", title: "Enxoval de Vendas — O que Compõe?", duration: "1h 30min", order: 4, status: "completed" },

  // ── Módulo 3b: Marketing Imobiliário ──
  { id: "m4-1", courseId: "c4", title: "Princípios do Marketing — Philip Kotler e os 5P's", duration: "1h 45min", order: 1, status: "completed" },
  { id: "m4-2", courseId: "c4", title: "Pesquisa de Mercado", duration: "1h 30min", order: 2, status: "completed" },
  { id: "m4-3", courseId: "c4", title: "Análise de Mercado e Público Alvo", duration: "1h 45min", order: 3, status: "in_progress" },
  { id: "m4-4", courseId: "c4", title: "Plano de Marketing", duration: "1h 45min", order: 4, status: "locked" },
  { id: "m4-5", courseId: "c4", title: "Plano de Mídias", duration: "1h 30min", order: 5, status: "locked" },
  { id: "m4-6", courseId: "c4", title: "Show Time", duration: "1h 45min", order: 6, status: "locked" },

  // ── Módulo 3c: Digital 3D e Renders ──
  { id: "m5-1", courseId: "c5", title: "A Importância do Render no Lançamento Imobiliário", duration: "1h 15min", order: 1, status: "locked" },
  { id: "m5-2", courseId: "c5", title: "Como Utilizar as Imagens em Favor das Vendas", duration: "1h 30min", order: 2, status: "locked" },
  { id: "m5-3", courseId: "c5", title: "Como é Criado um Render 3D?", duration: "1h 15min", order: 3, status: "locked" },
  { id: "m5-4", courseId: "c5", title: "Análise de Imagem 3D como Storytelling do Produto", duration: "1h 30min", order: 4, status: "locked" },

  // ── Módulo 3d: Audiovisual Imobiliário ──
  { id: "m6-1", courseId: "c6", title: "O Cinema no Mercado Imobiliário", duration: "1h 30min", order: 1, status: "completed" },
  { id: "m6-2", courseId: "c6", title: "O Processo Criativo de um Filme", duration: "1h 30min", order: 2, status: "in_progress" },
  { id: "m6-3", courseId: "c6", title: "O Impacto dos Filmes na Aquisição do Imóvel", duration: "1h 30min", order: 3, status: "locked" },
  { id: "m6-4", courseId: "c6", title: "O Set de Filmagem", duration: "1h 30min", order: 4, status: "locked" },

  // ── Módulo 4: Processos do Lançamento ──
  { id: "m7-1", courseId: "c7", title: "Arquitetura e Interiores", duration: "1h 45min", order: 1, status: "locked" },
  { id: "m7-2", courseId: "c7", title: "Jurídico", duration: "2h 00min", order: 2, status: "locked" },
  { id: "m7-3", courseId: "c7", title: "Vendas e Comercial", duration: "2h 00min", order: 3, status: "locked" },
  { id: "m7-4", courseId: "c7", title: "Incorporação Imobiliária", duration: "1h 45min", order: 4, status: "locked" },

  // ── Metodologia TBO Core ──
  { id: "m8-1", courseId: "c8", title: "Fundamentos do Framework TBO", duration: "2h 00min", order: 1, status: "completed" },
  { id: "m8-2", courseId: "c8", title: "Diagnóstico e Planejamento", duration: "2h 00min", order: 2, status: "completed" },
  { id: "m8-3", courseId: "c8", title: "Execução e Gestão de Entregas", duration: "2h 00min", order: 3, status: "completed" },
  { id: "m8-4", courseId: "c8", title: "Métricas e Performance", duration: "2h 00min", order: 4, status: "in_progress" },
  { id: "m8-5", courseId: "c8", title: "Escala e Replicação", duration: "2h 00min", order: 5, status: "locked" },
  { id: "m8-6", courseId: "c8", title: "Cases TBO — Aplicação Real", duration: "2h 00min", order: 6, status: "locked" },
]

// ─── Trilhas de Aprendizado ─────────────────────────────────────

export const MOCK_LEARNING_PATHS: LearningPath[] = [
  {
    id: "lp1",
    title: "Mercado Imobiliário — Fundamentos",
    description:
      "Do zero ao lançamento: entenda o mercado, os segmentos e as etapas completas de um lançamento.",
    totalCourses: 2,
    completedCourses: 1,
    progress: 85,
  },
  {
    id: "lp2",
    title: "Bastidores do Lançamento",
    description:
      "Branding, marketing, 3D e audiovisual — as disciplinas que fazem um lançamento vender.",
    totalCourses: 4,
    completedCourses: 1,
    progress: 40,
  },
  {
    id: "lp3",
    title: "Processos e Metodologia",
    description:
      "Arquitetura, jurídico, vendas e o framework TBO Core para gestão completa.",
    totalCourses: 2,
    completedCourses: 0,
    progress: 25,
  },
]

// ─── Leaderboard ────────────────────────────────────────────────

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "u1", name: "Ana Beatriz", avatar: "AB", points: 2450, rank: 1 },
  { id: "u2", name: "Lucas Oliveira", avatar: "LO", points: 2120, rank: 2 },
  { id: "u3", name: "Mariana Costa", avatar: "MC", points: 1890, rank: 3 },
  { id: "u4", name: "Rafael Torres", avatar: "RT", points: 1650, rank: 4 },
  { id: "u5", name: "Julia Andrade", avatar: "JA", points: 1420, rank: 5 },
]

// ─── Categorias ─────────────────────────────────────────────────

export const COURSE_CATEGORIES = [
  "Introdução",
  "Lançamento",
  "Branding",
  "Marketing",
  "Digital 3D",
  "Audiovisual",
  "Processos",
  "Metodologia",
] as const

export type CourseCategory = (typeof COURSE_CATEGORIES)[number]
