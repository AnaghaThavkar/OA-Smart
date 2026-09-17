# OA-SMART ESP32 Hardware Firmware & Wiring Guide

**Clinical Decision Support & Biomechanical Wearable Firmware**

This directory contains the production-ready C++/Arduino sketch for the ESP32 wearable microcontroller equipped with dual MPU6050 6-axis inertial sensors (Thigh and Lower Leg).

---

## 🔌 Hardware Circuit & Pinout Diagram

```text
               ┌───────────────────────┐
               │    ESP32 WEARABLE     │
               │                       │
               │   3.3V    GND   GPIO21 (SDA)  GPIO22 (SCL)
               └───┬────────┬────────┬───────────┬─────┘
                   │        │        │           │
       ┌───────────┴───┐    │        │           │
       │               │    │        │           │
 ┌─────┴──────────┐    │    │        │           │
 │ THIGH MPU6050  │    │    │        │           │
 │                │    │    │        │           │
 │ VCC ───────────┼────┘    │        │           │
 │ GND ───────────┼─────────┴────────┼───────────┤
 │ SDA ───────────┼──────────────────┴───────────┤
 │ SCL ───────────┼──────────────────────────────┘
 │ AD0 ───────────┴─── GND (Address: 0x68)
 └────────────────┘

 ┌────────────────┐
 │ LOWER LEG MPU  │
 │                │
 │ VCC ───────────┼──── 3.3V
 │ GND ───────────┼──── GND
 │ SDA ───────────┼──── GPIO21 (SDA)
 │ SCL ───────────┼──── GPIO22 (SCL)
 │ AD0 ───────────┼──── 3.3V (Address: 0x69)
 └────────────────┘
```

---

## ⚡ Key Features

- **Dual I2C Sensor Addressing**: 
  - Thigh MPU6050: AD0 to GND -> Address `0x68`
  - Lower Leg MPU6050: AD0 to 3.3V -> Address `0x69`
- **Biomechanical Knee Angle Calculation**: Computes absolute inclination differential between thigh and lower leg sensors.
- **BLE GATT Server**: Broadcasts 50Hz CSV notifications formatted specifically for `PacketParser.ts`:
  `timestamp,thigh_ax,thigh_ay,thigh_az,thigh_gx,thigh_gy,thigh_gz,lower_ax,lower_ay,lower_az,lower_gx,lower_gy,lower_gz,knee_angle`
- **Error Packet Resilience**: Transmits `ERROR, SENSOR_READ_FAILED` if I2C bus fails, allowing the PWA to handle sensor drops gracefully without crashing.

---

## 🛠️ How to Flash Firmware

1. Open `firmware/esp32_oa_smart/esp32_oa_smart.ino` in **Arduino IDE** or **PlatformIO**.
2. Select **Board**: `ESP32 Dev Module`.
3. Set CPU Frequency: `240MHz (WiFi/BT)`.
4. Install `BLEDevice` library (included standard in ESP32 Arduino core).
5. Click **Upload**.
