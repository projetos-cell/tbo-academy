"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconBuilding, IconPackage, IconChartBar, IconBuildingSkyscraper } from "@tabler/icons-react";
import { STAGE_OPTIONS } from "../data/diagnostic-data";

const STAGE_ICONS = {
  "building-2": IconBuilding,
  package: IconPackage,
  "chart-bar": IconChartBar,
  building: IconBuildingSkyscraper,
} as const;

interface ContextFormData {
  stage: string;
  vgv: string;
  freq: string;
  dep: string;
  invest: string;
}

interface DiagnosticContextStepProps {
  data: ContextFormData;
  onChange: (data: ContextFormData) => void;
  onNext: () => void;
}

export function DiagnosticContextStep({ data, onChange, onNext }: DiagnosticContextStepProps) {
  const [attempted, setAttempted] = useState(false);

  const update = (key: keyof ContextFormData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const isComplete = !!data.stage && !!data.vgv && !!data.freq && !!data.dep && !!data.invest;

  const handleNext = () => {
    setAttempted(true);
    if (!isComplete) return;
    onNext();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
      {/* Provocation block */}
      <div className="relative mb-8 overflow-hidden rounded-xl bg-[#000000] p-7">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[#BAF241]" />
        <h2 className="text-xl leading-tight font-extrabold tracking-tight text-white uppercase md:text-2xl">
          Todo incorporador acha que
          <br />
          sabe de marketing.
          <br />
          <span className="text-[#BAF241]">Quase nenhum sabe.</span>
        </h2>
        <p className="mt-3 max-w-xl text-xs leading-relaxed text-zinc-400">
          Esse diagnóstico não mede o que você tem. Mede o que você sabe.
          <br />
          Porque o que te custa caro não é a agência. É não saber cobrar dela.
        </p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-[10px] font-medium tracking-[4px] text-[#BAF241] uppercase">Etapa 1 de 3</p>
        <h2 className="text-3xl leading-none font-extrabold tracking-tight uppercase">
          Seu
          <br />
          Momento
        </h2>
        <p className="mt-3 max-w-xl text-xs leading-relaxed text-zinc-500">
          Antes de diagnosticar conhecimento, preciso entender onde você está. Não existe resposta errada — existe
          clareza sobre o ponto de partida.
        </p>
      </div>

      {/* Stage selector */}
      <label className="mb-3 block text-[8px] font-semibold tracking-[1.5px] text-zinc-400 uppercase">
        Qual seu momento atual? <span className="text-red-400">*</span>
      </label>
      <div
        className={cn(
          "mb-1 grid grid-cols-2 gap-3 rounded-xl transition-all lg:grid-cols-4",
          attempted && !data.stage ? "ring-2 ring-red-400/50 ring-offset-2" : "",
        )}
      >
        {STAGE_OPTIONS.map((opt) => {
          const Icon = STAGE_ICONS[opt.icon];
          const selected = data.stage === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => update("stage", opt.value)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-xl border-[1.5px] p-4 text-center transition-all duration-200 hover:-translate-y-0.5",
                selected
                  ? "border-[#BAF241] bg-[#BAF241]/5 shadow-[0_4px_16px_rgba(184,247,36,0.1)]"
                  : "border-zinc-200 bg-white hover:border-[#BAF241]/30 dark:border-zinc-800 dark:bg-zinc-900",
              )}
            >
              <Icon className={cn("size-6", selected ? "text-[#BAF241]" : "text-zinc-400")} />
              <span className="text-[11px] font-bold tracking-tight">{opt.title}</span>
              <span className="text-[8px] leading-snug text-zinc-500">{opt.desc}</span>
            </button>
          );
        })}
      </div>
      {attempted && !data.stage && <p className="mt-1 mb-5 text-[9px] text-red-400">Selecione seu momento atual</p>}
      {(!attempted || !!data.stage) && <div className="mb-6" />}

      {/* Context forms */}
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Numbers card */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-[#BAF241]" />
          <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold tracking-[1px] uppercase">
            <span className="text-sm">💰</span> Números
          </h3>
          <div className="space-y-3">
            <SelectField
              label="VGV médio por empreendimento"
              value={data.vgv}
              onChange={(v) => update("vgv", v)}
              error={attempted}
              options={[
                { value: "10", label: "Até R$ 10M" },
                { value: "30", label: "R$ 10M — R$ 30M" },
                { value: "60", label: "R$ 30M — R$ 60M" },
                { value: "100", label: "R$ 60M — R$ 100M" },
                { value: "200", label: "R$ 100M — R$ 200M" },
                { value: "400", label: "Acima de R$ 200M" },
              ]}
            />
            <SelectField
              label="Lançamentos por ano (média)"
              value={data.freq}
              onChange={(v) => update("freq", v)}
              error={attempted}
              options={[
                { value: "0.5", label: "Menos de 1" },
                { value: "1", label: "1 por ano" },
                { value: "2", label: "2 por ano" },
                { value: "4", label: "3 a 5 por ano" },
                { value: "8", label: "Mais de 5 por ano" },
              ]}
            />
          </div>
        </div>

        {/* Dependency card */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-[#BAF241]" />
          <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold tracking-[1px] uppercase">
            <span className="text-sm">🔗</span> Dependência
          </h3>
          <div className="space-y-3">
            <SelectField
              label="Como lida com marketing hoje?"
              value={data.dep}
              onChange={(v) => update("dep", v)}
              error={attempted}
              options={[
                { value: "full", label: "Terceirizo tudo com agência" },
                { value: "partial", label: "Terceirizo parte, faço parte interno" },
                { value: "internal", label: "Tenho equipe interna" },
                { value: "none", label: "Não faço marketing estruturado" },
              ]}
            />
            <div>
              <SelectField
                label="Investimento em marketing (% do VGV)"
                value={data.invest}
                onChange={(v) => update("invest", v)}
                error={attempted}
                options={[
                  { value: "0.5", label: "Menos de 1%" },
                  { value: "1", label: "1% a 2%" },
                  { value: "2.5", label: "2% a 3%" },
                  { value: "4", label: "3% a 5%" },
                  { value: "6", label: "Mais de 5%" },
                  { value: "0", label: "Não sei" },
                ]}
              />
              <p className="mt-1 text-[8px] text-zinc-400 italic">Se você não sabe, isso já é um dado.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation message */}
      {attempted && !isComplete && (
        <p className="mb-2 text-right text-[9px] text-red-400">
          Preencha todos os campos obrigatórios antes de continuar
        </p>
      )}

      {/* CTA */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleNext}
          disabled={attempted && !isComplete}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-[11px] font-semibold tracking-[1.5px] uppercase transition-all duration-200",
            isComplete
              ? "bg-[#BAF241] text-[#000000] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(184,247,36,0.25)]"
              : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600",
          )}
        >
          Começar diagnóstico →
        </button>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-[8px] font-semibold tracking-[1.5px] text-zinc-400 uppercase">
        {label} <span className="text-red-400">*</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none rounded-md border bg-zinc-50 px-3 py-2.5 text-[11px] text-zinc-900 transition-colors outline-none focus:border-[#BAF241] dark:bg-zinc-800 dark:text-zinc-100",
          error && !value ? "border-red-400 dark:border-red-500" : "border-zinc-200 dark:border-zinc-700",
        )}
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && !value && <p className="mt-0.5 text-[8px] text-red-400">Campo obrigatório</p>}
    </div>
  );
}
