import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import React from "react"

// Certificate styles with TBO Academy branding
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#000000",
    padding: 40,
    alignItems: "center",
  },
  headerTitle: {
    color: "#BAF241",
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 4,
  },
  headerSubtitle: {
    color: "#FFFFFF",
    fontSize: 11,
    marginTop: 6,
    opacity: 0.7,
    letterSpacing: 2,
  },
  body: {
    padding: 60,
    alignItems: "center",
    flex: 1,
  },
  declarationLabel: {
    color: "#666666",
    fontSize: 11,
    marginBottom: 24,
    textTransform: "uppercase",
    letterSpacing: 3,
  },
  studentName: {
    color: "#000000",
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    marginBottom: 24,
    textAlign: "center",
  },
  completionText: {
    color: "#444444",
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
  },
  courseName: {
    color: "#000000",
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  instructorText: {
    color: "#666666",
    fontSize: 11,
    marginBottom: 48,
    textAlign: "center",
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#BAF241",
    marginBottom: 48,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  footerItem: {
    alignItems: "center",
  },
  footerLabel: {
    color: "#999999",
    fontSize: 9,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  footerValue: {
    color: "#333333",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  accentBadge: {
    backgroundColor: "#BAF241",
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 32,
  },
  accentBadgeText: {
    color: "#000000",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },
})

function CertificatePDF({
  studentName,
  courseTitle,
  instructor,
  completionDate,
}: {
  studentName: string
  courseTitle: string
  instructor: string
  completionDate: string
}) {
  return React.createElement(
    Document,
    { title: `Certificado — ${courseTitle}` },
    React.createElement(
      Page,
      { size: "A4", orientation: "landscape", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.headerTitle }, "TBO ACADEMY"),
        React.createElement(Text, { style: styles.headerSubtitle }, "CERTIFICADO DE CONCLUSÃO")
      ),
      // Body
      React.createElement(
        View,
        { style: styles.body },
        React.createElement(Text, { style: styles.declarationLabel }, "Certificamos que"),
        React.createElement(Text, { style: styles.studentName }, studentName),
        React.createElement(View, { style: styles.divider }),
        React.createElement(
          View,
          { style: styles.accentBadge },
          React.createElement(Text, { style: styles.accentBadgeText }, "CURSO CONCLUÍDO COM ÊXITO")
        ),
        React.createElement(
          Text,
          { style: styles.completionText },
          "concluiu com aproveitamento o curso"
        ),
        React.createElement(Text, { style: styles.courseName }, courseTitle),
        React.createElement(
          Text,
          { style: styles.instructorText },
          `Instrutor: ${instructor}`
        ),
        // Footer row
        React.createElement(
          View,
          { style: styles.footer },
          React.createElement(
            View,
            { style: styles.footerItem },
            React.createElement(Text, { style: styles.footerLabel }, "Data de conclusão"),
            React.createElement(Text, { style: styles.footerValue }, completionDate)
          ),
          React.createElement(
            View,
            { style: styles.footerItem },
            React.createElement(Text, { style: styles.footerLabel }, "Plataforma"),
            React.createElement(Text, { style: styles.footerValue }, "TBO Academy")
          ),
          React.createElement(
            View,
            { style: styles.footerItem },
            React.createElement(Text, { style: styles.footerLabel }, "Categoria"),
            React.createElement(Text, { style: styles.footerValue }, "Arquitetura & Design")
          )
        )
      )
    )
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

  // Get student name from user metadata
  const studentName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "Aluno"

  const completionDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  // Generate PDF
  const pdfBuffer = await renderToBuffer(
    React.createElement(CertificatePDF, {
      studentName,
      courseTitle,
      instructor,
      completionDate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as React.ReactElement<any>
  )

  // Store certificate record in DB (upsert — idempotent)
  await supabase
    .from("academy_certificates" as never)
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        course_title: courseTitle,
      } as never,
      { onConflict: "user_id,course_id" }
    )

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificado-${courseId}.pdf"`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  })
}
