/**
 * Email helper using Resend for transactional emails.
 * RESEND_API_KEY must be set in environment variables.
 * RESEND_FROM_EMAIL should be set to a verified sender (e.g. "TBO Academy <noreply@tboacademy.com.br>")
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "TBO Academy <noreply@tboacademy.com.br>"

const TBO_ACCENT = "#BAF241"

function baseTemplate(body: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TBO Academy</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#000;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:#000;padding:32px 40px;text-align:left;">
              <span style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px;">
                TBO <span style="color:${TBO_ACCENT}">Academy</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:#111;padding:40px;color:#e5e5e5;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#000;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#666;">
                TBO Academy · Todos os direitos reservados<br />
                <a href="https://tboacademy.com.br" style="color:${TBO_ACCENT};text-decoration:none;">tboacademy.com.br</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()
}

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(opts: SendEmailOptions): Promise<{ id?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send")
    return { error: "RESEND_API_KEY not configured" }
  }

  try {
    // Dynamic import so the build doesn't break if resend is not installed
    const { Resend } = await import("resend")
    const resend = new Resend(RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    })

    if (error) {
      console.error("[email] Resend error", error)
      return { error: error.message }
    }

    return { id: data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error"
    console.error("[email] Unexpected error", message)
    return { error: message }
  }
}

// ---- Email templates ----

export function sendWelcomeEmail(opts: { to: string; name: string }): Promise<{ id?: string; error?: string }> {
  const body = `
    <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#fff;">
      Bem-vindo à TBO Academy! 🎉
    </h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#ccc;">
      Olá, <strong style="color:#fff;">${opts.name}</strong>!
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#ccc;">
      Sua conta foi criada com sucesso. Agora você tem acesso à maior plataforma de
      educação do mercado imobiliário — trilhas, cursos e diagnósticos criados
      especificamente para profissionais como você.
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://tboacademy.com.br"}"
       style="display:inline-block;background:${TBO_ACCENT};color:#000;font-weight:700;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;margin-bottom:24px;">
      Acessar minha conta
    </a>
    <p style="margin:24px 0 0;font-size:14px;color:#777;">
      Explore as trilhas gratuitas para começar, ou faça o diagnóstico para descobrir
      onde focar seus estudos primeiro.
    </p>
  `

  return sendEmail({
    to: opts.to,
    subject: "Bem-vindo à TBO Academy! 🎓",
    html: baseTemplate(body),
  })
}

export function sendPurchaseConfirmationEmail(opts: {
  to: string
  name: string
  productName: string
  planSlug: string
}): Promise<{ id?: string; error?: string }> {
  const planLabels: Record<string, string> = {
    essencial: "Essencial",
    profissional: "Profissional",
    enterprise: "Enterprise",
    diagnostic: "Diagnóstico",
  }
  const planLabel = planLabels[opts.planSlug] ?? opts.productName

  const body = `
    <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#fff;">
      Compra confirmada! ✅
    </h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#ccc;">
      Olá, <strong style="color:#fff;">${opts.name}</strong>!
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#ccc;">
      Seu plano <strong style="color:${TBO_ACCENT};">${planLabel}</strong> foi ativado com sucesso.
      Agora você tem acesso completo a todos os conteúdos incluídos no seu plano.
    </p>
    <div style="background:#1a1a1a;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Plano ativado</p>
      <p style="margin:0;font-size:20px;font-weight:700;color:#fff;">TBO Academy ${planLabel}</p>
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://tboacademy.com.br"}"
       style="display:inline-block;background:${TBO_ACCENT};color:#000;font-weight:700;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none;margin-bottom:24px;">
      Começar a aprender
    </a>
    <p style="margin:24px 0 0;font-size:14px;color:#777;">
      Em caso de dúvidas, responda este e-mail ou acesse nosso suporte.
    </p>
  `

  return sendEmail({
    to: opts.to,
    subject: `Plano ${planLabel} ativado — TBO Academy 🎓`,
    html: baseTemplate(body),
  })
}
