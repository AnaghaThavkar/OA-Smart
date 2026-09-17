import os
import json
import joblib
import numpy as np
import pandas as pd
from ml.features.extractor import FeatureExtractor

class OARiskPredictor:
    """Inference engine for Osteoarthritis risk screening model."""

    DEFAULT_15_FEATURES = [
        "lower_leg_acc_mag_mean",
        "lower_leg_acc_mag_std",
        "lower_leg_acc_mag_rms",
        "lower_leg_acc_mag_range",
        "lower_leg_free_acc_mag_mean",
        "lower_leg_free_acc_mag_std",
        "lower_leg_free_acc_mag_rms",
        "lower_leg_gyr_mag_mean",
        "lower_leg_gyr_mag_std",
        "lower_leg_gyr_mag_rms",
        "lower_leg_gyr_mag_range",
        "lower_leg_peak_angular_velocity",
        "Age",
        "Sex_encoded",
        "BMI"
    ]

    def __init__(self, models_dir: str = None):
        if models_dir is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            backend_models = os.path.abspath(os.path.join(base_dir, "..", "..", "backend", "app", "models"))
            ml_models = os.path.abspath(os.path.join(base_dir, "..", "models"))
            
            if os.path.exists(os.path.join(backend_models, "rf_oa_model.joblib")) or os.path.exists(os.path.join(backend_models, "random_forest_oa_improved.joblib")):
                models_dir = backend_models
            else:
                models_dir = ml_models

        self.models_dir = models_dir
        self.model = None
        self.scaler = None
        self.feature_names = []
        self.threshold = 0.30
        self.model_metadata = {}
        self.load_artifacts()

    def load_artifacts(self):
        """Loads trained Random Forest model, scaler, feature list, and metadata."""
        # Check improved model first, then standard name
        model_candidates = ["random_forest_oa_improved.joblib", "rf_oa_model.joblib"]
        model_path = None
        for cand in model_candidates:
            p = os.path.join(self.models_dir, cand)
            if os.path.exists(p):
                model_path = p
                break

        scaler_candidates = ["scaler_improved.joblib", "scaler.joblib"]
        scaler_path = None
        for cand in scaler_candidates:
            p = os.path.join(self.models_dir, cand)
            if os.path.exists(p):
                scaler_path = p
                break

        features_candidates = ["feature_list_improved.json", "feature_list.json"]
        features_path = None
        for cand in features_candidates:
            p = os.path.join(self.models_dir, cand)
            if os.path.exists(p):
                features_path = p
                break

        metadata_candidates = ["model_metadata_improved.json", "model_metadata.json"]
        metadata_path = None
        for cand in metadata_candidates:
            p = os.path.join(self.models_dir, cand)
            if os.path.exists(p):
                metadata_path = p
                break

        if model_path:
            self.model = joblib.load(model_path)
        else:
            raise FileNotFoundError(f"Model file missing in: {self.models_dir}")

        if scaler_path:
            self.scaler = joblib.load(scaler_path)
        else:
            raise FileNotFoundError(f"Scaler file missing in: {self.models_dir}")

        if features_path:
            with open(features_path, "r") as f:
                data = json.load(f)
                self.feature_names = data.get("feature_names", self.DEFAULT_15_FEATURES)
        else:
            self.feature_names = self.DEFAULT_15_FEATURES

        if metadata_path:
            with open(metadata_path, "r") as f:
                self.model_metadata = json.load(f)
                self.threshold = float(self.model_metadata.get("operating_decision_threshold", 0.30))
        else:
            self.threshold = 0.30

    def encode_demographics(self, features: dict, patient_metadata: dict = None) -> dict:
        """
        Ensures Age, Sex_encoded, and BMI are present and properly formatted.
        - Male Sex_encoded = 1.0, Female = 0.0
        - BMI = weight / (height / 100)^2
        """
        combined = dict(features)
        meta = patient_metadata or {}

        # 1. Age
        if "Age" not in combined or combined["Age"] is None:
            age_val = meta.get("age", meta.get("Age", 50.0))
            try:
                combined["Age"] = float(age_val) if age_val is not None else 50.0
            except (ValueError, TypeError):
                combined["Age"] = 50.0

        # 2. Sex_encoded (Male=1.0, Female=0.0)
        if "Sex_encoded" not in combined or combined["Sex_encoded"] is None:
            raw_sex = meta.get("sex", meta.get("gender", meta.get("Sex")))
            if raw_sex is None:
                combined["Sex_encoded"] = 0.5
            elif isinstance(raw_sex, (int, float)):
                combined["Sex_encoded"] = float(raw_sex)
            elif isinstance(raw_sex, str):
                s = raw_sex.strip().upper()
                if s in ["M", "MALE", "1"]:
                    combined["Sex_encoded"] = 1.0
                elif s in ["F", "FEMALE", "0"]:
                    combined["Sex_encoded"] = 0.0
                else:
                    combined["Sex_encoded"] = 0.5
            else:
                combined["Sex_encoded"] = 0.5

        # 3. BMI (weight_kg / (height_m)^2)
        if "BMI" not in combined or combined["BMI"] is None:
            bmi_val = meta.get("bmi", meta.get("BMI"))
            if bmi_val is not None:
                try:
                    combined["BMI"] = float(bmi_val)
                except (ValueError, TypeError):
                    combined["BMI"] = 25.0
            else:
                height = meta.get("height", meta.get("Height_cm", meta.get("height_cm")))
                weight = meta.get("weight", meta.get("Weight_kg", meta.get("weight_kg")))
                if height and weight:
                    try:
                        h_m = float(height) / 100.0
                        w_kg = float(weight)
                        if h_m > 0:
                            combined["BMI"] = round(w_kg / (h_m ** 2), 2)
                        else:
                            combined["BMI"] = 25.0
                    except (ValueError, TypeError, ZeroDivisionError):
                        combined["BMI"] = 25.0
                else:
                    combined["BMI"] = 25.0

        return combined

    def predict_from_features(self, features: dict, screening_id: str = "SCR-DEMO", patient_metadata: dict = None) -> dict:
        """
        Inference Pipeline:
        1. Inject & encode demographic features (Age, Sex_encoded, BMI)
        2. Order exact 15-feature vector matching feature_list_improved.json
        3. Scale vector via scaler.transform()
        4. Predict class probabilities via model.predict_proba()
        5. Apply calibrated screening threshold (0.30)
        """
        if self.model is None or self.scaler is None:
            raise RuntimeError("Model or Scaler artifact not loaded.")

        # 1. Complete feature set with demographics
        complete_features = self.encode_demographics(features, patient_metadata)

        # 2. Order exact 15 features matching feature_list
        raw_vector = []
        for col in self.feature_names:
            val = complete_features.get(col, 0.0)
            try:
                fval = float(val)
                if np.isnan(fval) or np.isinf(fval):
                    fval = 0.0
            except (ValueError, TypeError):
                fval = 0.0
            raw_vector.append(fval)

        X_raw = np.array([raw_vector], dtype=float)

        # 3. Scale features using scaler.transform() ONLY
        X_scaled = self.scaler.transform(X_raw)

        # 4. Model predict_proba()
        prob_arr = self.model.predict_proba(X_scaled)[0]
        
        # Take class 1 probability as the OA-associated risk score
        classes = list(getattr(self.model, "classes_", [0, 1]))
        class_1_idx = classes.index(1) if 1 in classes else 1
        oa_score = float(prob_arr[class_1_idx])
        class_0_score = float(prob_arr[0]) if len(prob_arr) > 0 else (1.0 - oa_score)

        # 5. Screening Decision Threshold (Fixed at 0.30 - Strictly Binary)
        is_oa_detected = bool(oa_score >= self.threshold)

        # Binary classification based strictly on clinical threshold 0.30:
        # Score >= 0.30 -> HIGH_RISK / OA Detected
        # Score < 0.30 -> LOW_RISK / Healthy
        if is_oa_detected:
            prediction_label = "HIGH_RISK"
        else:
            prediction_label = "LOW_RISK"

        # 6. Feature Importances
        feature_importance_map = {}
        if hasattr(self.model, "feature_importances_"):
            importances = self.model.feature_importances_
            top_indices = np.argsort(importances)[::-1][:5]
            feature_importance_map = {
                self.feature_names[i]: float(importances[i])
                for i in top_indices
            }

        recommendation_map = {
            "LOW_RISK": "Standard functional movement observed. Maintain routine physical activity and joint health monitoring.",
            "HIGH_RISK": "Osteoarthritis risk indicators detected (score exceeds 0.30 threshold). Recommend clinical examination, functional evaluation, and radiographic imaging."
        }

        return {
            "screening_id": screening_id,
            "prediction": prediction_label,
            "probabilities": {
                "LOW_RISK": round(class_0_score, 4),
                "HIGH_RISK": round(oa_score, 4)
            },
            "oa_score": round(oa_score, 4),
            "threshold": self.threshold,
            "is_oa_detected": is_oa_detected,
            "model_version": "RF-2.0.0-IMPROVED",
            "features": {k: complete_features.get(k, 0.0) for k in self.feature_names},
            "feature_importance": feature_importance_map,
            "recommendation": recommendation_map.get(prediction_label, "Consult a clinical specialist for comprehensive assessment."),
            "analysis_status": "completed"
        }

    def predict_from_sensor_stream(self, sensor_packets: list, screening_id: str = "SCR-DEMO", patient_metadata: dict = None) -> dict:
        from ml.preprocessing.cleaner import SensorDataCleaner

        # Step 1: Preprocessing & Validation
        valid_packets = [p for p in sensor_packets if SensorDataCleaner.validate_packet(p)]
        if not valid_packets:
            valid_packets = sensor_packets

        # Step 2: Noise Reduction (Moving Average Smoothing)
        keys_to_smooth = [
            'thigh_ax', 'thigh_ay', 'thigh_az',
            'thigh_gx', 'thigh_gy', 'thigh_gz',
            'lower_ax', 'lower_ay', 'lower_az',
            'lower_gx', 'lower_gy', 'lower_gz',
            'knee_angle'
        ]

        cleaned_packets = [dict(p) for p in valid_packets]
        for key in keys_to_smooth:
            raw_signal = [p[key] for p in cleaned_packets if key in p]
            smoothed_signal = SensorDataCleaner.apply_moving_average(raw_signal, window_size=3)
            for i, val in enumerate(smoothed_signal):
                cleaned_packets[i][key] = val

        # Step 3: Feature Extraction on Cleaned Telemetry
        features = FeatureExtractor.extract_features(cleaned_packets)
        return self.predict_from_features(features, screening_id, patient_metadata=patient_metadata)
