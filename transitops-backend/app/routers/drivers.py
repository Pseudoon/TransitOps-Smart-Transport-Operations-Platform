"""
Driver CRUD routes — Person B, Phase 1.
GET /drivers, GET /drivers/{id}, POST /drivers, PUT /drivers/{id}, DELETE /drivers/{id}
"""
from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId
from typing import Optional

from app.models.driver import DriverCreate, DriverUpdate, DriverOut
from app.database import drivers_collection
from datetime import date

router = APIRouter()


def driver_helper(doc: dict) -> dict:
    """Convert Mongo's ObjectId _id into a string so Pydantic can serialize it."""
    doc["_id"] = str(doc["_id"])
    return doc


def to_object_id(id_str: str) -> ObjectId:
    """Safely convert a path param string to ObjectId, or raise a clean 400."""
    try:
        return ObjectId(id_str)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid driver id")


@router.get("", response_model=list[DriverOut])
async def list_drivers(status_filter: Optional[str] = None):
    """GET /drivers?status="""
    query = {}
    if status_filter:
        query["status"] = status_filter

    drivers = []
    async for doc in drivers_collection.find(query):
        drivers.append(driver_helper(doc))
    return drivers



EXCLUDED_DRIVER_STATUSES = ["Suspended", "On Trip", "Off Duty"]
# Note: brief says "Off Duty" isn't explicitly excluded from dispatch,
# only Suspended + expired license + already On Trip are mandatory rules.
# Keeping "Off Duty" excluded is a reasonable judgment call since a driver
# who is off duty shouldn't be dispatched either — flag this to your team,
# easy to remove from the list below if they want Off Duty drivers selectable.
 
 
@router.get("/available", response_model=list[DriverOut])
async def list_available_drivers():
    """
    GET /drivers/available
    Returns only drivers eligible for dispatch:
    excludes Suspended/On Trip status, and drivers with an expired license.
    """
    today = date.today().isoformat()  # "YYYY-MM-DD" — matches stored string format
 
    query = {
        "status": {"$nin": EXCLUDED_DRIVER_STATUSES},
        "license_expiry_date": {"$gte": today},
    }
 
    drivers = []
    async for doc in drivers_collection.find(query):
        drivers.append(driver_helper(doc))
    return drivers
 



@router.get("/{driver_id}", response_model=DriverOut)
async def get_driver(driver_id: str):
    """GET /drivers/{id}"""
    obj_id = to_object_id(driver_id)
    doc = await drivers_collection.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver not found")
    return driver_helper(doc)


@router.post("", response_model=DriverOut, status_code=status.HTTP_201_CREATED)
async def create_driver(driver: DriverCreate):
    """POST /drivers — enforces unique license_number."""
    existing = await drivers_collection.find_one(
        {"license_number": driver.license_number}
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Driver with license number '{driver.license_number}' already exists",
        )

    driver_dict = driver.model_dump(mode="json")  # mode="json" serializes date -> str
    result = await drivers_collection.insert_one(driver_dict)
    new_doc = await drivers_collection.find_one({"_id": result.inserted_id})
    return driver_helper(new_doc)


@router.put("/{driver_id}", response_model=DriverOut)
async def update_driver(driver_id: str, driver: DriverUpdate):
    """PUT /drivers/{id} — partial update, only sends fields that were provided."""
    obj_id = to_object_id(driver_id)

    update_data = {
        k: v for k, v in driver.model_dump(mode="json").items() if v is not None
    }
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    result = await drivers_collection.update_one({"_id": obj_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver not found")

    updated_doc = await drivers_collection.find_one({"_id": obj_id})
    return driver_helper(updated_doc)


@router.delete("/{driver_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_driver(driver_id: str):
    """DELETE /drivers/{id}"""
    obj_id = to_object_id(driver_id)
    result = await drivers_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Driver not found")
    return None