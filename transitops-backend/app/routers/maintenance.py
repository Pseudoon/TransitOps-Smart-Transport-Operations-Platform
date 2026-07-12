"""Maintenance routes — Person A owns this. Phase 3.
GET /maintenance, POST /maintenance, PUT /maintenance/{id}/close
"""
from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.models.maintenance import MaintenanceCreate
from app.services import maintenance_service
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.get("")
async def get_maintenance(
    vehicle_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    return await maintenance_service.list_maintenance(vehicle_id=vehicle_id)


@router.post("")
async def create_maintenance(
    record: MaintenanceCreate,
    current_user: dict = Depends(get_current_user),
):
    return await maintenance_service.create_maintenance(record)


@router.put("/{record_id}/close")
async def close_maintenance(
    record_id: str,
    current_user: dict = Depends(get_current_user),
):
    return await maintenance_service.close_maintenance(record_id)