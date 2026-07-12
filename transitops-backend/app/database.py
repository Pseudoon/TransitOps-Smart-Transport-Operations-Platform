"""
MongoDB connection setup using Motor (async driver).
Import `db` anywhere you need to talk to the database.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.mongo_uri)
db = client[settings.db_name]

# Collections (import these instead of typing db["..."] everywhere)
users_collection = db["users"]
vehicles_collection = db["vehicles"]
drivers_collection = db["drivers"]
trips_collection = db["trips"]
maintenance_collection = db["maintenance_logs"]
fuel_logs_collection = db["fuel_logs"]
expenses_collection = db["expenses"]
