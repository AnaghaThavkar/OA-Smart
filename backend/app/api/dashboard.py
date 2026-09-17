from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.database.session import get_db
from backend.app.models.sql_models import Patient, ScreeningSession, MLPrediction

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_patients = db.query(Patient).count()
    total_screenings = db.query(ScreeningSession).count()
    
    # Risk Distribution
    risk_counts = db.query(
        MLPrediction.prediction_label,
        func.count(MLPrediction.prediction_label)
    ).group_by(MLPrediction.prediction_label).all()

    risk_dist = {label: count for label, count in risk_counts}

    recent_patients = db.query(Patient).order_by(Patient.created_at.desc()).limit(5).all()

    return {
        "total_patients": total_patients,
        "total_screenings": total_screenings,
        "pending_sync": 0,
        "device_status": "READY",
        "risk_distribution": {
            "LOW_RISK": risk_dist.get("LOW_RISK", 0),
            "HIGH_RISK": risk_dist.get("HIGH_RISK", 0) + risk_dist.get("MODERATE_RISK", 0)
        },
        "recent_patients": [
            {
                "id": p.id,
                "name": p.name,
                "age": p.age,
                "gender": p.gender,
                "created_at": p.created_at
            } for p in recent_patients
        ]
    }
