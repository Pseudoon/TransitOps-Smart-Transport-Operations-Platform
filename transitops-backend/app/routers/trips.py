"""Trip routes — Person A owns this. Phase 2 (highest priority).
GET /trips, POST /trips, POST /trips/{id}/dispatch, /complete, /cancel
"""
from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.models.trip import TripCreate, TripComplete
from app.services import trip_service
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.get("")
async def get_trips(
    status: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    return await trip_service.list_trips(status_filter=status)


@router.post("")
async def create_trip(
    trip: TripCreate,
    current_user: dict = Depends(get_current_user),
):
    return await trip_service.create_trip(trip)


@router.post("/{trip_id}/dispatch")
async def dispatch_trip(
    trip_id: str,
    current_user: dict = Depends(get_current_user),
):
    return await trip_service.dispatch_trip(trip_id)


@router.post("/{trip_id}/complete")
async def complete_trip(
    trip_id: str,
    payload: TripComplete,
    current_user: dict = Depends(get_current_user),
):
    return await trip_service.complete_trip(trip_id, payload)


@router.post("/{trip_id}/cancel")
async def cancel_trip(
    trip_id: str,
    current_user: dict = Depends(get_current_user),
):
    return await trip_service.cancel_trip(trip_id)