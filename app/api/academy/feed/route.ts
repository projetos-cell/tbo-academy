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

    const { data: posts, error } = await service
      .from("academy_feed_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    // Get user profiles
    const userIds = [...new Set((posts ?? []).map((p: any) => p.user_id))];
    const { data: profiles } =
      userIds.length > 0
        ? await service.from("profiles").select("id, full_name, role").in("id", userIds)
        : { data: [] };

    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));

    // Check which posts the current user liked
    const postIds = (posts ?? []).map((p: any) => p.id);
    const { data: myLikes } =
      postIds.length > 0
        ? await service.from("academy_feed_likes").select("post_id").eq("user_id", user.id).in("post_id", postIds)
        : { data: [] };

    const likedSet = new Set((myLikes ?? []).map((l: any) => l.post_id));

    const result = (posts ?? []).map((post: any) => {
      const profile = profileMap.get(post.user_id) as any;
      const name = profile?.full_name ?? "Usuário";
      const initials = name
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0] ?? "")
        .join("")
        .toUpperCase();

      return {
        id: post.id,
        userId: post.user_id,
        userName: name,
        userInitials: initials,
        userRole: profile?.role ?? "",
        type: post.type,
        content: post.content,
        detail: post.detail,
        likesCount: post.likes_count ?? 0,
        commentsCount: post.comments_count ?? 0,
        likedByMe: likedSet.has(post.id),
        createdAt: post.created_at,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Feed error:", err);
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
    const { action, postId } = body;

    const service = createServiceClient() as any;

    if (action === "like") {
      await service
        .from("academy_feed_likes")
        .upsert({ post_id: postId, user_id: user.id }, { onConflict: "post_id,user_id" });
      await service
        .rpc("increment_field", {
          table_name: "academy_feed_posts",
          row_id: postId,
          field_name: "likes_count",
          amount: 1,
        })
        .catch(() => {
          // Fallback: direct update
          return service
            .from("academy_feed_posts")
            .update({ likes_count: service.sql`likes_count + 1` })
            .eq("id", postId);
        });
    } else if (action === "unlike") {
      await service.from("academy_feed_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feed action error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
