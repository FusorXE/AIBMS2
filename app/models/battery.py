from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class BatteryReading(BaseModel):
    battery_id: str
    voltage: float
    current: float
    temperature: float
    soc: float = Field(..., description="State of Charge")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class BatteryHealthPrediction(BaseModel):
    battery_id: str
    health_score: float
    remaining_capacity: float
    estimated_lifetime: int
    status: str
    recommendations: Optional[list] = None

class BatteryAlert(BaseModel):
    battery_id: str
    alert_type: str
    severity: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    message: str

class BatteryAnalytics(BaseModel):
    battery_id: str
    average_voltage: float
    average_temperature: float
    max_current: float
    min_soc: float
    total_cycles: int
    health_trend: list
