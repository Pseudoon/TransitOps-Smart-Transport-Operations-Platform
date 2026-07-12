"""User model — Person A owns this."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str  # one of app.utils.constants.ROLES


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
