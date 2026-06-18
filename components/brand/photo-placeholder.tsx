import { cn } from "@/lib/utils";

/**
 * Placeholder fotográfico do DS — gradiente forest + legenda mono.
 * Marca onde entra uma foto real. `dark` usa o tratamento escuro.
 */
export function Ph({
  dark = false,
  label,
  className,
  children,
}: {
  dark?: boolean;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn(dark ? "img-dark" : "img", className)}>
      {label && <span className="cap">{label}</span>}
      {children}
    </div>
  );
}
