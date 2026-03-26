import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// Map plan slug → Stripe price ID env var
const PRICE_ID_MAP: Record<string, string | undefined> = {
  essencial: process.env.STRIPE_PRICE_ID_ESSENCIAL,
  profissional: process.env.STRIPE_PRICE_ID_PROFISSIONAL,
}

type StripeCheckoutSession = {
  url: string | null
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe não configurado" }, { status: 500 })
  }

  // Get authenticated user
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  // Parse request body
  let planSlug: string
  try {
    const body = await req.json()
    planSlug = body.plan
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 })
  }

  const priceId = PRICE_ID_MAP[planSlug]
  if (!priceId) {
    return NextResponse.json(
      { error: `Plano inválido ou price ID não configurado: ${planSlug}` },
      { status: 400 }
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  // Dynamic import for Stripe SDK
  let StripeConstructor: new (
    key: string,
    opts: { apiVersion: string }
  ) => {
    checkout: {
      sessions: {
        create: (params: object) => Promise<StripeCheckoutSession>
      }
    }
  }

  try {
    const mod = await import("stripe")
    StripeConstructor = (mod.default ?? mod) as typeof StripeConstructor
  } catch {
    return NextResponse.json(
      { error: "Stripe SDK não instalado. Execute: pnpm add stripe" },
      { status: 500 }
    )
  }

  const stripe = new StripeConstructor(stripeKey, { apiVersion: "2025-02-24.acacia" })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        user_id: user.id,
        product_slug: planSlug,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          product_slug: planSlug,
        },
        trial_period_days: 7,
      },
      success_url: `${appUrl}/cursos?checkout=success`,
      cancel_url: `${appUrl}/diagnostico?checkout=cancelled`,
      customer_email: user.email,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao criar sessão de checkout"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
