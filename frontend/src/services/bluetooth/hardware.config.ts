/**
 * HARDWARE CONFIGURATION FILE FOR ESP32 BLE WEARABLE
 * 
 * Update this file when physical ESP32 BLE UUIDs or baud rates change.
 * Software logic remains fully decoupled from hardware specifications.
 */

export const HARDWARE_CONFIG = {
  DEVICE_NAME_PREFIX: 'ESP32_OA_SENSOR',
  
  // TODO_HARDWARE_UUID: Replace with actual ESP32 GATT Service & Characteristic UUIDs
  SERVICE_UUID: '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
  CHARACTERISTIC_UUID: 'beb5483e-36e1-4688-b7f5-ea07361b26a8',

  BAUD_RATE: 115200,
  SAMPLING_RATE_HZ: 50,
  
  // Framing delimiters
  PACKET_DELIMITER: '\n',
  FIELD_DELIMITER: ',',

  // Error Tokens
  ERROR_TOKENS: ['ERROR', 'SENSOR_READ_FAILED', 'MPU6050_DISCONNECTED']
};
