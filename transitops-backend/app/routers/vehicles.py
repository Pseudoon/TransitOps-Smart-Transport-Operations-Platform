"""Vehicle CRUD routes — Person B owns this. Phase 1.
GET /vehicles, GET /vehicles/available, POST /vehicles, PUT /vehicles/{id}, DELETE /vehicles/{id}
"""
from fastapi import APIRouter

router = APIRouter()

# TODO Phase 1: basic CRUD
# TODO Phase 2: GET /available (filtered: not Retired/In Shop/On Trip)
