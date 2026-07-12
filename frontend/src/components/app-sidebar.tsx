import { Link, useRouterState } from "@tanstack/react-router";
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
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/vehicles", label: "Vehicles", icon: Truck },
  { to: "/drivers", label: "Drivers", icon: Users },
  { to: "/trips", label: "Trips", icon: RouteIcon },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/expenses", label: "Fuel & Expenses", icon: Fuel },
  { to: "/reports", label: "Reports", icon: BarChart3 },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid size-9 place-items-center rounded-lg bg-gradient-primary shadow-glow">
          <Radio className="size-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg font-bold leading-none text-sidebar-foreground">
            TransitOps
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            Fleet Control
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-sidebar-accent text-sidebar-primary shadow-inner ring-1 ring-primary/30"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
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
          to="/login"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
