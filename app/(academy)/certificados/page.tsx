"use client"

import { useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared"
import { MOCK_COURSES } from "@/features/courses/data/mock-courses"
import {
  IconCertificate,
  IconDownload,
  IconShare,
  IconCalendar,
  IconLoader2,
} from "@tabler/icons-react"
import { useState } from "react"

function useCertificateDownload() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const download = useCallback(async (courseId: string, courseTitle: string, instructor: string) => {
    setDownloading(courseId)
    try {
      const params = new URLSearchParams({ courseId, courseTitle, instructor })
      const res = await fetch(`/api/academy/certificate?${params.toString()}`)
      if (!res.ok) throw new Error("Falha ao gerar certificado")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `certificado-${courseId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert("Erro ao baixar o certificado. Tente novamente.")
    } finally {
      setDownloading(null)
    }
  }, [])

  return { download, downloading }
}

export default function CertificadosPage() {
  const completedCourses = useMemo(
    () => MOCK_COURSES.filter((c) => c.status === "concluido"),
    []
  )
  const { download, downloading } = useCertificateDownload()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificados"
        description="Certificados conquistados ao concluir cursos"
      />

      {completedCourses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {completedCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden group py-0 gap-0">
              {/* Certificate visual — Lumin */}
              <div className="relative bg-black p-6 flex flex-col items-center text-center overflow-hidden">
                <div className="absolute -right-6 -top-6 size-24 rounded-full bg-[#BAF241]/10" />
                <div className="relative flex size-16 items-center justify-center rounded-2xl bg-[#BAF241] text-black text-2xl mb-3">
                  <IconCertificate className="size-8" />
                </div>
                <h3 className="font-semibold text-sm text-white">{course.title}</h3>
                <p className="text-xs text-white/50 mt-1">
                  {course.instructor}
                </p>
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <IconCalendar className="size-3" />
                    Concluído em Mar 2026
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {course.category}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    disabled={downloading === course.id}
                    onClick={() => download(course.id, course.title, course.instructor)}
                  >
                    {downloading === course.id ? (
                      <IconLoader2 className="size-3 animate-spin" />
                    ) : (
                      <IconDownload className="size-3" />
                    )}
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <IconShare className="size-3" />
                    Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={IconCertificate}
          title="Nenhum certificado ainda"
          description="Conclua um curso completo para receber seu primeiro certificado."
        />
      )}
    </div>
  )
}
