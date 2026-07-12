"""Auth routes — Person A owns this. Phase 1.
POST /auth/login, POST /auth/register
"""
from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext

from app.database import users_collection
from app.models.user import UserCreate, UserLogin
from app.auth.jwt_handler import create_access_token
from app.utils.constants import ROLES

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    if user.role not in ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Must be one of: {ROLES}",
        )

    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    doc = {
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "password_hash": hash_password(user.password),
    }
    result = await users_collection.insert_one(doc)

    return {"user_id": str(result.inserted_id)}


@router.post("/login")
async def login(credentials: UserLogin):
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token({
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
    })

    return {
        "token": token,
        "role": user["role"],
        "name": user["name"],
    }