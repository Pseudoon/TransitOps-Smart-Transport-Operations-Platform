# TransitOps — Frontend Team Guide

## Stack
React (Next.js) + Recharts (charts) + Axios

## Your Mission
Build every screen against the API contract below (mocked responses first if
backend isn't ready yet), so integration at the end is just swapping mock data
for real fetch calls — not a rebuild.

---

## Folder Structure

```
transitops-frontend/
├── src/
│   ├── app/  (or pages/ if using React Router)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── vehicles/
│   │   ├── drivers/
│   │   ├── trips/
│   │   ├── maintenance/
│   │   ├── fuel-expenses/
│   │   └── reports/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx      # nav items change based on logged-in role
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx  # RBAC route guard
│   │   ├── common/
│   │   │   ├── StatusBadge.jsx  # colored badge: Available/On Trip/In Shop/etc.
│   │   │   ├── DataTable.jsx    # reusable table w/ sort + filter
│   │   │   ├── Modal.jsx
│   │   │   └── KPICard.jsx
│   │   ├── vehicles/
│   │   │   ├── VehicleForm.jsx
│   │   │   └── VehicleTable.jsx
│   │   ├── drivers/
│   │   │   ├── DriverForm.jsx
│   │   │   └── DriverTable.jsx
│   │   ├── trips/
│   │   │   ├── TripForm.jsx     # vehicle/driver dropdowns = only "available" endpoints
│   │   │   └── TripTable.jsx
│   │   ├── maintenance/
│   │   │   └── MaintenanceForm.jsx
│   │   ├── fuel/
│   │   │   └── FuelExpenseForm.jsx
│   │   └── charts/
│   │       ├── UtilizationChart.jsx
│   │       ├── FuelEfficiencyChart.jsx
│   │       └── ROIChart.jsx
│   │
│   ├── services/                # API wrappers — mirrors backend routers 1:1
│   │   ├── api.js               # axios instance, base URL, auth header interceptor
│   │   ├── authService.js
│   │   ├── vehicleService.js
│   │   ├── driverService.js
│   │   ├── tripService.js
│   │   ├── maintenanceService.js
│   │   ├── fuelExpenseService.js
│   │   ├── dashboardService.js
│   │   └── reportService.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx      # holds user + role + token globally
│   │
│   ├── hooks/
│   │   └── useAuth.js
│   │
│   └── utils/
│       ├── constants.js         # status enums, role names — MUST MATCH backend
│       └── formatters.js        # date/currency formatting
│
├── package.json
└── .env.local
```

**Rule:** every `xService.js` file has one function per backend endpoint. If backend
adds/changes a route, only that one service file needs updating — components never
call `fetch`/`axios` directly.

---

## Task Split (suggest 3–4 frontend people)

| Owner | Screens |
|---|---|
| Person A | Login, AuthContext, ProtectedRoute, Sidebar/Navbar (role-based nav) |
| Person B | Vehicle Registry + Driver Management (tables + forms) |
| Person C | Trip Management (creation flow, filtered dropdowns, dispatch/complete/cancel actions) |
| Person D | Dashboard (KPI cards), Maintenance, Fuel/Expense, Reports + charts |

---

## Status Enums (must match backend exactly — copy-paste, don't retype)

```js
export const VEHICLE_STATUS = ["Available", "On Trip", "In Shop", "Retired"];
export const DRIVER_STATUS  = ["Available", "On Trip", "Off Duty", "Suspended"];
export const TRIP_STATUS    = ["Draft", "Dispatched", "Completed", "Cancelled"];
export const ROLES = ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"];
```

---

## UX Rules Tied to Business Logic (Section 4 — build these into the UI)

- [ ] Trip form's vehicle dropdown only calls `/vehicles/available` (never full list)
- [ ] Trip form's driver dropdown only calls `/drivers/available`
- [ ] Cargo weight field shows inline error if it exceeds selected vehicle's max load
      (client-side hint only — backend still enforces the real check)
- [ ] Status badges use consistent colors: green=Available, blue=On Trip,
      orange=In Shop, red=Retired/Suspended
- [ ] Dashboard filters (vehicle type, status, region) pass query params to `/dashboard/kpis`
- [ ] After dispatch/complete/cancel actions, refetch the affected vehicle/driver/trip
      lists so the UI reflects the new status immediately

---

## API Contract (from backend team — call these exact endpoints)

### Auth
```
POST /auth/login          { email, password } → { token, role, name }
POST /auth/register        { name, email, password, role } → { user_id }
```

### Vehicles
```
GET    /vehicles                    ?status=&type=&region=  → [Vehicle]
GET    /vehicles/available          → [Vehicle]
POST   /vehicles                    → Vehicle
PUT    /vehicles/{id}               → Vehicle
DELETE /vehicles/{id}
```

### Drivers
```
GET    /drivers                     ?status=  → [Driver]
GET    /drivers/available           → [Driver]
POST   /drivers                     → Driver
PUT    /drivers/{id}                → Driver
DELETE /drivers/{id}
```

### Trips
```
GET    /trips                       ?status=  → [Trip]
POST   /trips                       → Trip (status=Draft)
POST   /trips/{id}/dispatch         → Trip
POST   /trips/{id}/complete         { final_odometer, fuel_consumed } → Trip
POST   /trips/{id}/cancel           → Trip
```

### Maintenance
```
GET    /maintenance                 ?vehicle_id=  → [MaintenanceLog]
POST   /maintenance                 → MaintenanceLog
PUT    /maintenance/{id}/close      → MaintenanceLog
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
| 0:00–0:45 | Schema + contract locked with backend team |
| 0:45–2:30 | Login UI + Vehicle/Driver tables (build against mock JSON) |
| 2:30–4:30 | Trip creation flow + Dashboard shell |
| 4:30–6:00 | Wire real API calls in (swap mocks → services/), Maintenance/Fuel UI |
| 6:00–7:00 | Reports page + charts |
| 7:00–8:00 | Integration testing with backend, bug fixes |

## Before You Start Coding
1. Create `services/api.js` with a placeholder base URL and mock mode toggle,
   so components can be built and demoed even if backend isn't live yet.
2. Build `StatusBadge.jsx` and `DataTable.jsx` first — nearly every screen reuses them.
3. Confirm the contract above with backend before hour 1 ends — flag any mismatch immediately.
