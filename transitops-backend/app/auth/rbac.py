"""
Role-based access control — Person A owns this. Phase 1.
Use in routers: Depends(require_role(["Fleet Manager"]))
"""
from fastapi import Depends, HTTPException, status
from app.auth.dependencies import get_current_user


def require_role(allowed_roles: list[str]):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )
        return current_user
    return role_checker
