import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ArrowRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { drivers, trips, vehicles, type TripStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/trips")({
  head: () => ({
    meta: [
      { title: "Trips — TransitOps" },
      {
        name: "description",
        content: "Dispatch, monitor, and close trips across the fleet.",
      },
    ],
  }),
  component: TripsPage,
});

const TABS: (TripStatus | "All")[] = [
  "All",
  "Draft",
  "Dispatched",
  "Completed",
  "Cancelled",
];

function TripsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const list = tab === "All" ? trips : trips.filter((t) => t.status === tab);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trip Dispatch"
        description="Plan, dispatch, and complete trips with automatic status transitions."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
            <Plus className="size-4" /> New trip
          </button>
        }
      />

      <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
        {TABS.map((t) => {
          const count =
            t === "All"
              ? trips.length
              : trips.filter((tr) => tr.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "rounded-lg px-3 py-1.5 text-xs font-medium transition " +
                (tab === t
                  ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground")
              }
            >
              {t} <span className="ml-1 text-[10px] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-3">
        {list.map((t) => {
          const v = vehicles.find((v) => v.id === t.vehicleId);
          const d = drivers.find((d) => d.id === t.driverId);
          const overload = v && t.cargoKg > v.capacityKg;
          return (
            <div
              key={t.id}
              className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition hover:border-primary/40 lg:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto]"
            >
              <div>
                <p className="font-mono text-xs text-primary">{t.id}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(t.scheduledAt).toLocaleString()}
                </p>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="size-4 text-primary" />
                  <span className="truncate">{t.source}</span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                  <span className="truncate">{t.destination}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {v?.name} · {d?.name} · {t.distanceKm} km planned
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Cargo
                </p>
                <p
                  className={
                    "font-mono text-sm font-semibold " +
                    (overload ? "text-destructive" : "")
                  }
                >
                  {t.cargoKg} kg
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Capacity
                </p>
                <p className="font-mono text-sm">{v?.capacityKg} kg</p>
              </div>

              <div className="flex items-center justify-end">
                <StatusBadge status={t.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
