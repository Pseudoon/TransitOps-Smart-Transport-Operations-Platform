"""Dashboard KPI route — Person A owns this. Phase 4.
GET /dashboard/kpis
"""
from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.database import vehicles_collection, drivers_collection, trips_collection
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.get("/kpis")
async def get_kpis(
    type: Optional[str] = Query(None, description="Filter vehicles by type"),
    status: Optional[str] = Query(None, description="Filter vehicles by status"),
    region: Optional[str] = Query(None, description="Filter vehicles by region"),
    current_user: dict = Depends(get_current_user),
):
    vehicle_query = {}
    if type:
        vehicle_query["type"] = type
    if status:
        vehicle_query["status"] = status
    if region:
        vehicle_query["region"] = region

    total_vehicles = await vehicles_collection.count_documents(vehicle_query)

    active_query = {**vehicle_query, "status": {"$in": ["Available", "On Trip"]}}
    active_vehicles = await vehicles_collection.count_documents(active_query)

    available_query = {**vehicle_query, "status": "Available"}
    available_vehicles = await vehicles_collection.count_documents(available_query)

    in_shop_query = {**vehicle_query, "status": "In Shop"}
    vehicles_in_maintenance = await vehicles_collection.count_documents(in_shop_query)

    on_trip_query = {**vehicle_query, "status": "On Trip"}
    vehicles_on_trip = await vehicles_collection.count_documents(on_trip_query)

    active_trips = await trips_collection.count_documents({"status": "Dispatched"})
    pending_trips = await trips_collection.count_documents({"status": "Draft"})

    drivers_on_duty = await drivers_collection.count_documents({"status": "On Trip"})

    fleet_utilization_pct = (
        round((vehicles_on_trip / total_vehicles) * 100, 2) if total_vehicles > 0 else 0
    )

    return {
        "active_vehicles": active_vehicles,
        "available_vehicles": available_vehicles,
        "vehicles_in_maintenance": vehicles_in_maintenance,
        "active_trips": active_trips,
        "pending_trips": pending_trips,
        "drivers_on_duty": drivers_on_duty,
        "fleet_utilization_pct": fleet_utilization_pct,
    }