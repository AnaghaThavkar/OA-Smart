import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.sql_models import Patient
from backend.app.schemas.pydantic_schemas import PatientCreateSchema, PatientResponseSchema

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.post("", response_model=PatientResponseSchema)
def create_patient(payload: PatientCreateSchema, db: Session = Depends(get_db)):
    patient_id = payload.id or payload.patient_id or f"PAT-{uuid.uuid4().hex[:6].upper()}"
    phone_val = payload.phone if payload.phone is not None else payload.contact
    existing = db.query(Patient).filter(Patient.id == patient_id).first()
    if existing:
        if payload.name:
            existing.name = payload.name
        if payload.age:
            existing.age = payload.age
        if payload.gender:
            existing.gender = payload.gender
        if phone_val is not None:
            existing.phone = phone_val
        db.commit()
        db.refresh(existing)
        return existing

    patient = Patient(
        id=patient_id,
        name=payload.name,
        age=payload.age,
        gender=payload.gender,
        phone=phone_val,
        sync_status="SYNCED"
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.get("", response_model=List[PatientResponseSchema])
def list_patients(db: Session = Depends(get_db)):
    return db.query(Patient).order_by(Patient.created_at.desc()).all()

@router.get("/{patient_id}", response_model=PatientResponseSchema)
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
