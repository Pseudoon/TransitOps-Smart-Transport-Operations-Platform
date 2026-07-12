"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Truck, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { vehicleService } from "@/services/vehicleService";

type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired";

interface Vehicle {
  _id: string;
  registration_number: string;
  name_model: string;
  type: string;
  max_load_capacity: number;
  odometer: number;
  acquisition_cost: number;
  region?: string;
  status: VehicleStatus;
}

const STATUSES: (VehicleStatus | "All")[] = ["All", "Available", "On Trip", "In Shop", "Retired"];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    registration_number: "",
    name_model: "",
    type: "",
    max_load_capacity: "",
    odometer: "0",
    acquisition_cost: "",
    region: "",
  });

  async function loadVehicles() {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err) {
      console.error(err);
      setError("Could not load vehicles. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  const filtered = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          (status === "All" || v.status === status) &&
          (q === "" ||
            v.registration_number.toLowerCase().includes(q.toLowerCase()) ||
            v.name_model.toLowerCase().includes(q.toLowerCase())),
      ),
    [vehicles, q, status],
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await vehicleService.create({
        registration_number: form.registration_number,
        name_model: form.name_model,
        type: form.type,
        max_load_capacity: Number(form.max_load_capacity),
        odometer: Number(form.odometer),
        acquisition_cost: Number(form.acquisition_cost),
        region: form.region || undefined,
        status: "Available",
      });
      setShowForm(false);
      setForm({
        registration_number: "",
        name_model: "",
        type: "",
        max_load_capacity: "",
        odometer: "0",
        acquisition_cost: "",
        region: "",
      });
      await loadVehicles();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Failed to create vehicle.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Registry"
        description="Every truck, van, and trailer in the fleet — with live status."
        actions={
          <button
            onClick={() => setShowForm((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Plus className="size-4" /> Register vehicle
          </button>
        }
      />

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-card sm:grid-cols-3"
        >
          <input
            required
            placeholder="Registration number"
            value={form.registration_number}
            onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Name / Model"
            value={form.name_model}
            onChange={(e) => setForm({ ...form, name_model: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Type (e.g. Mini Truck)"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            placeholder="Max load capacity (kg)"
            value={form.max_load_capacity}
            onChange={(e) => setForm({ ...form, max_load_capacity: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            placeholder="Acquisition cost"
            value={form.acquisition_cost}
            onChange={(e) => setForm({ ...form, acquisition_cost: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            placeholder="Region"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-3 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save vehicle"}
          </button>
        </form>
      )}

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
            {loading && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                  <Loader2 className="mx-auto mb-2 size-5 animate-spin" />
                  Loading vehicles…
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((v) => (
                <tr key={v._id} className="hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-8 place-items-center rounded-md bg-primary/15 text-primary">
                        <Truck className="size-4" />
                      </div>
                      <span className="font-mono text-xs">{v.registration_number}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium">{v.name_model}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.type}</td>
                  <td className="px-5 py-3 text-right font-mono">
                    {v.max_load_capacity.toLocaleString()} kg
                  </td>
                  <td className="px-5 py-3 text-right font-mono">
                    {v.odometer.toLocaleString()} km
                  </td>
                  <td className="px-5 py-3 text-right font-mono">
                    ₹{(v.acquisition_cost / 100000).toFixed(1)}L
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{v.region || "-"}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={v.status} />
                  </td>
                </tr>
              ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
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
