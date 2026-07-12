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
    revenue: float = 0  # money earned from this trip, used in ROI calc
    status: str = "Draft"


class TripCreate(TripBase):
    pass


class TripComplete(BaseModel):
    final_odometer: float
    fuel_consumed: float  # liters
    distance_km: Optional[float] = None  # actual distance travelled; falls back to planned_distance if omitted


class TripOut(TripBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True