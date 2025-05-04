from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Based BMS Platform"
    API_V1_STR: str = "/api/v1"
    
    # Database settings
    DATABASE_URL: str = "sqlite:///./bms.db"
    
    # ML Model settings
    MODEL_PATH: str = "models/battery_health_model"
    
    # Monitoring settings
    REFRESH_INTERVAL: int = 60  # seconds
    
    # Alert thresholds
    LOW_VOLTAGE_THRESHOLD: float = 3.0
    HIGH_TEMPERATURE_THRESHOLD: float = 45.0
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
