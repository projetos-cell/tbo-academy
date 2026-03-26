import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer"
import React from "react"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#000000",
    padding: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },
  headerAccent: {
    backgroundColor: "#BAF241",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerAccentText: {
    color: "#000000",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  body: {
    padding: 60,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    color: "#888888",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 20,
    textAlign: "center",
  },
  studentName: {
    fontSize: 38,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 16,
  },
  coursePre: {
    fontSize: 13,
    color: "#555555",
    textAlign: "center",
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 40,
  },
  accentLine: {
    backgroundColor: "#BAF241",
    height: 3,
    width: 80,
    marginBottom: 40,
    borderRadius: 2,
  },
  metaRow: {
    flexDirection: "row",
    gap: 60,
    marginTop: 20,
  },
  metaBlock: {
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 9,
    color: "#888888",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
  },
  footer: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#AAAAAA",
    letterSpacing: 1,
  },
})

function CertificatePDF({
  studentName,
  courseTitle,
  completionDate,
  instructor,
  certificateId,
}: {
  studentName: string
  courseTitle: string
  completionDate: string
  instructor: string
  certificateId: string
}) {
  return (
    <Document
      title={`Certificado — ${courseTitle}`}
      author="TBO Academy"
      subject="Certificado de Conclusão"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>TBO ACADEMY</Text>
          <View style={styles.headerAccent}>
            <Text style={styles.headerAccentText}>CERTIFICADO</Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.label}>certifica que</Text>
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.coursePre}>concluiu com êxito o curso</Text>
          <Text style={styles.courseTitle}>{courseTitle}</Text>

          <View style={styles.accentLine} />

          <View style={styles.metaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Instrutor</Text>
              <Text style={styles.metaValue}>{instructor}</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Conclusão</Text>
              <Text style={styles.metaValue}>{completionDate}</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Certificado Nº</Text>
              <Text style={styles.metaValue}>{certificateId.slice(0, 8).toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            TBO Academy · tbo.academy · Certificado válido com autenticação digital
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get("courseId")
  const courseTitle = searchParams.get("courseTitle") ?? "Curso TBO Academy"
  const instructor = searchParams.get("instructor") ?? "TBO Academy"

  if (!courseId) {
    return NextResponse.json({ error: "courseId é obrigatório" }, { status: 400 })
  }

  // Get student name from auth metadata or email
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Aluno"

  const completionDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  // Upsert certificate record
  const { data: certRecord } = await supabase
    .from("academy_certificates" as never)
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        course_title: courseTitle,
      } as never,
      { onConflict: "user_id,course_id" }
    )
    .select("id" as never)
    .single()

  const certificateId =
    (certRecord as { id?: string } | null)?.id ?? `${user.id}-${courseId}`

  // Generate PDF
  const pdfBuffer = await renderToBuffer(
    <CertificatePDF
      studentName={fullName}
      courseTitle={courseTitle}
      completionDate={completionDate}
      instructor={instructor}
      certificateId={certificateId}
    />
  )

  const safeCourseTitle = courseTitle.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificado-${safeCourseTitle}.pdf"`,
      "Cache-Control": "no-store",
    },
  })
}
