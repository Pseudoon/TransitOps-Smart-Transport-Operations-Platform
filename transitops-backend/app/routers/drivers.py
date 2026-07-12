"""Driver CRUD routes — Person B owns this. Phase 1.
GET /drivers, GET /drivers/available, POST /drivers, PUT /drivers/{id}, DELETE /drivers/{id}
"""
from fastapi import APIRouter

router = APIRouter()

# TODO Phase 1: basic CRUD
# TODO Phase 2: GET /available (filtered: Available status + license not expired)
