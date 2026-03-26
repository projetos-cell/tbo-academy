"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ThemeToggle, NotificationBell, SearchButton, UserAvatar } from "@/components/layout/header-parts";

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-black/[0.04] bg-white/60 px-4 backdrop-blur-xl">
      {/* Left — Sidebar trigger + Breadcrumbs */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 !h-4" />
      <Breadcrumbs />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right — Search, Theme, Notifications, Avatar */}
      <div className="flex items-center gap-5">
        <SearchButton />
        <NotificationBell />
        <UserAvatar />
      </div>
    </header>
  );
}
