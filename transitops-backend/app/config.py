"""
Environment configuration.
Loads values from .env — do not hardcode secrets here.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"
    db_name: str = "transitops"
    jwt_secret: str = "change_this_secret_key"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    class Config:
        env_file = ".env"


settings = Settings()
