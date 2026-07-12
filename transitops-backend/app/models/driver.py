"""Driver model — Person B owns this."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class DriverBase(BaseModel):
    name: str
    license_number: str
    license_category: str
    license_expiry_date: date
    contact_number: str
    safety_score: float = 100
    status: str = "Available"


class DriverCreate(DriverBase):
    pass


class DriverUpdate(BaseModel):
    name: Optional[str] = None
    license_category: Optional[str] = None
    license_expiry_date: Optional[date] = None
    contact_number: Optional[str] = None
    safety_score: Optional[float] = None
    status: Optional[str] = None


class DriverOut(DriverBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
