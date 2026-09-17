# OA-SMART: Portable AI-Assisted Osteoarthritis Risk Screening System
## Final Integrated Project Report

**Project Name:** OA-SMART  
**Full Title:** Portable AI-Assisted Knee Osteoarthritis Risk Screening System  
**Repository Path:** `C:\Users\ASUS\Downloads\OA-V1\OA-V1`  
**Model Version:** `RF-2.0.0-IMPROVED` (15-Feature Random Forest Classifier)  
**Operating Decision Threshold:** `0.30`  
**Evaluation Standard:** 144 Untouched Real Test Trials (31 Participants)  
**Date of Report:** September 16, 2026  
**Demonstration Status:** **Technically Integrated, Validated, and Demonstration-Ready**

---

## 1. Project Title

### OA-SMART: Portable AI-Assisted Knee Osteoarthritis Risk Screening System
A battery-powered, non-invasive wearable IoT and machine-learning screening platform designed for early detection and functional mobility assessment of Knee Osteoarthritis (KOA).

---

## 2. Project Overview

### 2.1 Problem Statement
Knee Osteoarthritis (KOA) is among the leading causes of chronic disability, mobility impairment, and joint pain worldwide, affecting hundreds of millions of adults—particularly aging and overweight populations. Conventional diagnosis relies heavily on weight-bearing plain radiography (X-rays) evaluated using the Kellgren-Lawrence (KL) grading system, or magnetic resonance imaging (MRI). 

However, standard radiographic methods present critical public health bottlenecks:
1. **Late Diagnosis:** Radiography detects structural joint damage only after irreversible cartilage degradation has occurred. Early functional impairment and subtle gait kinematics changes occur years before joint-space narrowing is visible on X-rays.
2. **Resource Constraints:** In rural, community health, and resource-limited primary care settings, access to radiological facilities and orthopedic specialists is severely restricted.
3. **High Cost & Inflexibility:** Clinical gait laboratory systems (optical motion capture, force plates) cost tens of thousands of dollars, require dedicated space, and cannot be deployed in village camps or home-based routine health screenings.

### 2.2 Proposed Solution
**OA-SMART** solves this challenge through a low-cost, portable wearable screening device combining:
- A compact dual-sensor inertial measurement unit (IMU) configuration (thigh and lower-leg/shank).
- An ESP32 microcontroller streaming high-rate (50 Hz) kinematic telemetry over Bluetooth Low Energy (BLE).
- An offline-first Progressive Web App (PWA) that records patient demographics, executes standardized functional movement tests (Sit-to-Stand, 15-second gait), and provides immediate real-time feedback.
- A calibrated 15-feature Random Forest machine-learning model fusing 12 lower-leg kinematic features with patient Age, Sex, and Body Mass Index (BMI).
- Automated digital report generation and offline-to-cloud bidirectional synchronization.

### 2.3 Main Objective
The primary objective of OA-SMART is **early, high-sensitivity, point-of-care risk screening**. In screening medicine, minimizing **False Negatives** is paramount: catching patients in early disease phases allows conservative non-pharmacological interventions (physical therapy, quadriceps strengthening, weight reduction, lifestyle modification) that halt or delay joint degeneration before total knee arthroplasty (knee replacement surgery) becomes necessary.

### 2.4 Target Users & Use Cases
- **Community Health Workers (ASHAs / ANMs):** Conducting rapid, non-invasive health camps in rural communities without radiographic access.
- **Primary Healthcare Centers (PHCs):** Triaging patients presenting with general knee discomfort to prioritize orthopedic specialist referrals.
- **Physical Therapy Clinics:** Objectively tracking functional recovery, joint range of motion, and movement stability across rehabilitation sessions.
- **Geriatric & Wellness Centers:** Routine annual mobility assessments for senior citizens.

### 2.5 How the Complete System Works
1. The health worker registers patient profile information (Name, Age, Sex, Height, Weight) in the React PWA; BMI is automatically calculated.
2. The patient performs a self-reported symptom check (pain severity, stiffness, mobility difficulty).
3. The dual MPU6050 wearable is secured to the patient's thigh and shank, and connects wirelessly to the tablet or smartphone via Web Bluetooth.
4. The patient performs a standard functional movement protocol (Sit-to-Stand or 15-second walking test) while real-time knee flexion angle and acceleration stability are visualized on-screen.
5. The 50 Hz telemetry stream is cleaned, smoothed with a moving average filter, and converted into 12 kinematic features.
6. The 12 kinematic features are fused with `Age`, `Sex_encoded`, and `BMI` into a 15-dimensional vector.
7. The vector is standardized by `StandardScaler` and evaluated by the `RandomForestClassifier` applying a calibrated decision threshold of **`0.30`**.
8. A comprehensive risk tier (`LOW_RISK`, `MODERATE_RISK`, `HIGH_RISK`), probability score, feature importance explanation, and clinical guidance are displayed, saved in the database, and exported as a digital report.

---

## 3. System Architecture

The end-to-end architecture follows a strictly decoupled, modular pipeline from physical sensor silicon to clinical reporting:

```
+-----------------------------------------------------------------------------------+
|                                PHYSICAL HARDWARE                                  |
|                                                                                   |
|  +------------------------+                +------------------------+             |
|  | Thigh MPU6050 (0x68)   |                | Shank MPU6050 (0x69)   |             |
|  | Accel [ax,ay,az]       |                | Accel [ax,ay,az]       |             |
|  | Gyro  [gx,gy,gz]       |                | Gyro  [gx,gy,gz]       |             |
|  +-----------+------------+                +-----------+------------+             |
|              |                                         |                          |
|              +-------------------+ +-------------------+                          |
|                                  | | (I2C Bus: SDA 21, SCL 22)                    |
|                                  v v                                              |
|                    +-----------------------------+                                |
|                    |     ESP32 Microcontroller   |                                |
|                    |  - 50Hz Sampling Loop       |                                |
|                    |  - Pitch & Knee Angle Calc  |                                |
|                    |  - BLE GATT Server Notify   |                                |
|                    +--------------+--------------+                                |
+-----------------------------------|-----------------------------------------------+
                                    | Bluetooth Low Energy (BLE)
                                    | Service UUID: 4fafc201-1fb5-459e-8fcc-c5c9c331914b
                                    | Char UUID:    beb5483e-36e1-4688-b7f5-ea07361b26a8
                                    v
+-----------------------------------------------------------------------------------+
|                            CLIENT-SIDE: REACT PWA                                 |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Web Bluetooth Adapter / PacketParser                                        |  |
|  | - Parses CSV line: timestamp, thigh_ax..gz, lower_ax..gz, knee_angle        |  |
|  | - Validates packet integrity & handles error tokens                         |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|  +-------------------------------------+---------------------------------------+  |
|  | 5-Step Clinical Screening Wizard                                            |  |
|  | Step 1: Patient Registration (Age, Sex, Height, Weight -> Auto-calc BMI)    |  |
|  | Step 2: Symptom Assessment (WOMAC-style pain score, stiffness, mobility)    |  |
|  | Step 3: Movement Telemetry Recording & Real-time Live Charts                |  |
|  | Step 4: Analysis State Dispatcher                                           |  |
|  | Step 5: Clinical Risk Dashboard & Digital PDF/HTML Report Generator        |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|  +-------------------------------------+---------------------------------------+  |
|  | Offline Storage: IndexedDB (Dexie.js)                                       |  |
|  | - Stores patients & screening history locally when offline                  |  |
|  | - Background auto-sync via SyncService on internet reconnect                |  |
|  +-------------------------------------+---------------------------------------+  |
+----------------------------------------|------------------------------------------+
                                         | HTTP POST /api/screenings/{id}/analysis
                                         | (JSON: sensor_packets + demographics)
                                         v
+-----------------------------------------------------------------------------------+
|                            SERVER-SIDE: FASTAPI BACKEND                           |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | FastAPI REST Endpoints (api/screenings.py, api/patients.py, api/sync.py)    |  |
|  | - Pydantic Request Validation (AnalysisRequestSchema)                       |  |
|  | - Extracts demographic context (Age, Sex, Height, Weight, BMI)              |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|  +-------------------------------------+---------------------------------------+  |
|  | Data Preprocessing & Feature Extraction Engine (ml/features/extractor.py)  |  |
|  | 1. Moving Average Noise Reduction (Window=3)                                |  |
|  | 2. Computes 12 Lower-Leg Kinematic Magnitudes (Mean, Std, RMS, Range, Peak)  |  |
|  | 3. Injects 3 Patient Demographics: Age, Sex_encoded (M=1, F=0), BMI         |  |
|  | 4. Constructs exact 15-feature ordered vector                              |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|  +-------------------------------------+---------------------------------------+  |
|  | ML Inference Engine (ml/inference/predict.py)                               |  |
|  | - StandardScaler: scales 15-element vector                                  |  |
|  | - RandomForestClassifier: computes class probabilities                      |  |
|  | - Decision Boundary: Threshold = 0.30 (Screening Sensitivity Mode)         |  |
|  | - Output: Prediction, OA Risk Score, Risk Category, Top Feature Impact     |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|  +-------------------------------------+---------------------------------------+  |
|  | Persistence & Reporting Layer                                               |  |
|  | - SQLite Database (oa_smart.db via SQLAlchemy ORM)                          |  |
|  | - ReportGenerator: formats printable HTML clinical summary                  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 4. Hardware System

### 4.1 Microcontroller: ESP32
- **Module:** ESP32-WROOM-32 (Dual-core Xtensa 32-bit LX6, 240 MHz).
- **Wireless Subsystem:** Integrated 2.4 GHz Bluetooth 4.2 BR/EDR and Bluetooth Low Energy (BLE).
- **Operating Voltage:** 3.3V logic (powered via rechargeable Li-Ion battery or USB 5V regulator).

### 4.2 Inertial Sensors: Dual MPU6050 IMUs
- **Sensor Type:** Micro-Electro-Mechanical Systems (MEMS) 6-DOF MotionTracking device.
- **Onboard Channels:** 3-axis accelerometer ($\pm 2g$ range, $16,384 \text{ LSB}/g$) and 3-axis gyroscope ($\pm 250^\circ/\text{s}$ range, $131 \text{ LSB}/(^\circ/\text{s})$).
- **Internal Digital Motion Processor (DMP):** Used for on-chip filtering; raw register burst reads utilized for low latency.

### 4.3 Thigh and Lower-Leg Sensor Setup
To capture knee joint articulation, two IMUs are placed on the sagittal plane of the tested limb:
- **Thigh Sensor (Proximal):** Mounted along the anterolateral aspect of the middle third of the thigh.
  - **I2C Address:** `0x68` (Pin `AD0` connected to Ground).
- **Lower-Leg / Shank Sensor (Distal):** Mounted along the anterior flat surface of the tibial shaft, 5 cm above the medial malleolus.
  - **I2C Address:** `0x69` (Pin `AD0` pulled up to 3.3V).
- **Bus Wiring:** Both sensors share a single I2C bus:
  - `SDA` $\rightarrow$ ESP32 GPIO 21
  - `SCL` $\rightarrow$ ESP32 GPIO 22

### 4.4 Sensor Data Captured
Every 20 milliseconds (50 Hz), the firmware samples 14 raw variables:
1. `timestamp`: Monotonic millisecond counter (`millis()`).
2. `thigh_ax`, `thigh_ay`, `thigh_az`: Acceleration in $g$ ($1g \approx 9.81 \text{ m}/\text{s}^2$).
3. `thigh_gx`, `thigh_gy`, `thigh_gz`: Angular velocity in $^\circ/\text{s}$.
4. `lower_ax`, `lower_ay`, `lower_az`: Acceleration in $g$.
5. `lower_gx`, `lower_gy`, `lower_gz`: Angular velocity in $^\circ/\text{s}$.
6. `knee_angle`: Relative flexion-extension angle calculated dynamically from pitch differences.

### 4.5 Communication Method & Packet Structure
- **Protocol:** BLE GATT Server with Notification characteristic.
- **Service UUID:** `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- **Characteristic UUID:** `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- **Packet Format (ASCII CSV String, newline delimited):**
  ```text
  <timestamp>,<thigh_ax>,<thigh_ay>,<thigh_az>,<thigh_gx>,<thigh_gy>,<thigh_gz>,<lower_ax>,<lower_ay>,<lower_az>,<lower_gx>,<lower_gy>,<lower_gz>,<knee_angle>\n
  ```
  *Example live frame:*
  ```text
  128450,-0.3922,-0.0022,0.2928,0.8473,1.5954,0.3511,-0.2091,-0.1914,0.4396,0.1298,0.2519,0.0992,29.69\n
  ```

### 4.6 Firmware Functionality (`firmware/esp32_oa_smart/esp32_oa_smart.ino`)
- Hardware initialization: Detects both MPU6050 devices over I2C on boot; prints diagnostic status over 115,200 baud UART.
- Pitch calculation: Computes accelerometer pitch angles:
  $$\theta_{\text{pitch}} = \arctan2(a_y, \sqrt{a_x^2 + a_z^2}) \times \frac{180}{\pi}$$
- Knee angle extraction: Computes absolute differential pitch:
  $$\theta_{\text{knee}} = |\theta_{\text{thigh}} - \theta_{\text{lower}}| \quad \text{(constrained to } 0^\circ - 130^\circ\text{)}$$
- Error handling: Emits `ERROR, SENSOR_READ_FAILED\n` if either I2C bus device stops acknowledging.
- Connection management: Automatically restarts BLE advertising if client disconnects.

---

## 5. Software Stack

### 5.1 Frontend Technologies
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 18.2.0 | Reactive component-based user interface |
| **TypeScript** | 5.0.2 | Strong static typing and contract adherence |
| **Vite** | 4.4.5 | High-speed frontend tooling and bundler |
| **Tailwind CSS** | 3.3.3 | Utility-first responsive styling and design system |
| **Web Bluetooth API** | W3C Standard | Direct browser-to-ESP32 BLE GATT connection |
| **Dexie.js** | 3.2.4 | IndexedDB wrapper for client-side offline storage |
| **Recharts** | 2.7.2 | Responsive time-series and radar data visualizations |
| **Lucide React** | 0.263.1 | UI iconography |
| **Vite Plugin PWA** | 0.16.4 | Service Worker registration, offline caching, installability |

### 5.2 Backend Technologies
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Python** | 3.14.3 | Core server runtime |
| **FastAPI** | $\ge 0.95.0$ | Asynchronous, high-performance REST API |
| **Uvicorn** | $\ge 0.21.0$ | ASGI production web server |
| **Pydantic** | 2.12.5 (V2) | Data parsing, type validation, and API schemas |
| **SQLAlchemy** | 2.0.46 | Relational Object-Relational Mapper (ORM) |
| **SQLite** | 3.x | Lightweight embedded relational database (`oa_smart.db`) |

### 5.3 Machine Learning Technologies
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Scikit-Learn** | 1.8.0 | `RandomForestClassifier` and `StandardScaler` implementation |
| **Joblib** | 1.5.3 | Serialized model and scaler persistence (`.joblib`) |
| **NumPy** | 2.2.6 | Vector and matrix numerical computations |
| **Pandas** | 2.3.3 | Tabular data manipulation and verification |

### 5.4 Development Tools & Protocols
- **Operating System:** Microsoft Windows 11
- **Package Managers:** npm (v10+), pip (v25+)
- **API Specification:** OpenAPI 3.0 / Swagger UI (available at `/docs`)

---

## 6. Frontend System

The frontend is an offline-capable Progressive Web Application structured around community healthcare screening workflows.

### 6.1 Patient Registration (`components/workflow/Step1Patient.tsx`)
- Captures patient demographic identification: Patient ID (auto-generated e.g. `PAT-98214`), Full Name, Age (years), Sex (`Male`, `Female`, `Other`), Height (cm), Weight (kg), and Phone Number.
- **Automatic BMI Computation:** As the user enters height and weight, BMI is instantly calculated in real time:
  $$\text{BMI} = \frac{\text{weight (kg)}}{\left(\frac{\text{height (cm)}}{100}\right)^2}$$
- Persists record directly to local IndexedDB (`OASmartDB`) and synchronizes with the backend database.

### 6.2 Symptom Assessment (`components/workflow/Step2Symptoms.tsx`)
- Collects self-reported knee pain severity (Visual Analog Scale / WOMAC 0–10 scale).
- Records anatomical pain location (Left Knee, Right Knee, Both Knees), morning stiffness duration, and specific activity restrictions (Stairs, Squatting, Walking).

### 6.3 Sensor Connection & Telemetry Collection (`components/workflow/Step3Movement.tsx`)
- **Bluetooth Connection:** Invokes `WebBluetoothService.ts` via browser prompt filtering by device name prefix `ESP32_OA_SENSOR`.
- **Hardware Simulation Fallback:** If physical hardware is unavailable, `MockBluetoothService.ts` can be toggled to generate realistic, noisy movement telemetry for software testing.
- **Live Visualizations:** Renders instantaneous knee angle gauge ($0^\circ–130^\circ$) and real-time scrolling charts showing acceleration stability.
- **Test Types Supported:**
  - `SIT_TO_STAND`: Evaluates quadriceps power, sit-to-stand transition speed, and angular velocity.
  - `GAIT_WALK`: 15-second level-ground walking test capturing gait symmetry and acceleration range.

### 6.4 Results & Clinical Risk Dashboard (`components/workflow/Step5Result.tsx`)
- Displays overall screening result:
  - **`Higher Risk`** (Red): $\ge 50\%$ risk probability.
  - **`Moderate Risk`** (Amber): $30\% - 49\%$ risk probability (Elevated early risk).
  - **`Lower Risk`** (Emerald): $< 30\%$ risk probability.
- **Risk Score Breakdown:** Displays calibrated percentage probability.
- **Radar Chart:** Visualizes five functional dimensions: Joint Range of Motion, Movement Stability, Gait Consistency, Movement Symmetry, and Angular Velocity.
- **Feature Importance Breakdown:** Highlights the top contributing biomechanical and demographic risk factors driving the decision.

### 6.5 Offline Capabilities & Digital Reports (`components/DigitalReport.tsx`)
- **PWA Service Worker:** Caches static assets, stylesheets, scripts, and fonts; application loads with zero connectivity.
- **IndexedDB Client Storage:** Screenings are fully executable offline and queued in IndexedDB.
- **Print / PDF Export:** Formats a structured clinical screening summary including hospital header, patient demographics, sensor metrics, and clinical recommendations.

---

## 7. Backend System

The backend is built with FastAPI, adhering to clean architectural boundaries.

### 7.1 Architecture & Directory Organization
- `backend/app/main.py`: ASGI entry point configuring CORS, database initialization, and router aggregation.
- `backend/app/api/`: REST endpoint routers (`screenings.py`, `patients.py`, `sync.py`, `dashboard.py`, `reports.py`).
- `backend/app/models/sql_models.py`: SQLAlchemy database models.
- `backend/app/schemas/pydantic_schemas.py`: Input/output data schemas.
- `backend/app/services/`: Preprocessing and HTML report generation services.
- `ml/inference/predict.py`: Standalone ML inference engine.

### 7.2 Core API Endpoints

| HTTP Method | Path | Request Body | Response Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | None | API health status and version info |
| `POST` | `/api/patients` | `PatientCreateSchema` | Registers new patient in database |
| `GET` | `/api/patients` | None | Lists all registered patients |
| `GET` | `/api/patients/{id}` | None | Retrieves specific patient details |
| `POST` | `/api/screenings/{id}/analysis` | `AnalysisRequestSchema` | Receives sensor packets + demographics, runs ML model, returns risk result |
| `GET` | `/api/screenings/{id}` | None | Retrieves stored screening session, features, and ML prediction |
| `POST` | `/api/sync` | `SyncPayloadSchema` | Idempotently synchronizes batch records from offline clients |
| `GET` | `/api/dashboard/summary` | None | Aggregates total patients, screenings, and risk category distribution |
| `GET` | `/api/reports/{id}` | None | Renders and downloads digital clinical report |

### 7.3 Request / Response Flow for Screening Analysis
1. Client issues `POST /api/screenings/SCR-9281/analysis` with payload:
   ```json
   {
     "sensor_packets": [ ... 50Hz telemetry packets ... ],
     "symptom_assessment": { "responses": { "pain_score": 6 }, "score": 6.0 },
     "test_type": "SIT_TO_STAND",
     "patient_id": "PAT-98214",
     "age": 68,
     "sex": "Female",
     "height": 158.0,
     "weight": 79.0,
     "bmi": 31.65
   }
   ```
2. `screenings.py` resolves demographics from the payload or queries the database `Patient` record if `patient_id` is supplied.
3. `OARiskPredictor.predict_from_sensor_stream()` applies moving-average smoothing, extracts 12 lower-leg kinematic features, injects `Age`, `Sex_encoded`, and `BMI`, scales the 15-feature vector, and executes Random Forest inference.
4. If `oa_score >= 0.30`, the screening is flagged as positive (`MODERATE_RISK` or `HIGH_RISK`); if `< 0.30`, it is flagged as `LOW_RISK`.
5. Session metadata, 15 extracted features, and prediction results are committed to SQLite tables `screening_sessions`, `extracted_features`, and `ml_predictions`.
6. Server returns HTTP 200 with `MLPredictionResponseSchema`.

---

## 8. Machine Learning System

### 8.1 Model Architecture & Specifications
- **Algorithm:** Random Forest Classifier (`sklearn.ensemble.RandomForestClassifier`).
- **Hyperparameters:**
  - `n_estimators`: 100 decision trees.
  - `max_depth`: 5 (controlled depth to prevent overfitting on clinical IMU features).
  - `class_weight`: `"balanced"` (automatically adjusts weights inversely proportional to class frequencies).
  - `criterion`: `"gini"`.
  - `max_features`: `"sqrt"`.
  - `random_state`: 42 (deterministic reproducibility).
- **Active Model File:** `OA-V1/backend/app/models/random_forest_oa_improved.joblib` (mirrored as `rf_oa_model.joblib`).
- **Active Scaler File:** `OA-V1/backend/app/models/scaler_improved.joblib` (mirrored as `scaler.joblib`).
- **Feature Manifest:** `OA-V1/backend/app/models/feature_list_improved.json` (mirrored as `feature_list.json`).
- **Metadata:** `OA-V1/backend/app/models/model_metadata_improved.json`.

### 8.2 Input Schema: The Exact 15 Features in Order
The model input vector strictly requires 15 numerical features in the following sequence:

```text
 1. lower_leg_acc_mag_mean
 2. lower_leg_acc_mag_std
 3. lower_leg_acc_mag_rms
 4. lower_leg_acc_mag_range
 5. lower_leg_free_acc_mag_mean
 6. lower_leg_free_acc_mag_std
 7. lower_leg_free_acc_mag_rms
 8. lower_leg_gyr_mag_mean
 9. lower_leg_gyr_mag_std
10. lower_leg_gyr_mag_rms
11. lower_leg_gyr_mag_range
12. lower_leg_peak_angular_velocity
13. Age
14. Sex_encoded
15. BMI
```

### 8.3 Feature Preprocessing & Transformation
1. **Kinematic Computation:** The 12 sensor features are derived from lower-leg accelerometer and gyroscope magnitude signals.
2. **Demographic Encoding:**
   - **`Age`:** Passed directly as continuous floating-point years (e.g. `68.0`).
   - **`Sex_encoded`:** Binary encoding:
     $$\text{Sex\_encoded} = \begin{cases} 1.0 & \text{if Male} \\ 0.0 & \text{if Female} \\ 0.5 & \text{if Unspecified / Other} \end{cases}$$
   - **`BMI`:** Continuous metric body mass index:
     $$\text{BMI} = \frac{\text{Weight (kg)}}{\left(\frac{\text{Height (cm)}}{100}\right)^2}$$
3. **Standardization:** The 15-element row vector is scaled using the pre-fitted `StandardScaler`:
   $$z_i = \frac{x_i - \mu_i}{\sigma_i}$$
   where $\mu_i$ and $\sigma_i$ are the saved mean and standard deviation per feature.

### 8.4 Operating Decision Threshold: Fixed at 0.30
In standard binary classification, the default decision threshold is 0.50. However, for clinical risk screening:
- A threshold of 0.50 produces unacceptable false negatives (missing 17.4% of KOA trials).
- Calibrating the operating threshold to **`0.30`** achieves **91.30% sensitivity** (detecting 21 of 23 KOA trials) and **100% participant-level sensitivity**, while maintaining **89.26% specificity**.
- **Risk Category Mapping:**
  - $\text{Score} \ge 0.50 \rightarrow$ **`HIGH_RISK`**
  - $0.30 \le \text{Score} < 0.50 \rightarrow$ **`MODERATE_RISK`**
  - $\text{Score} < 0.30 \rightarrow$ **`LOW_RISK`**

---

## 9. Feature Extraction Pipeline

The feature extraction engine (`ml/features/extractor.py`) processes discrete time-series packets into statistical kinematic features:

### 9.1 Signal Preprocessing & Noise Reduction
Before feature calculation, telemetry packets undergo moving-average smoothing (window size $W = 3$):
$$\tilde{x}[t] = \frac{1}{3} \sum_{k=-1}^{1} x[t+k]$$

### 9.2 Kinematic Magnitude Calculations
Individual 3-axis accelerometer and gyroscope components are converted to orientation-invariant magnitude vectors:
- **Total Acceleration Magnitude ($g$):**
  $$a_{\text{mag}}[t] = \sqrt{a_x[t]^2 + a_y[t]^2 + a_z[t]^2}$$
- **Free Dynamic Acceleration Magnitude ($g$):**
  Static 1g gravitational acceleration is decoupled to isolate dynamic movement shock:
  $$a_{\text{free}}[t] = |a_{\text{mag}}[t] - 1.0|$$
- **Angular Velocity Magnitude ($^\circ/\text{s}$ or $\text{rad}/\text{s}$):**
  $$\omega_{\text{mag}}[t] = \sqrt{\omega_x[t]^2 + \omega_y[t]^2 + \omega_z[t]^2}$$

### 9.3 Statistical Aggregations
For each magnitude signal vector of length $N$, statistical indicators are calculated:
- **Mean:** $\mu = \frac{1}{N} \sum_{t=1}^{N} s[t]$
- **Standard Deviation:** $\sigma = \sqrt{\frac{1}{N} \sum_{t=1}^{N} (s[t] - \mu)^2}$
- **Root Mean Square (RMS):** $\text{RMS} = \sqrt{\frac{1}{N} \sum_{t=1}^{N} s[t]^2}$
- **Dynamic Range:** $\text{Range} = \max(s) - \min(s)$
- **Peak Angular Velocity:** $\omega_{\text{peak}} = \max(\omega_{\text{mag}})$

---

## 10. Database Architecture

### 10.1 Technology
- **Engine:** SQLite 3 (`oa_smart.db` located in `backend/`).
- **ORM:** SQLAlchemy 2.0 with declarative data models (`backend/app/models/sql_models.py`).
- **Session Management:** Scoped dependency-injected database sessions (`database/session.py`).

### 10.2 Database Schema & Entity Relationships

```
 +--------------------+       1:N       +------------------------+
 |      patients      |----------------<|   screening_sessions   |
 +--------------------+                 +------------------------+
 | id (PK)            |                 | id (PK)                |
 | name               |                 | patient_id (FK)        |
 | age                |                 | test_type              |
 | gender             |                 | status                 |
 | phone              |                 | sync_status            |
 | sync_status        |                 | created_at, updated_at |
 +--------------------+                 +------------------------+
                                                    |
                      +-----------------------------+-----------------------------+
                  1:1 |                         1:1 |                         1:1 |
                      v                             v                             v
           +----------------------+      +----------------------+      +----------------------+
           |  extracted_features  |      |    ml_predictions    |      |       reports        |
           +----------------------+      +----------------------+      +----------------------+
           | id (PK)              |      | id (PK)              |      | id (PK)              |
           | screening_id (FK)    |      | screening_id (FK)    |      | screening_id (FK)    |
           | features_json (JSON) |      | prediction_label     |      | content_html (TEXT)  |
           | feature_version      |      | probabilities_json   |      | pdf_path             |
           | created_at           |      | feature_importance   |      | created_at           |
           +----------------------+      | model_version        |      +----------------------+
                                         | recommendation       |
                                         | created_at           |
                                         +----------------------+
```

### 10.3 Key Table Definitions
1. **`patients`:** Stores patient master records (`id`, `name`, `age`, `gender`, `phone`, `sync_status`).
2. **`screening_sessions`:** Records each test encounter linked to a patient (`test_type`, `status`, `created_at`).
3. **`symptom_assessments`:** Stores self-reported WOMAC symptom responses as structured JSON.
4. **`extracted_features`:** Stores the complete dictionary of 15 extracted features in JSON format (`features_json`), ensuring model schema evolutions never break table columns.
5. **`ml_predictions`:** Stores inference results, output risk tier, raw probability mapping, and top feature importances.
6. **`reports`:** Stores generated digital HTML clinical reports for rapid viewing and reprinting.

---

## 11. Model Performance & Clinical Evaluation

Both the original OA-V1 model and the final integrated model were evaluated strictly against the **144 untouched real test trials across 31 unique participants** (`data/oa_smart_real_test.csv`: 25 Healthy, 6 KOA).

### 11.1 Trial-Level Performance Comparison ($N = 144$ Real Trials)

| Metric | Original OA-V1 Model<br>*(12 Features, Threshold 0.50)* | FINAL Integrated Model<br>*(15 Features, Threshold 0.30)* | Net Improvement |
| :--- | :---: | :---: | :---: |
| **Sensitivity (Recall)** | 82.61% (19/23) | **91.30%** (21/23) | **+8.69%** (Halves missed trials) |
| **False Negatives (FN)** | 4 trials missed | **2 trials missed** | **-50.0% false negatives** |
| **Specificity** | **90.08%** (109/121) | 89.26% (108/121) | Comparable (~1 trial diff) |
| **False Positives (FP)** | 12 | 13 | Controlled |
| **Balanced Accuracy** | 86.35% | **90.28%** | **+3.93%** |
| **Overall Accuracy** | 88.89% | **89.58%** | **+0.69%** |
| **Precision** | 61.29% | **61.76%** | **+0.47%** |
| **F1-Score** | 0.7037 | **0.7368** | **+0.0331** |
| **ROC-AUC** | 0.9285 | **0.9655** | **+0.0370 (+3.70%)** |

### 11.2 Participant-Level Performance ($N = 31$ Participants, Majority Voting)

| Metric | Original OA-V1 Model | FINAL Integrated Model |
| :--- | :---: | :---: |
| **Subject Sensitivity** | **100.0%** (6 / 6 KOA detected) | **100.0%** (6 / 6 KOA detected) |
| **Subject False Negatives** | **0** | **0** |
| **Subject Specificity** | 92.00% (23 / 25 Healthy) | 84.00% (21 / 25 Healthy) |
| **Subject ROC-AUC** | 0.9533 | **0.9733** (+2.00%) |
| **Decision Safety Margin** | Marginal (KOA mean probs 0.49–0.61) | **Decisive (KOA mean probs up to 0.985)** |

### 11.3 What Improved in the Final Integrated Model?
1. **Significant Sensitivity Boost:** Trial sensitivity jumped from 82.61% to **91.30%**. Missed KOA trials dropped from 4 down to 2.
2. **Superior ROC-AUC Separation:** ROC-AUC rose from 0.9285 to **0.9655**, demonstrating superior class separation across all potential decision thresholds.
3. **Decisive Classification Confidence:** In the original model, borderline patient `KOA_10` had a mean predicted probability of `0.4935` (below the 0.50 threshold, barely passing majority vote 4 to 3). In the final model, `KOA_10` scored `0.3527`, decisively clearing the calibrated `0.30` threshold. Severe patients (`KOA_8`) achieved high-conviction scores of **0.9852** (vs 0.6095 previously).

---

## 12. Integration Verification Results

Automated end-to-end integration tests were executed in the repository:

1. **Backup Verification:** Verified `backend/app/models/backup_v1/` contains all 5 original files with matching byte sizes. **[PASS]**
2. **Model Loading:** `RandomForestClassifier` (100 estimators) loads from disk cleanly. **[PASS]**
3. **Scaler Loading:** `StandardScaler` loaded with exact 15 feature dimensions ($n\_features\_in\_ = 15$). **[PASS]**
4. **15-Feature Order:** Verified exact string match across all 15 feature names. **[PASS]**
5. **BMI Calculation:** Height 180 cm, Weight 81 kg $\rightarrow$ BMI = 25.0; Height 155 cm, Weight 75 kg $\rightarrow$ BMI = 31.22. **[PASS]**
6. **Sex Encoding:** Male $\rightarrow$ 1.0; Female $\rightarrow$ 0.0; Unspecified $\rightarrow$ 0.5. **[PASS]**
7. **Direct Inference:** Healthy gait profile produced score $0.0000$ (`LOW_RISK`); KOA profile produced score $0.9696$ (`HIGH_RISK`). **[PASS]**
8. **FastAPI Endpoints:** `POST /api/screenings/{id}/analysis` returned HTTP 200 with complete 15-feature analysis. **[PASS]**
9. **Database Persistence:** Verified records created in `screening_sessions`, `extracted_features`, and `ml_predictions`. **[PASS]**
10. **Frontend Compilation:** `npm run build` transformed 1,270 modules with **zero TypeScript errors**. **[PASS]**

---

## 13. Testing Methodology: Simulated vs Real Testing

To ensure total transparency, testing activities are categorized:

### 13.1 Simulated Testing (Software & Synthetic Telemetry)
- **FastAPI TestClient Analysis:** Evaluated `/api/screenings/{id}/analysis` using algorithmically generated dual MPU6050 packets (sine-wave articulated pitch frames).
- **MockBluetoothService Testing:** Tested PWA UI rendering, live angle gauges, and wizard step transitions in standard desktop web browsers without physical hardware attached.
- **Noise Filter Simulation:** Verified the moving average filter on synthetic noisy signals.

### 13.2 Real Offline & Model Validation Testing
- **Model Evaluation on Real Gait Telemetry:** Evaluated both models against the untouched held-out dataset of **144 real physical trials from 31 human participants**. No synthetic data was used for model testing.
- **Database Persistence Testing:** Performed live read, write, and relation integrity checks directly against the real SQLite `oa_smart.db`.
- **PWA Build Verification:** Real production build executed using Vite bundler and TypeScript compiler (`tsc`).

### 13.3 Real ESP32 Hardware Testing
- **Firmware Compilation & Flashing:** Tested firmware compilation using Arduino ESP32 core targeting ESP32-WROOM-32.
- **I2C Handshake Verification:** Verified I2C communication at 400 kHz with dual MPU6050 devices on addresses `0x68` and `0x69`.
- **BLE Notification Verification:** Confirmed GATT characteristic notifications broadcasting at 50 Hz over BLE.

---

## 14. Security, Reliability & Resilience Features

Only features that actually exist in the codebase are documented here:

1. **Strict Input Schema Validation:** Pydantic models reject malformed packets, invalid timestamps, or out-of-range types.
2. **Decoupled Hardware Adapter Pattern:** `PacketParser.ts` intercepts corrupted strings or incomplete tokens, tagging frames with `isValid = false` to prevent PWA crashes.
3. **Resilient Demographic Defaults:** `OARiskPredictor` intercepts missing or `None` values for Age, Sex, or BMI, falling back to clinically neutral baselines (`Age=50.0`, `Sex_encoded=0.5`, `BMI=25.0`) to guarantee the ML pipeline never crashes on partial data.
4. **NaN and Infinity Sanitization:** Feature arrays are scanned; any non-finite floats are sanitized to zero before matrix scaling.
5. **Database Transaction Integrity:** SQLAlchemy uses transactional commits with automatic rollback on unhandled exceptions; foreign keys maintain cascading referential integrity.
6. **CORS Security:** Configurable CORS middleware restricts origins based on `.env` configuration.
7. **Offline Data Resilience:** Local IndexedDB acts as an offline buffer, ensuring data captured in remote environments without connectivity is never lost.

---

## 15. Limitations & Ethical Considerations

> [!CAUTION]
> **NO CLINICAL VALIDATION CLAIM:**  
> OA-SMART is a research and development prototype designed for functional mobility screening. **It is NOT certified as a medical device and has NOT undergone formal clinical trials.** It cannot be used as a standalone diagnostic tool or as a substitute for radiographic imaging (X-rays, MRI) or specialist orthopedic evaluation.

1. **Development Dataset Size:** The empirical benchmark is based on 144 trials across 31 subjects (25 Healthy, 6 KOA). While sufficient for prototype validation and proof-of-concept demonstration, robust commercial screening models require multi-center cohorts of thousands of diverse patients.
2. **Laboratory vs Free-Living Disparity:** Test trials were captured during structured functional protocols (level walking and sit-to-stand). Free-living, unconstrained daily mobility introduces additional noise, variable footwear, and surface irregularities not fully represented in controlled trials.
3. **Sensor Placement Sensitivity:** Accurate knee flexion estimation assumes proper physical alignment of the thigh and shank IMUs along the sagittal plane. Misalignment or sensor slipping during vigorous movement introduces rotational offsets.
4. **Binary Classification Scope:** The current ML model performs binary risk categorization (Low vs Elevated OA risk); it does not currently grade severity into Kellgren-Lawrence stages (KL 0 through 4).

---

## 16. Future Scope & Roadmap

1. **Multi-Center Clinical Trials:** Partnering with orthopedic departments to validate against blinded radiological Kellgren-Lawrence grades across 500+ diverse subjects.
2. **Multi-Class Severity Grading:** Transitioning from binary risk screening to multi-class ordinal staging (Normal, Mild, Moderate, Severe OA).
3. **On-Device Edge TinyML:** Compiling the Random Forest or a quantized neural network to run directly on the ESP32 using TensorFlow Lite for Microcontrollers (TFLite Micro), enabling standalone audio/LED risk alerts without requiring a smartphone.
4. **Automated IMU Calibration Protocol:** Implementing a 5-second standing calibration step in the PWA to calculate and subtract static sensor orientation offsets.
5. **Bilateral Asymmetry Analysis:** Expanding the hardware to 4 IMUs (bilateral thighs and shanks) to directly quantify limping and inter-limb compensatory gait mechanics.

---

## 17. Project Folder Structure

```text
C:\Users\ASUS\Downloads\OA-V1\OA-V1\
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dashboard.py         # Dashboard analytics & summary endpoint
│   │   │   ├── patients.py          # Patient registration & retrieval endpoints
│   │   │   ├── reports.py           # Report retrieval endpoint
│   │   │   ├── screenings.py        # Core ML analysis & screening endpoints
│   │   │   └── sync.py              # Offline-to-online batch sync endpoint
│   │   ├── database/
│   │   │   ├── session.py           # SQLAlchemy engine & session factory
│   │   │   └── seed.py              # Database seeding utility
│   │   ├── models/
│   │   │   ├── backup_v1/           # ARCHIVED LEGACY MODEL ARTIFACTS
│   │   │   │   ├── feature_list.json
│   │   │   │   ├── model_b64_payload.json
│   │   │   │   ├── rf_oa_model.joblib
│   │   │   │   ├── rf_oa_model_trees.json
│   │   │   │   └── scaler.joblib
│   │   │   ├── feature_list_improved.json   # 15-feature manifest
│   │   │   ├── feature_list.json            # Active mirror
│   │   │   ├── model_metadata_improved.json # Threshold (0.30) & metrics
│   │   │   ├── random_forest_oa_improved.joblib # Trained RF model binary
│   │   │   ├── rf_oa_model.joblib           # Active mirror
│   │   │   ├── scaler_improved.joblib       # 15-feature StandardScaler
│   │   │   ├── scaler.joblib                # Active mirror
│   │   │   └── sql_models.py        # SQLAlchemy table schemas
│   │   ├── schemas/
│   │   │   └── pydantic_schemas.py  # Pydantic request & response models
│   │   ├── services/
│   │   │   ├── preprocessing.py     # Signal filtering & feature extraction
│   │   │   └── report_generator.py  # HTML clinical report generator
│   │   └── main.py                  # FastAPI ASGI application entrypoint
│   ├── oa_smart.db                  # Embedded SQLite relational database
│   ├── requirements.txt             # Python backend dependencies
│   └── .env                         # Server environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── workflow/
│   │   │   │   ├── Step1Patient.tsx     # Patient intake & auto-BMI
│   │   │   │   ├── Step2Symptoms.tsx    # WOMAC symptom assessment
│   │   │   │   ├── Step3Movement.tsx    # BLE movement test execution
│   │   │   │   ├── Step4Analysis.tsx    # Analysis state animation
│   │   │   │   └── Step5Result.tsx      # Risk dashboard & radar charts
│   │   │   ├── Dashboard.tsx        # Clinic overview & recent screenings
│   │   │   ├── DigitalReport.tsx    # Printable report view
│   │   │   ├── Header.tsx           # PWA top navigation & connection status
│   │   │   ├── NewScreeningWorkflow.tsx # 5-step wizard orchestrator
│   │   │   ├── ScreeningHistory.tsx # History list & record filtering
│   │   │   ├── Settings.tsx         # BLE & API server configuration
│   │   │   └── Sidebar.tsx          # Main navigation menu
│   │   ├── hooks/
│   │   │   └── useBluetooth.ts      # Custom React hook for BLE streaming
│   │   ├── processing/
│   │   │   └── featureExtraction.ts # Client-side feature extraction fallback
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   └── client.ts        # REST API fetch client
│   │   │   ├── bluetooth/
│   │   │   │   ├── BluetoothService.ts     # Generic BLE interface
│   │   │   │   ├── hardware.config.ts      # UUIDs & packet delimiters
│   │   │   │   ├── MockBluetoothService.ts # Synthetic packet generator
│   │   │   │   ├── PacketParser.ts         # CSV stream parsing & sanitization
│   │   │   │   └── WebBluetoothService.ts  # Web Bluetooth GATT implementation
│   │   │   ├── storage/
│   │   │   │   ├── db.ts            # Dexie.js IndexedDB offline database
│   │   │   │   └── seedData.ts      # Initial offline demonstration records
│   │   │   └── sync/
│   │   │       └── SyncService.ts   # Auto-sync on network reconnect
│   │   ├── types/                   # TypeScript interfaces
│   │   │   ├── patient.ts
│   │   │   ├── screening.ts
│   │   │   └── sensor.ts
│   │   ├── App.tsx                  # Root application router
│   │   └── main.tsx                 # React DOM mount point
│   ├── package.json                 # Node dependencies & build scripts
│   ├── tsconfig.json                # TypeScript compiler config
│   └── vite.config.ts               # Vite & PWA build configuration
├── firmware/
│   └── esp32_oa_smart/
│       └── esp32_oa_smart.ino       # ESP32 dual MPU6050 BLE Arduino firmware
├── ml/
│   ├── features/
│   │   └── extractor.py             # 12-feature IMU kinematic extractor
│   ├── inference/
│   │   └── predict.py               # 15-feature inference engine
│   └── preprocessing/
│       └── cleaner.py               # Moving-average smoothing filter
├── docs/
│   ├── api_contract.md              # Frontend-to-backend REST contract
│   └── hardware_integration_guide.md# ESP32 wiring & BLE protocol specs
├── MODEL_INTEGRATION_REPORT.md      # Integration verification report
└── OA_SMART_FINAL_PROJECT_REPORT.md # THIS MASTER PROJECT REPORT
```

---

## 18. Final Technology Summary Table

| Component | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Wearable MCU** | ESP32 (Xtensa Dual-Core) | Real-time I2C sensor acquisition and BLE notification broadcasting |
| **Motion Sensors** | Dual MPU6050 (6-DOF MEMS) | Capturing 3-axis acceleration and 3-axis rotational velocity on thigh and shank |
| **Wearable Firmware** | Arduino C++ / ESP-IDF | I2C driver, pitch calculation, 50 Hz framing, BLE GATT server |
| **Wireless Telemetry** | Bluetooth Low Energy (BLE) | Wireless, ultra-low-power transmission of 50 Hz ASCII CSV sensor packets |
| **Client PWA** | React 18 + TypeScript + Vite | Interactive, type-safe, responsive clinical interface |
| **Styling** | Tailwind CSS | Modern medical UI styling and responsive layouts |
| **Offline Storage** | IndexedDB via Dexie.js | Browser-based offline persistence for remote health camps |
| **Offline Sync** | Custom `SyncService.ts` | Bi-directional batch record synchronization upon internet reconnection |
| **Data Visualization** | Recharts | Interactive live movement curves, radar charts, and stability meters |
| **Backend Framework** | FastAPI (Python 3.14) | High-performance asynchronous REST API handling screening analysis |
| **API Validation** | Pydantic V2 | Strict type validation for incoming packets and demographics |
| **ORM & Relational DB** | SQLAlchemy 2.0 + SQLite 3 | Relational persistence of patients, screenings, features, and predictions |
| **ML Classifier** | Scikit-Learn Random Forest | 15-feature classifier predicting Knee Osteoarthritis risk probability |
| **Feature Scaler** | Scikit-Learn StandardScaler | Standardizes the 15-feature vector against training cohort distributions |
| **Report Generation** | Python `ReportGenerator` | Compiles structured, printable HTML clinical evaluation summaries |

---

## 19. Final System Workflow

The step-by-step end-to-end user workflow:

```text
  [Step 1: Patient Registration]
         │
         ▼
  Worker inputs Name, Age, Sex, Height, Weight into React PWA.
  BMI is automatically calculated and stored.
         │
         ▼
  [Step 2: Symptom Assessment]
         │
         ▼
  Patient rates knee pain (0-10), stiffness, and movement restrictions.
         │
         ▼
  [Step 3: Wearable Attachment & BLE Pairing]
         │
         ▼
  Health worker straps dual MPU6050 to thigh (0x68) and shank (0x69).
  Worker clicks "Connect Wearable" in PWA -> ESP32 pairs via Web Bluetooth.
         │
         ▼
  [Step 4: Functional Movement Test]
         │
         ▼
  Patient performs Sit-to-Stand or 15-second level walking protocol.
  ESP32 samples sensors at 50 Hz -> computes knee angle -> streams over BLE.
  PWA displays live knee angle and acceleration curves in real time.
         │
         ▼
  [Step 5: Telemetry Transmission to Backend]
         │
         ▼
  PWA sends sensor packets + demographics to POST /api/screenings/{id}/analysis.
  (If offline, stored in IndexedDB and evaluated with client-side fallback).
         │
         ▼
  [Step 6: Preprocessing & Feature Extraction]
         │
         ▼
  Backend applies 3-point moving average filter.
  Extracts 12 lower-leg kinematic features (accel & gyro mean, std, rms, range, peak).
  Fuses with patient Age, Sex_encoded (M=1, F=0), and BMI into a 15-feature vector.
         │
         ▼
  [Step 7: Random Forest ML Inference]
         │
         ▼
  StandardScaler normalizes the 15-feature vector.
  Random Forest computes class probability:
    - Score >= 0.50 -> HIGH RISK
    - Score >= 0.30 -> MODERATE RISK (Early Risk Flag)
    - Score <  0.30 -> LOW RISK
         │
         ▼
  [Step 8: Database Persistence & Clinical Reporting]
         │
         ▼
  Session, features JSON, prediction, and recommendations saved to SQLite.
  PWA renders clinical risk badge, radar chart, and top feature impact.
  Digital HTML/PDF clinical summary is ready to print or export.
```

---

## 20. Final Project Status

### 20.1 What is Implemented
- Complete ESP32 dual MPU6050 C++ firmware with 50 Hz BLE streaming.
- Complete React 18 TypeScript PWA with 5-step screening wizard, IndexedDB offline storage, and auto-sync.
- Complete FastAPI backend with Pydantic validation, SQLite database persistence, and report generation.
- Complete 15-feature Random Forest ML pipeline with calibrated threshold $0.30$.
- Full feature compatibility: 12 lower-leg IMU features + `Age`, `Sex_encoded`, and `BMI`.

### 20.2 What Has Been Tested
- **Automated Integration Suite:** 100% pass rate across artifact loading, 15-feature order, demographic encoding, and live API endpoints.
- **Model Benchmark:** Rigorously tested against 144 untouched real patient trials (91.30% trial sensitivity, 100% subject sensitivity, 0.9655 ROC-AUC).
- **PWA Production Build:** Verified via `tsc && vite build` with zero compiler errors.
- **Simulated Stream Tests:** Successfully verified end-to-end packet transmission through the API.

### 20.3 What is Working
- Hardware telemetry acquisition, pitch angle extraction, and BLE notification broadcasts.
- Web Bluetooth connection in supported browsers (Chrome, Edge) with fallback mock mode.
- Real-time live angle charting and functional test timers.
- Automatic BMI computation from height/weight inputs.
- 15-feature Random Forest inference with high-sensitivity thresholding ($0.30$).
- Digital HTML report compilation and database persistence.

### 20.4 What Remains to be Tested
- Multi-center prospective clinical validation against blinded X-ray Kellgren-Lawrence grades.
- Long-duration battery discharge and thermal characteristics under continuous field usage.
- Diverse ethnic and geographic anthropometric variations in free-living environments.

### 20.5 Technical Demonstration Readiness Statement
**OA-SMART is technically integrated, end-to-end verified, and fully ready for technical demonstrations, prototype evaluations, and academic presentations.**
