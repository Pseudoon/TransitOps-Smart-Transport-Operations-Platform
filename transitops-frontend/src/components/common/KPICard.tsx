import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  trend?: { value: number; positive?: boolean };
  accent?: "primary" | "accent" | "success" | "warning";
}

const ACCENT: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  primary: "from-primary/25 to-primary/0 text-primary",
  accent: "from-accent/25 to-accent/0 text-accent",
  success: "from-success/25 to-success/0 text-success",
  warning: "from-warning/25 to-warning/0 text-warning",
};

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  accent = "primary",
}: KpiCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition hover:border-primary/40">
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-60",
          ACCENT[accent],
        )}
      />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-lg bg-background/50 ring-1 ring-border",
            ACCENT[accent].split(" ").pop(),
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
      {trend && (
        <div className="relative mt-3 flex items-center gap-1 text-xs">
          <span
            className={trend.positive ? "text-success" : "text-destructive"}
          >
            {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
          <span className="text-muted-foreground">vs last week</span>
        </div>
      )}
    </div>
  );
}
