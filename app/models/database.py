from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
from app.core.config import settings

Base = declarative_base()

class Battery(Base):
    __tablename__ = "batteries"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    capacity = Column(Float, nullable=False)
    manufacturer = Column(String, nullable=False)
    installation_date = Column(DateTime, nullable=False)
    status = Column(String, default="ACTIVE")
    readings = relationship("BatteryReading", back_populates="battery")
    alerts = relationship("BatteryAlert", back_populates="battery")

class BatteryReading(Base):
    __tablename__ = "battery_readings"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    battery_id = Column(String, ForeignKey("batteries.id"), nullable=False)
    voltage = Column(Float, nullable=False)
    current = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    soc = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    battery = relationship("Battery", back_populates="readings")

class BatteryAlert(Base):
    __tablename__ = "battery_alerts"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    battery_id = Column(String, ForeignKey("batteries.id"), nullable=False)
    alert_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    message = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    battery = relationship("Battery", back_populates="alerts")

class BatteryMaintenance(Base):
    __tablename__ = "battery_maintenance"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    battery_id = Column(String, ForeignKey("batteries.id"), nullable=False)
    maintenance_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    performed_by = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    next_due_date = Column(DateTime, nullable=False)
    battery = relationship("Battery", back_populates="maintenance")

class BatteryHealth(Base):
    __tablename__ = "battery_health"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    battery_id = Column(String, ForeignKey("batteries.id"), nullable=False)
    health_score = Column(Float, nullable=False)
    remaining_capacity = Column(Float, nullable=False)
    estimated_lifetime = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    recommendations = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    battery = relationship("Battery", back_populates="health")

# Create database engine and session
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)
