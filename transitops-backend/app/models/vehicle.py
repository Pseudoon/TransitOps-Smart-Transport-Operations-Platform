"""Vehicle model — Person B owns this."""
from pydantic import BaseModel, Field
from typing import Optional


class VehicleBase(BaseModel):
    registration_number: str
    name_model: str
    type: str
    max_load_capacity: float  # kg
    odometer: float = 0
    acquisition_cost: float
    status: str = "Available"
    region: Optional[str] = None


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    name_model: Optional[str] = None
    type: Optional[str] = None
    max_load_capacity: Optional[float] = None
    odometer: Optional[float] = None
    status: Optional[str] = None
    region: Optional[str] = None


class VehicleOut(VehicleBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
