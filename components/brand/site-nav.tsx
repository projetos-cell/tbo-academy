"use client";

import { useState } from "react";
import Link from "next/link";
import { IconSearch, IconMenu2 } from "@tabler/icons-react";
import { TboLogo } from "@/components/brand/tbo-logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/catalogo", label: "Cursos", key: "catalogo" },
  { href: "/planos", label: "Planos", key: "planos" },
  { href: "/sobre", label: "Sobre", key: "sobre" },
  { href: "/blog", label: "Blog", key: "blog" },
];

/** Navegação editorial sobreposta ao hero (marketing). */
export function SiteNav({ active }: { active?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="eo-nav">
      <Link href="/" aria-label="TBO Academy — início">
        <TboLogo tone="light" />
      </Link>

      <div className="eo-navlinks">
        {LINKS.map((l) => (
          <Link key={l.key} href={l.href} className={cn(active === l.key && "active")}>
            {l.label}
          </Link>
        ))}
      </div>

      <div className="eo-navactions">
        <Link href="/catalogo" className="eo-iconbtn" aria-label="Buscar">
          <IconSearch className="size-[18px]" />
        </Link>
        <Link
          href="/login"
          className="flex items-center text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          Entrar
        </Link>
        <Link href="/planos" className="pill pill-white pill-sm">
          Assinar <span className="parrow">→</span>
        </Link>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button type="button" className="eo-iconbtn lg:hidden" aria-label="Abrir menu de navegação">
              <IconMenu2 className="size-[18px]" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>Navegação</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              {LINKS.map((l) => (
                <SheetClose asChild key={l.key}>
                  <Link
                    href={l.href}
                    className={cn(
                      "rounded-md px-2 py-2.5 text-base font-semibold transition-colors hover:bg-muted",
                      active === l.key && "text-volt",
                    )}
                  >
                    {l.label}
                  </Link>
                </SheetClose>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-2 border-t p-4">
              <SheetClose asChild>
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-md px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  Entrar
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/planos" className="pill pill-volt pill-sm justify-center">
                  Assinar <span className="parrow">→</span>
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
