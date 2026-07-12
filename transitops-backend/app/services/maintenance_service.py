"""
Maintenance workflow — Person A owns this. Phase 3.

- create_maintenance(): auto-sets vehicle status -> "In Shop"
- close_maintenance(): auto-sets vehicle status -> "Available" (unless Retired)
"""
from bson import ObjectId
from fastapi import HTTPException, status

from app.database import maintenance_collection, vehicles_collection
from app.models.maintenance import MaintenanceCreate


def _serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


async def create_maintenance(record: MaintenanceCreate) -> dict:
    vehicle = await vehicles_collection.find_one({"_id": ObjectId(record.vehicle_id)})
    if not vehicle:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Vehicle not found")

    if vehicle["status"] == "On Trip":
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Cannot create maintenance for a vehicle that is currently On Trip",
        )

    doc = record.model_dump(mode="json")
    doc["is_closed"] = False
    result = await maintenance_collection.insert_one(doc)
    doc["_id"] = result.inserted_id

    # Auto-flip vehicle status to In Shop, removing it from dispatch pool
    await vehicles_collection.update_one(
        {"_id": ObjectId(record.vehicle_id)}, {"$set": {"status": "In Shop"}}
    )

    return _serialize(doc)


async def get_maintenance_or_404(record_id: str) -> dict:
    record = await maintenance_collection.find_one({"_id": ObjectId(record_id)})
    if not record:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Maintenance record not found")
    return record


async def close_maintenance(record_id: str) -> dict:
    record = await get_maintenance_or_404(record_id)

    if record["is_closed"]:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Maintenance record is already closed")

    await maintenance_collection.update_one(
        {"_id": ObjectId(record_id)}, {"$set": {"is_closed": True}}
    )

    vehicle = await vehicles_collection.find_one({"_id": ObjectId(record["vehicle_id"])})
    if vehicle and vehicle["status"] != "Retired":
        await vehicles_collection.update_one(
            {"_id": ObjectId(record["vehicle_id"])}, {"$set": {"status": "Available"}}
        )

    updated = await maintenance_collection.find_one({"_id": ObjectId(record_id)})
    return _serialize(updated)


async def list_maintenance(vehicle_id: str = None) -> list[dict]:
    query = {"vehicle_id": vehicle_id} if vehicle_id else {}
    records = await maintenance_collection.find(query).to_list(length=500)
    return [_serialize(r) for r in records]