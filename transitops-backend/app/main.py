"""
TransitOps Backend — entrypoint.
Mounts all routers. Run with: uvicorn app.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TransitOps API", version="0.1.0")

# Allow frontend (adjust origin for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "TransitOps API"}


# --- Mount routers here as they're built ---
from app.routers import auth
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
# from app.routers import auth, vehicles, drivers, trips, maintenance, fuel_expense, dashboard, reports
# app.include_router(auth.router, prefix="/auth", tags=["Auth"])
# app.include_router(vehicles.router, prefix="/vehicles", tags=["Vehicles"])
# app.include_router(drivers.router, prefix="/drivers", tags=["Drivers"])
# app.include_router(trips.router, prefix="/trips", tags=["Trips"])
# app.include_router(maintenance.router, prefix="/maintenance", tags=["Maintenance"])
# app.include_router(fuel_expense.router, tags=["Fuel & Expenses"])
# app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
# app.include_router(reports.router, prefix="/reports", tags=["Reports"])
