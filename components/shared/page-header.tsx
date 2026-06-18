"use client";

import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Eyebrow opcional (label em caixa-alta acima do título — estilo DS). */
  eyebrow?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, eyebrow, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        {eyebrow && <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">{eyebrow}</span>}
        <h1 className="font-display mt-1 text-[28px] font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-[var(--tbo-gray-500)]">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
