"""Trip routes — Person A owns this. Phase 2 (highest priority).
GET /trips, POST /trips, POST /trips/{id}/dispatch, /complete, /cancel
Routers stay thin — call trip_service functions, don't put logic here.
"""
from fastapi import APIRouter

router = APIRouter()

# TODO Phase 2: implement all trip routes, calling app.services.trip_service
