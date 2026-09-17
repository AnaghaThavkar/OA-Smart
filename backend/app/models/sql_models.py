import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.database.session import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=True, default="Anonymous Patient")
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    sync_status = Column(String, default="SYNCED")

    screenings = relationship("ScreeningSession", back_populates="patient", cascade="all, delete-orphan")

class ScreeningSession(Base):
    __tablename__ = "screening_sessions"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    test_type = Column(String, default="SIT_TO_STAND")
    status = Column(String, default="COMPLETED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    sync_status = Column(String, default="SYNCED")

    patient = relationship("Patient", back_populates="screenings")
    symptoms = relationship("SymptomAssessment", back_populates="screening", uselist=False)
    features = relationship("ExtractedFeatures", back_populates="screening", uselist=False)
    prediction = relationship("MLPrediction", back_populates="screening", uselist=False)
    report = relationship("Report", back_populates="screening", uselist=False)

class SymptomAssessment(Base):
    __tablename__ = "symptom_assessments"

    id = Column(String, primary_key=True, index=True)
    screening_id = Column(String, ForeignKey("screening_sessions.id"), nullable=False)
    responses_json = Column(JSON, nullable=False)
    symptom_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    screening = relationship("ScreeningSession", back_populates="symptoms")

class ExtractedFeatures(Base):
    __tablename__ = "extracted_features"

    id = Column(String, primary_key=True, index=True)
    screening_id = Column(String, ForeignKey("screening_sessions.id"), nullable=False)
    features_json = Column(JSON, nullable=False)
    feature_version = Column(String, default="1.0.0")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    screening = relationship("ScreeningSession", back_populates="features")

class MLPrediction(Base):
    __tablename__ = "ml_predictions"

    id = Column(String, primary_key=True, index=True)
    screening_id = Column(String, ForeignKey("screening_sessions.id"), nullable=False)
    prediction_label = Column(String, nullable=False)
    probabilities_json = Column(JSON, nullable=False)
    feature_importance_json = Column(JSON, nullable=True)
    model_version = Column(String, nullable=False)
    recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    screening = relationship("ScreeningSession", back_populates="prediction")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    screening_id = Column(String, ForeignKey("screening_sessions.id"), nullable=False)
    content_html = Column(Text, nullable=False)
    pdf_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    screening = relationship("ScreeningSession", back_populates="report")

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    salt = Column(String, nullable=False)
    full_name = Column(String, nullable=True)  # Full name is optional
    role = Column(String, default="HEALTHCARE_WORKER")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

