"use client";

import Link from "next/link";
import {
  Truck,
  Wrench,
  Route as RouteIcon,
  Users,
  Map,
  Activity,
  Fuel,
  AlertTriangle,
  ArrowUpRight,
  Navigation,
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
import { KpiCard } from "@/components/common/KPICard";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  computeKpis,
  costBreakdown,
  drivers,
  fleetByType,
  trips,
  utilizationTrend,
  vehicles,
} from "@/lib/mock-data";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

export default function DashboardPage() {
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
              href="/trips"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              New dispatch
              <ArrowUpRight className="size-4" />
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <KpiCard label="Active Vehicles" value={k.onTrip} hint={`${k.available} available`} icon={Truck} accent="primary" trend={{ value: 12, positive: true }} />
        <KpiCard label="Active Trips" value={k.activeTrips} hint={`${k.pendingTrips} pending`} icon={RouteIcon} accent="accent" trend={{ value: 8, positive: true }} />
        <KpiCard label="Drivers On Duty" value={k.driversOnDuty} hint={`${drivers.length} total`} icon={Users} accent="success" trend={{ value: 3, positive: true }} />
        <KpiCard label="Fleet Utilization" value={`${k.utilization}%`} hint={`${k.inShop} in shop`} icon={Activity} accent="warning" trend={{ value: 5, positive: false }} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <div className="rounded-xl border border-border bg-card/80 p-5 shadow-card backdrop-blur-md transition-transform hover:-translate-y-1 hover:border-primary/30 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Fleet Utilization — Last 7 days</h3>
              <p className="text-xs text-muted-foreground">Percent of active fleet dispatched per day.</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Utilization</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" /> Trips</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationTrend}>
                <defs>
                  <linearGradient id="gradU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 250)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.72 0.02 245)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.72 0.02 245)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.32 0.03 250)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="utilization" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gradU)" />
                <Area type="monotone" dataKey="trips" stroke={CHART_COLORS[1]} strokeWidth={2} fill="url(#gradT)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/80 p-5 shadow-card backdrop-blur-md transition-transform hover:-translate-y-1 hover:border-accent/30">
          <h3 className="font-display text-lg font-semibold">Cost Breakdown</h3>
          <p className="text-xs text-muted-foreground">Last 30 days · INR</p>
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={costBreakdown} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {costBreakdown.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="none" />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.32 0.03 250)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 text-xs">
            {costBreakdown.map((c, i) => (
              <li key={c.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ background: CHART_COLORS[i] }} />
                  {c.name}
                </span>
                <span className="font-mono font-medium">₹{c.value.toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: "300ms" }}>
        {/* Mock Map UI for Active Trips */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card/80 shadow-card backdrop-blur-md lg:col-span-2">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-hero opacity-30" />
          <div className="absolute inset-0 grid-bg opacity-20" />
          
          <div className="relative flex h-full flex-col p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <Map className="size-5 text-primary" /> Live Dispatch Map
                </h3>
                <p className="text-xs text-muted-foreground">Real-time geospatial tracking</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/30">
                <div className="size-1.5 animate-pulse rounded-full bg-primary" />
                Live Sync
              </div>
            </div>

            <div className="relative flex-1 rounded-xl bg-muted/40 border border-border min-h-[300px] overflow-hidden">
              {/* Map UI Elements */}
              <div className="absolute left-1/4 top-1/3 grid size-12 place-items-center rounded-full bg-primary/20 ring-1 ring-primary/50 text-primary">
                <Navigation className="size-5" />
                <div className="absolute -bottom-8 whitespace-nowrap rounded bg-popover px-2 py-1 text-[10px] font-bold text-foreground shadow-sm">T-1042</div>
              </div>
              
              <div className="absolute right-1/3 bottom-1/4 grid size-10 place-items-center rounded-full bg-accent/20 ring-1 ring-accent/50 text-accent">
                <Navigation className="size-4 rotate-45" />
                <div className="absolute -bottom-8 whitespace-nowrap rounded bg-popover px-2 py-1 text-[10px] font-bold text-foreground shadow-sm">T-1041</div>
              </div>

              {/* Connecting abstract route line */}
              <svg className="absolute inset-0 size-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M25,33 Q50,20 66,75" fill="none" stroke="oklch(0.75 0.20 205)" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-50" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card/80 p-5 shadow-card backdrop-blur-md transition-transform hover:-translate-y-1 hover:border-info/30">
            <h3 className="font-display text-lg font-semibold text-foreground">Fleet by Type</h3>
            <div className="mt-3 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fleetByType}>
                  <XAxis dataKey="type" stroke="oklch(0.72 0.02 245)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.72 0.02 245)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.32 0.03 250)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {fleetByType.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-warning/40 bg-warning/10 p-5 shadow-card backdrop-blur-md transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-warning" />
              <h3 className="font-display text-sm font-semibold">Licence Expiry Watch</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {expiringSoon.map((d) => (
                <li key={d.id} className="flex items-center justify-between">
                  <div className="min-w-0"><p className="truncate font-medium">{d.name}</p><p className="text-xs text-muted-foreground">{d.licenseNumber}</p></div>
                  <span className="font-mono text-xs text-warning">{d.licenseExpiry}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up" style={{ animationDelay: "400ms" }}>
        {[
          { icon: Truck, label: "Register vehicle", href: "/vehicles" },
          { icon: Users, label: "Add driver", href: "/drivers" },
          { icon: Wrench, label: "Log maintenance", href: "/maintenance" },
          { icon: Fuel, label: "Record fuel", href: "/fuel-expenses" },
        ].map((a) => (
          <Link key={a.label} href={a.href} className="group flex items-center gap-3 rounded-xl border border-border bg-card/80 p-4 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-muted/40 hover:shadow-glow">
            <div className="grid size-10 place-items-center rounded-lg bg-primary/20 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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
