"""Maintenance model — Person A owns this."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class MaintenanceBase(BaseModel):
    vehicle_id: str
    service_type: str  # e.g. "Oil Change"
    cost: float
    date: date
    is_closed: bool = False


class MaintenanceCreate(MaintenanceBase):
    pass


class MaintenanceOut(MaintenanceBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
