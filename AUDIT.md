# Auditoria TBO Academy — pós design system

Auditoria multi-agente read-only (8 dimensões + verificação adversarial + crítico de completude).
Produção live e saudável; achados abaixo são oportunidades de correção, não quebras em produção
(salvo onde indicado). Severidade já **ajustada pela verificação** (falsos positivos removidos).

## ✅ Pontos fortes confirmados
- **Autorização do admin sólida**: as 14 rotas `/api/admin/*` re-checam role no servidor (`getAdminRole` + `hasMinRole('diretoria')`), além do guard no layout. Não é só defesa de UI.
- **Pagamentos**: webhook Stripe verifica assinatura; checkout usa allow-list de price-id e injeta `user_id` no servidor; `service-role` nunca vaza para o client; nenhum `NEXT_PUBLIC_*` carrega segredo.
- **Produção**: 10 rotas testadas OK (públicas 200, protegidas 307→/login), sem 5xx; home serve o DS novo; o bug de react-query no 1º SSR **não** afeta anônimos.

---

## 🔴 CRÍTICO

### C1 — Bypass do modo preview/guest libera o app inteiro sem login
`app/api/academy-preview/route.ts` · `app/(academy)/layout.tsx:29-35` · `lib/supabase/middleware.ts:31-35`
Qualquer pessoa pode setar o cookie `academy_preview=true` (endpoint POST sem auth, `httpOnly:false`) — ou
forjar o header `referer` com `/diagnostico` — e o layout trata isso como passe livre para as ~16 telas do grupo `(academy)`.
**Atenuante:** hoje muito do conteúdo é mock e as APIs realmente gated (biblioteca/live/progress) exigem 401 — o vazamento de dados imediato é pequeno, mas o furo de controle de acesso é real.
**Decisão necessária (sua):** isso é intencional como funil de discovery? Se sim, endurecer (cookie assinado HMAC + `httpOnly:true`, emitido só após `/diagnostico` legítimo, escopo só telas teaser). Se não, remover.

---

## 🟠 ALTO

**Rotas**
- **A1 — Dashboard `/inicio` órfão**: o dashboard principal foi movido para `/inicio` mas **nada** aponta para ele (sidebar "Home", login e auth/callback vão todos para `/explorar`). Só acessível digitando a URL. → Decidir o destino canônico do aluno: apontar sidebar+redirects para `/inicio`, **ou** remover `/inicio` se `/explorar` é a home real. `academy-sidebar.tsx:70`, `login/page.tsx:127`, `auth/callback/route.ts:84`.

**Acessibilidade (contraste WCAG 1.4.3)**
- **A2 — `text-white/40` e `/50`** em cards forest falham contraste (suporte:208, explorar:57, certificados:70, aulas-ao-vivo:168, biblioteca:196). → usar ≥ `white/65` ou `forest-100/200` sólido.
- **A3 — `text-ink/45` e `/55` sobre `bg-volt`** (suporte:207-208) — 2.99:1 / 4.06:1. → `text-ink` sólido.
- **A4 — `--muted-foreground: rgba(0,0,0,.5)`** no `.academy-theme` = 3.9:1, sistêmico (~20 usos de `text-muted-foreground`). → subir para `rgba(0,0,0,.62)` ou `--tbo-gray-600`.
- **A5 — Botões só-ícone sem `aria-label`** no feed (share/bookmark, feed:243,246). WCAG 4.1.2.

**Design system**
- **A6 — Dois "volt" coexistem**: token `#BAF241` (rgb 186,242,65) vs `rgba(184,247,36)` ad-hoc em 8 sombras/glows (features/diagnostico/*, content-gate, onboarding-wizard). → padronizar no token.
- **A7 — Hex de marca hardcoded**: ~194 ocorrências de `#BAF241`/`#000000`/`#02261C` em 24 arquivos em vez de `bg-volt`/`text-ink`/`text-forest-900`. Se o token mudar, metade do app não acompanha. (Maioria pré-existe ao DS, em features/diagnostico e features/academy.)
- **A8 — Cluster `features/diagnostico`** usa `zinc-*` (97x) + `dark:` órfão (29x) como sistema de cor próprio, ignorando os tokens. → migrar para os tokens.

**Performance**
- **A9 — `next/image` nunca usado** (sharp + remotePatterns prontos, zero adoção) — maior alavanca de LCP quando entrarem fotos/avatares reais do Supabase.
- **A10 — Preloader MP4 de 2.6 MB** no root layout, em toda visita, com `overflow:hidden` bloqueando scroll (`preloader.tsx`). *Pré-existe ao DS.* → comprimir (WebM/Lottie) + `preload="none"`/poster + restringir à home.

**Responsivo**
- **A11 — Nav de marketing sem menu mobile**: `.eo-navlinks { display:none }` < 920px e o `SiteNav` não tem hamburger → marketing fica **sem navegação** em celular/tablet.

---

## 🟡 MÉDIO (resumo)
- **M1 — `PublishToggle` invertido**: botão diz "Publicado" mas a ação é *despublicar* (ícone+label trocados no re-skin); inconsistente com o toggle do `course-list`. `publish-toggle.tsx:39-44`.
- **M2 — Foco visível ausente** nos elementos editoriais custom (`.pill`, `.ccard`, `.eo-navlinks a`, `.eo-iconbtn`) — shadcn Button/Input têm; o CSS puro do DS não. WCAG 2.4.7.
- **M3 — Modal do catálogo sem focus-trap** (foco não entra/retorna; Tab vaza). `catalogo/page.tsx`.
- **M4 — `content-teaser`** usa categorias arco-íris (violet/blue/amber/pink/cyan…) fora da paleta.
- **M5 — Eyebrow em 3 implementações** com tracking divergente (0.14em/0.3em/1px/4px). → reutilizar `.eo-eyebrow`.
- **M6 — Sem code-split**: `recharts` entra no bundle do `/admin` default; TipTap entra estático no editor. → `next/dynamic`.
- **M7 — `/catalogo` é `"use client"` inteira** com dataset grande inline → mais JS/pior LCP/SEO; isolar só o filtro/modal.
- **M8 — `force-dynamic` sem `loading.tsx`/Suspense**: cada navegação autenticada bloqueia no Supabase sem skeleton.
- **M9 — Responsivo**: `ed-grid-2` não colapsa entre 601-920px; modal do catálogo não-responsivo (paddings/stats 3-col); `user-table` do admin sem `overflow-x`.
- **M10 — `SUPER_ADMIN_EMAILS`** importado em arquivo `"use client"` (vaza e-mails no bundle) + normalização `toLowerCase` inconsistente; cookie de preview `httpOnly:false`.
- **M11 — Gating de conteúdo client-side** (blur/opacity por CSS) e **APIs de catálogo com service-role sem checagem de tier** — hoje OK (só metadata/mock), vira **alto/crítico assim que houver conteúdo pago real**.

## ⚪ BAIXO/INFO (destaques)
Dead code com links quebrados (`CourseDetailHeader`, `workspace-switcher` com gradiente violet, `features/onboarding/*` legado do TBO OS, `admin-guard`); footer público "Trilhas"→rota autenticada; admin nega acesso redirecionando para `/` (marketing) em vez de `/inicio`; blog com `href="#"`; 25 ribbon SVGs mortos (344 KB); `<img>` cru x3; 2 monoespaçadas redundantes; iframe do player sem `loading="lazy"`; literal `#7da01a` no diagnóstico; headings do diagnóstico sem `font-display`; imports/vars mortos pós-re-skin.

---

## 🔍 Lacunas não auditadas (crítico de completude) — várias são bloqueadores de go-to-market
- **G1 — Mock vs real em produção** ⚠️: `meus-cursos`, `certificados` e `cursos/[id]` usam `MOCK_*` **direto, sem fallback de banco** → o aluno vê cursos/certificados **inventados**, não o seed real ("Branding Imobiliário"). O `inicio` usa `MOCK_LEADERBOARD` apesar da API real existir. Outras telas exibem mock silenciosamente se a tabela estiver vazia.
- **G2 — SEO técnico**: `robots.txt` e `sitemap.xml` retornam **404** em produção (não existem `app/robots.ts`/`app/sitemap.ts`).
- **G3 — Open Graph/Twitter/canonical/`metadataBase`**: inexistentes → links compartilhados (WhatsApp/LinkedIn) sem preview. Sem imagem OG.
- **G4 — Metadata por página**: home sem metadata própria; `/catalogo` é `"use client"` → `export const metadata` é **ignorado** (cai no title genérico).
- **G5 — Seed**: só 1 curso, todas as aulas `video_url NULL`; a home promete "90+ cursos" (mock). Verificar se migrations/RLS foram aplicadas em prod.
- **G6 — Dark mode legado**: o toggle ainda alterna para um tema **laranja** órfão (DS antigo em `globals.css .dark`), não reescrito para o volt.
- **G7 — Sem `loading.tsx`/`error.tsx`/`not-found.tsx`** por segmento em `(site)`/`(academy)`.
- **G8 — GA4**: verificar se os eventos (`course_started`, `module_completed`, `checkout_initiated`) sobreviveram à troca de handlers/markup no re-skin.
- **G9 — Encoding/i18n**: validar UTF-8 byte-level dos arquivos editados pelos agentes (Windows/CRLF) e acentos vindos do Supabase.

---

## Falsos positivos descartados pela verificação
Pílulas/botão de filtro do `/explorar` ("texto branco em fundo claro" — na verdade estão sobre `bg-black`); `text-white/60` sobre forest (passa 5.95–7.16:1); `text-volt` "em fundo claro" (todos os usos reais estão sobre fundo escuro, conforme o DS); injeção SQL no like do feed (`.eq` é parametrizado; `service.sql` nem existe).
