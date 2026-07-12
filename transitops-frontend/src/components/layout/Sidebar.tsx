"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route as RouteIcon,
  Wrench,
  Fuel,
  BarChart3,
  LogOut,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vehicles", label: "Vehicles", icon: Truck },
  { href: "/drivers", label: "Drivers", icon: Users },
  { href: "/trips", label: "Trips", icon: RouteIcon },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/fuel-expenses", label: "Fuel & Expenses", icon: Fuel },
  { href: "/reports", label: "Reports", icon: BarChart3 },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-sidebar transition-all z-30">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid size-9 place-items-center rounded-lg bg-gradient-primary shadow-glow">
          <Radio className="size-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg font-bold leading-none text-sidebar-foreground">
            TransitOps
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-widest text-sidebar-foreground/70">
            Fleet Control
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:translate-x-1",
                active
                  ? "bg-primary text-primary-foreground shadow-glow ring-1 ring-primary/50"
                  : "text-sidebar-foreground/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon
                className={cn("size-4 shrink-0", active && "text-primary")}
              />
              <span className="truncate">{item.label}</span>
              {active && (
                <span className="ml-auto size-1.5 rounded-full bg-primary shadow-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-sidebar-accent/60 px-3 py-2.5">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-accent text-sm font-bold text-accent-foreground">
            FM
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              Fleet Manager
            </p>
            <p className="truncate text-xs text-muted-foreground">
              ops@transitops.io
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
