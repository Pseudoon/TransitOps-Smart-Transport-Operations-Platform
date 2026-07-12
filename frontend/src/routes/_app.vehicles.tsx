import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Truck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { vehicles, type VehicleStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/vehicles")({
  head: () => ({
    meta: [
      { title: "Vehicles — TransitOps" },
      {
        name: "description",
        content:
          "Master registry of every vehicle: registration, capacity, odometer, and status.",
      },
    ],
  }),
  component: VehiclesPage,
});

const STATUSES: (VehicleStatus | "All")[] = [
  "All",
  "Available",
  "On Trip",
  "In Shop",
  "Retired",
];

function VehiclesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");

  const filtered = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          (status === "All" || v.status === status) &&
          (q === "" ||
            v.regNumber.toLowerCase().includes(q.toLowerCase()) ||
            v.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, status],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Registry"
        description="Every truck, van, and trailer in the fleet — with live status."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
            <Plus className="size-4" /> Register vehicle
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search registration or model…"
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none ring-primary/40 focus:ring-2"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={
                "rounded-lg border px-3 py-2 text-xs font-medium transition " +
                (status === s
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground")
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Registration</th>
              <th className="px-5 py-3 text-left">Vehicle</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-right">Capacity</th>
              <th className="px-5 py-3 text-right">Odometer</th>
              <th className="px-5 py-3 text-right">Acquisition</th>
              <th className="px-5 py-3 text-left">Region</th>
              <th className="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-muted/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-md bg-primary/15 text-primary">
                      <Truck className="size-4" />
                    </div>
                    <span className="font-mono text-xs">{v.regNumber}</span>
                  </div>
                </td>
                <td className="px-5 py-3 font-medium">{v.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{v.type}</td>
                <td className="px-5 py-3 text-right font-mono">
                  {v.capacityKg.toLocaleString()} kg
                </td>
                <td className="px-5 py-3 text-right font-mono">
                  {v.odometer.toLocaleString()} km
                </td>
                <td className="px-5 py-3 text-right font-mono">
                  ₹{(v.acquisitionCost / 100000).toFixed(1)}L
                </td>
                <td className="px-5 py-3 text-muted-foreground">{v.region}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={v.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-muted-foreground"
                >
                  No vehicles match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
