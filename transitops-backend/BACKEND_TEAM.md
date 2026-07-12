# TransitOps — Backend Team Guide

## Stack
FastAPI + MongoDB (Motor/PyMongo) + JWT Auth

## Your Mission
Own the data, the rules, and the state machine. The example workflow in the
problem statement (register vehicle → register driver → create trip → dispatch
→ complete → maintenance) is what gets tested end-to-end. Every rule in
Section 4 of the brief must be enforced **server-side**, not trusted from the frontend.

---

## Folder Structure

```
transitops-backend/
├── app/
│   ├── main.py                  # FastAPI app entrypoint, mounts routers
│   ├── config.py                # env vars, DB connection string, JWT secret
│   ├── database.py              # MongoDB client/connection setup
│   │
│   ├── models/                  # Pydantic schemas (request/response + DB shape)
│   │   ├── user.py
│   │   ├── vehicle.py
│   │   ├── driver.py
│   │   ├── trip.py
│   │   ├── maintenance.py
│   │   ├── fuel_log.py
│   │   └── expense.py
│   │
│   ├── routers/                 # one file per entity = one person owns each
│   │   ├── auth.py              # /login, /register
│   │   ├── vehicles.py          # CRUD /vehicles
│   │   ├── drivers.py           # CRUD /drivers
│   │   ├── trips.py             # /trips + dispatch/complete/cancel
│   │   ├── maintenance.py       # /maintenance
│   │   ├── fuel_expense.py      # /fuel-logs, /expenses
│   │   ├── dashboard.py         # /dashboard/kpis
│   │   └── reports.py           # /reports, /reports/export-csv
│   │
│   ├── services/                # business logic lives HERE, not in routers
│   │   ├── trip_service.py      # dispatch/complete/cancel state machine
│   │   ├── maintenance_service.py
│   │   ├── validation_service.py # cargo weight, license expiry, uniqueness checks
│   │   └── report_service.py    # ROI, fuel efficiency, utilization calculations
│   │
│   ├── auth/
│   │   ├── jwt_handler.py       # token create/verify
│   │   ├── rbac.py              # role-check dependency/decorator
│   │   └── dependencies.py      # get_current_user, require_role()
│   │
│   └── utils/
│       ├── csv_export.py
│       └── constants.py         # status enums — MUST MATCH frontend constants.js
│
├── requirements.txt
├── .env
└── README.md
```

**Rule:** routers stay thin — parse request, call a service function, return response.
All rule enforcement and state transitions live in `services/`. This keeps logic
testable in isolation (curl/Postman) without needing the UI at all.

---

## Task Split (suggest 3–4 backend people)

| Owner | Modules |
|---|---|
| Person A | `auth/`, `routers/auth.py`, `models/user.py`, RBAC middleware |
| Person B | `vehicles.py`, `drivers.py`, `maintenance.py` + their services |
| Person C | `trips.py` + `trip_service.py` (the state machine — highest priority) |
| Person D | `fuel_expense.py`, `dashboard.py`, `reports.py` + `report_service.py` |

---

## Status Enums (lock these — frontend depends on exact strings)

```python
VEHICLE_STATUS = ["Available", "On Trip", "In Shop", "Retired"]
DRIVER_STATUS  = ["Available", "On Trip", "Off Duty", "Suspended"]
TRIP_STATUS    = ["Draft", "Dispatched", "Completed", "Cancelled"]
```

---

## Business Rules Checklist (Section 4 — non-negotiable)

- [ ] Vehicle registration number is unique (DB-level unique index + validation)
- [ ] Retired / In Shop vehicles never appear in dispatch selection queries
- [ ] Drivers with expired license or Suspended status cannot be assigned
- [ ] Vehicle/driver already "On Trip" cannot be assigned to another trip
- [ ] Cargo weight must not exceed vehicle's max load capacity
- [ ] Dispatch trip → vehicle AND driver status → "On Trip"
- [ ] Complete trip → vehicle AND driver status → "Available"
- [ ] Cancel dispatched trip → vehicle AND driver → "Available"
- [ ] Create maintenance record → vehicle → "In Shop"
- [ ] Close maintenance → vehicle → "Available" (unless Retired)

Write `validation_service.py` functions for each check so `trip_service.py` and
`maintenance_service.py` just call them — don't duplicate validation logic across routers.

---

## API Contract (share this exactly with frontend — do not deviate without telling them)

### Auth
```
POST /auth/login          { email, password } → { token, role, name }
POST /auth/register        { name, email, password, role } → { user_id }
```

### Vehicles
```
GET    /vehicles                    ?status=&type=&region=  → [Vehicle]
GET    /vehicles/available          → [Vehicle]   (filtered: not Retired/In Shop/On Trip)
POST   /vehicles                    → Vehicle
PUT    /vehicles/{id}               → Vehicle
DELETE /vehicles/{id}
```

### Drivers
```
GET    /drivers                     ?status=  → [Driver]
GET    /drivers/available           → [Driver]  (filtered: Available, license not expired)
POST   /drivers                     → Driver
PUT    /drivers/{id}                → Driver
DELETE /drivers/{id}
```

### Trips
```
GET    /trips                       ?status=  → [Trip]
POST   /trips                       → Trip (status=Draft)
POST   /trips/{id}/dispatch         → Trip (validates + flips statuses)
POST   /trips/{id}/complete         { final_odometer, fuel_consumed } → Trip
POST   /trips/{id}/cancel           → Trip
```

### Maintenance
```
GET    /maintenance                 ?vehicle_id=  → [MaintenanceLog]
POST   /maintenance                 → MaintenanceLog (auto: vehicle → In Shop)
PUT    /maintenance/{id}/close      → MaintenanceLog (auto: vehicle → Available)
```

### Fuel & Expenses
```
GET/POST  /fuel-logs                → [FuelLog]
GET/POST  /expenses                 → [Expense]
```

### Dashboard & Reports
```
GET /dashboard/kpis                 → { active_vehicles, available_vehicles,
                                          vehicles_in_maintenance, active_trips,
                                          pending_trips, drivers_on_duty,
                                          fleet_utilization_pct }
GET /reports/fuel-efficiency        → [{ vehicle_id, distance, fuel, efficiency }]
GET /reports/operational-cost       → [{ vehicle_id, fuel_cost, maintenance_cost, total }]
GET /reports/roi                    → [{ vehicle_id, roi_pct }]
GET /reports/export-csv             → file download
```

---

## Timeline

| Time | Task |
|---|---|
| 0:00–0:45 | Schema + this contract locked with frontend team |
| 0:45–2:30 | Auth + Vehicle/Driver CRUD working |
| 2:30–4:30 | Trip logic + state machine + validations (priority #1) |
| 4:30–6:00 | Maintenance, Fuel/Expense, Dashboard KPI aggregation |
| 6:00–7:00 | Reports endpoints + CSV export |
| 7:00–8:00 | Integration testing with frontend, bug fixes |

## Before You Start Coding
1. Stand up MongoDB + a `/health` route first — confirm the server runs.
2. Seed 2–3 dummy vehicles/drivers so frontend can test against real data early.
3. Post the contract above (or your Postman collection) in the team chat immediately.
