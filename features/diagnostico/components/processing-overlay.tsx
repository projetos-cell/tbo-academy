"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { pct: 15, text: "Analisando visão estratégica..." },
  { pct: 35, text: "Mapeando conhecimento do comprador..." },
  { pct: 55, text: "Avaliando domínio do processo..." },
  { pct: 70, text: "Medindo capacidade de avaliação..." },
  { pct: 85, text: "Calculando custo da ignorância..." },
  { pct: 100, text: "Gerando diagnóstico completo..." },
];

interface ProcessingOverlayProps {
  active: boolean;
  onComplete: () => void;
}

export function ProcessingOverlay({ active, onComplete }: ProcessingOverlayProps) {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!active) {
      setStepIdx(0);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < STEPS.length) {
        setStepIdx(i);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [active, onComplete]);

  if (!active) return null;

  const step = STEPS[stepIdx];

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#000000] duration-300">
      <div className="text-center">
        <p className="mb-5 text-[10px] font-semibold tracking-[3px] text-zinc-400 uppercase">Processando diagnóstico</p>
        <div className="mx-auto mb-4 h-1 w-[300px] overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[#BAF241] transition-all duration-500 ease-out"
            style={{ width: `${step.pct}%` }}
          />
        </div>
        <p className="text-[10px] text-zinc-500">{step.text}</p>
      </div>
    </div>
  );
}
