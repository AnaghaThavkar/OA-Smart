# OA-SMART Quick Start Guide

**Project**: OA-SMART (Portable AI-Assisted Osteoarthritis Risk Screening System)  
**Version**: 2.0.0  

---

## ⚡ 1. Install Dependencies (First Time Only)

### Backend Dependencies
Open terminal in `C:\Users\HP\Downloads\oa-smart`:
```powershell
py -m pip install -r backend/requirements.txt
py backend/app/database/seed.py
```

### Frontend Dependencies
Open terminal in `C:\Users\HP\Downloads\oa-smart\frontend`:
```powershell
cd frontend
npm install
```

---

## 🚀 2. Start System (Every Time)

### Terminal 1: Start Backend Server
```powershell
cd C:\Users\HP\Downloads\oa-smart
py -m uvicorn backend.app.main:app --port 8000
```
*(Backend URL: `http://localhost:8000` | API Docs: `http://localhost:8000/docs`)*

### Terminal 2: Start Frontend Dev Server
```powershell
cd C:\Users\HP\Downloads\oa-smart\frontend
npm run dev -- --host
```
*(Frontend URL: `http://localhost:5173/`)*

---

## 🔌 3. Connect ESP32 Hardware

1. Power ON your ESP32 board via USB.
2. In Arduino Serial Monitor (115200 baud), verify:
   `[BLE] Advertising Started. Waiting for OA-SMART PWA connection...`
3. Hardware Specs:
   - **Device Name**: `ESP32_OA_SENSOR`
   - **Service UUID**: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
   - **Characteristic UUID**: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
   - **Thigh Sensor**: MPU6050 (I2C `0x68`)
   - **Lower-Leg Sensor**: MPU6050 (I2C `0x69`)

---

## 🧪 4. Perform a Screening Demo

1. Open **Google Chrome** or **Microsoft Edge** at **`http://localhost:5173/`**.
2. Click **"Start New Screening"**.
3. **Step 1 (Patient Info)**: Enter Patient ID, Age, Sex, Height, Weight -> click **"Continue"**.
4. **Step 2 (Symptoms)**: Set VAS Pain Level (0-10) & affected activities -> click **"Continue to Movement Assessment"**.
5. **Step 3 (Movement Assessment)**:
   - Click the top-right toggle button to switch from `Test Sensor Mode` to **`ESP32 Connected`**.
   - Click **`Start Recording`**.
   - Select **`ESP32_OA_SENSOR`** in the Chrome pairing popup and click **Pair**.
   - Wait 15 seconds while live IMU telemetry is captured.
6. Click **"Analyse Screening"**.
7. **Step 5 (Screening Result)**: View the **"OA-Associated Screening Risk"** score calculated by `rf_oa_model.joblib`.
8. Click **"View Full Report"** -> Click **"Print Report"** for printable clinical output.

---

## 📌 Quick Reference Table

| Task | Command / Action |
|---|---|
| **Start Backend** | `py -m uvicorn backend.app.main:app --port 8000` |
| **Start Frontend** | `cd frontend; npm run dev -- --host` |
| **Open App** | [http://localhost:5173/](http://localhost:5173/) |
| **Open Swagger Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **Re-seed Database** | `py backend/app/database/seed.py` |
| **Test Model Inference** | `py -c "from ml.inference.predict import OARiskPredictor; print(OARiskPredictor().predict_from_features({}))"` |
