"""
Trip state machine — Person A owns this. Phase 2 (highest priority module).

Implements:
- create trip (Draft)
- dispatch (Draft -> Dispatched, vehicle+driver -> On Trip)
- complete (Dispatched -> Completed, vehicle+driver -> Available)
- cancel (Dispatched -> Cancelled, vehicle+driver -> Available)

Every transition must call validation_service checks BEFORE writing to DB.
"""

# TODO Phase 2: implement create_trip(), dispatch_trip(), complete_trip(), cancel_trip()
