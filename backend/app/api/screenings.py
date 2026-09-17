import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.sql_models import ScreeningSession, ExtractedFeatures, MLPrediction, Patient
from backend.app.schemas.pydantic_schemas import AnalysisRequestSchema, MLPredictionResponseSchema
from ml.inference.predict import OARiskPredictor

router = APIRouter(prefix="/screenings", tags=["Screenings"])
predictor = OARiskPredictor()

@router.post("/{screening_id}/analysis", response_model=MLPredictionResponseSchema)
def analyze_screening(screening_id: str, payload: AnalysisRequestSchema, db: Session = Depends(get_db)):
    packets = [p.dict() for p in payload.sensor_packets]
    
    # 1. Resolve patient demographics from request payload
    patient_meta = {}
    if payload.age is not None:
        patient_meta["age"] = payload.age
    if payload.sex is not None:
        patient_meta["sex"] = payload.sex
    elif payload.gender is not None:
        patient_meta["gender"] = payload.gender
    if payload.height is not None:
        patient_meta["height"] = payload.height
    if payload.weight is not None:
        patient_meta["weight"] = payload.weight
    if payload.bmi is not None:
        patient_meta["bmi"] = payload.bmi

    # 2. Check if screening exists in DB or if patient_id was supplied
    session = db.query(ScreeningSession).filter(ScreeningSession.id == screening_id).first()
    target_patient_id = payload.patient_id or (session.patient_id if session else None)

    if target_patient_id:
        p_record = db.query(Patient).filter(Patient.id == target_patient_id).first()
        if p_record:
            if "age" not in patient_meta and p_record.age is not None:
                patient_meta["age"] = p_record.age
            if "gender" not in patient_meta and "sex" not in patient_meta and p_record.gender:
                patient_meta["gender"] = p_record.gender

    # Run ML inference with 15-feature model
    result = predictor.predict_from_sensor_stream(packets, screening_id=screening_id, patient_metadata=patient_meta)

    # Persist in DB if screening exists or create session record
    if not session:
        # Assign to default or resolved patient if not pre-created
        if not target_patient_id:
            first_patient = db.query(Patient).first()
            target_patient_id = first_patient.id if first_patient else "PAT-DEFAULT"
            if not first_patient:
                db.add(Patient(id=target_patient_id, name="Default Patient", age=patient_meta.get("age", 50), gender=patient_meta.get("gender", "UNKNOWN")))
                db.commit()

        session = ScreeningSession(id=screening_id, patient_id=target_patient_id, test_type=payload.test_type)
        db.add(session)
        db.commit()

    # Save features
    feat_entry = ExtractedFeatures(
        id=f"FEAT-{uuid.uuid4().hex[:6].upper()}",
        screening_id=screening_id,
        features_json=result["features"],
        feature_version="1.0.0"
    )
    db.add(feat_entry)

    # Save ML prediction
    pred_entry = MLPrediction(
        id=f"PRED-{uuid.uuid4().hex[:6].upper()}",
        screening_id=screening_id,
        prediction_label=result["prediction"],
        probabilities_json=result["probabilities"],
        feature_importance_json=result["feature_importance"],
        model_version=result["model_version"],
        recommendation=result["recommendation"]
    )
    db.add(pred_entry)
    db.commit()

    return result

@router.get("")
def list_screenings(db: Session = Depends(get_db)):
    sessions = db.query(ScreeningSession).order_by(ScreeningSession.created_at.desc()).all()
    results = []
    for s in sessions:
        pred = db.query(MLPrediction).filter(MLPrediction.screening_id == s.id).first()
        patient = db.query(Patient).filter(Patient.id == s.patient_id).first()
        results.append({
            "id": s.id,
            "patient_id": s.patient_id,
            "patient_name": patient.name if patient else "Unknown Patient",
            "test_type": s.test_type,
            "status": s.status,
            "prediction": pred.prediction_label if pred else None,
            "probabilities": pred.probabilities_json if pred else None,
            "recommendation": pred.recommendation if pred else None,
            "created_at": s.created_at
        })
    return results

@router.get("/{screening_id}")
def get_screening(screening_id: str, db: Session = Depends(get_db)):
    session = db.query(ScreeningSession).filter(ScreeningSession.id == screening_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Screening session not found")
    
    pred = db.query(MLPrediction).filter(MLPrediction.screening_id == screening_id).first()
    feat = db.query(ExtractedFeatures).filter(ExtractedFeatures.screening_id == screening_id).first()

    return {
        "session": {
            "id": session.id,
            "patient_id": session.patient_id,
            "test_type": session.test_type,
            "status": session.status,
            "created_at": session.created_at
        },
        "features": feat.features_json if feat else {},
        "prediction": {
            "prediction_label": pred.prediction_label,
            "probabilities": pred.probabilities_json,
            "feature_importance": pred.feature_importance_json,
            "recommendation": pred.recommendation
        } if pred else None
    }
