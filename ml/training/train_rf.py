import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

def generate_synthetic_dataset(n_samples=500):
    """Generates synthetic dataset matching sensor profiles for baseline Random Forest training."""
    np.random.seed(42)
    
    # Feature columns matching FeatureExtractor
    data = []
    labels = []
    
    for _ in range(n_samples):
        # Class 0: Low Risk / Normal Movement
        # Class 1: Moderate Risk
        # Class 2: High Risk / Restricted ROM & High Variability
        risk_class = np.random.choice([0, 1, 2], p=[0.4, 0.4, 0.2])
        
        if risk_class == 0:
            knee_range = np.random.normal(55.0, 5.0)
            knee_min = np.random.normal(5.0, 2.0)
            knee_mean = np.random.normal(30.0, 4.0)
            thigh_rms = np.random.normal(0.45, 0.05)
            lower_rms = np.random.normal(0.50, 0.05)
        elif risk_class == 1:
            knee_range = np.random.normal(35.0, 6.0)
            knee_min = np.random.normal(12.0, 3.0)
            knee_mean = np.random.normal(35.0, 5.0)
            thigh_rms = np.random.normal(0.65, 0.08)
            lower_rms = np.random.normal(0.70, 0.08)
        else:
            knee_range = np.random.normal(20.0, 4.0)
            knee_min = np.random.normal(18.0, 4.0)
            knee_mean = np.random.normal(42.0, 6.0)
            thigh_rms = np.random.normal(0.85, 0.12)
            lower_rms = np.random.normal(0.92, 0.12)
            
        row = {
            "knee_angle_mean": knee_mean,
            "knee_angle_std": np.abs(np.random.normal(8.0, 2.0)),
            "knee_angle_min": knee_min,
            "knee_angle_max": knee_min + knee_range,
            "knee_angle_range": knee_range,
            "thigh_acc_rms": thigh_rms,
            "thigh_acc_std": np.abs(np.random.normal(0.3, 0.05)),
            "thigh_gyro_rms": np.abs(np.random.normal(1.2, 0.2)),
            "lower_leg_acc_rms": lower_rms,
            "lower_leg_acc_std": np.abs(np.random.normal(0.35, 0.05)),
            "lower_leg_gyro_rms": np.abs(np.random.normal(1.4, 0.2)),
            "signal_duration_sec": 5.0,
            "thigh_lower_angle_diff": np.abs(np.random.normal(0.18, 0.04))
        }
        data.append(row)
        labels.append(risk_class)
        
    return pd.DataFrame(data), np.array(labels)

def train_and_save():
    df, y = generate_synthetic_dataset()
    
    rf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    rf.fit(df, y)
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.abspath(os.path.join(script_dir, "..", "models"))
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "rf_oa_model.joblib")
    
    # Save model and feature names together
    artifact = {
        "model": rf,
        "feature_names": list(df.columns),
        "target_classes": ["LOW_RISK", "MODERATE_RISK", "HIGH_RISK"],
        "model_version": "RF-1.0.0"
    }
    
    joblib.dump(artifact, model_path)
    print(f"Model successfully saved to {model_path}")

if __name__ == "__main__":
    train_and_save()
