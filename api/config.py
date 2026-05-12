from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:55432/er_wait"
    redis_url: str = "redis://localhost:6379/0"
    api_title: str = "Alberta ER Wait Time Predictor"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
