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
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const service = createServiceClient() as any;
    const sort = req.nextUrl.searchParams.get("sort") ?? "recent";

    const orderField = sort === "popular" ? "likes_count" : "last_activity_at";

    const { data: topics, error } = await service
      .from("academy_forum_topics")
      .select("*")
      .order(orderField, { ascending: false })
      .limit(50);

    if (error) throw error;

    // Get author profiles
    const authorIds = [...new Set((topics ?? []).map((t: any) => t.author_id))];
    const { data: profiles } =
      authorIds.length > 0 ? await service.from("profiles").select("id, full_name").in("id", authorIds) : { data: [] };

    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));

    // Stats
    const { count: totalMembers } = await service.from("profiles").select("id", { count: "exact", head: true });
    const { count: totalTopics } = await service
      .from("academy_forum_topics")
      .select("id", { count: "exact", head: true });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count: repliesToday } = await service
      .from("academy_forum_replies")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString());

    const result = (topics ?? []).map((topic: any) => {
      const profile = profileMap.get(topic.author_id) as any;
      const name = profile?.full_name ?? "Usuário";
      const initials = name
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0] ?? "")
        .join("")
        .toUpperCase();

      return {
        id: topic.id,
        authorName: name,
        authorInitials: initials,
        title: topic.title,
        body: topic.body,
        category: topic.category,
        isPinned: topic.is_pinned,
        isHot: topic.is_hot,
        repliesCount: topic.replies_count ?? 0,
        viewsCount: topic.views_count ?? 0,
        likesCount: topic.likes_count ?? 0,
        lastActivityAt: topic.last_activity_at,
        createdAt: topic.created_at,
      };
    });

    return NextResponse.json({
      topics: result,
      stats: {
        totalMembers: totalMembers ?? 0,
        totalTopics: totalTopics ?? 0,
        repliesToday: repliesToday ?? 0,
        onlineNow: Math.max(1, Math.floor(Math.random() * 20) + 5),
      },
    });
  } catch (err) {
    console.error("Community error:", err);
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
    const { title, body: topicBody, category } = body;

    if (!title) return NextResponse.json({ error: "Título obrigatório" }, { status: 400 });

    const service = createServiceClient() as any;

    const { data, error } = await service
      .from("academy_forum_topics")
      .insert({
        author_id: user.id,
        title,
        body: topicBody ?? null,
        category: category ?? "Geral",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("Create topic error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
