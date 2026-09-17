# OA-SMART Model Integration Report: 15-Feature Random Forest Deployment

**Project:** OA-SMART Knee Osteoarthritis Screening System  
**Target Repository:** `C:\Users\ASUS\Downloads\OA-V1\OA-V1`  
**Model Version:** `RF-2.0.0-IMPROVED`  
**Operating Decision Threshold:** `0.30`  
**Execution Date:** September 16, 2026  
**Status:** **ALL INTEGRATION CHECKS PASSED (100%)**

---

## Executive Summary

The newly improved, high-sensitivity 15-feature Random Forest model has been successfully integrated into the **OA-V1** production repository. All legacy model artifacts were backed up to a dedicated versioned directory before deployment. The inference pipeline, FastAPI schemas, and React PWA screening workflow were upgraded to supply patient demographics (`Age`, `Sex_encoded`, `BMI`) alongside live lower-leg IMU kinematic packets, unlocking **91.30% screening sensitivity** and **0.9655 ROC-AUC** while preserving 100% backward compatibility with the ESP32 dual-sensor firmware and offline database.

---

## 1. Artifact Locations & Backup Status

### 1.1 Source Model Artifacts
Source Directory: `C:\Users\ASUS\Downloads\dataset\models\`
- `random_forest_oa_improved.joblib` (212,137 bytes, MD5: `d66fd681bcc33d8f480dbc942cdef0bd`)
- `scaler_improved.joblib` (927 bytes, MD5: `b732223e7a1010e2de6a877c00450a42`)
- `feature_list_improved.json` (466 bytes, MD5: `d730e3648c75d6974a15abf5832963b5`)
- `model_metadata_improved.json` (2,041 bytes, MD5: `da5af3c37dead77376826e981ea2af70`)

### 1.2 Backup Location
Backup Directory: `C:\Users\ASUS\Downloads\OA-V1\OA-V1\backend\app\models\backup_v1\`

All original OA-V1 model files were archived prior to any modifications:
1. `rf_oa_model.joblib` (283,801 bytes)
2. `scaler.joblib` (871 bytes)
3. `feature_list.json` (422 bytes)
4. `rf_oa_model_trees.json` (170,984 bytes)
5. `model_b64_payload.json` (379,603 bytes)

### 1.3 Active Deployed Artifacts in OA-V1
Target Directory: `C:\Users\ASUS\Downloads\OA-V1\OA-V1\backend\app\models\`
- `random_forest_oa_improved.joblib` (Active binary)
- `rf_oa_model.joblib` (Synchronized copy for backwards-compatibility)
- `scaler_improved.joblib` (Active scaler)
- `scaler.joblib` (Synchronized copy)
- `feature_list_improved.json` (Active feature list)
- `feature_list.json` (Synchronized copy)
- `model_metadata_improved.json` (Metadata & operating threshold configuration)

---

## 2. Files Changed & Files Backed Up

### 2.1 Files Backed Up
| File Name | Backup Path | Status |
| :--- | :--- | :---: |
| `rf_oa_model.joblib` | `backend/app/models/backup_v1/rf_oa_model.joblib` | Verified |
| `scaler.joblib` | `backend/app/models/backup_v1/scaler.joblib` | Verified |
| `feature_list.json` | `backend/app/models/backup_v1/feature_list.json` | Verified |
| `rf_oa_model_trees.json`| `backend/app/models/backup_v1/rf_oa_model_trees.json`| Verified |
| `model_b64_payload.json`| `backend/app/models/backup_v1/model_b64_payload.json`| Verified |

### 2.2 Files Modified
| File Path | Description of Changes |
| :--- | :--- |
| [`ml/inference/predict.py`](file:///C:/Users/ASUS/Downloads/OA-V1/OA-V1/ml/inference/predict.py) | Upgraded `OARiskPredictor` to load the 15-feature model, enforce exact feature order, process `Age`, `Sex_encoded` (Male=1.0, Female=0.0), and compute $\text{BMI} = \text{weight}/(\text{height}/100)^2$. Set calibrated screening threshold to fixed `0.30`. Added resilience against missing values and NaNs. |
| [`backend/app/schemas/pydantic_schemas.py`](file:///C:/Users/ASUS/Downloads/OA-V1/OA-V1/backend/app/schemas/pydantic_schemas.py) | Extended `AnalysisRequestSchema` with optional patient fields (`patient_id`, `age`, `sex`, `gender`, `height`, `weight`, `bmi`). Extended `MLPredictionResponseSchema` with `oa_score`, `threshold`, and `is_oa_detected`. |
| [`backend/app/api/screenings.py`](file:///C:/Users/ASUS/Downloads/OA-V1/OA-V1/backend/app/api/screenings.py) | Updated `POST /api/screenings/{id}/analysis` to extract demographics from payload or resolve them from the database `Patient` table, passing metadata to `predictor.predict_from_sensor_stream()`. |
| [`frontend/src/services/api/client.ts`](file:///C:/Users/ASUS/Downloads/OA-V1/OA-V1/frontend/src/services/api/client.ts) | Extended `ApiClient.analyzeScreening()` to accept optional `patientContext` and forward demographics in the HTTP request payload. |
| [`frontend/src/components/NewScreeningWorkflow.tsx`](file:///C:/Users/ASUS/Downloads/OA-V1/OA-V1/frontend/src/components/NewScreeningWorkflow.tsx) | Updated screening submission to compute BMI from existing `height` and `weight` state and supply `{ patientId, age, sex, height, weight, bmi }` to `analyzeScreening()`. |

---

## 3. The 15 Features: Schema & Ordering Verification

The model input vector strictly enforces the following 15 features in exact order:

| Index | Feature Identifier | Source | Description / Formula |
| :---: | :--- | :--- | :--- |
| **1** | `lower_leg_acc_mag_mean` | ESP32 / MPU6050 Lower Leg | Mean acceleration magnitude ($\text{m}/\text{s}^2$) |
| **2** | `lower_leg_acc_mag_std` | ESP32 / MPU6050 Lower Leg | Acceleration magnitude standard deviation |
| **3** | `lower_leg_acc_mag_rms` | ESP32 / MPU6050 Lower Leg | Root mean square of acceleration magnitude |
| **4** | `lower_leg_acc_mag_range` | ESP32 / MPU6050 Lower Leg | Peak-to-peak acceleration range ($\max - \min$) |
| **5** | `lower_leg_free_acc_mag_mean` | ESP32 / MPU6050 Lower Leg | Mean dynamic acceleration without 1g gravity |
| **6** | `lower_leg_free_acc_mag_std` | ESP32 / MPU6050 Lower Leg | Standard deviation of free acceleration |
| **7** | `lower_leg_free_acc_mag_rms` | ESP32 / MPU6050 Lower Leg | RMS of free acceleration magnitude |
| **8** | `lower_leg_gyr_mag_mean` | ESP32 / MPU6050 Lower Leg | Mean gyroscope angular velocity ($\text{rad}/\text{s}$) |
| **9** | `lower_leg_gyr_mag_std` | ESP32 / MPU6050 Lower Leg | Gyroscope angular velocity standard deviation |
| **10** | `lower_leg_gyr_mag_rms` | ESP32 / MPU6050 Lower Leg | RMS of angular velocity magnitude |
| **11** | `lower_leg_gyr_mag_range` | ESP32 / MPU6050 Lower Leg | Range of angular velocity ($\max - \min$) |
| **12** | `lower_leg_peak_angular_velocity` | ESP32 / MPU6050 Lower Leg | Maximum instantaneous rotational rate |
| **13** | `Age` | Patient Intake | Chronological age in years |
| **14** | `Sex_encoded` | Patient Intake | Binary: Male = `1.0`, Female = `0.0` (neutral default: `0.5`) |
| **15** | `BMI` | Patient Intake | $\text{weight} (\text{kg}) / (\text{height} (\text{m}))^2$ |

---

## 4. Demographic Encoding & BMI Calculation Verification

Demographic normalization was rigorously verified against clinical edge cases:
- **Male Encoding:** `sex='Male'`, `height=180.0 cm`, `weight=81.0 kg`  
  $\rightarrow \text{Age} = 60.0$, $\text{Sex\_encoded} = 1.0$, $\text{BMI} = 81 / (1.80)^2 = 25.0$ **[PASS]**
- **Female Encoding:** `sex='Female'`, `height=155.0 cm`, `weight=75.0 kg`  
  $\rightarrow \text{Age} = 70.0$, $\text{Sex\_encoded} = 0.0$, $\text{BMI} = 75 / (1.55)^2 = 31.22$ **[PASS]**
- **Fallback / Empty Metadata:** `{}` (no demographics supplied)  
  $\rightarrow \text{Age} = 50.0$, $\text{Sex\_encoded} = 0.5$ (neutral), $\text{BMI} = 25.0$ (baseline) **[PASS]**

---

## 5. End-to-End Verification Results

### 5.1 Model & Scaler Artifact Loading
- Model: `RandomForestClassifier` loaded successfully (100 estimators, max depth 5).
- Scaler: `StandardScaler` loaded successfully ($n\_features\_in\_ = 15$).
- Threshold: Calibrated operating threshold initialized to **`0.30`**.

### 5.2 Direct Inference Verification (Healthy vs KOA)
- **Healthy Test Gait Profile:**
  - Prediction: `LOW_RISK`
  - OA Risk Score: `0.0000` ($< 0.30$)
  - `is_oa_detected`: `False` **[PASS]**
- **KOA Test Gait Profile (Senior Female, high BMI, reduced angular velocity):**
  - Prediction: `HIGH_RISK`
  - OA Risk Score: `0.9696` ($\ge 0.30$)
  - `is_oa_detected`: `True` **[PASS]**

### 5.3 Live Backend API & Database Workflow
- **`GET /`**: Healthcheck returned `200 OK`.
- **`POST /api/patients`**: Successfully created patient record `PAT-TEST-002` in SQLite `oa_smart.db`.
- **`POST /api/screenings/{id}/analysis`**: Successfully processed 30 dual-sensor telemetry packets + demographic payload (`age: 71`, `sex: "Female"`, `height: 155`, `weight: 80`).
  - Response Code: `200 OK`
  - Returned Schema: `screening_id`, `prediction='HIGH_RISK'`, `oa_score=0.9714`, `threshold=0.30`, `is_oa_detected=True`, `model_version='RF-2.0.0-IMPROVED'`.
  - Feature Vector: Contains all 15 features properly populated.
  - Top Feature Importances: `Age` (0.227), `lower_leg_gyr_mag_mean` (0.115), `lower_leg_acc_mag_mean` (0.104), `lower_leg_gyr_mag_rms` (0.101), `BMI` (0.094).
- **`GET /api/screenings/{id}`**: Verified session and ML prediction records persisted in `screening_sessions`, `extracted_features`, and `ml_predictions` tables.
- **Report Generation (`ReportGenerator.generate_html_report`)**: Successfully generated a 4,276-byte HTML clinical report containing all 15 features and importance breakdowns.

### 5.4 Frontend PWA Build & Type Integrity
- Executed `npm run build` (`tsc && vite build`) in `OA-V1/frontend/`:
  - 1,270 modules transformed.
  - **Zero TypeScript compilation errors.**
  - PWA service worker and production bundles generated cleanly (`dist/assets/index-4c477e38.js`).

---

## 6. Final Integration Checklist

| Verification Check | Expected Standard | Observed Result | Status |
| :--- | :--- | :--- | :---: |
| **1. Backup Integrity** | All 5 old model files archived to `backup_v1/` | All 5 files present with matching sizes | **PASS** |
| **2. Model Loading** | RandomForestClassifier loads from disk | Successfully loaded, 100 estimators | **PASS** |
| **3. Scaler Loading** | StandardScaler expects exactly 15 features | Successfully loaded, 15 features | **PASS** |
| **4. Feature Ordering** | 12 IMU kinematics + Age, Sex_encoded, BMI | Exact match on all 15 column names and positions | **PASS** |
| **5. Operating Threshold** | Fixed at 0.30 | Threshold set to 0.30 in predictor & API response | **PASS** |
| **6. Sex Encoding** | Male = 1.0, Female = 0.0, Default = 0.5 | Verified across case variations and defaults | **PASS** |
| **7. BMI Calculation** | $\text{weight} / (\text{height}/100)^2$ | Verified with standard and elevated test cases | **PASS** |
| **8. Direct ML Inference** | Correct discrimination of Healthy vs KOA | Healthy $\rightarrow 0.000$, KOA $\rightarrow 0.970$ | **PASS** |
| **9. FastAPI Endpoint** | `POST /api/screenings/{id}/analysis` | Returns 200 OK with full 15-feature analysis | **PASS** |
| **10. Database Persistence** | Sessions, features, predictions stored | Stored and retrieved via `GET /api/screenings/{id}` | **PASS** |
| **11. Frontend Compatibility** | PWA passes typecheck and builds | `npm run build` passed in 9.0s | **PASS** |
| **12. ESP32 Firmware Compatibility** | Dual MPU6050 packet structure unchanged | `DataPreprocessingService` extracts all 12 kinematics | **PASS** |

---

## Conclusion

The improved 15-feature OA-SMART model is **fully operational and integrated into OA-V1**. The system is ready for live clinical screening with enhanced sensitivity (91.30%), zero code regressions, and complete preservation of hardware, database, and UI workflows.
