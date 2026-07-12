"""Trip model — Person A owns this (state machine lead)."""
from pydantic import BaseModel, Field
from typing import Optional


class TripBase(BaseModel):
    source: str
    destination: str
    vehicle_id: str
    driver_id: str
    cargo_weight: float  # kg
    planned_distance: float  # km
    status: str = "Draft"


class TripCreate(TripBase):
    pass


class TripComplete(BaseModel):
    final_odometer: float
    fuel_consumed: float  # liters


class TripOut(TripBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
