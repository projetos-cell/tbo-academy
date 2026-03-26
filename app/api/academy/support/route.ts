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

    // Fetch published FAQ items
    const { data: faqItems, error: faqError } = await service
      .from("academy_faq_items")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");

    if (faqError) throw faqError;

    // Fetch user's tickets
    const { data: tickets, error: ticketError } = await service
      .from("academy_support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (ticketError) throw ticketError;

    const faq = (faqItems ?? []).map((item: any) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      category: item.category,
      sortOrder: item.sort_order,
    }));

    const userTickets = (tickets ?? []).map((t: any) => ({
      id: t.id,
      subject: t.subject,
      body: t.body,
      category: t.category,
      status: t.status,
      createdAt: t.created_at,
    }));

    return NextResponse.json({ faq, tickets: userTickets });
  } catch (err) {
    console.error("Support error:", err);
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
    const { subject, body: ticketBody, category } = body;

    if (!subject || !ticketBody) {
      return NextResponse.json({ error: "Assunto e descrição obrigatórios" }, { status: 400 });
    }

    const service = createServiceClient() as any;

    const { data, error } = await service
      .from("academy_support_tickets")
      .insert({
        user_id: user.id,
        subject,
        body: ticketBody,
        category: category ?? "Geral",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("Create ticket error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
