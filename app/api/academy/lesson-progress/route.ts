/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ progress: [] });

    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");

    const service = createServiceClient() as any;
    let query = service
      .from("academy_lesson_progress")
      .select("lesson_id, completed, progress_pct, last_position_sec")
      .eq("user_id", user.id);

    if (lessonId) query = query.eq("lesson_id", lessonId);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ progress: data ?? [] });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();
    const { lessonId, completed, progressPct, lastPositionSec } = body as {
      lessonId: string;
      completed?: boolean;
      progressPct?: number;
      lastPositionSec?: number;
    };

    if (!lessonId) {
      return NextResponse.json({ error: "lessonId é obrigatório" }, { status: 400 });
    }

    const service = createServiceClient() as any;
    const payload: Record<string, unknown> = {
      user_id: user.id,
      lesson_id: lessonId,
      updated_at: new Date().toISOString(),
    };
    if (completed !== undefined) payload.completed = completed;
    if (progressPct !== undefined) payload.progress_pct = progressPct;
    if (lastPositionSec !== undefined) payload.last_position_sec = lastPositionSec;

    const { data, error } = await service
      .from("academy_lesson_progress")
      .upsert(payload, { onConflict: "user_id,lesson_id" })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erro interno" }, { status: 500 });
  }
}
