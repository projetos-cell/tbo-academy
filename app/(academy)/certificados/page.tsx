"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { IconCertificate, IconDownload, IconShare, IconCalendar, IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";

function useCertificateDownload() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const download = useCallback(async (courseId: string, courseTitle: string, instructor: string) => {
    setDownloading(courseId);
    try {
      const params = new URLSearchParams({ courseId, courseTitle, instructor });
      const res = await fetch(`/api/academy/certificate?${params.toString()}`);
      if (!res.ok) throw new Error("Falha ao gerar certificado");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado-${courseId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erro ao baixar o certificado. Tente novamente.");
    } finally {
      setDownloading(null);
    }
  }, []);

  return { download, downloading };
}

export default function CertificadosPage() {
  const router = useRouter();
  const { data: dbCourses, isLoading } = useCourses();
  const completedCourses = useMemo(
    () => (dbCourses ?? []).filter((c) => c.status === "concluido"),
    [dbCourses],
  );
  const { download, downloading } = useCertificateDownload();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Conquistas"
        title="Certificados"
        description="Certificados conquistados ao concluir cursos"
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-2xl" />
          ))}
        </div>
      ) : completedCourses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {completedCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-card relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]"
            >
              {/* Certificate visual — forest treatment do DS */}
              <div className="from-forest-800 to-forest-950 relative flex flex-col items-center overflow-hidden bg-gradient-to-br p-6 text-center">
                <div
                  className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(186,242,65,.16), transparent 62%)" }}
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {course.category}
                </span>
                <div className="bg-volt text-ink relative mt-4 mb-3 flex size-16 items-center justify-center rounded-2xl">
                  <IconCertificate className="size-8" />
                </div>
                <h3 className="font-display text-[15px] leading-tight font-bold tracking-tight text-white">
                  {course.title}
                </h3>
                <p className="mt-1 text-xs text-white/70">{course.instructor}</p>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <span className="flex items-center gap-1.5 text-xs text-[var(--tbo-gray-500)]">
                  <IconCalendar className="text-forest-500 size-3.5" />
                  Curso concluído
                </span>

                <div className="mt-4 flex gap-2">
                  <button
                    disabled={downloading === course.id}
                    onClick={() => download(course.id, course.title, course.instructor)}
                    className="bg-forest-900 hover:bg-ink flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-[13px] font-bold text-white transition-all hover:-translate-y-px disabled:pointer-events-none disabled:opacity-60"
                  >
                    {downloading === course.id ? (
                      <IconLoader2 className="size-3.5 animate-spin" />
                    ) : (
                      <IconDownload className="size-3.5" />
                    )}
                    Download
                  </button>
                  <button className="text-ink flex flex-1 items-center justify-center gap-1.5 rounded-full border border-black/10 py-2.5 text-[13px] font-bold transition-all hover:-translate-y-px hover:bg-black/[0.04]">
                    <IconShare className="size-3.5" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={IconCertificate}
          title="Você ainda não tem certificados"
          description="Conclua um curso completo para receber seu primeiro certificado."
          cta={{ label: "Explorar cursos", onClick: () => router.push("/explorar") }}
        />
      )}
    </div>
  );
}
