"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { DiagnosticContextStep } from "@/features/diagnostico/components/diagnostic-context-step";
import { DiagnosticQuestionsStep, type Answers } from "@/features/diagnostico/components/diagnostic-questions-step";
import { DiagnosticResultsDashboard } from "@/features/diagnostico/components/diagnostic-results-dashboard";
import { ProcessingOverlay } from "@/features/diagnostico/components/processing-overlay";
import { PricingDialog } from "@/features/diagnostico/components/pricing-dialog";
import { ETAPAS, getLevel } from "@/features/diagnostico/data/diagnostic-data";
import { useDiagnosticPersistence } from "@/features/diagnostico/hooks/use-diagnostic-persistence";
import { trackDiagnosticCompleted } from "@/lib/analytics";
import { toast } from "sonner";

const STEP_LABELS = ["Contexto", "Diagnóstico", "Resultado"];

export default function DiagnosticoPage() {
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);

  const [contextData, setContextData] = useState({
    stage: "",
    vgv: "",
    freq: "",
    dep: "",
    invest: "",
  });

  const [answers, setAnswers] = useState<Answers>({});

  const totalQuestions = ETAPAS.reduce((a, e) => a + e.qs.length, 0);

  const goStep = useCallback((n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleAnswer = useCallback((key: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < totalQuestions) {
      const missing = totalQuestions - answeredCount;
      toast.error(`Responda todas as perguntas antes de continuar. Faltam ${missing} respostas.`);
      return;
    }
    setProcessing(true);
  }, [answers, totalQuestions]);

  const handleRestore = useCallback(
    (draft: { answers: Answers; contextData: typeof contextData; currentStep: number }) => {
      setAnswers(draft.answers);
      setContextData(draft.contextData);
      setStep(draft.currentStep);
    },
    [],
  );

  const { clearDraft } = useDiagnosticPersistence({
    answers,
    contextData,
    currentStep: step,
    onRestore: handleRestore,
  });

  const handleProcessingComplete = useCallback(() => {
    setProcessing(false);
    clearDraft();
    // Compute overall score to send with the GA event
    const totalScore = ETAPAS.reduce((acc, etapa, ei) => {
      return (
        acc +
        etapa.qs.reduce((s, q, qi) => {
          const val = answers[`${ei}_${qi}`];
          return s + (val ? val * q.weight : 0);
        }, 0)
      );
    }, 0);
    const totalMax = ETAPAS.reduce((a, e) => a + e.max, 0);
    const pct = totalScore / totalMax;
    const level = getLevel(pct);
    trackDiagnosticCompleted(Math.round(pct * 100), level.cls);
    goStep(2);
  }, [goStep, clearDraft, answers]);

  return (
    <div className="min-h-screen">
      {/* Steps bar — DS forest/volt */}
      <div className="sticky top-0 z-40 flex items-center justify-center gap-0 border-b border-black/[0.06] bg-white/80 px-6 py-3 backdrop-blur-sm">
        {STEP_LABELS.map((label, i) => (
          <div key={i} className="relative flex items-center gap-2 px-5">
            <div
              className={cn(
                "flex size-[22px] items-center justify-center rounded-full border text-[9px] font-bold transition-all",
                i === step
                  ? "bg-volt text-ink border-volt"
                  : i < step
                    ? "bg-forest-900 border-forest-900 text-volt"
                    : "border-black/15 text-[var(--tbo-gray-400)]",
              )}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "text-[9px] font-bold tracking-[0.14em] whitespace-nowrap uppercase transition-colors",
                i === step ? "text-ink" : i < step ? "text-forest-700" : "text-[var(--tbo-gray-400)]",
              )}
            >
              {label}
            </span>
            {i < STEP_LABELS.length - 1 && (
              <div className="absolute top-1/2 right-0 h-4 w-px -translate-y-1/2 bg-black/[0.08]" />
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-10 md:px-12">
        {step === 0 && <DiagnosticContextStep data={contextData} onChange={setContextData} onNext={() => goStep(1)} />}
        {step === 1 && (
          <DiagnosticQuestionsStep
            answers={answers}
            onAnswer={handleAnswer}
            onBack={() => goStep(0)}
            onSubmit={handleSubmit}
          />
        )}
        {step === 2 && (
          <DiagnosticResultsDashboard
            answers={answers}
            context={{
              vgv: contextData.vgv,
              freq: contextData.freq,
              invest: contextData.invest,
            }}
            onBack={() => goStep(1)}
            onCTA={() => setPricingOpen(true)}
            onExplore={() => setPricingOpen(true)}
          />
        )}
      </div>

      <ProcessingOverlay active={processing} onComplete={handleProcessingComplete} />
      <PricingDialog open={pricingOpen} onOpenChange={setPricingOpen} />
    </div>
  );
}
