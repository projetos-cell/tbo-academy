import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("academy_user_progress" as never)
    .select("module_id, status, completed_at, updated_at" as never)
    .eq("user_id" as never, user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ progress: data ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const body = await request.json()
  const { moduleId, status } = body as { moduleId: string; status: string }

  if (!moduleId || !status) {
    return NextResponse.json({ error: "moduleId e status são obrigatórios" }, { status: 400 })
  }

  const validStatuses = ["completed", "in_progress", "not_started"]
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 })
  }

  const now = new Date().toISOString()

  const { error } = await supabase
    .from("academy_user_progress" as never)
    .upsert(
      {
        user_id: user.id,
        module_id: moduleId,
        status,
        completed_at: status === "completed" ? now : null,
        updated_at: now,
      } as never,
      { onConflict: "user_id,module_id" }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
