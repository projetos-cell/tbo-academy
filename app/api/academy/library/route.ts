/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
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

    const { data: resources, error } = await service
      .from("academy_resources")
      .select("*")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    const result = (resources ?? []).map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description ?? "",
      type: r.type,
      category: r.category,
      fileUrl: r.file_url,
      externalUrl: r.external_url,
      thumbnailUrl: r.thumbnail_url,
      downloadsCount: r.downloads_count ?? 0,
      isFeatured: r.is_featured ?? false,
      createdAt: r.created_at,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Library error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
