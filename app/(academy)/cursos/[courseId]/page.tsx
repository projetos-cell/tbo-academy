"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { MOCK_COURSES, MOCK_MODULES } from "@/features/courses/data/mock-courses"
import { CourseDetailHeader } from "@/features/courses/components/course-detail-header"
import { CourseVideoPlayer } from "@/features/courses/components/course-video-player"
import { CourseModulesList } from "@/features/courses/components/course-modules-list"
import { CourseAbout } from "@/features/courses/components/course-about"
import type { CourseModule } from "@/features/courses/types"
import { EmptyState } from "@/components/shared"
import { IconSchool } from "@tabler/icons-react"
import { ContentGate } from "@/features/academy/components/content-gate"
import { ContentTeaser } from "@/features/academy/components/content-teaser"
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store"
import { usePreviewSession } from "@/features/academy/hooks/use-preview-session"

/** Mock takeaways per course category */
const COURSE_TAKEAWAYS: Record<string, string[]> = {
  Design: [
    "Como criar identidades visuais que comunicam posicionamento",
    "Processo de briefing que elimina 70% das refações",
    "Princípios de tipografia e cor aplicados ao mercado imobiliário",
  ],
  Branding: [
    "Framework de posicionamento de marca para incorporadoras",
    "Arquitetura de marca: produto vs. institucional",
    "Storytelling que conecta emocionalmente com o comprador",
  ],
  "Marketing Digital": [
    "Como dimensionar investimento em mídia por fase de lançamento",
    "Funil de captação de leads qualificados para imóveis",
    "Métricas que realmente importam em cada etapa",
  ],
  Copywriting: [
    "Princípios de persuasão aplicados ao mercado imobiliário",
    "Headlines que convertem para landing pages de empreendimentos",
    "A diferença entre falar DO produto e falar COM o comprador",
  ],
  "Motion Graphics": [
    "Animações de impacto para redes sociais imobiliárias",
    "Técnicas de timing e ritmo para manter atenção",
    "Workflow de produção: do storyboard ao render final",
  ],
  "UI/UX": [
    "Pesquisa de usuário aplicada a plataformas imobiliárias",
    "Design system escalável para múltiplos empreendimentos",
    "Prototipagem rápida no Figma com componentes reutilizáveis",
  ],
  "Social Media": [
    "Planejamento editorial para incorporadoras",
    "Métricas de engajamento que indicam intenção de compra",
    "Gestão de comunidade no mercado de alto padrão",
  ],
  Gestao: [
    "Metodologias ágeis adaptadas para lançamentos imobiliários",
    "Como montar cronograma reverso a partir do Dia D",
    "Gestão de fornecedores criativos sem dependência",
  ],
}

const DEFAULT_TAKEAWAYS = [
  "Fundamentos aplicados ao mercado imobiliário",
  "Frameworks práticos para uso imediato",
  "Cases reais de incorporadoras brasileiras",
]

export default function AcademyCourseDetailPage() {
  const params = useParams<{ courseId: string }>()
  const courseId = params.courseId
  const isPreview = usePreviewStore((s) => s.isPreview)
  const { isCourseUnlocked, trackCourseExplored, trackEvent } = usePreviewSession()

  const course = useMemo(
    () => MOCK_COURSES.find((c) => c.id === courseId),
    [courseId]
  )

  const modules = useMemo(
    () =>
      MOCK_MODULES.filter((m) => m.courseId === courseId).sort(
        (a, b) => a.order - b.order
      ),
    [courseId]
  )

  const currentModule = useMemo(
    () => modules.find((m) => m.status === "in_progress") ?? modules[0],
    [modules]
  )

  const [activeModule, setActiveModule] = useState<CourseModule | undefined>(
    currentModule
  )

  const [teaserWatched, setTeaserWatched] = useState(false)

  // Track course browse in preview mode
  useEffect(() => {
    if (isPreview && courseId) {
      trackCourseExplored(courseId)
    }
  }, [isPreview, courseId, trackCourseExplored])

  if (!course) {
    return (
      <EmptyState
        icon={IconSchool}
        title="Curso não encontrado"
        description="O curso que você está procurando não existe ou foi removido."
        cta={{ label: "Voltar para Academy", onClick: () => window.history.back() }}
      />
    )
  }

  const isUnlocked = isPreview && isCourseUnlocked(courseId)
  const takeaways = COURSE_TAKEAWAYS[course.category] ?? DEFAULT_TAKEAWAYS

  const handleTeaserPlay = () => {
    setTeaserWatched(true)
    trackEvent("teaser_watched", { courseId, category: course.category })
  }

  // Build teaser content for video area
  const videoTeaser = (
    <ContentTeaser
      title={activeModule?.title ?? course.title}
      category={course.category}
      duration={course.duration}
      takeaways={takeaways}
      summary={course.description}
      teaserWatched={teaserWatched}
      onTeaserPlay={handleTeaserPlay}
    />
  )

  return (
    <div className="space-y-6">
      <CourseDetailHeader course={course} backHref="/explorar" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ContentGate
            label="Assista às aulas com o plano Essencial"
            courseId={courseId}
            previewLevel={isPreview ? "teaser" : "none"}
            previewContent={videoTeaser}
          >
            <CourseVideoPlayer
              category={course.category}
              currentModuleTitle={activeModule?.title ?? course.title}
            />
          </ContentGate>
          <CourseAbout course={course} />
        </div>

        <div className="lg:col-span-1">
          <ContentGate
            label="Acesse os módulos do curso"
            courseId={courseId}
            previewLevel={isPreview && isUnlocked ? "full" : "none"}
          >
            <CourseModulesList
              modules={modules}
              completedCount={course.completedModules}
              totalCount={course.totalModules}
              progress={course.progress}
              activeModuleId={activeModule?.id}
              onModuleClick={setActiveModule}
            />
          </ContentGate>
        </div>
      </div>
    </div>
  )
}
