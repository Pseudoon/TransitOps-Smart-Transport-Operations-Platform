"""
get_current_user dependency — Person A owns this. Phase 1.
Use in routers: current_user: dict = Depends(get_current_user)
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt_handler import decode_access_token

token_auth_scheme = HTTPBearer()


def get_current_user(token: HTTPAuthorizationCredentials = Depends(token_auth_scheme)) -> dict:
    jwt_token = token.credentials
    payload = decode_access_token(jwt_token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return payload