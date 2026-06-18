// ============================================================
// TBO Academy — taxonomia/config de cursos (NÃO é mock de dados).
// Os dados de cursos/módulos/aulas vêm do Supabase via os hooks
// (use-courses / use-course). Aqui ficam só listas estáticas de
// configuração reaproveitadas pela UI (categorias e módulos opcionais).
// ============================================================

// ─── Módulos adicionais (opcionais) ─────────────────────────────

export const OPTIONAL_MODULES = [
  "Tráfego Pago",
  "Marketing Offline",
  "Detalhamento de Projetos",
  "Comunicação Visual",
  "Inteligência Artificial",
  "Atendimento ao Público",
  "Plantão de Vendas (Experiências Sensoriais)",
  "Do Início até a Entrega",
  "Render 3D",
  "Audiovisual para Corretores",
  "Audiovisual para Arquitetos",
  "Branding Institucional",
] as const;

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
] as const;

export type CourseCategory = (typeof COURSE_CATEGORIES)[number];
