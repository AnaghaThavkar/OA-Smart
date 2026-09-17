from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.sql_models import Patient, ScreeningSession, MLPrediction, ExtractedFeatures
from backend.app.schemas.pydantic_schemas import SyncPayloadSchema, SyncResponseSchema

router = APIRouter(prefix="/sync", tags=["Sync"])

@router.post("", response_model=SyncResponseSchema)
def synchronize_offline_data(payload: SyncPayloadSchema, db: Session = Depends(get_db)):
    synced = 0
    failed = 0

    # Process Patients
    for p_data in payload.patients:
        try:
            p_id = p_data.get("id")
            existing = db.query(Patient).filter(Patient.id == p_id).first()
            if not existing:
                patient = Patient(
                    id=p_id,
                    name=p_data.get("name", "Unknown"),
                    age=p_data.get("age", 0),
                    gender=p_data.get("gender", "UNKNOWN"),
                    phone=p_data.get("phone"),
                    sync_status="SYNCED"
                )
                db.add(patient)
                synced += 1
        except Exception:
            failed += 1

    # Process Screenings
    for s_data in payload.screenings:
        try:
            s_id = s_data.get("id")
            existing = db.query(ScreeningSession).filter(ScreeningSession.id == s_id).first()
            if not existing:
                session = ScreeningSession(
                    id=s_id,
                    patient_id=s_data.get("patientId", s_data.get("patient_id", "PAT-UNKNOWN")),
                    test_type=s_data.get("testType", s_data.get("test_type", "SIT_TO_STAND")),
                    status=s_data.get("status", "COMPLETED"),
                    sync_status="SYNCED"
                )
                db.add(session)
                synced += 1
        except Exception:
            failed += 1

    db.commit()
    return SyncResponseSchema(
        synced_count=synced,
        failed_count=failed,
        status="SUCCESS"
    )
