from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str
    supabase_anon_key: str
    acled_api_key: str = ""
    acled_email: str = ""
    openweathermap_api_key: str = ""
    zai_api_key: str = ""
    zai_model: str = "glm-4"
    sentinel_stac_url: str = "https://earth-search.aws.element84.com/v1"
    pipeline_max_retries: int = 3
    cluster_radius_km: float = 5.0
    cluster_time_window_hours: int = 72

    class Config:
        env_file = ".env"
        env_prefix = "TRIBBLE_"


settings = Settings()
