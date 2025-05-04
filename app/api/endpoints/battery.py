from fastapi import APIRouter, HTTPException
from typing import List
from app.models.battery import BatteryReading, BatteryHealthPrediction
from app.services.battery_monitor import BatteryMonitor

router = APIRouter()

@router.post("/readings/", response_model=BatteryReading)
async def create_battery_reading(reading: BatteryReading):
    """
    Record a new battery reading
    """
    try:
        monitor = BatteryMonitor()
        return monitor.process_reading(reading)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/health/", response_model=BatteryHealthPrediction)
async def get_battery_health(battery_id: str):
    """
    Get current battery health prediction
    """
    try:
        monitor = BatteryMonitor()
        return monitor.get_health_prediction(battery_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/analytics/", response_model=List[BatteryReading])
async def get_battery_analytics(battery_id: str, start_date: str = None, end_date: str = None):
    """
    Get battery analytics data
    """
    try:
        monitor = BatteryMonitor()
        return monitor.get_analytics(battery_id, start_date, end_date)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
