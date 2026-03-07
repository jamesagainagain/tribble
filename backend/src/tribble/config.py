from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="TRIBBLE_")

    supabase_url: str
    supabase_service_key: str = Field(repr=False)
    supabase_anon_key: str = Field(repr=False)
    acled_api_key: str = Field(default="", repr=False)
    acled_email: str = ""
    openweathermap_api_key: str = Field(default="", repr=False)
    zai_api_key: str = Field(default="", repr=False)
    zai_model: str = "glm-4"
    sentinel_stac_url: str = "https://earth-search.aws.element84.com/v1"
    pipeline_max_retries: int = 3
    cluster_radius_km: float = 5.0
    cluster_time_window_hours: int = 72
    cors_origins: list[str] = ["http://localhost:3000"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
