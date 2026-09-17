# OA-SMART API & Data Contract

This document details the interface definitions between Member 1 (Frontend + BLE + Offline Storage) and Member 2 (FastAPI Backend + ML Engine + Database).

---

## 1. Sensor Packet Interface

```json
{
  "timestamp": 1726156800000,
  "thigh_ax": -0.3922,
  "thigh_ay": -0.0022,
  "thigh_az": 0.2928,
  "thigh_gx": 0.8473,
  "thigh_gy": 1.5954,
  "thigh_gz": 0.3511,
  "lower_ax": -0.2091,
  "lower_ay": -0.1914,
  "lower_az": 0.4396,
  "lower_gx": 0.1298,
  "lower_gy": 0.2519,
  "lower_gz": 0.0992,
  "knee_angle": 29.69
}
```

---

## 2. ML Prediction Result Contract

```json
{
  "screening_id": "SCR-2026-0912-001",
  "prediction": "HIGH_RISK",
  "probabilities": {
    "LOW_RISK": 0.2957,
    "HIGH_RISK": 0.7043
  },
  "oa_score": 0.7043,
  "threshold": 0.30,
  "is_oa_detected": true,
  "model_version": "RF-2.0.0-IMPROVED",
  "features": {
    "lower_leg_acc_mag_mean": 9.82,
    "lower_leg_acc_mag_std": 1.45,
    "lower_leg_acc_mag_rms": 9.95,
    "lower_leg_acc_mag_range": 5.20,
    "lower_leg_free_acc_mag_mean": 1.24,
    "lower_leg_free_acc_mag_std": 0.88,
    "lower_leg_free_acc_mag_rms": 1.52,
    "lower_leg_gyr_mag_mean": 42.10,
    "lower_leg_gyr_mag_std": 28.35,
    "lower_leg_gyr_mag_rms": 50.78,
    "lower_leg_gyr_mag_range": 112.40,
    "lower_leg_peak_angular_velocity": 124.60,
    "Age": 68.0,
    "Sex_encoded": 0.0,
    "BMI": 30.5
  },
  "feature_importance": {
    "Age": 0.2265,
    "lower_leg_gyr_mag_mean": 0.1153,
    "lower_leg_acc_mag_mean": 0.1038,
    "lower_leg_gyr_mag_rms": 0.1008,
    "BMI": 0.0935
  },
  "recommendation": "Osteoarthritis risk indicators detected (score exceeds 0.30 threshold). Recommend clinical examination, functional evaluation, and radiographic imaging.",
  "analysis_status": "completed"
}
```

---

## 3. Idempotent Offline Sync Payload (`POST /api/sync`)

```json
{
  "patients": [
    {
      "id": "PAT-98214",
      "name": "Jane Doe",
      "age": 54,
      "gender": "FEMALE",
      "phone": "+91 9876543210",
      "created_at": "2026-09-12T10:00:00Z"
    }
  ],
  "screenings": [
    {
      "id": "SCR-2026-0912-001",
      "patient_id": "PAT-98214",
      "test_type": "SIT_TO_STAND",
      "status": "COMPLETED",
      "created_at": "2026-09-12T10:05:00Z"
    }
  ]
}
```
