"""
app/routers/fuel_expense.py

Phase 3 — Person B
Fuel Logs + Expenses CRUD, plus operational cost calculation per vehicle.

ASSUMPTIONS (adjust to match your actual models/fuel_log.py and models/expense.py
if the field names differ — these are guesses based on the entity list in your
project summary, not read from your real files):

FuelLog: vehicle_id, trip_id (optional), date, liters, cost, odometer_reading
Expense: vehicle_id (optional), trip_id (optional), category, amount, date, description

Wire this into main.py the same way vehicles/drivers are mounted:
    from app.routers import fuel_expense
    app.include_router(fuel_expense.router)

Route ordering note (per your Gotcha #4): the /operational-cost route below
is defined under /vehicles/{vehicle_id}/operational-cost, not a bare /{id},
so it won't collide with fuel_logs/{id} or expenses/{id}. Still — keep any
new static-path routes ABOVE dynamic /{id} routes in the same router.
"""

from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from bson.errors import InvalidId
from datetime import date as date_type, datetime
from pydantic import BaseModel

from app.database import db  # adjust import if your db handle lives elsewhere
from app.models.fuel_log import FuelLogCreate
from app.models.expense import ExpenseCreate

router = APIRouter(tags=["Fuel & Expenses"])


# FuelLogUpdate / ExpenseUpdate don't exist in your models files yet, so
# they're defined here instead of imported — one less place to be blocked
# waiting on a model file edit. Move these into models/fuel_log.py and
# models/expense.py later if you want everything centralized; not required
# for this to work.

class FuelLogUpdate(BaseModel):
    vehicle_id: str | None = None
    trip_id: str | None = None
    date: date_type | None = None
    liters: float | None = None
    cost: float | None = None
    odometer_reading: float | None = None


class ExpenseUpdate(BaseModel):
    vehicle_id: str | None = None
    trip_id: str | None = None
    category: str | None = None
    amount: float | None = None
    date: date_type | None = None
    description: str | None = None


# ---------- helpers ----------

def fuel_log_helper(doc) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


def expense_helper(doc) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


def to_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")


# ---------- FUEL LOGS ----------

@router.post("/fuel-logs", status_code=status.HTTP_201_CREATED)
async def create_fuel_log(fuel_log: FuelLogCreate):
    # confirm vehicle exists
    vehicle = await db.vehicles.find_one({"_id": to_object_id(fuel_log.vehicle_id)})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    doc = fuel_log.model_dump(mode="json")  # mode="json" per your Gotcha #6 (date serialization)
    result = await db.fuel_logs.insert_one(doc)
    created = await db.fuel_logs.find_one({"_id": result.inserted_id})
    return fuel_log_helper(created)


@router.get("/fuel-logs")
async def list_fuel_logs(vehicle_id: str | None = None):
    query = {"vehicle_id": vehicle_id} if vehicle_id else {}
    logs = await db.fuel_logs.find(query).to_list(length=1000)
    return [fuel_log_helper(l) for l in logs]


@router.get("/fuel-logs/{fuel_log_id}")
async def get_fuel_log(fuel_log_id: str):
    doc = await db.fuel_logs.find_one({"_id": to_object_id(fuel_log_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Fuel log not found")
    return fuel_log_helper(doc)


@router.put("/fuel-logs/{fuel_log_id}")
async def update_fuel_log(fuel_log_id: str, update: FuelLogUpdate):
    oid = to_object_id(fuel_log_id)
    existing = await db.fuel_logs.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Fuel log not found")

    update_data = {k: v for k, v in update.model_dump(mode="json").items() if v is not None}
    if update_data:
        await db.fuel_logs.update_one({"_id": oid}, {"$set": update_data})
    doc = await db.fuel_logs.find_one({"_id": oid})
    return fuel_log_helper(doc)


@router.delete("/fuel-logs/{fuel_log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_fuel_log(fuel_log_id: str):
    oid = to_object_id(fuel_log_id)
    result = await db.fuel_logs.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Fuel log not found")
    return None


# ---------- EXPENSES ----------

@router.post("/expenses", status_code=status.HTTP_201_CREATED)
async def create_expense(expense: ExpenseCreate):
    if expense.vehicle_id:
        vehicle = await db.vehicles.find_one({"_id": to_object_id(expense.vehicle_id)})
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")

    doc = expense.model_dump(mode="json")
    result = await db.expenses.insert_one(doc)
    created = await db.expenses.find_one({"_id": result.inserted_id})
    return expense_helper(created)


@router.get("/expenses")
async def list_expenses(vehicle_id: str | None = None, category: str | None = None):
    query = {}
    if vehicle_id:
        query["vehicle_id"] = vehicle_id
    if category:
        query["category"] = category
    docs = await db.expenses.find(query).to_list(length=1000)
    return [expense_helper(d) for d in docs]


@router.get("/expenses/{expense_id}")
async def get_expense(expense_id: str):
    doc = await db.expenses.find_one({"_id": to_object_id(expense_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense_helper(doc)


@router.put("/expenses/{expense_id}")
async def update_expense(expense_id: str, update: ExpenseUpdate):
    oid = to_object_id(expense_id)
    existing = await db.expenses.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Expense not found")

    update_data = {k: v for k, v in update.model_dump(mode="json").items() if v is not None}
    if update_data:
        await db.expenses.update_one({"_id": oid}, {"$set": update_data})
    doc = await db.expenses.find_one({"_id": oid})
    return expense_helper(doc)


@router.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(expense_id: str):
    oid = to_object_id(expense_id)
    result = await db.expenses.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return None


# ---------- OPERATIONAL COST CALCULATION ----------
# Must be defined here (static path segment "operational-cost" after the
# vehicle_id) so it doesn't get shadowed by a bare /{id} route elsewhere.

@router.get("/vehicles/{vehicle_id}/operational-cost")
async def get_operational_cost(vehicle_id: str):
    """
    Operational Cost = total fuel cost + total maintenance cost for a vehicle.
    Maintenance costs come from Person A's maintenance_logs collection —
    confirm the collection/field name matches what trips.py / maintenance.py
    actually write before trusting this number.
    """
    oid = to_object_id(vehicle_id)
    vehicle = await db.vehicles.find_one({"_id": oid})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    fuel_cursor = db.fuel_logs.find({"vehicle_id": vehicle_id})
    total_fuel_cost = 0.0
    total_liters = 0.0
    async for log in fuel_cursor:
        total_fuel_cost += log.get("cost", 0)
        total_liters += log.get("liters", 0)

    # NOTE: adjust collection/field names to match maintenance_service.py once
    # Person A's maintenance module lands — this assumes a `cost` field on
    # each maintenance_logs document tied to this vehicle_id.
    total_maintenance_cost = 0.0
    if "maintenance_logs" in await db.list_collection_names():
        maint_cursor = db.maintenance_logs.find({"vehicle_id": vehicle_id})
        async for record in maint_cursor:
            total_maintenance_cost += record.get("cost", 0)

    operational_cost = total_fuel_cost + total_maintenance_cost

    return {
        "vehicle_id": vehicle_id,
        "registration_number": vehicle.get("registration_number"),
        "total_fuel_cost": total_fuel_cost,
        "total_maintenance_cost": total_maintenance_cost,
        "operational_cost": operational_cost,
        "total_liters_fueled": total_liters,
    }