/*
 * OA-SMART ESP32 Wearable Firmware
 * Dual MPU6050 Telemetry & BLE Broadcaster
 * Clinical Decision Support Wearable Firmware
 * 
 * Hardware Connections:
 * ESP32 SDA -> GPIO 21
 * ESP32 SCL -> GPIO 22
 * Thigh MPU6050: AD0 -> GND (I2C Address: 0x68)
 * Lower Leg MPU6050: AD0 -> 3.3V (I2C Address: 0x69)
 */

#include <Wire.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// I2C Addresses for Dual MPU6050 Sensors
#define MPU_THIGH_ADDR 0x68
#define MPU_LOWER_ADDR 0x69

// BLE GATT Service & Characteristic UUIDs (Matching hardware.config.ts)
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

// Raw Sensor Values Container
struct MPUData {
  float ax, ay, az;
  float gx, gy, gz;
  float pitch;
};

// Function Prototypes
bool initMPU(uint8_t addr);
bool readMPU(uint8_t addr, MPUData &data);

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("[BLE] Device Connected!");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("[BLE] Device Disconnected!");
    }
};

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22); // SDA = GPIO21, SCL = GPIO22

  Serial.println("\n[OA-SMART] Initializing Hardware Wearable Node...");

  // Initialize Thigh and Lower Leg MPU6050 sensors
  if (!initMPU(MPU_THIGH_ADDR)) {
    Serial.println("[ERROR] Failed to find Thigh MPU6050 (0x68)");
  } else {
    Serial.println("[OK] Thigh MPU6050 Initialized (0x68)");
  }

  if (!initMPU(MPU_LOWER_ADDR)) {
    Serial.println("[ERROR] Failed to find Lower Leg MPU6050 (0x69)");
  } else {
    Serial.println("[OK] Lower Leg MPU6050 Initialized (0x69)");
  }

  // Create BLE Device
  BLEDevice::init("ESP32_OA_SENSOR");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create BLE Characteristic with Notify
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_NOTIFY |
                      BLECharacteristic::PROPERTY_INDICATE
                    );

  pCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  // Start Advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  Serial.println("[BLE] Advertising Started. Waiting for OA-SMART PWA connection...");
}

unsigned long lastSampleTime = 0;
const unsigned long SAMPLE_INTERVAL_MS = 20; // 50Hz telemetry loop

void loop() {
  unsigned long now = millis();
  if (now - lastSampleTime >= SAMPLE_INTERVAL_MS) {
    lastSampleTime = now;

    MPUData thighData, lowerData;
    bool thighOK = readMPU(MPU_THIGH_ADDR, thighData);
    bool lowerOK = readMPU(MPU_LOWER_ADDR, lowerData);

    if (!thighOK || !lowerOK) {
      if (deviceConnected) {
        String errPacket = "ERROR, SENSOR_READ_FAILED\n";
        pCharacteristic->setValue(errPacket.c_str());
        pCharacteristic->notify();
      }
      return;
    }

    // Calculate Knee Angle from pitch difference
    float kneeAngle = abs(thighData.pitch - lowerData.pitch);
    kneeAngle = constrain(kneeAngle, 0.0, 130.0);

    // Format Telemetry Packet CSV:
    // timestamp,thigh_ax,thigh_ay,thigh_az,thigh_gx,thigh_gy,thigh_gz,lower_ax,lower_ay,lower_az,lower_gx,lower_gy,lower_gz,knee_angle
    char packet[256];
    snprintf(packet, sizeof(packet),
      "%lu,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.2f\n",
      now,
      thighData.ax, thighData.ay, thighData.az,
      thighData.gx, thighData.gy, thighData.gz,
      lowerData.ax, lowerData.ay, lowerData.az,
      lowerData.gx, lowerData.gy, lowerData.gz,
      kneeAngle
    );

    // Send packet via BLE Notification if connected
    if (deviceConnected) {
      pCharacteristic->setValue(packet);
      pCharacteristic->notify();
    }
  }

  // Handle BLE disconnect auto-readvertising
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);
    pServer->startAdvertising();
    Serial.println("[BLE] Restarted Advertising");
    oldDeviceConnected = deviceConnected;
  }
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
  }
}

// MPU6050 Helper Functions
bool initMPU(uint8_t addr) {
  Wire.beginTransmission(addr);
  Wire.write(0x6B); // PWR_MGMT_1 register
  Wire.write(0);    // Wake up MPU6050
  return (Wire.endTransmission() == 0);
}

bool readMPU(uint8_t addr, MPUData &data) {
  Wire.beginTransmission(addr);
  Wire.write(0x3B); // Start reading from ACCEL_XOUT_H
  if (Wire.endTransmission(false) != 0) return false;

  uint8_t bytesRead = Wire.requestFrom((int)addr, 14, (int)true);
  if (bytesRead < 14) return false;

  int16_t rawAX = (Wire.read() << 8) | Wire.read();
  int16_t rawAY = (Wire.read() << 8) | Wire.read();
  int16_t rawAZ = (Wire.read() << 8) | Wire.read();
  int16_t rawTemp = (Wire.read() << 8) | Wire.read();
  int16_t rawGX = (Wire.read() << 8) | Wire.read();
  int16_t rawGY = (Wire.read() << 8) | Wire.read();
  int16_t rawGZ = (Wire.read() << 8) | Wire.read();

  // Convert to g's and deg/s
  data.ax = rawAX / 16384.0;
  data.ay = rawAY / 16384.0;
  data.az = rawAZ / 16384.0;
  data.gx = rawGX / 131.0;
  data.gy = rawGY / 131.0;
  data.gz = rawGZ / 131.0;

  // Calculate accelerometer pitch angle
  data.pitch = atan2(data.ay, sqrt(data.ax * data.ax + data.az * data.az)) * 180.0 / M_PI;

  return true;
}
