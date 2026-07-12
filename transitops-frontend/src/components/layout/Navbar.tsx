"use client";

import { Bell, Search, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-background/60 px-6 py-3.5 backdrop-blur-xl lg:px-10">
      <div className="relative min-w-0 max-w-lg group">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <input
          placeholder="Search vehicles, drivers, trip IDs…"
          className="w-full rounded-lg border border-border bg-card/80 py-2 pl-9 pr-12 text-sm outline-none ring-primary/40 transition focus:border-primary/50 focus:bg-background focus:ring-2"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-card/80 px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
          ⌘K
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button className="hidden items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:border-accent/40 hover:bg-accent/10 hover:text-accent sm:inline-flex">
          <Sparkles className="size-3.5 text-accent animate-pulse" />
          Ask Ops AI
        </button>
        <ThemeToggle />
        <button className="relative grid size-9 place-items-center rounded-lg border border-border bg-card/80 text-muted-foreground transition hover:border-primary/20 hover:bg-muted/40 hover:text-foreground">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 animate-pulse rounded-full bg-destructive shadow-[0_0_8px_rgba(var(--destructive),0.8)]" />
        </button>
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5 sm:flex">
          <div className="grid size-7 place-items-center rounded-md bg-gradient-accent text-xs font-bold text-accent-foreground">
            FM
          </div>
          <div className="pr-2 text-xs">
            <p className="font-semibold leading-tight">Fleet Manager</p>
            <p className="text-[10px] text-muted-foreground">All regions</p>
          </div>
        </div>
      </div>
    </header>
  );
}
