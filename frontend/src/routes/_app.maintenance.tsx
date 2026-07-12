import { createFileRoute } from "@tanstack/react-router";
import { Plus, Wrench, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { maintenanceLogs, vehicles } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance — TransitOps" },
      {
        name: "description",
        content: "Track open and closed maintenance jobs across the fleet.",
      },
    ],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const open = maintenanceLogs.filter((m) => m.closedAt === null);
  const closed = maintenanceLogs.filter((m) => m.closedAt !== null);
  const totalCost = maintenanceLogs.reduce((s, m) => s + m.cost, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance"
        description="Open maintenance moves a vehicle to In Shop and hides it from dispatch."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
            <Plus className="size-4" /> Log maintenance
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Clock}
          label="Open jobs"
          value={open.length}
          accent="warning"
        />
        <StatCard
          icon={CheckCircle2}
          label="Closed this month"
          value={closed.length}
          accent="success"
        />
        <StatCard
          icon={Wrench}
          label="Total spend (30d)"
          value={`₹${(totalCost / 1000).toFixed(1)}k`}
          accent="primary"
        />
      </div>

      <section>
        <h3 className="mb-3 font-display text-lg font-semibold">Open jobs</h3>
        <div className="grid gap-3">
          {open.map((m) => {
            const v = vehicles.find((v) => v.id === m.vehicleId);
            return (
              <div
                key={m.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-warning/30 bg-warning/5 p-4 shadow-card"
              >
                <div className="grid size-11 place-items-center rounded-lg bg-warning/15 text-warning">
                  <Wrench className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{m.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {v?.name} · {v?.regNumber} · opened {m.openedAt}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold">
                    ₹{m.cost.toLocaleString("en-IN")}
                  </p>
                  <button className="mt-1 text-xs font-medium text-primary hover:underline">
                    Close job
                  </button>
                </div>
              </div>
            );
          })}
          {open.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No open maintenance jobs.
            </p>
          )}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-display text-lg font-semibold">
          Recently closed
        </h3>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Job</th>
                <th className="px-5 py-3 text-left">Vehicle</th>
                <th className="px-5 py-3 text-left">Opened</th>
                <th className="px-5 py-3 text-left">Closed</th>
                <th className="px-5 py-3 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {closed.map((m) => {
                const v = vehicles.find((v) => v.id === m.vehicleId);
                return (
                  <tr key={m.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">{m.type}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {v?.name}{" "}
                      <span className="font-mono text-xs">
                        ({v?.regNumber})
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">
                      {m.openedAt}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">
                      {m.closedAt}
                    </td>
                    <td className="px-5 py-3 text-right font-mono">
                      ₹{m.cost.toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Wrench;
  label: string;
  value: number | string;
  accent: "warning" | "success" | "primary";
}) {
  const colors = {
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
    primary: "bg-primary/15 text-primary",
  };
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
      <div
        className={
          "grid size-11 place-items-center rounded-lg " + colors[accent]
        }
      >
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="font-display text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
