import { cn } from "@/lib/utils";

/**
 * Marca TBO Academy — 3 círculos (currentColor) + flor (volt).
 * A cor dos círculos segue `currentColor`; a flor usa --tbo-volt por padrão.
 */
export function TboMark({ className, voltColor = "var(--tbo-volt)" }: { className?: string; voltColor?: string }) {
  return (
    <svg className={className} viewBox="0 18 92 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="65.16" cy="97.84" r="14.16" fill="currentColor" />
      <circle cx="15.87" cy="46.43" r="14.16" fill="currentColor" />
      <circle cx="14.16" cy="98.48" r="14.16" fill="currentColor" />
      <path
        d="M55.01,73.86s0-.3.04-.75c.02-.14.03-.27.04-.41.22-1.95-1.02-8.08,2.27-11.37,2.33-2.33,5.52-3.11,8.75-2.66,1.93.27,3.91.21,5.78-.36,2.15-.65,4.17-1.82,5.87-3.52,5.53-5.53,5.53-14.5,0-20.03-5.53-5.53-14.5-5.53-20.03,0-1.7,1.7-2.87,3.72-3.52,5.87-.57,1.87-.63,3.84-.36,5.78.45,3.23-.32,6.42-2.66,8.75-3.29,3.29-9.42,2.06-11.37,2.27-.14.01-.27.02-.41.04-.45.04-.75.04-.75.04l.06.06c-3.78.61-7.37,2.73-9.75,6.44-2.94,4.58-2.91,10.67.09,15.21.57.87,1.22,1.63,1.91,2.33.69.69,1.46,1.34,2.33,1.91,4.54,3,10.63,3.03,15.21.09,3.7-2.37,5.83-5.96,6.44-9.75l.06.06Z"
        fill={voltColor}
      />
    </svg>
  );
}

/**
 * Logo completo: marca + wordmark "TBO Academy".
 * `tone` controla a cor do texto/círculos (escuro p/ fundo claro, claro p/ fundo escuro).
 */
export function TboLogo({
  className,
  markClassName,
  tone = "dark",
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  tone?: "dark" | "light";
  showWordmark?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-center gap-2.5 text-[22px] font-extrabold tracking-tight",
        tone === "light" ? "text-paper" : "text-forest-900",
        className,
      )}
    >
      <TboMark className={cn("h-[1.3em] w-auto shrink-0", markClassName)} />
      {showWordmark && <span>TBO Academy</span>}
    </span>
  );
}
