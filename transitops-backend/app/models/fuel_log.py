"""Fuel log model — Person B owns this."""
from pydantic import BaseModel, Field
from datetime import date


class FuelLogBase(BaseModel):
    vehicle_id: str
    liters: float
    cost: float
    date: date


class FuelLogCreate(FuelLogBase):
    pass


class FuelLogOut(FuelLogBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
