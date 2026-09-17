import os
import sys
import datetime

# Ensure sys.path includes parent directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))

from backend.app.database.session import Base, engine, SessionLocal
from backend.app.models.sql_models import Patient, ScreeningSession, ExtractedFeatures, MLPrediction

def seed_backend_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(Patient).count() > 0:
        print("[Backend Seed] Database already contains records. Skipping seed.")
        db.close()
        return

    print("[Backend Seed] Seeding initial demo patients and screenings into backend database...")

    p1 = Patient(id="PAT-98214", name="Ramesh Kumar", age=58, gender="MALE", phone="+91 98765 43210", sync_status="SYNCED")
    p2 = Patient(id="PAT-67102", name="Sunita Devi", age=62, gender="FEMALE", phone="+91 91234 56789", sync_status="SYNCED")
    p3 = Patient(id="PAT-40193", name="Rajesh Patel", age=48, gender="MALE", phone="+91 99887 76655", sync_status="SYNCED")
    
    db.add_all([p1, p2, p3])
    db.commit()

    s1 = ScreeningSession(id="SCR-2026-0912-001", patient_id=p1.id, test_type="SIT_TO_STAND", status="COMPLETED", sync_status="SYNCED")
    s2 = ScreeningSession(id="SCR-2026-0912-002", patient_id=p2.id, test_type="WALKING_NORMAL", status="COMPLETED", sync_status="SYNCED")
    
    db.add_all([s1, s2])
    db.commit()

    feat1 = ExtractedFeatures(
        id="FEAT-001",
        screening_id=s1.id,
        features_json={"knee_angle_range": 32.4, "knee_angle_mean": 31.0, "thigh_acc_rms": 0.48, "lower_leg_acc_rms": 0.58},
        feature_version="1.0.0"
    )

    pred1 = MLPrediction(
        id="PRED-001",
        screening_id=s1.id,
        prediction_label="MODERATE_RISK",
        probabilities_json={"LOW_RISK": 0.20, "MODERATE_RISK": 0.65, "HIGH_RISK": 0.15},
        feature_importance_json={"knee_angle_range": 0.35, "lower_leg_acc_rms": 0.28, "thigh_acc_rms": 0.22},
        model_version="RF-1.0.0",
        recommendation="Slight knee joint stiffness detected. Functional joint exercise therapy and follow-up screening suggested."
    )

    db.add_all([feat1, pred1])
    db.commit()
    db.close()
    print("[Backend Seed] Database successfully seeded.")

if __name__ == "__main__":
    seed_backend_database()
