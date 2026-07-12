"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Route,
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { tripService } from "@/services/tripService";
import { vehicleService } from "@/services/vehicleService";
import { driverService } from "@/services/driverService";

type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled";

interface Trip {
  _id: string;
  source: string;
  destination: string;
  vehicle_id: string;
  driver_id: string;
  cargo_weight: number;
  planned_distance: number;
  status: TripStatus;
}

interface Vehicle {
  _id: string;
  registration_number: string;
  name_model: string;
  max_load_capacity: number;
}

interface Driver {
  _id: string;
  name: string;
  license_number: string;
}

const STATUSES: (TripStatus | "All")[] = [
  "All",
  "Draft",
  "Dispatched",
  "Completed",
  "Cancelled",
];

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const [completingTrip, setCompletingTrip] = useState<Trip | null>(null);
  const [completeForm, setCompleteForm] = useState({
    final_odometer: "",
    fuel_consumed: "",
  });

  const [form, setForm] = useState({
    source: "",
    destination: "",
    vehicle_id: "",
    driver_id: "",
    cargo_weight: "",
    planned_distance: "",
  });

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        tripService.getAll(),
        vehicleService.getAvailable(),
        driverService.getAvailable(),
      ]);
      setTrips(tripsData);
      setAvailableVehicles(vehiclesData);
      setAvailableDrivers(driversData);
    } catch (err) {
      console.error(err);
      setError("Could not load trips. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const filtered = useMemo(
    () => trips.filter((t) => status === "All" || t.status === status),
    [trips, status],
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await tripService.create({
        source: form.source,
        destination: form.destination,
        vehicle_id: form.vehicle_id,
        driver_id: form.driver_id,
        cargo_weight: Number(form.cargo_weight),
        planned_distance: Number(form.planned_distance),
      });
      setShowForm(false);
      setForm({
        source: "",
        destination: "",
        vehicle_id: "",
        driver_id: "",
        cargo_weight: "",
        planned_distance: "",
      });
      await loadAll();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Failed to create trip.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDispatch(tripId: string) {
    setActioningId(tripId);
    setError(null);
    try {
      await tripService.dispatch(tripId);
      await loadAll();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Failed to dispatch trip.";
      setError(message);
    } finally {
      setActioningId(null);
    }
  }

  async function handleCancel(tripId: string) {
    setActioningId(tripId);
    setError(null);
    try {
      await tripService.cancel(tripId);
      await loadAll();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Failed to cancel trip.";
      setError(message);
    } finally {
      setActioningId(null);
    }
  }

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault();
    if (!completingTrip) return;
    setActioningId(completingTrip._id);
    setError(null);
    try {
      await tripService.complete(completingTrip._id, {
        final_odometer: Number(completeForm.final_odometer),
        fuel_consumed: Number(completeForm.fuel_consumed),
      });
      setCompletingTrip(null);
      setCompleteForm({ final_odometer: "", fuel_consumed: "" });
      await loadAll();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Failed to complete trip.";
      setError(message);
    } finally {
      setActioningId(null);
    }
  }

  function vehicleLabel(id: string) {
    const v = availableVehicles.find((v) => v._id === id);
    return v ? `${v.registration_number} — ${v.name_model}` : id;
  }

  function driverLabel(id: string) {
    const d = availableDrivers.find((d) => d._id === id);
    return d ? d.name : id;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trip Management"
        description="Create, dispatch, complete, and cancel trips."
        actions={
          <button
            onClick={() => setShowForm((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Plus className="size-4" /> New trip
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
            placeholder="Source"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Destination"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            placeholder="Planned distance (km)"
            value={form.planned_distance}
            onChange={(e) =>
              setForm({ ...form, planned_distance: e.target.value })
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />

          <select
            required
            value={form.vehicle_id}
            onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select available vehicle…</option>
            {availableVehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.registration_number} — {v.name_model} (max{" "}
                {v.max_load_capacity}kg)
              </option>
            ))}
          </select>

          <select
            required
            value={form.driver_id}
            onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select available driver…</option>
            {availableDrivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} — {d.license_number}
              </option>
            ))}
          </select>

          <input
            required
            type="number"
            placeholder="Cargo weight (kg)"
            value={form.cargo_weight}
            onChange={(e) => setForm({ ...form, cargo_weight: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />

          {availableVehicles.length === 0 && (
            <p className="sm:col-span-3 text-xs text-amber-600">
              No available vehicles right now — all are On Trip, In Shop, or
              Retired.
            </p>
          )}
          {availableDrivers.length === 0 && (
            <p className="sm:col-span-3 text-xs text-amber-600">
              No available drivers right now — all are On Trip, Suspended, Off
              Duty, or license expired.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-3 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create trip (Draft)"}
          </button>
        </form>
      )}

      {completingTrip && (
        <form
          onSubmit={handleComplete}
          className="grid gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 sm:grid-cols-3"
        >
          <p className="sm:col-span-3 text-sm font-medium text-emerald-800">
            Completing trip: {completingTrip.source} →{" "}
            {completingTrip.destination}
          </p>
          <input
            required
            type="number"
            placeholder="Final odometer (km)"
            value={completeForm.final_odometer}
            onChange={(e) =>
              setCompleteForm({
                ...completeForm,
                final_odometer: e.target.value,
              })
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            placeholder="Fuel consumed (liters)"
            value={completeForm.fuel_consumed}
            onChange={(e) =>
              setCompleteForm({
                ...completeForm,
                fuel_consumed: e.target.value,
              })
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={actioningId === completingTrip._id}
              className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Confirm complete
            </button>
            <button
              type="button"
              onClick={() => setCompletingTrip(null)}
              className="rounded-lg border border-border px-3 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

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

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Route</th>
              <th className="px-5 py-3 text-left">Vehicle</th>
              <th className="px-5 py-3 text-left">Driver</th>
              <th className="px-5 py-3 text-right">Cargo</th>
              <th className="px-5 py-3 text-right">Distance</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-muted-foreground"
                >
                  <Loader2 className="mx-auto mb-2 size-5 animate-spin" />
                  Loading trips…
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((t) => (
                <tr key={t._id} className="hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 font-medium">
                      <Route className="size-4 text-muted-foreground" />
                      {t.source} → {t.destination}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {vehicleLabel(t.vehicle_id)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {driverLabel(t.driver_id)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono">
                    {t.cargo_weight} kg
                  </td>
                  <td className="px-5 py-3 text-right font-mono">
                    {t.planned_distance} km
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1.5">
                      {t.status === "Draft" && (
                        <button
                          onClick={() => handleDispatch(t._id)}
                          disabled={actioningId === t._id}
                          title="Dispatch"
                          className="rounded-md bg-primary/15 p-1.5 text-primary hover:bg-primary/25 disabled:opacity-50"
                        >
                          <Play className="size-4" />
                        </button>
                      )}
                      {t.status === "Dispatched" && (
                        <>
                          <button
                            onClick={() => setCompletingTrip(t)}
                            disabled={actioningId === t._id}
                            title="Complete"
                            className="rounded-md bg-emerald-100 p-1.5 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50"
                          >
                            <CheckCircle2 className="size-4" />
                          </button>
                          <button
                            onClick={() => handleCancel(t._id)}
                            disabled={actioningId === t._id}
                            title="Cancel"
                            className="rounded-md bg-red-100 p-1.5 text-red-700 hover:bg-red-200 disabled:opacity-50"
                          >
                            <XCircle className="size-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-muted-foreground"
                >
                  No trips match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
