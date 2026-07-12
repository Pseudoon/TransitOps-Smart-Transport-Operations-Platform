"""Expense model — Person B owns this."""
from pydantic import BaseModel, Field
from datetime import date


class ExpenseBase(BaseModel):
    vehicle_id: str
    type: str  # e.g. "Toll", "Maintenance"
    amount: float
    date: date


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseOut(ExpenseBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
