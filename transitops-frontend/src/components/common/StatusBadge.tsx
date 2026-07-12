import { cn } from "@/lib/utils";

type Tone = "success" | "info" | "warning" | "destructive" | "muted";

const TONE_MAP: Record<string, Tone> = {
  Available: "success",
  "On Trip": "info",
  "In Shop": "warning",
  Retired: "muted",
  "Off Duty": "muted",
  Suspended: "destructive",
  Draft: "muted",
  Dispatched: "info",
  Completed: "success",
  Cancelled: "destructive",
};

const TONE_CLASS: Record<Tone, string> = {
  success: "bg-success/15 text-success ring-success/30",
  info: "bg-info/15 text-info ring-info/30",
  warning: "bg-warning/15 text-warning ring-warning/40",
  destructive: "bg-destructive/15 text-destructive ring-destructive/40",
  muted: "bg-muted text-muted-foreground ring-border",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const tone = TONE_MAP[status] ?? "muted";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE_CLASS[tone],
        className,
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", {
          "bg-success": tone === "success",
          "bg-info": tone === "info",
          "bg-warning": tone === "warning",
          "bg-destructive": tone === "destructive",
          "bg-muted-foreground": tone === "muted",
        })}
      />
      {status}
    </span>
  );
}
