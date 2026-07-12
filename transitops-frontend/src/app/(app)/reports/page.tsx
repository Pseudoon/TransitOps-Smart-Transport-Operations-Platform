"use client";

import React from "react";
import { Download, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { fuelLogs, maintenanceLogs, trips, utilizationTrend, vehicles } from "@/lib/mock-data";

const CHART_COLORS = [
  "oklch(0.78 0.16 195)",
  "oklch(0.82 0.17 75)",
  "oklch(0.75 0.18 155)",
  "oklch(0.68 0.2 320)",
  "oklch(0.72 0.14 240)",
];

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactElement }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const rollup = vehicles
    .filter((v) => v.status !== "Retired")
    .map((v, i) => {
      const fuel = fuelLogs.filter((f) => f.vehicleId === v.id).reduce((s, f) => s + f.cost, 0);
      const liters = fuelLogs.filter((f) => f.vehicleId === v.id).reduce((s, f) => s + f.liters, 0);
      const maint = maintenanceLogs.filter((m) => m.vehicleId === v.id).reduce((s, m) => s + m.cost, 0);
      const km = trips.filter((t) => t.vehicleId === v.id && t.status === "Completed").reduce((s, t) => s + t.distanceKm, 0) || 200 + i * 40;
      const revenue = km * 45 + i * 15000;
      const efficiency = liters > 0 ? km / liters : 0;
      const roi = ((revenue - (fuel + maint)) / v.acquisitionCost) * 100;
      return { id: v.id, name: v.name, reg: v.regNumber, fuel, maint, km, revenue, efficiency, roi };
    });

  const utilization = utilizationTrend.map((d) => ({ ...d, cost: 8000 + d.trips * 900 }));

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" description="Fuel efficiency, utilization, operational cost, and per-vehicle ROI." actions={<button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium"><Download className="size-4" /> Export CSV</button>} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Utilization vs Cost" subtitle="Daily active fleet % against operational spend">
          <LineChart data={utilization}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 250)" vertical={false} />
            <XAxis dataKey="day" stroke="oklch(0.72 0.02 245)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="oklch(0.72 0.02 245)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.32 0.03 250)", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="utilization" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="cost" stroke={CHART_COLORS[1]} strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Fuel Efficiency" subtitle="Km per litre by vehicle (higher is better)">
          <BarChart data={rollup} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 250)" horizontal={false} />
            <XAxis type="number" stroke="oklch(0.72 0.02 245)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="reg" type="category" stroke="oklch(0.72 0.02 245)" fontSize={10} tickLine={false} axisLine={false} width={90} />
            <Tooltip contentStyle={{ backgroundColor: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.32 0.03 250)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="efficiency" radius={[0, 6, 6, 0]}>
              {rollup.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}
            </Bar>
          </BarChart>
        </ChartCard>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div><h3 className="font-display text-lg font-semibold">Per-vehicle ROI</h3><p className="text-xs text-muted-foreground">Revenue − (Fuel + Maintenance) ÷ Acquisition cost</p></div>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success"><TrendingUp className="size-3.5" /> Trailing 30d</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3 text-left">Vehicle</th><th className="px-5 py-3 text-right">Distance</th><th className="px-5 py-3 text-right">Fuel Cost</th><th className="px-5 py-3 text-right">Maint. Cost</th><th className="px-5 py-3 text-right">Revenue</th><th className="px-5 py-3 text-right">Efficiency</th><th className="px-5 py-3 text-right">ROI</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rollup.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-5 py-3"><p className="font-medium">{r.name}</p><p className="font-mono text-xs text-muted-foreground">{r.reg}</p></td>
                <td className="px-5 py-3 text-right font-mono">{r.km} km</td>
                <td className="px-5 py-3 text-right font-mono">₹{r.fuel.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3 text-right font-mono">₹{r.maint.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3 text-right font-mono">₹{r.revenue.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3 text-right font-mono">{r.efficiency.toFixed(1)} km/L</td>
                <td className={"px-5 py-3 text-right font-mono font-semibold " + (r.roi >= 0 ? "text-success" : "text-destructive")}>{r.roi >= 0 ? "+" : ""}{r.roi.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
