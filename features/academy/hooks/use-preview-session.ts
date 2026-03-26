"use client"

import { useCallback, useEffect, useMemo } from "react"
import { create } from "zustand"
import { ETAPAS, getLevel, TRAILS } from "@/features/diagnostico/data/diagnostic-data"
import type { LevelKey } from "@/features/diagnostico/data/diagnostic-data"
import { MOCK_COURSES } from "@/features/courses/data/mock-courses"

// ─── Types ──────────────────────────────────────────────────────
type PreviewEventType =
  | "diagnostic_complete"
  | "lesson_watched"
  | "course_browsed"
  | "pricing_viewed"
  | "teaser_watched"
  | "return_visit"

interface PreviewEvent {
  type: PreviewEventType
  metadata: Record<string, unknown>
  timestamp: string
}

interface DiagnosticDraft {
  answers: Record<string, number>
  contextData: {
    stage?: string
    vgv?: string
    freq?: string
    deps?: string[]
    invest?: string
  }
  currentStep: number
  updatedAt: string
}

interface WeakArea {
  etapaIndex: number
  title: string
  score100: number
  level: { name: string; cls: LevelKey }
  insight: string
  recommendedTrail: { name: string; desc: string; modules: string[] } | null
  /** One free course mapped to this weakness */
  freeCourse: { id: string; title: string; category: string; duration: string; instructor: string } | null
}

interface PreviewSessionState {
  events: PreviewEvent[]
  weakAreas: WeakArea[]
  totalScore100: number
  totalLevel: { name: string; cls: LevelKey }
  unlockedCourseIds: string[]
  diagnosticComplete: boolean
  coursesExplored: number
  initialized: boolean
}

const STORAGE_KEY = "academy_preview_session"
const DRAFT_KEY = "diagnostic_draft"

// ─── Zustand store (client-only, ephemeral) ─────────────────────
const usePreviewSessionStore = create<
  PreviewSessionState & {
    _init: (state: PreviewSessionState) => void
    _addEvent: (event: PreviewEvent) => void
    _incExplored: () => void
  }
>((set) => ({
  events: [],
  weakAreas: [],
  totalScore100: 0,
  totalLevel: { name: "Cego", cls: "cego" },
  unlockedCourseIds: [],
  diagnosticComplete: false,
  coursesExplored: 0,
  initialized: false,
  _init: (state) => set({ ...state, initialized: true }),
  _addEvent: (event) =>
    set((s) => {
      const events = [...s.events, event]
      return { events }
    }),
  _incExplored: () => set((s) => ({ coursesExplored: s.coursesExplored + 1 })),
}))

// ─── Category → Course mapping for free unlocks ────────────────
const ETAPA_TO_CATEGORY: Record<number, string[]> = {
  0: ["Branding", "Gestao"], // Visão Estratégica
  1: ["Marketing Digital", "Copywriting"], // Conhecimento do Comprador
  2: ["Gestao", "Marketing Digital"], // Domínio do Processo
  3: ["Design", "UI/UX"], // Capacidade de Avaliação
  4: ["Gestao", "Social Media"], // Autonomia Decisória
}

function findFreeCourseForEtapa(etapaIndex: number): WeakArea["freeCourse"] {
  const categories = ETAPA_TO_CATEGORY[etapaIndex] ?? []
  for (const cat of categories) {
    const course = MOCK_COURSES.find((c) => c.category === cat)
    if (course) {
      return {
        id: course.id,
        title: course.title,
        category: course.category,
        duration: course.duration,
        instructor: course.instructor,
      }
    }
  }
  return null
}

// ─── Compute diagnostic results from stored draft ──────────────
function computeFromDraft(draft: DiagnosticDraft): {
  weakAreas: WeakArea[]
  totalScore100: number
  totalLevel: { name: string; cls: LevelKey }
  unlockedCourseIds: string[]
} {
  const { answers } = draft

  const etapaResults = ETAPAS.map((etapa, ei) => {
    let score = 0
    etapa.qs.forEach((q, qi) => {
      const val = answers[`${ei}_${qi}`]
      if (val) score += val * q.weight
    })
    score = Math.round(score)
    const pct = etapa.max > 0 ? score / etapa.max : 0
    const level = getLevel(pct)
    const score100 = Math.round(pct * 100)
    return { score, score100, pct, level, etapa, etapaIndex: ei }
  })

  const totalScore = etapaResults.reduce((a, r) => a + r.score, 0)
  const totalMax = ETAPAS.reduce((a, e) => a + e.max, 0)
  const totalPct = totalMax > 0 ? totalScore / totalMax : 0
  const totalScore100 = Math.round(totalPct * 100)
  const totalLevel = getLevel(totalPct)

  // Weak areas = score < 55% (threshold)
  const weakAreas: WeakArea[] = etapaResults
    .filter((r) => r.pct < 0.55)
    .sort((a, b) => a.pct - b.pct)
    .map((r) => {
      const trail = TRAILS.find((t) => t.etapas.includes(r.etapaIndex))
      const freeCourse = findFreeCourseForEtapa(r.etapaIndex)
      return {
        etapaIndex: r.etapaIndex,
        title: r.etapa.title,
        score100: r.score100,
        level: r.level,
        insight: "",
        recommendedTrail: trail
          ? { name: trail.name, desc: trail.desc, modules: trail.modules }
          : null,
        freeCourse,
      }
    })

  // Unlock 1 course per weak area (deduplicated)
  const seen = new Set<string>()
  const unlockedCourseIds: string[] = []
  for (const area of weakAreas) {
    if (area.freeCourse && !seen.has(area.freeCourse.id)) {
      seen.add(area.freeCourse.id)
      unlockedCourseIds.push(area.freeCourse.id)
    }
  }

  // If no weak areas, unlock first course as default
  if (unlockedCourseIds.length === 0 && MOCK_COURSES.length > 0) {
    unlockedCourseIds.push(MOCK_COURSES[0].id)
  }

  return { weakAreas, totalScore100, totalLevel, unlockedCourseIds }
}

// ─── Persistence helpers ────────────────────────────────────────
function loadSession(): PreviewSessionState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as PreviewSessionState
  } catch {
    // ignore
  }
  return null
}

function saveSession(state: PreviewSessionState): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // quota exceeded — ignore
  }
}

// ─── Main hook ──────────────────────────────────────────────────
export function usePreviewSession() {
  const store = usePreviewSessionStore()

  // Initialize from sessionStorage on mount
  useEffect(() => {
    if (store.initialized) return

    const existing = loadSession()
    if (existing) {
      usePreviewSessionStore.getState()._init(existing)
      return
    }

    // Compute from diagnostic draft
    const draftRaw = sessionStorage.getItem(DRAFT_KEY)
    if (draftRaw) {
      try {
        const draft = JSON.parse(draftRaw) as DiagnosticDraft
        const hasAnswers = Object.keys(draft.answers).length > 0
        if (hasAnswers) {
          const { weakAreas, totalScore100, totalLevel, unlockedCourseIds } =
            computeFromDraft(draft)
          const initial: PreviewSessionState = {
            events: [
              {
                type: "diagnostic_complete",
                metadata: { score: totalScore100 },
                timestamp: new Date().toISOString(),
              },
            ],
            weakAreas,
            totalScore100,
            totalLevel,
            unlockedCourseIds,
            diagnosticComplete: true,
            coursesExplored: 0,
            initialized: true,
          }
          usePreviewSessionStore.getState()._init(initial)
          saveSession(initial)
          return
        }
      } catch {
        // ignore parse errors
      }
    }

    // No diagnostic data — empty preview
    const empty: PreviewSessionState = {
      events: [],
      weakAreas: [],
      totalScore100: 0,
      totalLevel: { name: "Cego", cls: "cego" },
      unlockedCourseIds: MOCK_COURSES.length > 0 ? [MOCK_COURSES[0].id] : [],
      diagnosticComplete: false,
      coursesExplored: 0,
      initialized: true,
    }
    usePreviewSessionStore.getState()._init(empty)
  }, [store.initialized])

  // Persist on every change
  useEffect(() => {
    if (!store.initialized) return
    saveSession(store)
  }, [store])

  // ─── Actions ────────────────────────────────────────────────
  const trackEvent = useCallback(
    (type: PreviewEventType, metadata: Record<string, unknown> = {}) => {
      const event: PreviewEvent = {
        type,
        metadata,
        timestamp: new Date().toISOString(),
      }
      usePreviewSessionStore.getState()._addEvent(event)
    },
    []
  )

  const trackCourseExplored = useCallback(
    (courseId: string) => {
      const s = usePreviewSessionStore.getState()
      const alreadyTracked = s.events.some(
        (e) => e.type === "course_browsed" && e.metadata.courseId === courseId
      )
      if (!alreadyTracked) {
        trackEvent("course_browsed", { courseId })
        usePreviewSessionStore.getState()._incExplored()
      }
    },
    [trackEvent]
  )

  const isCourseUnlocked = useCallback(
    (courseId: string): boolean => {
      return store.unlockedCourseIds.includes(courseId)
    },
    [store.unlockedCourseIds]
  )

  // Derived: should show conversion trigger?
  const shouldShowConversion = useMemo(() => {
    return store.coursesExplored >= 3 || store.events.some((e) => e.type === "teaser_watched")
  }, [store.coursesExplored, store.events])

  const freeContentCount = store.unlockedCourseIds.length
  const exploredCount = store.coursesExplored

  return {
    ...store,
    trackEvent,
    trackCourseExplored,
    isCourseUnlocked,
    shouldShowConversion,
    freeContentCount,
    exploredCount,
  }
}
