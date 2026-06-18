"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconMail, IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { TboMark, TboLogo } from "@/components/brand/tbo-logo";

function LoadingScreen() {
  return (
    <div className="bg-forest-950 fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Ambient volt glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-volt/[0.10] absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 animate-[ambientPulse_4s_ease-in-out_infinite] rounded-full blur-[110px]" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        <div className="animate-[fadeInScale_0.6s_ease-out_forwards] opacity-0">
          <TboMark className="text-forest-100 h-16 w-16 animate-[spinSlow_8s_linear_infinite]" />
        </div>

        <div className="flex animate-[fadeIn_0.5s_ease-out_0.3s_forwards] flex-col items-center gap-1 opacity-0">
          <span className="font-display text-paper/90 text-lg font-extrabold tracking-tight">TBO Academy</span>
          <span className="text-forest-200/50 text-[10px] font-light tracking-[0.3em] uppercase">
            Educação imobiliária
          </span>
        </div>

        <div className="h-[2px] w-40 animate-[fadeIn_0.3s_ease-out_0.5s_forwards] overflow-hidden rounded-full bg-white/[0.06] opacity-0">
          <div className="via-volt to-volt/40 from-volt/40 h-full animate-[loadBar_2.2s_ease-in-out_forwards] rounded-full bg-gradient-to-r" />
        </div>

        <p className="text-forest-200/40 animate-[fadeIn_0.4s_ease-out_0.7s_forwards] text-xs font-light tracking-wide opacity-0">
          Preparando seu ambiente
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes loadBar {
          0% {
            width: 0%;
          }
          50% {
            width: 60%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes ambientPulse {
          0%,
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      const messages: Record<string, string> = {
        "Invalid login credentials": "Email ou senha incorretos.",
        "Email not confirmed": "Confirme seu email antes de entrar.",
        "Too many requests": "Muitas tentativas. Aguarde um momento.",
      };
      setError(messages[authError.message] ?? authError.message);
      setLoading(false);
      return;
    }

    setShowSplash(true);
    setTimeout(() => {
      router.push("/explorar");
      router.refresh();
    }, 2200);
  }

  async function handleGoogleLogin() {
    setError(null);
    setGoogleLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/explorar`,
      },
    });

    if (authError) {
      setError(authError.message);
      setGoogleLoading(false);
    }
  }

  if (showSplash) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-forest-950 tbo-site min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1280px] lg:grid-cols-[1.05fr_1fr]">
        {/* ── Painel de marca (esquerda) ── */}
        <div className="from-forest-800 to-forest-950 relative hidden flex-col overflow-hidden bg-gradient-to-br px-14 py-12 text-white lg:flex">
          {/* glow ambiente */}
          <div
            className="pointer-events-none absolute -top-32 -right-36 h-[560px] w-[560px] rounded-full blur-lg"
            style={{ background: "radial-gradient(circle, rgba(186,242,65,.18), transparent 62%)" }}
            aria-hidden="true"
          />

          <TboLogo tone="light" className="relative z-10 text-2xl" />

          <div className="relative z-10 mt-auto">
            <span className="text-volt text-xs font-bold tracking-[0.14em] uppercase">Acesso completo</span>
            <h1 className="font-display mt-4 text-[clamp(2.25rem,4.2vw,3.375rem)] leading-[1.02] font-extrabold tracking-tight">
              Tudo incluído.
              <br />
              <span className="text-volt">Um único acesso.</span>
            </h1>
            <p className="text-forest-100 mt-[18px] max-w-[420px] text-[17px] leading-relaxed">
              Ao entrar, você desbloqueia toda a plataforma — cursos, trilhas, materiais e certificados do mercado
              imobiliário. Sem comprar aula por aula.
            </p>

            <ul className="mt-[34px] grid gap-[13px]">
              {[
                "Todos os cursos e trilhas, sempre liberados",
                "Novos lançamentos incluídos automaticamente",
                "Certificados, materiais e modo offline",
              ].map((item) => (
                <li key={item} className="text-forest-50 flex items-center gap-[13px] text-[15px]">
                  <span className="bg-volt text-ink grid h-6 w-6 flex-none place-items-center rounded-full text-xs font-extrabold">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-[14px] border-t border-white/10 pt-7">
              <span className="text-volt text-[15px] tracking-[2px]">★★★★★</span>
              <span className="text-forest-200 text-[13.5px]">4.9 · mais de 12.000 alunos no mercado imobiliário</span>
            </div>
          </div>
        </div>

        {/* ── Painel de formulário (direita) ── */}
        <div className="bg-paper flex items-center justify-center px-7 py-12 sm:px-12">
          <div className="w-full max-w-[380px]">
            {/* logo mobile */}
            <div className="mb-8 lg:hidden">
              <TboLogo tone="dark" />
            </div>

            <div className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Bem-vindo de volta</div>
            <h2 className="font-display text-ink mt-3 text-[30px] font-bold tracking-tight">Entrar na plataforma</h2>
            <p className="mt-2 mb-[30px] text-[15px] text-[var(--tbo-gray-600)]">
              Acesse sua conta para continuar de onde parou.
            </p>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="mb-[7px] block text-[13px] font-semibold text-[var(--tbo-gray-700)]">
                  E-mail
                </label>
                <div className="focus-within:border-forest-700 focus-within:ring-forest-700/10 flex items-center gap-[10px] rounded-[14px] border border-[var(--tbo-gray-300)] bg-white px-4 transition-all focus-within:ring-4">
                  <IconMail className="size-[18px] text-[var(--tbo-gray-400)]" />
                  <input
                    id="email"
                    type="email"
                    placeholder="voce@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="text-ink flex-1 border-0 bg-transparent py-[14px] text-[15px] outline-none placeholder:text-[var(--tbo-gray-400)]"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="mb-[7px] block text-[13px] font-semibold text-[var(--tbo-gray-700)]"
                >
                  Senha
                </label>
                <div className="focus-within:border-forest-700 focus-within:ring-forest-700/10 flex items-center gap-[10px] rounded-[14px] border border-[var(--tbo-gray-300)] bg-white px-4 transition-all focus-within:ring-4">
                  <IconLock className="size-[18px] text-[var(--tbo-gray-400)]" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="text-ink flex-1 border-0 bg-transparent py-[14px] text-[15px] outline-none placeholder:text-[var(--tbo-gray-400)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-[var(--tbo-gray-400)] transition-colors hover:text-[var(--tbo-gray-600)]"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <IconEyeOff className="size-[18px]" /> : <IconEye className="size-[18px]" />}
                  </button>
                </div>
              </div>

              <div className="mt-1 mb-6 flex items-center justify-between text-[13.5px]">
                <label className="flex cursor-pointer items-center gap-2 text-[var(--tbo-gray-600)]">
                  <input type="checkbox" className="accent-forest-800 size-[15px]" /> Manter conectado
                </label>
                <a href="#" className="text-forest-700 font-semibold">
                  Esqueci a senha
                </a>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-[14px] bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit — pill escura com seta volt */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="bg-forest-900 hover:bg-ink flex w-full items-center justify-between rounded-full py-[15px] pr-4 pl-6 text-[15px] font-bold text-white transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Autenticando..." : "Entrar na plataforma"}
                <span className="bg-volt text-ink grid h-7 w-7 place-items-center rounded-full">
                  {loading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <IconArrowRight className="size-4" />
                  )}
                </span>
              </button>
            </form>

            {/* divisor */}
            <div className="my-6 flex items-center gap-[14px] text-[12.5px] text-[var(--tbo-gray-400)]">
              <div className="h-px flex-1 bg-[var(--tbo-gray-200)]" />
              ou continue com
              <div className="h-px flex-1 bg-[var(--tbo-gray-200)]" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="text-ink hover:border-forest-700 hover:bg-paper-off flex w-full items-center justify-center gap-[9px] rounded-[14px] border border-[var(--tbo-gray-300)] bg-white px-4 py-[13px] text-[14px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {googleLoading ? "Redirecionando..." : "Continuar com Google"}
            </button>

            <div className="mt-[30px] text-center text-[14px] text-[var(--tbo-gray-600)]">
              Ainda não tem acesso?{" "}
              <Link href="/planos" className="text-forest-800 font-bold">
                Assine agora →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
