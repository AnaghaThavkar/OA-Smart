from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.sql_models import ScreeningSession, Patient, MLPrediction, ExtractedFeatures
from backend.app.services.report_generator import ReportGenerator

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/{screening_id}", response_class=HTMLResponse)
def get_report(screening_id: str, db: Session = Depends(get_db)):
    session = db.query(ScreeningSession).filter(ScreeningSession.id == screening_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Screening session not found")

    patient = db.query(Patient).filter(Patient.id == session.patient_id).first()
    pred = db.query(MLPrediction).filter(MLPrediction.screening_id == screening_id).first()
    feat = db.query(ExtractedFeatures).filter(ExtractedFeatures.screening_id == screening_id).first()

    patient_dict = {"id": patient.id, "name": patient.name, "age": patient.age, "gender": patient.gender} if patient else {}
    screening_dict = {"id": session.id, "test_type": session.test_type}
    prediction_dict = {
        "prediction": pred.prediction_label if pred else "UNKNOWN",
        "model_version": pred.model_version if pred else "RF-1.0.0",
        "recommendation": pred.recommendation if pred else "",
        "features": feat.features_json if feat else {},
        "feature_importance": pred.feature_importance_json if pred else {}
    }

    return ReportGenerator.generate_html_report(patient_dict, screening_dict, prediction_dict)
