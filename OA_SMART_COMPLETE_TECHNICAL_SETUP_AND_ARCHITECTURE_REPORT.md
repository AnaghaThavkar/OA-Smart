# OA-SMART Complete Technical Setup & Architecture Report

**Project Title**: OA-SMART (Portable AI-Assisted Osteoarthritis Risk Screening System)  
**Smart India Hackathon (SIH) 2026**  
**Document Version**: 2.0.0  
**Date**: September 16, 2026  

---

## PART 1 — PROJECT OVERVIEW

### 1.1 Project Purpose
OA-SMART is a portable, community-focused decision support system designed for Primary Health Center (PHC) staff and community health workers. It enables early screening of Osteoarthritis (OA) risk by combining patient demographics, self-reported VAS pain scores, mobility assessments, real-time kinetic telemetry from wearable IMU sensors, and a pre-trained Random Forest machine learning model.

### 1.2 Core Workflow
```
[01 Patient Information] 
       ↓ (Name, Age, Sex, Height, Weight, Auto-BMI)
[02 Symptom Assessment] 
       ↓ (VAS Pain 0-10, Location, Mobility difficulty, Affected activities)
[03 Movement Assessment] 
       ↓ (15s MPU6050 Telemetry Stream via 50Hz BLE GATT or Test Simulator)
[04 Assessment Processing] 
       ↓ (Data cleaning → 12-Feature Extraction → StandardScaler transform)
[05 Screening Result & Report] 
       ↓ (RandomForest predict_proba() class-1 score → OA-Associated Risk & Printable Report)
```

### 1.3 Implementation Status Summary

| System Component | Status | Details |
|---|---|---|
| **5-Step Guided PWA UI** | **IMPLEMENTED** | Built with React, Vite, TypeScript, and Tailwind CSS. |
| **Web Bluetooth BLE Client** | **IMPLEMENTED** | Connects to `ESP32_OA_SENSOR` via Web Bluetooth API. |
| **Test Mode Simulator** | **IMPLEMENTED** | Built-in realistic 50Hz IMU simulator for offline testing. |
| **IndexedDB Offline Storage** | **IMPLEMENTED** | `LocalDB` in browser stores patient records & screenings. |
| **FastAPI Backend Server** | **IMPLEMENTED** | Python 3.14 backend handling API routing, SQLite DB, and ML. |
| **SQLite Database** | **IMPLEMENTED** | `backend/oa_smart.db` persists session logs, features, and predictions. |
| **Random Forest Inference** | **IMPLEMENTED** | `OARiskPredictor` loads `rf_oa_model.joblib`, `scaler.joblib`, `feature_list.json`. |
| **Dual MPU6050 Firmware** | **IMPLEMENTED** | ESP32 Arduino C++ firmware broadcasting 14-field CSV telemetry at 50Hz. |
| **PostgreSQL Docker Setup** | **PARTIALLY IMPLEMENTED** | `docker-compose.yml` configured for production PostgreSQL deployment. |
| **OAuth2 / Cloud Multi-Tenant**| **PLANNED** | Multi-clinic cloud synchronization planned for future release. |

---

## PART 2 — COMPLETE TECHNOLOGY STACK

### 2.1 Frontend Stack

| Technology | Version | Purpose in OA-SMART | Why Used | Dependencies |
|---|---|---|---|---|
| **React** | `18.2.0` | UI component rendering framework. | Component reusability & fast DOM reconciliation. | Entire UI (`src/components/*`) |
| **Vite** | `4.5.14` | Frontend build tool & HMR dev server. | Sub-second dev server startup and optimized bundle production. | `package.json` scripts (`dev`, `build`) |
| **TypeScript** | `5.9.3` | Static typing language. | Type safety across sensor packets, patient profiles, and API schemas. | All `.ts` and `.tsx` source files |
| **Tailwind CSS** | `3.3.3` | Utility-first CSS framework. | Rapid, consistent, healthcare-focused UI styling. | `tailwind.config.js`, `src/index.css` |
| **Lucide React** | `0.263.1` | Icon library. | Accessible visual iconography for buttons and cards. | UI components |
| **Web Bluetooth API** | Native Browser | BLE GATT communication. | Connects browser directly to ESP32 without native mobile wrappers. | `WebBluetoothService.ts` |
| **IndexedDB (`LocalDB`)**| Native Browser | Client-side persistent database. | Enables 100% offline data collection in rural PHCs. | `src/services/storage/db.ts` |
| **Vite PWA Plugin** | `0.16.7` | Service worker & PWA manifest generator. | Makes app installable on Android/Windows with offline caching. | `vite.config.ts`, `manifest.webmanifest` |

### 2.2 Backend Stack

| Technology | Version | Purpose in OA-SMART | Why Used | Dependencies |
|---|---|---|---|---|
| **Python** | `3.14` / `3.10+` | Backend runtime language. | High performance and seamless integration with ML libraries. | Entire backend & ML engine |
| **FastAPI** | `0.141.1` | REST API web framework. | Asynchronous, automatic OpenAPI/Swagger docs, high throughput. | `backend/app/main.py` |
| **Uvicorn** | `0.53.0` | ASGI server implementation. | Fast asynchronous server hosting FastAPI app. | Main entry startup script |
| **SQLAlchemy** | `2.0.53` | Object-Relational Mapper (ORM). | Database abstraction for SQLite and PostgreSQL. | `backend/app/models/sql_models.py` |
| **SQLite** | `3.x` | Embedded relational database. | Zero-configuration local database (`backend/oa_smart.db`). | `backend/app/database/session.py` |
| **Pydantic** | `2.13.5` | Data validation library. | Enforces strict API request/response JSON schemas. | `backend/app/schemas/pydantic_schemas.py` |

### 2.3 Machine Learning Stack

| Technology | Version | Purpose in OA-SMART | Why Used | Dependencies |
|---|---|---|---|---|
| **NumPy** | `2.4.6` | Vectorized numerical processing. | Fast matrix math for signal RMS, magnitudes, and vector operations. | `extractor.py`, `predict.py` |
| **Pandas** | `3.0.3` | Dataframe manipulation. | Structuring feature matrices for ML model input. | `predict.py` |
| **Scikit-Learn** | `1.9.0` | ML model & preprocessing execution. | Hosts `RandomForestClassifier` and `StandardScaler`. | `predict.py` |
| **Joblib** | `1.5.3` | Model serialization / deserialization. | Fast loading of trained binary artifacts (`.joblib`). | `OARiskPredictor` |
| **StandardScaler** | `scaler.joblib` | Pre-trained feature scaling object. | Normalizes 12 lower-leg magnitude features before inference. | `predict.py` |
| **RandomForestClassifier**| `rf_oa_model.joblib` | Trained 2-class OA risk classifier. | Robust ensemble classification based on IMU kinetic features. | `predict.py` |

### 2.4 Hardware & Firmware Stack

| Technology | Specification | Purpose in OA-SMART | Why Used |
|---|---|---|---|
| **ESP32 NodeMCU** | Tensilica Xtensa 32-bit | Central wearable microcontroller. | Integrated Bluetooth Low Energy (BLE) and Dual I2C hardware buses. |
| **MPU6050 IMU** | 6-DOF Accelerometer + Gyroscope | Kinetic movement telemetry capture. | Low-cost, high-precision motion tracking on thigh and lower leg. |
| **I2C Bus** | GPIO 21 (SDA), GPIO 22 (SCL) | Dual sensor communication. | Connects Thigh MPU (`0x68`) and Lower-Leg MPU (`0x69`) on shared bus. |
| **BLE GATT** | Service: `4fafc201...`, Char: `beb5483e...` | Telemetry broad-caster. | Wireless streaming of 50Hz CSV telemetry packets to PWA. |
| **Arduino C++** | ESP32 Core v2.0+ | Firmware development language. | Hardware interrupt and BLE library efficiency. |

---

## PART 3 — COMPLETE SYSTEM ARCHITECTURE

```
+-----------------------------------------------------------------------------------+
|                                 HARDWARE WEARABLE NODE                            |
|                                                                                   |
|   Thigh MPU6050 (0x68)    +   Lower-Leg MPU6050 (0x69)   [I2C: GPIO 21/22]         |
|                                       │                                           |
|                                       ▼                                           |
|                     ESP32 Microcontroller (50Hz Telemetry Loop)                   |
|                                       │                                           |
|                                       ▼  BLE GATT Notifications                   |
|                      CSV Packet: timestamp, thigh_ax..gz, lower_ax..gz, knee_angle|
+---------------------------------------│-------------------------------------------+
                                        │
                                        │ Wireless BLE Stream
                                        ▼
+-----------------------------------------------------------------------------------+
|                                FRONTEND PWA (React + Vite)                        |
|                                                                                   |
|  [Step 3 Movement] ──► WebBluetoothService.ts ──► PacketParser.ts (CSV to JSON)   |
|                                                                                   |
|  [IndexedDB (LocalDB)] ◄── Save Offline Patients & Screenings                     |
+---------------------------------------│-------------------------------------------+
                                        │
                                        │ HTTP POST /api/screenings/{id}/analysis
                                        ▼
+-----------------------------------------------------------------------------------+
|                             FASTAPI BACKEND & ML ENGINE                           |
|                                                                                   |
|  FastAPI Router (/api/screenings)                                                 |
|          │                                                                        |
|          ▼                                                                        |
|  OARiskPredictor (ml/inference/predict.py)                                        |
|          │                                                                        |
|          ├─► 1. Preprocessing Cleaner (Moving average window = 3)                 |
|          ├─► 2. Feature Extractor (Calculates 12 Lower-Leg Magnitude Features)   |
|          ├─► 3. Feature Ordering (feature_list.json)                              |
|          ├─► 4. StandardScaler (scaler.joblib.transform())                       |
|          └─► 5. RandomForestClassifier (rf_oa_model.joblib.predict_proba())        |
|                                       │                                           |
|                                       ▼                                           |
|  Save Session, Features, & Prediction to SQLite (backend/oa_smart.db)              |
+---------------------------------------│-------------------------------------------+
                                        │
                                        │ JSON Response (oa_score, prediction, probabilities)
                                        ▼
+-----------------------------------------------------------------------------------+
|                             FRONTEND RESULT & REPORT                              |
|                                                                                   |
|  [Step 5 Result] ──► "OA-Associated Screening Risk" & Recommended Action           |
|  [Digital Report] ──► Printable Official Screening Summary (window.print())       |
+-----------------------------------------------------------------------------------+
```

---

## PART 4 — FOLDER / FILE STRUCTURE

```
c:/Users/HP/Downloads/oa-smart/
├── .env.example                         # Environment configuration template
├── README.md                            # High-level project summary
├── docker-compose.yml                   # Production container orchestration
├── OA_SMART_COMPLETE_TECHNICAL_SETUP_AND_ARCHITECTURE_REPORT.md  # Complete technical doc
├── OA_SMART_QUICK_START.md              # One-page quick start guide
│
├── frontend/                            # React + Vite PWA Application
│   ├── index.html                       # HTML entry point
│   ├── package.json                     # Frontend dependencies & scripts
│   ├── tailwind.config.js               # Theme colors & shadow definitions
│   ├── tsconfig.json                    # TypeScript compiler config
│   ├── vite.config.ts                   # Vite bundler & PWA plugin config
│   ├── public/
│   │   ├── favicon.ico
│   │   └── manifest.json                # PWA installation manifest
│   └── src/
│       ├── main.tsx                     # React root DOM mount
│       ├── App.tsx                      # Central view coordinator & navigation
│       ├── index.css                    # Healthcare CSS & print utilities
│       ├── vite-env.d.ts                # Vite client type references
│       ├── types/                       # TypeScript interfaces
│       │   ├── patient.ts
│       │   ├── screening.ts
│       │   └── sensor.ts
│       ├── services/
│       │   ├── api/client.ts            # FastAPI client & HTTP methods
│       │   ├── bluetooth/
│       │   │   ├── BluetoothService.ts  # Generic interface & status types
│       │   │   ├── WebBluetoothService.ts # Real Web Bluetooth BLE GATT client
│       │   │   ├── MockBluetoothService.ts# Hardware 50Hz simulator
│       │   │   ├── PacketParser.ts      # CSV telemetry parsing & validation
│       │   │   └── hardware.config.ts   # UUIDs & BLE device name filter
│       │   ├── storage/
│       │   │   ├── db.ts                # Native IndexedDB LocalDB wrapper
│       │   │   └── seedData.ts          # Offline seed population
│       │   └── sync/SyncService.ts      # Background offline sync queue
│       ├── processing/featureExtraction.ts # Client fallback feature calculation
│       └── components/                  # UI Components
│           ├── Sidebar.tsx              # Main navigation drawer
│           ├── Header.tsx               # Status badge (Online/Offline, Synced)
│           ├── Dashboard.tsx            # Community screening activity summary
│           ├── NewScreeningWorkflow.tsx # 5-Step guided progress manager
│           ├── ScreeningHistory.tsx     # Searchable screening repository
│           ├── DigitalReport.tsx        # Printable clinical screening report
│           ├── Settings.tsx             # Server URL & BLE hardware controls
│           └── workflow/
│               ├── Step1Patient.tsx     # 01 Patient info & BMI
│               ├── Step2Symptoms.tsx    # 02 VAS Pain slider & mobility cards
│               ├── Step3Movement.tsx    # 03 Telemetry capture & 15s timer
│               ├── Step4Analysis.tsx    # 04 Processing checklist animation
│               └── Step5Result.tsx      # 05 OA-Associated Risk result card
│
├── backend/                             # FastAPI Server & ML Hosting
│   ├── oa_smart.db                      # SQLite local database file
│   ├── requirements.txt                 # Python dependencies
│   └── app/
│       ├── main.py                      # FastAPI app initialization & CORS
│       ├── api/                         # REST API Route Endpoints
│       │   ├── patients.py              # Patient CRUD endpoints
│       │   ├── screenings.py            # Analysis execution endpoint
│       │   ├── dashboard.py             # Overview metrics endpoint
│       │   ├── sync.py                  # Idempotent offline data sync endpoint
│       │   └── reports.py               # Dynamic HTML report rendering
│       ├── models/                      # SQL Models & Trained Model Artifacts
│       │   ├── sql_models.py            # SQLAlchemy database tables
│       │   ├── rf_oa_model.joblib       # Trained RandomForest model binary
│       │   ├── scaler.joblib            # Trained StandardScaler binary
│       │   └── feature_list.json        # 12 exact feature order configuration
│       ├── schemas/pydantic_schemas.py  # Request/Response Pydantic schemas
│       ├── database/
│       │   ├── session.py               # SQLite database session engine
│       │   └── seed.py                  # Initial demo data seeder
│       └── services/
│           ├── preprocessing.py         # Signal cleaner wrapper
│           └── report_generator.py      # HTML template renderer
│
├── ml/                                  # Machine Learning Pipeline Source
│   ├── features/extractor.py            # 12 lower-leg magnitude feature extractor
│   ├── inference/predict.py             # OARiskPredictor inference engine
│   ├── preprocessing/cleaner.py         # Telemetry noise cleaner
│   ├── training/train_rf.py             # Model training script
│   └── evaluation/evaluate.py           # Model evaluation script
│
├── firmware/                            # ESP32 Wearable Hardware Firmware
│   └── esp32_oa_smart/
│       └── esp32_oa_smart.ino           # Arduino C++ Dual MPU6050 BLE firmware
│
└── reports/
    └── FRONTEND_INTEGRATION_REPORT.md   # Integration verification report
```

---

## PART 5 — FRESH LAPTOP SETUP

Follow these instructions to set up the entire project on a fresh Windows laptop:

### 5.1 Prerequisites Installation

1. **Install Git**:
   - Download Git for Windows from [git-scm.com](https://git-scm.com/).
   - Verification command in terminal:
     ```powershell
     git --version
     ```

2. **Install Node.js (v18 or v20 LTS recommended)**:
   - Download Node.js installer from [nodejs.org](https://nodejs.org/).
   - Verification commands:
     ```powershell
     node -v
     npm -v
     ```

3. **Install Python (v3.10 to v3.14 recommended)**:
   - Download Python installer from [python.org](https://python.org/).
   - **IMPORTANT**: Check the box **"Add Python to PATH"** during installation.
   - Verification commands:
     ```powershell
     py --version
     py -m pip --version
     ```

4. **Install Arduino IDE (v2.0+ recommended)**:
   - Download from [arduino.cc](https://www.arduino.cc/en/software).
   - Go to **File** → **Preferences** → **Additional Boards Manager URLs** and add:
     `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Open **Tools** → **Board** → **Boards Manager**, search `esp32`, and click **Install**.

---

### 5.2 Project Repository Setup

```powershell
# 1. Open Terminal and navigate to your project directory
cd C:\Users\HP\Downloads\oa-smart

# 2. Verify folder structure
dir
```

---

### 5.3 Backend Setup & Dependencies

```powershell
# Navigate to project root
cd C:\Users\HP\Downloads\oa-smart

# Install Python requirements globally or in environment
py -m pip install -r backend/requirements.txt

# Initialize and seed the SQLite database
py backend/app/database/seed.py
```

*Expected output*: `[Backend Seed] Database successfully seeded.`

---

### 5.4 Frontend Setup & Dependencies

```powershell
# Navigate to frontend directory
cd C:\Users\HP\Downloads\oa-smart\frontend

# Install node modules
npm install

# Test building the production bundle
npm run build
```

*Expected output*: `✓ built in X.XXs`

---

### 5.5 ESP32 Firmware Setup

1. Open **Arduino IDE**.
2. Open file: `C:\Users\HP\Downloads\oa-smart\firmware\esp32_oa_smart\esp32_oa_smart.ino`.
3. Select Board: **Tools** → **Board** → **ESP32 Arduino** → **DOIT ESP32 DEVKIT V1** (or ESP32 Dev Module).
4. Connect ESP32 via Micro-USB / USB-C cable.
5. Select Port: **Tools** → **Port** → **COMx** (e.g. `COM3` or `COM4`).
6. Click **Upload** (Right Arrow button).
7. Open **Serial Monitor** (**Ctrl + Shift + M**), set Baud Rate to **115200 baud**.
8. Confirm startup log:
   ```
   [OA-SMART] Initializing Hardware Wearable Node...
   [OK] Thigh MPU6050 Initialized (0x68)
   [OK] Lower Leg MPU6050 Initialized (0x69)
   [BLE] Advertising Started. Waiting for OA-SMART PWA connection...
   ```

---

## PART 6 — HOW TO START THE COMPLETE SYSTEM

Execute the startup sequence in the following order:

### Step 1: Power ON ESP32 Hardware
Connect your ESP32 board to USB power. Verify the red power LED is lit and Serial Monitor prints `[BLE] Advertising Started...`.

### Step 2: Start Backend Server (Terminal 1)
Open VS Code Terminal 1 in `C:\Users\HP\Downloads\oa-smart` and run:

```powershell
py -m uvicorn backend.app.main:app --port 8000
```
*Expected log*: `INFO: Uvicorn running on http://127.0.0.1:8000`

### Step 3: Start Frontend Dev Server (Terminal 2)
Open VS Code Terminal 2 in `C:\Users\HP\Downloads\oa-smart\frontend` and run:

```powershell
cd frontend
npm run dev -- --host
```
*Expected log*: `➜ Local: http://localhost:5173/`

### Step 4: Open Browser & Perform Screening
1. Open Google Chrome or Microsoft Edge and go to **`http://localhost:5173/`**.
2. Click **"Start New Screening"**.
3. Complete Step 1 (Patient Info) → click **"Continue"**.
4. Complete Step 2 (Symptoms) → click **"Continue to Movement Assessment"**.
5. On **Step 3 (Movement Assessment)**:
   - Click the **Hardware Mode** toggle button once to switch from `Test Sensor Mode` to **`ESP32 Connected`**.
   - Click **`Start Recording`**.
   - Select **`ESP32_OA_SENSOR`** in the Chrome Bluetooth pairing popup and click **Pair**.
   - Watch the 15-second timer countdown and live packet counter.
6. Click **"Analyse Screening"** → View the **"OA-Associated Screening Risk"** score on Step 5.
7. Click **"View Full Report"** → Click **"Print Report"** to test printable output.

---

## PART 7 — FRONTEND DOCUMENTATION

- **Main Router Controller**: `frontend/src/App.tsx` manages `activeView` state (`dashboard`, `new-screening`, `screening-history`, `digital-report`, `settings`).
- **5-Step Workflow Coordinator**: `frontend/src/components/NewScreeningWorkflow.tsx` controls linear progress from Step 1 to Step 5.
- **Key Workflow Components**:
  - [Step1Patient.tsx](file:///c:/Users/HP/Downloads/oa-smart/frontend/src/components/workflow/Step1Patient.tsx): Patient registration, height/weight inputs, and auto-calculated BMI.
  - [Step2Symptoms.tsx](file:///c:/Users/HP/Downloads/oa-smart/frontend/src/components/workflow/Step2Symptoms.tsx): VAS Pain scale (0-10), location selector, mobility cards, affected activities.
  - [Step3Movement.tsx](file:///c:/Users/HP/Downloads/oa-smart/frontend/src/components/workflow/Step3Movement.tsx): Sensor status cards, Hardware vs Simulator mode toggle, 15s timer countdown.
  - [Step4Analysis.tsx](file:///c:/Users/HP/Downloads/oa-smart/frontend/src/components/workflow/Step4Analysis.tsx): Clean progress checklist animation.
  - [Step5Result.tsx](file:///c:/Users/HP/Downloads/oa-smart/frontend/src/components/workflow/Step5Result.tsx): "OA-Associated Screening Risk" card, "Recommended Next Step" card, mandatory disclaimer, and expandable "Technical Details" accordion.
- **Bluetooth Services**:
  - `WebBluetoothService.ts`: Native Web Bluetooth API client requesting device `ESP32_OA_SENSOR` and subscribing to GATT notifications on characteristic `beb5483e-36e1-4688-b7f5-ea07361b26a8`.
  - `MockBluetoothService.ts`: Built-in simulator emitting realistic 50Hz telemetry packets for offline testing.
  - `PacketParser.ts`: Parses 14-field CSV string telemetry packets into typed `SensorPacket` JSON objects.
- **Offline Storage & Sync**:
  - `db.ts`: Native IndexedDB wrapper (`LocalDB`) persisting patient profiles and screening records.
  - `SyncService.ts`: Auto-sync queue listening to browser `online` events to push local data to `POST /api/sync`.

---

## PART 8 — BACKEND DOCUMENTATION

FastAPI application entry point is located at `backend/app/main.py`.

### 8.1 API Endpoints Specification

#### 1. Screening ML Analysis
- **Method**: `POST`
- **Path**: `/api/screenings/{screening_id}/analysis`
- **Purpose**: Accepts 15-second IMU telemetry stream, cleans signal, extracts 12 lower-leg magnitude features, applies `scaler.transform()`, executes `rf_oa_model.joblib.predict_proba()`, saves results to database, and returns screening risk score.
- **Input**: `AnalysisRequestSchema` JSON (`{ sensor_packets: [...], symptom_assessment: {...}, test_type: "SIT_TO_STAND" }`)
- **Output**: `MLPredictionResponseSchema` JSON (`{ screening_id, prediction, probabilities, oa_score, features, feature_importance, recommendation, analysis_status }`)
- **Used by**: `Step3Movement.tsx` / `NewScreeningWorkflow.tsx`

#### 2. Patient Registration
- **Method**: `POST`
- **Path**: `/api/patients`
- **Purpose**: Creates a new patient demographic record in SQLite DB.
- **Input**: `{ id, name, age, gender, phone }`
- **Output**: Created `PatientResponseSchema`
- **Used by**: `Step1Patient.tsx`

#### 3. Dashboard Summary Metrics
- **Method**: `GET`
- **Path**: `/api/dashboard/summary`
- **Purpose**: Fetches total patient count, total screenings count, risk level distribution breakdown, and recent patient list.
- **Output**: `{ total_patients, total_screenings, pending_sync, device_status, risk_distribution, recent_patients }`
- **Used by**: `Dashboard.tsx`

#### 4. Idempotent Offline Sync
- **Method**: `POST`
- **Path**: `/api/sync`
- **Purpose**: Accepts array of offline patients and screenings created in browser IndexedDB and inserts non-duplicate records into SQLite DB.
- **Input**: `{ patients: [...], screenings: [...] }`
- **Output**: `{ synced_count, failed_count, status: "SUCCESS" }`
- **Used by**: `SyncService.ts` / `Settings.tsx`

#### 5. HTML Clinical Report Rendering
- **Method**: `GET`
- **Path**: `/api/reports/{screening_id}`
- **Purpose**: Generates standalone dynamic HTML report for a screening session.
- **Output**: `HTMLResponse` document
- **Used by**: External clinical export / web report view

---

## PART 9 — DATABASE

### 9.1 Database Architecture Comparison

| Feature | Frontend IndexedDB (`LocalDB`) | Backend SQLite (`oa_smart.db`) |
|---|---|---|
| **Location** | Browser local storage (`OASmartDB`) | Backend disk file (`backend/oa_smart.db`) |
| **Purpose** | 100% offline field availability | Central repository & ML session logging |
| **Tables / Stores** | `patients`, `screenings` | `patients`, `screening_sessions`, `extracted_features`, `ml_predictions` |
| **Reset Command** | Clear browser site storage | Delete `oa_smart.db` and run `py backend/app/database/seed.py` |

### 9.2 SQLAlchemy Database Models (`backend/app/models/sql_models.py`)
- `Patient`: `id`, `name`, `age`, `gender`, `phone`, `sync_status`, `created_at`.
- `ScreeningSession`: `id`, `patient_id`, `test_type`, `status`, `sync_status`, `created_at`.
- `ExtractedFeatures`: `id`, `screening_id`, `features_json`, `feature_version`, `created_at`.
- `MLPrediction`: `id`, `screening_id`, `prediction_label`, `probabilities_json`, `feature_importance_json`, `model_version`, `recommendation`, `created_at`.

---

## PART 10 — ML MODEL & INFERENCE PIPELINE

### 10.1 Model Specifications
- **Model File**: `backend/app/models/rf_oa_model.joblib`
- **Scaler File**: `backend/app/models/scaler.joblib`
- **Feature Order Configuration**: `backend/app/models/feature_list.json`
- **Model Type**: `RandomForestClassifier` (Scikit-Learn)
- **Classes**: `[0, 1]` (0 = Low Risk, 1 = OA-Associated Risk)
- **Scaler Type**: `StandardScaler` (`n_features_in_ = 12`)

### 10.2 Exact 12 Input Features (In Order)
1. `lower_leg_acc_mag_mean`
2. `lower_leg_acc_mag_std`
3. `lower_leg_acc_mag_rms`
4. `lower_leg_acc_mag_range`
5. `lower_leg_free_acc_mag_mean`
6. `lower_leg_free_acc_mag_std`
7. `lower_leg_free_acc_mag_rms`
8. `lower_leg_gyr_mag_mean`
9. `lower_leg_gyr_mag_std`
10. `lower_leg_gyr_mag_rms`
11. `lower_leg_gyr_mag_range`
12. `lower_leg_peak_angular_velocity`

### 10.3 Real Inference Pipeline Execution
```python
# 1. Feature Extraction (ml/features/extractor.py)
features = FeatureExtractor.extract_features(cleaned_packets)

# 2. Feature Vector Ordering (ml/inference/predict.py)
raw_vector = [features.get(col, 0.0) for col in self.feature_names]
X_raw = np.array([raw_vector], dtype=float)

# 3. Scaler Transform (StandardScaler)
X_scaled = self.scaler.transform(X_raw)

# 4. RandomForest predict_proba()
prob_arr = self.model.predict_proba(X_scaled)[0]
oa_score = float(prob_arr[1])  # Class-1 probability

# 5. Risk Categorization
if oa_score >= 0.60:
    prediction_label = "HIGH_RISK"
elif oa_score >= 0.35:
    prediction_label = "MODERATE_RISK"
else:
    prediction_label = "LOW_RISK"
```

---

## PART 11 — HARDWARE & BLE FIRMWARE

- **Firmware Path**: `firmware/esp32_oa_smart/esp32_oa_smart.ino`
- **Microcontroller**: ESP32 NodeMCU
- **Sensors**: Thigh MPU6050 (I2C `0x68`), Lower-Leg MPU6050 (I2C `0x69`)
- **Pins**: SDA -> GPIO 21, SCL -> GPIO 22
- **BLE Device Name**: `ESP32_OA_SENSOR`
- **BLE Service UUID**: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- **BLE Characteristic UUID**: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- **Sampling Frequency**: 50 Hz (`SAMPLE_INTERVAL_MS = 20`)
- **14-Field CSV Packet**:
  ```csv
  timestamp,thigh_ax,thigh_ay,thigh_az,thigh_gx,thigh_gy,thigh_gz,lower_ax,lower_ay,lower_az,lower_gx,lower_gy,lower_gz,knee_angle\n
  ```

---

## PART 12 — OFFLINE MODE ARCHITECTURE

- **App Launch Without Internet**: **YES**. Service Worker precaches all static HTML, CSS, JS, and font assets.
- **Offline Data Storage**: Demographics and screening evaluations are written directly to IndexedDB (`LocalDB`).
- **Offline Telemetry Capture**: Web Bluetooth connects directly to ESP32 locally without any cloud dependency.
- **Offline ML Inference**:
  - When connected to local backend server (`http://localhost:8000`), full RandomForest inference executes offline on local machine.
  - If backend server is unpowered, `FrontendFeatureExtractor` evaluates risk locally as a secondary fallback.
- **Auto-Sync on Internet Restoration**: `SyncService.ts` listens to browser `online` window events and pushes un-synced IndexedDB records to `POST /api/sync`.

---

## PART 13 — CONFIGURATION & ENVIRONMENT VARIABLES

| Variable Name | Purpose | Default / Example Value | Where Used |
|---|---|---|---|
| `DATABASE_URL` | SQLAlchemy database connection URI | `sqlite:///./oa_smart.db` | `backend/app/database/session.py` |
| `CORS_ORIGINS` | Permitted CORS origins | `http://localhost:5173,http://localhost:3000` | `backend/app/main.py` |
| `VITE_API_BASE_URL` | Frontend API backend endpoint | `http://localhost:8000/api` | `frontend/src/services/api/client.ts` |
| `HARDWARE_CONFIG.SERVICE_UUID` | BLE GATT Service UUID | `4fafc201-1fb5-459e-8fcc-c5c9c331914b` | `hardware.config.ts`, `WebBluetoothService.ts` |
| `HARDWARE_CONFIG.CHARACTERISTIC_UUID` | BLE Characteristic UUID | `beb5483e-36e1-4688-b7f5-ea07361b26a8` | `hardware.config.ts`, `WebBluetoothService.ts` |

---

## PART 14 — TROUBLESHOOTING GUIDE

| Symptom | Likely Cause | Check | Fix |
|---|---|---|---|
| **Frontend won't start** | Missing node modules | Check if `frontend/node_modules` exists | Run `cd frontend; npm install; npm run dev` |
| **Backend won't start** | Missing Python packages | Run `py -m pip list` | Run `py -m pip install -r backend/requirements.txt` |
| **Port 8000 / 5173 in use** | Previous process backgrounded | Run `netstat -ano \| findstr 8000` | Kill process via Task Manager or `stop-process -id PID` |
| **Browser BLE popup doesn't open** | App run on non-localhost HTTP | Check URL in browser address bar | Ensure URL is `http://localhost:5173/` or HTTPS |
| **`ESP32_OA_SENSOR` not visible** | Bluetooth OFF or already paired | Check computer Bluetooth & Serial Monitor | Turn Bluetooth ON; Reset ESP32 board |
| **MPU6050 0x69 fail** | AD0 pin disconnected | Check AD0 pin wiring on 2nd MPU6050 | Connect AD0 on 2nd MPU6050 to 3.3V power |
| **Model file missing error** | `rf_oa_model.joblib` not found | Check `backend/app/models/` directory | Confirm `rf_oa_model.joblib` exists in `backend/app/models/` |

---

## PART 15 — SIH JUDGING DEMO PROCEDURE (5-MINUTE CHECKLIST)

### Pre-Demo Checklist (10 Minutes Before Judges Arrive)
- [ ] ESP32 powered ON via USB; Serial Monitor shows `[BLE] Advertising Started...`
- [ ] Backend running in Terminal 1 (`py -m uvicorn backend.app.main:app --port 8000`).
- [ ] Frontend running in Terminal 2 (`cd frontend; npm run dev -- --host`).
- [ ] Chrome opened at `http://localhost:5173/`.
- [ ] Test mode toggle tested once.

### 5-Minute Pitch & Demo Script
1. **0:00 - 1:00 (Introduction)**: Introduce OA-SMART as a portable, community-level decision support system for early Osteoarthritis risk identification at Primary Health Centers.
2. **1:00 - 2:00 (Patient & Symptoms)**: Click **"Start New Screening"** → Enter Patient ID & Age → Demonstrate the VAS Pain slider (0-10) and mobility difficulty cards.
3. **2:00 - 3:30 (Live Telemetry & BLE)**: Move to Step 3 → Toggle Hardware Mode to **`ESP32 Connected`** → Click **"Start Recording"** → Select `ESP32_OA_SENSOR` in Chrome popup → Show live 15-second telemetry streaming from the Dual MPU6050 wearable.
4. **3:30 - 4:30 (AI Model & Screening Result)**: Click **"Analyse Screening"** → Show the **"OA-Associated Screening Risk"** result → Expand **"Technical Details"** to show judges the 12 scaled lower-leg magnitude features and Random Forest feature importances.
5. **4:30 - 5:00 (Digital Report)**: Click **"View Full Report"** → Show the printable clinical report and mandatory medical disclaimer.

---

## PART 16 — JUDGE EXPLANATION (WHY WE CHOSE THIS STACK)

- **Why ESP32 & Dual MPU6050?**: Dual IMU sensors at thigh and shank capture full knee joint kinematics without expensive optical motion capture systems. ESP32 provides built-in BLE and dual I2C buses at ultra-low cost.
- **Why Web Bluetooth API & PWA?**: Eliminates the need for native Android/iOS App Store distribution. Community health workers can install the PWA instantly on any browser and pair with the wearable over BLE.
- **Why React & FastAPI?**: Decouples UI rendering from heavy ML computation. React provides a responsive 5-step clinical interface, while FastAPI delivers sub-millisecond Python ML inference.
- **Why Random Forest Model?**: Random Forest ensemble classifiers are highly interpretable, resistant to overfitting on kinetic sensor signals, and output explicit feature importances (`lower_leg_gyr_mag_mean`, `lower_leg_free_acc_mag_mean`).

---

## PART 17 — SECURITY & PRIVACY

- **Local Data Isolation**: Patient data is stored locally in browser IndexedDB (`OASmartDB`) and local SQLite database (`oa_smart.db`).
- **No Cloud Exposure**: Telemetry processing and Random Forest inference run 100% locally on the device without transmitting health data to third-party cloud servers.
- **Anonymized Patient IDs**: System uses anonymized identifiers (`PAT-XXXXX` / `ARC-XXX`).

---

## PART 18 — TESTING

- **Frontend Production Build**: Tested via `npm run build` inside `frontend/` (0 TypeScript errors).
- **Backend Database Seed Test**: Tested via `py backend/app/database/seed.py` (Creates SQLite schema & populates demo records).
- **Inference Verification Test**:
  ```powershell
  py -c "from ml.inference.predict import OARiskPredictor; predictor = OARiskPredictor(); test_features = {'lower_leg_acc_mag_mean': 1.05, 'lower_leg_acc_mag_std': 0.25, 'lower_leg_acc_mag_rms': 1.08, 'lower_leg_acc_mag_range': 0.85, 'lower_leg_free_acc_mag_mean': 0.12, 'lower_leg_free_acc_mag_std': 0.10, 'lower_leg_free_acc_mag_rms': 0.15, 'lower_leg_gyr_mag_mean': 45.2, 'lower_leg_gyr_mag_std': 18.5, 'lower_leg_gyr_mag_rms': 48.8, 'lower_leg_gyr_mag_range': 85.0, 'lower_leg_peak_angular_velocity': 120.5}; print(predictor.predict_from_features(test_features))"
  ```
  *Result*: `PASSED` (Returns class-1 OA risk score `0.1854`).

---

## PART 19 — KNOWN LIMITATIONS & FUTURE IMPROVEMENTS

| Current Limitation | Cause / Detail | Planned Future Improvement |
|---|---|---|
| **Web Bluetooth Browser Dependency** | Web Bluetooth is supported on Chrome, Edge, and Opera, but limited on iOS Safari. | Add Web Serial API / Native Capacitor wrapper for iOS Safari compatibility. |
| **Manual Hardware Mode Toggle** | UI defaults to `Test Sensor Mode` until toggled. | Auto-detect ESP32 BLE advertisement on page load. |
| **Single-Clinic SQLite Storage** | SQLite is single-file local database. | Enable multi-tenant PostgreSQL cloud database synchronization. |

---

## PART 20 — QUICK REFERENCE CHEAT SHEET

```
===================================================================================
                             OA-SMART QUICK REFERENCE
===================================================================================
START BACKEND:  py -m uvicorn backend.app.main:app --port 8000
START FRONTEND: cd frontend; npm run dev -- --host
OPEN PWA:       http://localhost:5173/
OPEN API DOCS:  http://localhost:8000/docs

ESP32 BOARD:    DOIT ESP32 DEVKIT V1
ESP32 BAUDRATE: 115200 baud
BLE DEVICE:     ESP32_OA_SENSOR
SERVICE UUID:   4fafc201-1fb5-459e-8fcc-c5c9c331914b
CHAR UUID:      beb5483e-36e1-4688-b7f5-ea07361b26a8

THIGH MPU:      I2C 0x68 (AD0 -> GND)
LOWER LEG MPU:  I2C 0x69 (AD0 -> 3.3V)
I2C PINS:       GPIO 21 (SDA), GPIO 22 (SCL)

MODEL LOCATION: backend/app/models/rf_oa_model.joblib
SCALER LOCATION:backend/app/models/scaler.joblib
FEATURES FILE:  backend/app/models/feature_list.json
DATABASE FILE:  backend/oa_smart.db
===================================================================================
```
