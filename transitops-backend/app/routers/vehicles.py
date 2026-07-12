"""
Vehicle CRUD routes — Person B, Phase 1.
GET /vehicles, GET /vehicles/{id}, POST /vehicles, PUT /vehicles/{id}, DELETE /vehicles/{id}
"""
from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId
from typing import Optional

from app.models.vehicle import VehicleCreate, VehicleUpdate, VehicleOut
from app.database import vehicles_collection

router = APIRouter()


def vehicle_helper(doc: dict) -> dict:
    """Convert Mongo's ObjectId _id into a string so Pydantic can serialize it."""
    doc["_id"] = str(doc["_id"])
    return doc


def to_object_id(id_str: str) -> ObjectId:
    """Safely convert a path param string to ObjectId, or raise a clean 400."""
    try:
        return ObjectId(id_str)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid vehicle id")


@router.get("", response_model=list[VehicleOut])
async def list_vehicles(
    status_filter: Optional[str] = None,
    type_filter: Optional[str] = None,
    region: Optional[str] = None,
):
    """GET /vehicles?status=&type=&region="""
    query = {}
    if status_filter:
        query["status"] = status_filter
    if type_filter:
        query["type"] = type_filter
    if region:
        query["region"] = region

    vehicles = []
    async for doc in vehicles_collection.find(query):
        vehicles.append(vehicle_helper(doc))
    return vehicles



EXCLUDED_VEHICLE_STATUSES = ["Retired", "In Shop", "On Trip"]
 
 
@router.get("/available", response_model=list[VehicleOut])
async def list_available_vehicles():
    """
    GET /vehicles/available
    Returns only vehicles eligible for dispatch:
    excludes Retired, In Shop, and On Trip statuses.
    """
    query = {"status": {"$nin": EXCLUDED_VEHICLE_STATUSES}}
 
    vehicles = []
    async for doc in vehicles_collection.find(query):
        vehicles.append(vehicle_helper(doc))
    return vehicles
 
@router.get("/{vehicle_id}", response_model=VehicleOut)
async def get_vehicle(vehicle_id: str):
    """GET /vehicles/{id}"""
    obj_id = to_object_id(vehicle_id)
    doc = await vehicles_collection.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return vehicle_helper(doc)


@router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
async def create_vehicle(vehicle: VehicleCreate):
    """POST /vehicles — enforces unique registration_number."""
    existing = await vehicles_collection.find_one(
        {"registration_number": vehicle.registration_number}
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Vehicle with registration number '{vehicle.registration_number}' already exists",
        )

    vehicle_dict = vehicle.model_dump()
    result = await vehicles_collection.insert_one(vehicle_dict)
    new_doc = await vehicles_collection.find_one({"_id": result.inserted_id})
    return vehicle_helper(new_doc)


@router.put("/{vehicle_id}", response_model=VehicleOut)
async def update_vehicle(vehicle_id: str, vehicle: VehicleUpdate):
    """PUT /vehicles/{id} — partial update, only sends fields that were provided."""
    obj_id = to_object_id(vehicle_id)

    update_data = {k: v for k, v in vehicle.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    result = await vehicles_collection.update_one({"_id": obj_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    updated_doc = await vehicles_collection.find_one({"_id": obj_id})
    return vehicle_helper(updated_doc)


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vehicle(vehicle_id: str):
    """DELETE /vehicles/{id}"""
    obj_id = to_object_id(vehicle_id)
    result = await vehicles_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return None

