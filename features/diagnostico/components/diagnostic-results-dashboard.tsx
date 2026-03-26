"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ETAPAS, TRAILS, getLevel, getInsight, CTA_MESSAGES, type LevelKey } from "../data/diagnostic-data";
import type { Answers } from "./diagnostic-questions-step";
import { ScoreGauge } from "./score-gauge";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconEye,
  IconTarget,
  IconTrendingUp,
  IconBrain,
  IconChartBar,
  IconShieldCheck,
} from "@tabler/icons-react";

interface ContextData {
  vgv: string;
  freq: string;
  invest: string;
}

interface DiagnosticResultsDashboardProps {
  answers: Answers;
  context: ContextData;
  onBack: () => void;
  onCTA: () => void;
  onExplore: () => void;
}

const LEVEL_COLORS: Record<LevelKey, { text: string; bg: string; bar: string }> = {
  cego: { text: "text-red-500", bg: "bg-red-500/10 text-red-500", bar: "bg-red-500" },
  miope: { text: "text-amber-500", bg: "bg-amber-500/10 text-amber-500", bar: "bg-amber-500" },
  enxerga: { text: "text-[#BAF241]", bg: "bg-[#BAF241]/10 text-[#BAF241]", bar: "bg-[#BAF241]" },
  domina: { text: "text-emerald-500", bg: "bg-emerald-500/10 text-emerald-500", bar: "bg-emerald-500" },
};

const ETAPA_ICONS = [IconEye, IconTarget, IconTrendingUp, IconBrain, IconShieldCheck];

const PRIORITY_STYLES = {
  critical: { card: "border-l-red-500", badge: "bg-red-500/10 text-red-500", label: "Crítica" },
  high: { card: "border-l-[#BAF241]", badge: "bg-[#BAF241]/10 text-[#BAF241]", label: "Alta" },
  medium: { card: "border-l-amber-500", badge: "bg-amber-500/10 text-amber-500", label: "Média" },
  low: { card: "border-l-emerald-500", badge: "bg-emerald-500/10 text-emerald-500", label: "Baixa" },
} as const;

function useResults(answers: Answers) {
  return useMemo(() => {
    const etapaResults = ETAPAS.map((etapa, ei) => {
      let score = 0;
      const criticals: string[] = [];
      etapa.qs.forEach((q, qi) => {
        const val = answers[`${ei}_${qi}`];
        if (val) {
          score += val * q.weight;
          if (val <= 2) criticals.push(q.text);
        }
      });
      score = Math.round(score);
      const pct = score / etapa.max;
      const level = getLevel(pct);
      const insight = getInsight(ei, pct);
      // Normalize to 0-100
      const score100 = Math.round(pct * 100);
      return { score, score100, pct, level, insight, criticals, etapa };
    });

    const totalScore = etapaResults.reduce((a, r) => a + r.score, 0);
    const totalMax = ETAPAS.reduce((a, e) => a + e.max, 0);
    const totalPct = totalScore / totalMax;
    const totalScore100 = Math.round(totalPct * 100);
    const level = getLevel(totalPct);

    return { etapaResults, totalScore100, totalPct, level };
  }, [answers]);
}

export function DiagnosticResultsDashboard({
  answers,
  context,
  onBack,
  onCTA,
  onExplore,
}: DiagnosticResultsDashboardProps) {
  const { etapaResults, totalScore100, totalPct, level } = useResults(answers);
  const colors = LEVEL_COLORS[level.cls];
  const ctaMsg = CTA_MESSAGES[level.cls];

  // Cost calculation
  const cost = useMemo(() => {
    const vgvVal = parseFloat(context.vgv) || 30;
    const freqVal = parseFloat(context.freq) || 1;
    const investPct = parseFloat(context.invest) || 2;
    const vgvM = vgvVal * 1_000_000;
    const ignorance = 1 - totalPct;

    const mktSpend = vgvM * (investPct / 100);
    const wasteRate = Math.min(0.3, ignorance * 0.35);
    const wasteValue = Math.round(mktSpend * wasteRate);

    const delayMonths = Math.round(ignorance * 4);
    const monthlyCarry = vgvM * 0.008;
    const delayCost = Math.round(delayMonths * monthlyCarry);

    const velocityLoss = Math.round(ignorance * 0.15 * vgvM);
    const totalCost = wasteValue + delayCost + velocityLoss;
    const annualCost = Math.round(totalCost * freqVal);

    return {
      wasteValue,
      wasteRate,
      delayCost,
      delayMonths,
      monthlyCarry,
      velocityLoss,
      totalCost,
      annualCost,
      freqVal,
    };
  }, [context, totalPct]);

  // Trails sorted by priority
  const sortedTrails = useMemo(() => {
    return TRAILS.map((trail) => {
      const avgPct = trail.etapas.reduce((a, ei) => a + etapaResults[ei].pct, 0) / trail.etapas.length;
      let priority: keyof typeof PRIORITY_STYLES;
      if (avgPct < 0.35) priority = "critical";
      else if (avgPct < 0.55) priority = "high";
      else if (avgPct < 0.75) priority = "medium";
      else priority = "low";
      return { ...trail, avgPct, priority };
    })
      .filter((t) => t.avgPct < 0.85)
      .sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      });
  }, [etapaResults]);

  const fmtR = (v: number) => "R$ " + v.toLocaleString("pt-BR");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      {/* ===== ROW 1: Performance gauge + dimension cards ===== */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Gauge card */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-[10px] font-semibold tracking-[3px] text-zinc-400 uppercase">Performance Geral</h3>
          <ScoreGauge score={totalScore100} level={level} size={220} />
        </div>

        {/* Dimension summary cards - 2x column grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
          {etapaResults.map((r, i) => {
            const c = LEVEL_COLORS[r.level.cls];
            const Icon = ETAPA_ICONS[i];
            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={cn("absolute inset-x-0 top-0 h-[3px]", c.bar)} />
                <div className="mb-3 flex items-center gap-2.5">
                  <div className={cn("flex size-8 items-center justify-center rounded-lg", c.bg.split(" ")[0])}>
                    <Icon className={cn("size-4", c.text)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-[10px] font-bold tracking-tight">{r.etapa.title}</h4>
                    <span className={cn("text-[8px] font-semibold tracking-[0.5px] uppercase", c.text)}>
                      {r.level.name}
                    </span>
                  </div>
                  <span className={cn("text-lg font-extrabold tracking-tight", c.text)}>{r.score100}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700 ease-out", c.bar)}
                    style={{ width: `${r.score100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== ROW 2: Dimension details (expandable insights) ===== */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <IconChartBar className="size-4 text-[#BAF241]" />
          <h3 className="text-[10px] font-semibold tracking-[3px] text-zinc-400 uppercase">Análise por Dimensão</h3>
        </div>
        <div className="space-y-4">
          {etapaResults.map((r, i) => {
            const c = LEVEL_COLORS[r.level.cls];
            return (
              <div key={i} className="rounded-xl border border-zinc-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-tight">{r.etapa.title}</span>
                    <span
                      className={cn("rounded px-2 py-0.5 text-[8px] font-semibold tracking-[0.5px] uppercase", c.bg)}
                    >
                      {r.score100}/100
                    </span>
                  </div>
                </div>
                <p className="mb-2 text-[10px] leading-relaxed text-zinc-500">{r.insight}</p>
                {r.criticals.length > 0 && (
                  <div className="space-y-1">
                    {r.criticals.map((crit, ci) => (
                      <div
                        key={ci}
                        className="flex items-start gap-1.5 rounded bg-red-50 px-2 py-1.5 text-[9px] text-red-600"
                      >
                        <IconAlertTriangle className="mt-0.5 size-3 shrink-0" />
                        <span>{crit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== ROW 3: Cost of ignorance ===== */}
      <div className="relative overflow-hidden rounded-2xl bg-[#000000] p-6 text-white shadow-sm">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-red-500" />
        <div className="mb-5">
          <h3 className="text-base font-extrabold tracking-tight uppercase">Custo Estimado da Ignorância</h3>
          <p className="mt-1 text-[10px] text-zinc-400">Por empreendimento — baseado nos dados que você informou</p>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <CostCard
            label="Desperdício em marketing"
            value={fmtR(cost.wasteValue)}
            explain={`~${Math.round(cost.wasteRate * 100)}% do investimento perdido por não saber avaliar entregas.`}
          />
          <CostCard
            label="Custo do atraso"
            value={fmtR(cost.delayCost)}
            explain={`~${cost.delayMonths} meses de atraso. Capital parado custa ${fmtR(Math.round(cost.monthlyCarry))}/mês.`}
          />
          <CostCard
            label="VGV em risco"
            value={fmtR(cost.velocityLoss)}
            explain="Venda lenta, unidades encalhadas, descontos forçados."
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border-2 border-red-500/30 bg-red-500/5 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[2px] text-zinc-400 uppercase">
              Custo total por lançamento
            </p>
            {cost.freqVal > 1 && (
              <p className="mt-0.5 text-[9px] text-zinc-500">
                {cost.freqVal} lançamentos/ano: {fmtR(cost.annualCost)}/ano
              </p>
            )}
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-red-500">{fmtR(cost.totalCost)}</span>
        </div>

        <p className="mt-3 border-t border-white/5 pt-3 text-[8px] text-zinc-500 italic">
          Estimativa conservadora. O objetivo não é precisão — é dimensionar o que a falta de repertório custa.
        </p>
      </div>

      {/* ===== ROW 4: Recommended trails ===== */}
      {sortedTrails.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-[10px] font-semibold tracking-[3px] text-zinc-400 uppercase">
            Trilhas Recomendadas
          </h4>
          <div className="space-y-2.5">
            {sortedTrails.map((trail, i) => {
              const style = PRIORITY_STYLES[trail.priority];
              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border border-l-4 border-zinc-100 px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:shadow-sm",
                    style.card,
                  )}
                >
                  <span
                    className={cn(
                      "w-16 shrink-0 rounded px-2 py-1 text-center text-[7px] font-bold tracking-[1px] uppercase",
                      style.badge,
                    )}
                  >
                    {style.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold tracking-tight">{trail.name}</h5>
                    <p className="mt-0.5 text-[9px] text-zinc-500">{trail.desc}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {trail.modules.map((m) => (
                        <span
                          key={m}
                          className="rounded bg-[#BAF241]/5 px-1.5 py-0.5 text-[7px] font-medium tracking-wide text-[#7da01a] uppercase"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== CTA BLOCK ===== */}
      <div className="relative overflow-hidden rounded-2xl bg-[#BAF241] p-8 text-center shadow-sm">
        <div className="absolute -top-1/2 -right-[20%] h-[300px] w-[300px] rounded-full bg-white/5" />
        <h3 className="relative z-10 text-xl font-extrabold tracking-tight text-[#000000] uppercase md:text-2xl">
          {ctaMsg.title}
        </h3>
        <p className="relative z-10 mx-auto mt-2 max-w-md text-[11px] text-[#000000]/70">{ctaMsg.sub}</p>
        <div className="relative z-10 mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onCTA}
            className="inline-flex items-center gap-2 rounded-lg bg-[#000000] px-8 py-4 text-xs font-bold tracking-[1px] text-[#BAF241] uppercase transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)]"
          >
            Quero enxergar
            <IconArrowRight className="size-4" />
          </button>
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#000000]/20 px-6 py-3.5 text-[10px] font-semibold tracking-[1px] text-[#000000]/70 uppercase transition-all hover:border-[#000000]/40 hover:text-[#000000]"
          >
            Explorar a plataforma
          </button>
        </div>
      </div>

      {/* Back */}
      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-6 py-3 text-[11px] font-semibold tracking-[1.5px] text-zinc-500 uppercase transition-all hover:border-[#BAF241] hover:text-[#BAF241]"
        >
          ← Refazer diagnóstico
        </button>
      </div>
    </div>
  );
}

function CostCard({ label, value, explain }: { label: string; value: string; explain: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4">
      <p className="mb-1.5 text-[8px] font-semibold tracking-[1.5px] text-zinc-400 uppercase">{label}</p>
      <p className="text-xl font-extrabold tracking-tight text-red-500">{value}</p>
      <p className="mt-1 text-[9px] leading-relaxed text-zinc-500">{explain}</p>
    </div>
  );
}
