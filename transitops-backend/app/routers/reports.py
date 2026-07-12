"""
app/routers/reports.py

Phase 4 — Person B
Reports: Fuel Efficiency, ROI, CSV export.
(Fleet Utilization % is Person A's Dashboard KPI endpoint, not this file.)

ASSUMPTIONS — confirm these against the real Trip model before trusting numbers:
- trips collection has: vehicle_id, status ("Completed" per your TRIP_STATUS enum),
  distance_km (float), revenue (float)
If Person A's Trip model uses different field names (e.g. "distance" instead of
"distance_km", or revenue lives elsewhere / doesn't exist yet), swap the field
name strings in the aggregation queries below — the structure won't need to change.

Wire into main.py:
    from app.routers import reports
    app.include_router(reports.router)
"""

import csv
import io

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from bson import ObjectId
from bson.errors import InvalidId

from app.database import db

router = APIRouter(prefix="/reports", tags=["Reports"])


def to_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")


# ---------- shared calculation helpers ----------
# Both the JSON endpoints and the CSV export call these, so the numbers can't
# drift between "what you see on screen" and "what you download".

async def compute_fuel_efficiency() -> list[dict]:
    vehicles = await db.vehicles.find({}).to_list(length=1000)
    results = []

    for vehicle in vehicles:
        vid = str(vehicle["_id"])

        total_liters = 0.0
        async for log in db.fuel_logs.find({"vehicle_id": vid}):
            total_liters += log.get("liters", 0)

        total_distance = 0.0
        async for trip in db.trips.find({"vehicle_id": vid, "status": "Completed"}):
            total_distance += trip.get("distance_km", 0)

        efficiency = (total_distance / total_liters) if total_liters > 0 else None

        results.append({
            "vehicle_id": vid,
            "registration_number": vehicle.get("registration_number"),
            "total_distance_km": total_distance,
            "total_liters": total_liters,
            "km_per_liter": round(efficiency, 2) if efficiency is not None else None,
        })

    return results


async def compute_roi() -> list[dict]:
    vehicles = await db.vehicles.find({}).to_list(length=1000)
    results = []

    for vehicle in vehicles:
        vid = str(vehicle["_id"])
        acquisition_cost = vehicle.get("acquisition_cost", 0)

        total_revenue = 0.0
        async for trip in db.trips.find({"vehicle_id": vid, "status": "Completed"}):
            total_revenue += trip.get("revenue", 0)

        total_fuel_cost = 0.0
        async for log in db.fuel_logs.find({"vehicle_id": vid}):
            total_fuel_cost += log.get("cost", 0)

        total_maintenance_cost = 0.0
        if "maintenance_logs" in await db.list_collection_names():
            async for record in db.maintenance_logs.find({"vehicle_id": vid}):
                total_maintenance_cost += record.get("cost", 0)

        operational_cost = total_fuel_cost + total_maintenance_cost
        roi = (
            (total_revenue - operational_cost) / acquisition_cost
            if acquisition_cost > 0 else None
        )

        results.append({
            "vehicle_id": vid,
            "registration_number": vehicle.get("registration_number"),
            "total_revenue": total_revenue,
            "operational_cost": operational_cost,
            "acquisition_cost": acquisition_cost,
            "roi": round(roi, 4) if roi is not None else None,
        })

    return results


# ---------- JSON endpoints ----------

@router.get("/fuel-efficiency")
async def fuel_efficiency_report():
    return await compute_fuel_efficiency()


@router.get("/roi")
async def roi_report():
    return await compute_roi()


# ---------- CSV export ----------
# Note: your repo already has app/utils/csv_export.py as a helper (per your
# repo structure notes) that isn't used yet. If it has a signature that fits,
# swap the manual csv.writer code below for that helper instead of duplicating
# logic — but this works standalone if you're short on time to check it.

def rows_to_csv(rows: list[dict]) -> str:
    if not rows:
        return ""
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)
    return output.getvalue()


@router.get("/export/csv")
async def export_csv(report: str):
    """
    report= "fuel_efficiency" | "roi"
    Example: GET /reports/export/csv?report=roi
    """
    if report == "fuel_efficiency":
        rows = await compute_fuel_efficiency()
        filename = "fuel_efficiency_report.csv"
    elif report == "roi":
        rows = await compute_roi()
        filename = "roi_report.csv"
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid report type. Use 'fuel_efficiency' or 'roi'."
        )

    csv_content = rows_to_csv(rows)
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )