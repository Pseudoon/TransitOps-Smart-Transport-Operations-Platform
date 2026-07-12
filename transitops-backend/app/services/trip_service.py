"""
Trip state machine — Person A owns this. Phase 2 (highest priority module).

Implements:
- create trip (Draft)
- dispatch (Draft -> Dispatched, vehicle+driver -> On Trip)
- complete (Dispatched -> Completed, vehicle+driver -> Available)
- cancel (Dispatched -> Cancelled, vehicle+driver -> Available)

Every transition calls validation_service checks BEFORE writing to DB.
"""
from bson import ObjectId
from fastapi import HTTPException, status

from app.database import trips_collection, vehicles_collection, drivers_collection
from app.models.trip import TripCreate, TripComplete
from app.services import validation_service as val


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


async def create_trip(trip: TripCreate) -> dict:
    vehicle = await val.get_vehicle_or_none(trip.vehicle_id)
    if not vehicle:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vehicle not found")

    driver = await val.get_driver_or_none(trip.driver_id)
    if not driver:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Driver not found")

    ok, msg = await val.is_cargo_within_capacity(trip.vehicle_id, trip.cargo_weight)
    if not ok:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, msg)

    doc = trip.model_dump()
    doc["status"] = "Draft"
    result = await trips_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _serialize(doc)


async def get_trip_or_404(trip_id: str) -> dict:
    trip = await trips_collection.find_one({"_id": ObjectId(trip_id)})
    if not trip:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Trip not found")
    return trip


async def dispatch_trip(trip_id: str) -> dict:
    trip = await get_trip_or_404(trip_id)

    if trip["status"] != "Draft":
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Trip must be in Draft status to dispatch (current: {trip['status']})",
        )

    ok, msg = await val.is_vehicle_available_for_dispatch(trip["vehicle_id"])
    if not ok:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, msg)

    ok, msg = await val.is_driver_available_for_dispatch(trip["driver_id"])
    if not ok:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, msg)

    ok, msg = await val.is_cargo_within_capacity(trip["vehicle_id"], trip["cargo_weight"])
    if not ok:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, msg)

    await vehicles_collection.update_one(
        {"_id": ObjectId(trip["vehicle_id"])}, {"$set": {"status": "On Trip"}}
    )
    await drivers_collection.update_one(
        {"_id": ObjectId(trip["driver_id"])}, {"$set": {"status": "On Trip"}}
    )
    await trips_collection.update_one(
        {"_id": ObjectId(trip_id)}, {"$set": {"status": "Dispatched"}}
    )

    updated = await trips_collection.find_one({"_id": ObjectId(trip_id)})
    return _serialize(updated)


async def complete_trip(trip_id: str, payload: TripComplete) -> dict:
    trip = await get_trip_or_404(trip_id)

    if trip["status"] != "Dispatched":
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Trip must be Dispatched to complete (current: {trip['status']})",
        )

    await vehicles_collection.update_one(
        {"_id": ObjectId(trip["vehicle_id"])},
        {"$set": {"status": "Available", "odometer": payload.final_odometer}},
    )
    await drivers_collection.update_one(
        {"_id": ObjectId(trip["driver_id"])}, {"$set": {"status": "Available"}}
    )
    await trips_collection.update_one(
        {"_id": ObjectId(trip_id)},
        {"$set": {
            "status": "Completed",
            "final_odometer": payload.final_odometer,
            "fuel_consumed": payload.fuel_consumed,
        }},
    )

    updated = await trips_collection.find_one({"_id": ObjectId(trip_id)})
    return _serialize(updated)


async def cancel_trip(trip_id: str) -> dict:
    trip = await get_trip_or_404(trip_id)

    if trip["status"] != "Dispatched":
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Only a Dispatched trip can be cancelled (current: {trip['status']})",
        )

    await vehicles_collection.update_one(
        {"_id": ObjectId(trip["vehicle_id"])}, {"$set": {"status": "Available"}}
    )
    await drivers_collection.update_one(
        {"_id": ObjectId(trip["driver_id"])}, {"$set": {"status": "Available"}}
    )
    await trips_collection.update_one(
        {"_id": ObjectId(trip_id)}, {"$set": {"status": "Cancelled"}}
    )

    updated = await trips_collection.find_one({"_id": ObjectId(trip_id)})
    return _serialize(updated)


async def list_trips(status_filter: str = None) -> list[dict]:
    query = {"status": status_filter} if status_filter else {}
    trips = await trips_collection.find(query).to_list(length=500)
    return [_serialize(t) for t in trips]