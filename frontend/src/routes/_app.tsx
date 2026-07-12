import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Bell, Search, Sparkles } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 px-6 py-6 lg:px-10 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-background/80 px-6 py-3.5 backdrop-blur lg:px-10">
      <div className="relative min-w-0 max-w-lg">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search vehicles, drivers, trip IDs…"
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none ring-primary/40 transition focus:ring-2"
        />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground sm:inline-flex">
          <Sparkles className="size-3.5 text-accent" />
          Ask Ops AI
        </button>
        <button className="relative grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
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
