# OA-SMART: Portable AI-Assisted Osteoarthritis Risk Screening System

**Clinical Decision Support & Biomechanical Screening Platform**

OA-SMART is an offline-first, portable point-of-care screening application designed for Primary Health Centres (PHCs), rural clinics, and community screening camps. It interfaces with an ESP32-based wearable equipped with dual MPU6050 inertial measurement units (thigh and lower-leg) via Web Bluetooth (BLE), captures real-time 50 Hz movement kinematics during a standardized 15-second Sit-to-Stand test, extracts 15 biomechanical and demographic features, and evaluates knee osteoarthritis (KOA) risk using a calibrated Random Forest machine learning model.

> **IMPORTANT CLINICAL NOTICE:**  
> **OA-SMART is a preliminary risk screening and clinical decision support system, NOT an autonomous medical diagnostic device.** It does not replace radiographic confirmation (X-ray/MRI) or evaluation by an orthopaedic specialist. All screening indications must be clinically correlated by a qualified healthcare professional.

---

## 1. System Architecture

The end-to-end data pipeline operates as follows:

```
[ Dual MPU6050 Sensors ]  (Thigh: 0x68, Shin: 0x69 on I2C bus)
         │
         ▼  (50 Hz Kinematic Sampling)
[ ESP32 Wearable Controller ]  (GATT Service 4fafc201... Characteristic beb5483e...)
         │
         ▼  (Web Bluetooth BLE Stream)
[ OA-SMART PWA Frontend ]  (React 18 + TypeScript + Vite + Tailwind CSS)
         │
         ▼  (POST /api/screenings/{id}/analysis)
[ FastAPI Backend + ML Pipeline ]  (15 Features + Scaler + Random Forest Model)
         │
         ▼  (Threshold 0.30: LOW_RISK < 0.30, HIGH_RISK >= 0.30)
[ Screening Assessment & SQLite Persistence ]  (oa_smart.db)
         │
         ▼
[ Professional Clinical Report & History ]
```

---

## 2. Hardware Requirements

* **Microcontroller**: ESP32 Development Board (ESP-WROOM-32 with integrated Bluetooth 4.2 / BLE).
* **Sensors**: 2 × MPU-6050 6-DOF Accelerometer and Gyroscope breakout boards.
* **Power**: 3.7V LiPo Battery or standard 5V USB power bank.
* **Wearable Harness**: Adjustable elastic knee/leg straps with secure enclosures for:
  - IMU #1: Mid-femur (anterior thigh).
  - IMU #2: Mid-tibia (anterior lower leg / shin).
* **Cabling / Connections**: Shared I2C bus (SDA: GPIO 21, SCL: GPIO 22).

---

## 3. ESP32 + MPU6050 Hardware Wiring

Both MPU6050 sensors communicate over a single I2C bus using distinct hardware addresses configured via the **AD0** pin:

| Sensor | AD0 Pin Connection | I2C Address | Anatomical Placement | Function |
| :--- | :--- | :--- | :--- | :--- |
| **MPU6050 #1** | Connected to **GND** | `0x68` | Mid-Femur (Thigh) | Captures femoral acceleration & angular velocity |
| **MPU6050 #2** | Connected to **VCC (3.3V)** | `0x69` | Mid-Tibia (Shin) | Captures tibial acceleration & angular velocity |

### I2C Pin Mapping (ESP32)
* **VCC**: 3.3V (ESP32 3V3 rail)
* **GND**: Common Ground
* **SDA**: GPIO 21
* **SCL**: GPIO 22

---

## 4. Bluetooth LE (BLE) Configuration

The ESP32 firmware advertises as `ESP32_OA_SENSOR` or `OA-SMART` with the following GATT specifications:

* **Service UUID**: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
* **Characteristic UUID**: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
* **Properties**: Read, Notify (`0x2902` descriptor enabled)
* **Baud Rate**: 115200 bps
* **Sampling Rate**: 50 Hz (20 ms transmission interval)
* **Packet Delimiter**: Newline (`\n`)
* **Field Delimiter**: Comma (`,`)

### 14-Field CSV Packet Format
```csv
timestamp,thigh_ax,thigh_ay,thigh_az,thigh_gx,thigh_gy,thigh_gz,lower_ax,lower_ay,lower_az,lower_gx,lower_gy,lower_gz,knee_angle
```

---

## 5. Machine Learning Model & 15 Biomechanical Features

The screening engine evaluates a calibrated **Random Forest Classifier** (`RF-2.0.0-IMPROVED`) using exactly 15 input features (12 kinematic metrics + 3 demographic factors):

| # | Feature Name | Category | Unit | Clinical Significance |
| :---: | :--- | :--- | :---: | :--- |
| 1 | `lower_leg_acc_mag_mean` | Linear Kinematics | $\text{m/s}^2$ | Mean tibial acceleration magnitude |
| 2 | `lower_leg_acc_mag_std` | Linear Kinematics | $\text{m/s}^2$ | Variability in tibial movement |
| 3 | `lower_leg_acc_mag_rms` | Linear Kinematics | $\text{m/s}^2$ | Root mean square energy of tibial motion |
| 4 | `lower_leg_acc_mag_range` | Linear Kinematics | $\text{m/s}^2$ | Dynamic acceleration amplitude |
| 5 | `lower_leg_free_acc_mag_mean` | Dynamic Acceleration | $\text{m/s}^2$ | Gravity-compensated movement acceleration |
| 6 | `lower_leg_free_acc_mag_std` | Dynamic Acceleration | $\text{m/s}^2$ | Free acceleration standard deviation |
| 7 | `lower_leg_free_acc_mag_rms` | Dynamic Acceleration | $\text{m/s}^2$ | Free acceleration signal power |
| 8 | `lower_leg_gyr_mag_mean` | Rotational Kinematics | $^\circ/\text{s}$ | Average angular velocity across transitions |
| 9 | `lower_leg_gyr_mag_std` | Rotational Kinematics | $^\circ/\text{s}$ | Rotational motion consistency |
| 10 | `lower_leg_gyr_mag_rms` | Rotational Kinematics | $^\circ/\text{s}$ | Angular momentum RMS power |
| 11 | `lower_leg_gyr_mag_range` | Rotational Kinematics | $^\circ/\text{s}$ | Range of tibial angular rotation |
| 12 | `lower_leg_peak_angular_velocity` | Rotational Kinematics | $^\circ/\text{s}$ | Peak rotational rate during Sit-to-Stand |
| 13 | `Age` | Demographic | years | Patient chronological age |
| 14 | `Sex_encoded` | Demographic | binary | Biological sex ($1.0 = \text{Male}, 0.0 = \text{Female}$) |
| 15 | `BMI` | Demographic | $\text{kg/m}^2$ | Body Mass Index calculated from height and weight |

### Decision Boundary (Strictly Binary)
* **Score Threshold**: Fixed at `0.30`
* $\mathbf{\text{Probability} < 0.30} \longrightarrow$ **`LOW_RISK`** (Normative functional kinematics / Low risk)
* $\mathbf{\text{Probability} \ge 0.30} \longrightarrow$ **`HIGH_RISK`** (Osteoarthritis-associated risk patterns detected)

---

## 6. Repository Layout

```text
OA-V1/
├── backend/                  # FastAPI REST API & Database
│   ├── app/
│   │   ├── api/              # Endpoints: auth, patients, screenings, reports, dashboard
│   │   ├── database/         # SQLAlchemy engine, session, and schema migrations
│   │   ├── models/           # SQL ORM models & trained ML model weights
│   │   ├── schemas/          # Pydantic validation schemas
│   │   └── services/         # Report generation & sync handlers
│   └── requirements.txt      # Python backend dependencies
├── frontend/                 # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/       # Clinical UI, workflows, report views, navbar, footer
│   │   │   └── workflow/     # Steps 1–5: Patient, Symptoms, Movement, Analysis, Result
│   │   ├── i18n/             # Trilingual dictionaries: English, Hindi, Marathi
│   │   ├── processing/       # Client-side 15-feature extraction & signal filtering
│   │   ├── services/         # Web Bluetooth BLE service & REST API client
│   │   └── types/            # TypeScript interfaces (Screening, Patient, Sensor)
│   ├── package.json          # Node dependencies & Vite build configuration
│   └── vite.config.ts        # Vite + PWA build settings
├── firmware/                 # ESP32 Arduino C++ Firmware
│   └── esp32_oa_smart/       # BLE GATT server & Dual MPU6050 50Hz driver
├── ml/                       # Machine Learning Inference & Preprocessing
│   ├── inference/            # OARiskPredictor production inference engine
│   ├── features/             # Biomechanical 15-feature extraction logic
│   ├── preprocessing/        # Sensor signal cleaner & moving average filter
│   └── models/               # Scaler (.joblib), metadata (.json), feature names (.json)
├── docs/                     # Technical architecture & API contracts
├── oa_smart.db               # Canonical SQLite production database
└── README.md                 # System documentation & setup guide
```

---

## 7. Installation & Running Locally

### Prerequisites
* **Python**: 3.10 to 3.14
* **Node.js**: v18 or v20 LTS
* **Web Browser**: Google Chrome or Microsoft Edge (Chromium-based with Web Bluetooth enabled)

### Step 1: Backend Setup
```powershell
cd C:\Users\ASUS\Downloads\OA-V1\OA-V1
python -m venv backend\venv
.\backend\venv\Scripts\activate
pip install -r backend\requirements.txt
```

Start the FastAPI development server:
```powershell
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
* Backend API: `http://localhost:8000`
* Interactive API Documentation (Swagger): `http://localhost:8000/docs`

### Step 2: Frontend Setup
Open a new terminal:
```powershell
cd C:\Users\ASUS\Downloads\OA-V1\OA-V1\frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in **Google Chrome** or **Microsoft Edge**.

---

## 8. Database Setup & Persistence

The application utilizes a single canonical SQLite database:
* **Location**: `C:\Users\ASUS\Downloads\OA-V1\OA-V1\oa_smart.db`
* **Tables**:
  - `patients`: Patient demographic intake (ID, name, age, gender, contact).
  - `screening_sessions`: Session metadata, timestamps, and test type (`SIT_TO_STAND`).
  - `extracted_features`: Computed 15-feature JSON vectors.
  - `ml_predictions`: Binary risk outcome, probabilities JSON, top-5 feature importances.
  - `users`: Clinician credentials (PBKDF2-HMAC hashed passwords with per-user salt).

Data is committed synchronously via SQLAlchemy transactions and persists across backend restarts.

---

## 9. API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | System health check and API version info |
| `POST` | `/api/auth/login` | Clinician authentication with secure token |
| `POST` | `/api/auth/signup` | Clinician account registration |
| `GET` | `/api/patients` | Retrieve all registered patients |
| `POST` | `/api/patients` | Register new patient intake directly into database |
| `POST` | `/api/screenings/{id}/analysis` | Run 15-feature ML inference & persist result |
| `GET` | `/api/screenings` | Retrieve all historical screening sessions with patient joins |
| `GET` | `/api/screenings/{id}` | Detailed screening assessment with full feature vector |
| `GET` | `/api/dashboard/summary` | Aggregated patient and screening statistics |
| `GET` | `/api/reports/{id}` | Printable HTML clinical report generator |

---

## 10. Screening Workflow (Step-by-Step)

1. **Clinician Authentication**: Log in with authenticated clinician credentials or register.
2. **Dashboard**: View patient statistics, risk breakdown, and click **"Start New Screening"**.
3. **Step 1 — Patient Intake**: Enter patient ID, full name, age, biological sex, height (cm), and weight (kg). BMI is calculated automatically and saved to the database.
4. **Step 2 — Symptoms Assessment**: Record pain intensity (VAS 0–10), pain anatomical location, and mobility limitations.
5. **Step 3 — Sensor Connection & Movement Test**:
   - Strap MPU6050 #1 to the thigh and MPU6050 #2 to the lower leg.
   - Power on the ESP32.
   - Click **"Pair & Connect ESP32"** and select device in Chrome Web Bluetooth prompt.
   - Click **"Start 15-Second Motion Test"**.
   - Instruct patient to perform 3 to 5 continuous, smooth Sit-to-Stand transitions.
   - Real-time 50 Hz telemetry is streamed and validated.
6. **Step 4 — Automated Analysis**: Extract 12 kinematic features, merge with 3 demographic metrics, and invoke Random Forest model.
7. **Step 5 — Results & Interpretation**: View binary risk level (High Risk vs Low Risk), probability score, top contributing features, and tailored clinical recommendations.
8. **Digital Report & History**: Generate and print official clinical report, view archived sessions in **Screening History**.

---

## 11. Hardware Testing & Verification Instructions

1. **Hardware Preparation**:
   - Verify ESP32 is powered via USB or LiPo battery.
   - Confirm I2C wiring: SDA $\rightarrow$ GPIO 21, SCL $\rightarrow$ GPIO 22, VCC $\rightarrow$ 3.3V, GND $\rightarrow$ GND.
   - Confirm AD0 pin on Thigh sensor is connected to GND (`0x68`), and AD0 pin on Shin sensor is connected to 3.3V (`0x69`).
2. **Firmware Flashing**:
   - Open `firmware/esp32_oa_smart/esp32_oa_smart.ino` in Arduino IDE.
   - Install `ESP32` board definitions and `Adafruit MPU6050` library.
   - Select Board: `ESP32 Dev Module`, upload firmware.
   - Open Serial Monitor at 115200 baud to verify sensor initialization (`[OK] Thigh MPU6050 Initialized (0x68)` and `[OK] Lower Leg MPU6050 Initialized (0x69)`).
3. **PWA Bluetooth Pairing**:
   - Open Google Chrome or Microsoft Edge.
   - Ensure Bluetooth is turned on in Windows Settings.
   - Click **"Pair & Connect ESP32"** in Step 3 of the workflow.
   - Select `ESP32_OA_SENSOR` or `OA-SMART` in the pairing dialog.
   - Status will update to **"ESP32 Connected"** and display active sensor channels.

---

## 12. Important Limitations & Medical Disclaimer

* **Screening Purpose Only**: OA-SMART is designed as a community risk-stratification tool to identify patients who exhibit kinematic and demographic risk markers associated with knee osteoarthritis.
* **Not a Diagnostic Tool**: It does NOT diagnose osteoarthritis, Kellgren-Lawrence grade, meniscus tears, or ligament pathology.
* **Mandatory Referral**: Patients flagged as `HIGH_RISK` ($\text{score} \ge 0.30$) should be referred to an orthopaedic specialist for radiographic confirmation (weight-bearing knee X-rays) and clinical joint examination.
* **Browser Compatibility**: Direct hardware communication requires Web Bluetooth API, available on Chromium-based browsers (Google Chrome, Microsoft Edge, Opera).

