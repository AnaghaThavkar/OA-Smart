import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class SensorPacketSchema(BaseModel):
    timestamp: float
    thigh_ax: float
    thigh_ay: float
    thigh_az: float
    thigh_gx: float
    thigh_gy: float
    thigh_gz: float
    lower_ax: float
    lower_ay: float
    lower_az: float
    lower_gx: float
    lower_gy: float
    lower_gz: float
    knee_angle: float

class PatientCreateSchema(BaseModel):
    id: Optional[str] = None
    patient_id: Optional[str] = None
    name: Optional[str] = "Anonymous Patient"
    age: int
    gender: str
    phone: Optional[str] = None
    contact: Optional[str] = None

class PatientResponseSchema(PatientCreateSchema):
    id: str
    created_at: datetime.datetime
    sync_status: str

    class Config:
        from_attributes = True

class UserCreateSchema(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class UserLoginSchema(BaseModel):
    email: str
    password: str

class UserResponseSchema(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    role: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class AuthResponseSchema(BaseModel):
    token: str
    user: UserResponseSchema
    message: str = "Authentication successful"

class ChatMessageSchema(BaseModel):
    message: str
    language: Optional[str] = "en"
    screening_context: Optional[Dict[str, Any]] = None

class ChatResponseSchema(BaseModel):
    reply: str
    suggested_actions: List[str] = []
    language: str = "en"

class SymptomAssessmentSchema(BaseModel):
    responses: Dict[str, Any]
    score: Optional[float] = 0.0

class AnalysisRequestSchema(BaseModel):
    sensor_packets: List[SensorPacketSchema]
    symptom_assessment: Optional[SymptomAssessmentSchema] = None
    test_type: Optional[str] = "SIT_TO_STAND"
    patient_id: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    sex: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    bmi: Optional[float] = None

class MLPredictionResponseSchema(BaseModel):
    screening_id: str
    prediction: str
    probabilities: Dict[str, float]
    model_version: str
    features: Dict[str, float]
    feature_importance: Dict[str, float]
    recommendation: str
    analysis_status: str
    oa_score: Optional[float] = None
    threshold: Optional[float] = 0.30
    is_oa_detected: Optional[bool] = None

class SyncItemSchema(BaseModel):
    id: str
    type: str  # 'patient' or 'screening'
    payload: Dict[str, Any]
    created_at: str

class SyncPayloadSchema(BaseModel):
    patients: List[Dict[str, Any]] = []
    screenings: List[Dict[str, Any]] = []

class SyncResponseSchema(BaseModel):
    synced_count: int
    failed_count: int
    status: str
