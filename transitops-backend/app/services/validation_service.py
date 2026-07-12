"""
Shared validation checks — used by trip_service and maintenance_service.
Person A owns this (Phase 2), Person B contributes vehicle/driver-lookup helpers.
"""
from datetime import date
from bson import ObjectId

from app.database import vehicles_collection, drivers_collection, trips_collection


async def is_registration_number_unique(reg_number: str, exclude_id: str = None) -> bool:
    """Check no other vehicle has this registration number."""
    query = {"registration_number": reg_number}
    if exclude_id:
        query["_id"] = {"$ne": ObjectId(exclude_id)}
    existing = await vehicles_collection.find_one(query)
    return existing is None


async def get_vehicle_or_none(vehicle_id: str):
    return await vehicles_collection.find_one({"_id": ObjectId(vehicle_id)})


async def get_driver_or_none(driver_id: str):
    return await drivers_collection.find_one({"_id": ObjectId(driver_id)})


async def is_vehicle_available_for_dispatch(vehicle_id: str) -> tuple[bool, str]:
    """Vehicle must exist and be status == Available."""
    vehicle = await get_vehicle_or_none(vehicle_id)
    if not vehicle:
        return False, "Vehicle not found"
    if vehicle["status"] != "Available":
        return False, f"Vehicle is not available (status: {vehicle['status']})"
    return True, ""


async def is_driver_available_for_dispatch(driver_id: str) -> tuple[bool, str]:
    """Driver must exist, be Available, not Suspended, and license must not be expired."""
    driver = await get_driver_or_none(driver_id)
    if not driver:
        return False, "Driver not found"
    if driver["status"] != "Available":
        return False, f"Driver is not available (status: {driver['status']})"

    expiry = driver["license_expiry_date"]
    if isinstance(expiry, str):
        expiry = date.fromisoformat(expiry)
    if expiry < date.today():
        return False, "Driver's license has expired"

    return True, ""


async def is_cargo_within_capacity(vehicle_id: str, cargo_weight: float) -> tuple[bool, str]:
    """Cargo weight must not exceed vehicle's max_load_capacity."""
    vehicle = await get_vehicle_or_none(vehicle_id)
    if not vehicle:
        return False, "Vehicle not found"
    if cargo_weight > vehicle["max_load_capacity"]:
        return False, (
            f"Cargo weight ({cargo_weight}kg) exceeds vehicle's "
            f"max load capacity ({vehicle['max_load_capacity']}kg)"
        )
    return True, ""