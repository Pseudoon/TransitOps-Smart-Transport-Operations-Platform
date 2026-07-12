import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck,
  Wrench,
  Route as RouteIcon,
  Users,
  Activity,
  Fuel,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import {
  computeKpis,
  costBreakdown,
  drivers,
  fleetByType,
  trips,
  utilizationTrend,
  vehicles,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — TransitOps" },
      {
        name: "description",
        content:
          "Real-time fleet KPIs, active trips, driver duty status, and cost analytics.",
      },
    ],
  }),
  component: DashboardPage,
});

const CHART_COLORS = [
  "oklch(0.78 0.16 195)",
  "oklch(0.82 0.17 75)",
  "oklch(0.75 0.18 155)",
  "oklch(0.68 0.2 320)",
];

function DashboardPage() {
  const k = computeKpis();
  const activeTrips = trips.filter(
    (t) => t.status === "Dispatched" || t.status === "Draft",
  );
  const expiringSoon = drivers
    .filter((d) => new Date(d.licenseExpiry) < new Date("2027-01-01"))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Operations Overview"
        description="Live snapshot of your fleet, drivers, and dispatch activity."
        actions={
          <>
            <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
              <option>All regions</option>
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
            </select>
            <Link
              to="/trips"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              New dispatch
              <ArrowUpRight className="size-4" />
            </Link>
          </>
        }
      />

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Active Vehicles"
          value={k.onTrip}
          hint={`${k.available} available`}
          icon={Truck}
          accent="primary"
          trend={{ value: 12, positive: true }}
        />
        <KpiCard
          label="Active Trips"
          value={k.activeTrips}
          hint={`${k.pendingTrips} pending`}
          icon={RouteIcon}
          accent="accent"
          trend={{ value: 8, positive: true }}
        />
        <KpiCard
          label="Drivers On Duty"
          value={k.driversOnDuty}
          hint={`${drivers.length} total`}
          icon={Users}
          accent="success"
          trend={{ value: 3, positive: true }}
        />
        <KpiCard
          label="Fleet Utilization"
          value={`${k.utilization}%`}
          hint={`${k.inShop} in shop`}
          icon={Activity}
          accent="warning"
          trend={{ value: 5, positive: false }}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">
                Fleet Utilization — Last 7 days
              </h3>
              <p className="text-xs text-muted-foreground">
                Percent of active fleet dispatched per day.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" /> Utilization
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-accent" /> Trips
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationTrend}>
                <defs>
                  <linearGradient id="gradU" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={CHART_COLORS[0]}
                      stopOpacity={0.6}
                    />
                    <stop
                      offset="100%"
                      stopColor={CHART_COLORS[0]}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="gradT" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={CHART_COLORS[1]}
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="100%"
                      stopColor={CHART_COLORS[1]}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.32 0.03 250)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="oklch(0.72 0.02 245)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="oklch(0.72 0.02 245)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.22 0.03 250)",
                    border: "1px solid oklch(0.32 0.03 250)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2}
                  fill="url(#gradU)"
                />
                <Area
                  type="monotone"
                  dataKey="trips"
                  stroke={CHART_COLORS[1]}
                  strokeWidth={2}
                  fill="url(#gradT)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-lg font-semibold">Cost Breakdown</h3>
          <p className="text-xs text-muted-foreground">Last 30 days · INR</p>
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdown}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {costBreakdown.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.22 0.03 250)",
                    border: "1px solid oklch(0.32 0.03 250)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 text-xs">
            {costBreakdown.map((c, i) => (
              <li key={c.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: CHART_COLORS[i] }}
                  />
                  {c.name}
                </span>
                <span className="font-mono font-medium">
                  ₹{c.value.toLocaleString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-display text-lg font-semibold">
              Active & Pending Trips
            </h3>
            <Link
              to="/trips"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-2.5 text-left">Trip</th>
                  <th className="px-5 py-2.5 text-left">Route</th>
                  <th className="px-5 py-2.5 text-left">Vehicle</th>
                  <th className="px-5 py-2.5 text-left">Driver</th>
                  <th className="px-5 py-2.5 text-right">Cargo</th>
                  <th className="px-5 py-2.5 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeTrips.map((t) => {
                  const v = vehicles.find((v) => v.id === t.vehicleId);
                  const d = drivers.find((d) => d.id === t.driverId);
                  return (
                    <tr key={t.id} className="hover:bg-muted/40">
                      <td className="px-5 py-3 font-mono text-xs text-primary">
                        {t.id}
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-medium">{t.source}</div>
                        <div className="text-xs text-muted-foreground">
                          → {t.destination}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {v?.name}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {d?.name}
                      </td>
                      <td className="px-5 py-3 text-right font-mono">
                        {t.cargoKg} kg
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-display text-lg font-semibold">
              Fleet by Type
            </h3>
            <div className="mt-3 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fleetByType}>
                  <XAxis
                    dataKey="type"
                    stroke="oklch(0.72 0.02 245)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="oklch(0.72 0.02 245)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.22 0.03 250)",
                      border: "1px solid oklch(0.32 0.03 250)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {fleetByType.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-warning/30 bg-warning/5 p-5 shadow-card">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-warning" />
              <h3 className="font-display text-sm font-semibold">
                Licence Expiry Watch
              </h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {expiringSoon.map((d) => (
                <li key={d.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.licenseNumber}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-warning">
                    {d.licenseExpiry}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Truck, label: "Register vehicle", to: "/vehicles" },
          { icon: Users, label: "Add driver", to: "/drivers" },
          { icon: Wrench, label: "Log maintenance", to: "/maintenance" },
          { icon: Fuel, label: "Record fuel", to: "/expenses" },
        ].map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-muted/40"
          >
            <div className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <a.icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{a.label}</p>
              <p className="text-xs text-muted-foreground">Quick action</p>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
