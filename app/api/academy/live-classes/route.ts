/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const service = createServiceClient() as any;

    const { data: classes, error } = await service
      .from("academy_live_classes")
      .select("*")
      .in("status", ["upcoming", "live", "recorded"])
      .order("scheduled_at", { ascending: false });

    if (error) throw error;

    // Count registrations per class
    const classIds = (classes ?? []).map((c: any) => c.id);
    const { data: registrations } =
      classIds.length > 0
        ? await service.from("academy_live_class_registrations").select("class_id").in("class_id", classIds)
        : { data: [] };

    const regCounts: Record<string, number> = {};
    for (const r of registrations ?? []) {
      regCounts[r.class_id] = (regCounts[r.class_id] ?? 0) + 1;
    }

    // Check user registrations
    const { data: myRegs } =
      classIds.length > 0
        ? await service
            .from("academy_live_class_registrations")
            .select("class_id")
            .eq("user_id", user.id)
            .in("class_id", classIds)
        : { data: [] };

    const myRegSet = new Set((myRegs ?? []).map((r: any) => r.class_id));

    const result = (classes ?? []).map((cls: any) => {
      const name = cls.instructor_name ?? "Instrutor";
      const initials = name
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0] ?? "")
        .join("")
        .toUpperCase();

      return {
        id: cls.id,
        title: cls.title,
        description: cls.description,
        instructorName: name,
        instructorInitials: initials,
        instructorRole: cls.instructor_role,
        category: cls.category,
        scheduledAt: cls.scheduled_at,
        durationMinutes: cls.duration_minutes,
        maxAttendees: cls.max_attendees,
        attendeesCount: regCounts[cls.id] ?? 0,
        meetingUrl: cls.meeting_url,
        recordingUrl: cls.recording_url,
        status: cls.status,
        isRegistered: myRegSet.has(cls.id),
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Live classes error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
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
    const { action, classId } = body;

    const service = createServiceClient() as any;

    if (action === "register") {
      const { error } = await service
        .from("academy_live_class_registrations")
        .upsert({ class_id: classId, user_id: user.id }, { onConflict: "class_id,user_id" });
      if (error) throw error;
    } else if (action === "unregister") {
      await service.from("academy_live_class_registrations").delete().eq("class_id", classId).eq("user_id", user.id);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Live class action error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
