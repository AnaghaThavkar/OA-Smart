# OA-SMART Hardware Integration Guide

This document defines the integration boundary between the ESP32 hardware wearable and the OA-SMART React PWA application.

## 1. Hardware Overview
The hardware system consists of:
- **MCU**: ESP32 microcontroller with Bluetooth Low Energy (BLE) or Bluetooth Classic enabled.
- **Sensors**: 
  - Thigh MPU6050 (Accelerometer + Gyroscope)
  - Lower Leg MPU6050 (Accelerometer + Gyroscope)
  - Knee Angle derived via complimentary/Kalman filtering on ESP32 or raw telemetry.

---

## 2. Hardware Adapter Architecture

The frontend application uses an isolated hardware adapter pattern to prevent ESP32 firmware variations from impacting the UI or processing layer.

```text
ESP32 Wearable -> BLE Packet -> PacketParser.ts -> Standard SensorPacket -> React PWA
```

All hardware-dependent configuration parameters live inside:
`frontend/src/services/bluetooth/hardware.config.ts`

---

## 3. BLE Packet Format

The ESP32 broadcasts or streams sensor records in either CSV string format or packed binary frame format.

### Standard CSV Packet Format (Default 50Hz Stream):
`timestamp,thigh_ax,thigh_ay,thigh_az,thigh_gx,thigh_gy,thigh_gz,lower_ax,lower_ay,lower_az,lower_gx,lower_gy,lower_gz,knee_angle`

Example packet payload:
`1726156800000,-0.3922,-0.0022,0.2928,0.8473,1.5954,0.3511,-0.2091,-0.1914,0.4396,0.1298,0.2519,0.0992,29.69`

### Error Packet Format:
`ERROR, SENSOR_READ_FAILED`

`PacketParser.ts` catches invalid numeric values, sensor failure signals, or corrupted strings and marks `isValid = false` while maintaining data stream continuity without crashing the PWA application.
