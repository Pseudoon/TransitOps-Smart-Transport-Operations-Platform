"""
Shared validation checks — used by trip_service and maintenance_service.
Person A owns this (Phase 2), Person B contributes vehicle/driver-lookup helpers.

Fill in each function during Phase 2. Keep validations here so routers/services
don't duplicate rule logic.
"""


async def is_registration_number_unique(reg_number: str) -> bool:
    """Check no other vehicle has this registration number."""
    # TODO: query vehicles_collection
    pass


async def is_vehicle_available_for_dispatch(vehicle_id: str) -> bool:
    """Vehicle must not be Retired, In Shop, or already On Trip."""
    # TODO
    pass


async def is_driver_available_for_dispatch(driver_id: str) -> bool:
    """Driver must not be Suspended, have expired license, or be On Trip."""
    # TODO
    pass


async def is_cargo_within_capacity(vehicle_id: str, cargo_weight: float) -> bool:
    """Cargo weight must not exceed vehicle's max_load_capacity."""
    # TODO
    pass
