import { createFileRoute } from "@tanstack/react-router";
import { Plus, Fuel, Receipt } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { expenses, fuelLogs, vehicles } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/expenses")({
  head: () => ({
    meta: [
      { title: "Fuel & Expenses — TransitOps" },
      {
        name: "description",
        content:
          "Fuel logs, tolls, and other operational expenses per vehicle.",
      },
    ],
  }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const totalFuel = fuelLogs.reduce((s, f) => s + f.cost, 0);
  const totalLiters = fuelLogs.reduce((s, f) => s + f.liters, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuel & Expenses"
        description="Every rupee against the vehicle that spent it."
        actions={
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground">
              <Receipt className="size-4" /> Add expense
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              <Plus className="size-4" /> Log fuel
            </button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatBig
          label="Fuel cost (30d)"
          value={`₹${totalFuel.toLocaleString("en-IN")}`}
          accent="primary"
          icon={Fuel}
        />
        <StatBig
          label="Litres pumped"
          value={`${totalLiters} L`}
          accent="accent"
          icon={Fuel}
        />
        <StatBig
          label="Other expenses"
          value={`₹${totalExpenses.toLocaleString("en-IN")}`}
          accent="success"
          icon={Receipt}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-display text-lg font-semibold">Fuel logs</h3>
            <span className="text-xs text-muted-foreground">
              Recent entries
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 text-left">Vehicle</th>
                <th className="px-5 py-2.5 text-right">Litres</th>
                <th className="px-5 py-2.5 text-right">Cost</th>
                <th className="px-5 py-2.5 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fuelLogs.map((f) => {
                const v = vehicles.find((v) => v.id === f.vehicleId);
                return (
                  <tr key={f.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <p className="font-medium">{v?.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {v?.regNumber}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-right font-mono">
                      {f.liters} L
                    </td>
                    <td className="px-5 py-3 text-right font-mono">
                      ₹{f.cost.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">{f.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-display text-lg font-semibold">
              Other expenses
            </h3>
            <span className="text-xs text-muted-foreground">
              Tolls, permits, parking
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 text-left">Vehicle</th>
                <th className="px-5 py-2.5 text-left">Category</th>
                <th className="px-5 py-2.5 text-right">Amount</th>
                <th className="px-5 py-2.5 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.map((e) => {
                const v = vehicles.find((v) => v.id === e.vehicleId);
                return (
                  <tr key={e.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <p className="font-medium">{v?.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {v?.regNumber}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {e.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono">
                      ₹{e.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">{e.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatBig({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  accent: "primary" | "accent" | "success";
  icon: typeof Fuel;
}) {
  const colors = {
    primary: "bg-primary/15 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
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
