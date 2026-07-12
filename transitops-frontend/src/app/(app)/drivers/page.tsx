"use client";

import { Plus, Phone, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { drivers } from "@/lib/mock-data";

function safetyColor(score: number) {
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-warning";
  return "text-destructive";
}

export default function DriversPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Drivers" description="Compliance, safety scores, and duty status at a glance." actions={<button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-glow"><Plus className="size-4" /> Add driver</button>} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {drivers.map((d) => {
          const expiringSoon = new Date(d.licenseExpiry) < new Date("2027-01-01");
          return (
            <div key={d.id} className="group rounded-xl border border-border bg-card p-5 shadow-card transition hover:border-primary/40">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-accent font-display text-lg font-bold text-accent-foreground">
                  {d.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-semibold">{d.name}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">{d.licenseNumber} · {d.licenseCategory}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3 text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Safety</p>
                  <p className={"mt-0.5 font-display text-xl font-bold " + safetyColor(d.safetyScore)}>{d.safetyScore}</p>
                </div>
                <div className="border-x border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Licence</p>
                  <p className={"mt-0.5 font-mono text-xs font-semibold " + (expiringSoon ? "text-warning" : "text-foreground")}>{d.licenseExpiry}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Category</p>
                  <p className="mt-0.5 font-display text-sm font-bold">{d.licenseCategory}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Phone className="size-3.5" /> {d.contact}</span>
                {d.safetyScore >= 85 && (<span className="inline-flex items-center gap-1 text-success"><ShieldCheck className="size-3.5" /> Certified</span>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
