import { SensorPacket } from '../../types/sensor';
import { HARDWARE_CONFIG } from './hardware.config';

export class PacketParser {
  /**
   * Parses raw incoming string line from ESP32 BLE stream into a SensorPacket object.
   * Prevents PWA crashes when corrupted readings or ERROR tokens occur.
   */
  static parseLine(line: string): SensorPacket {
    const cleanLine = line.trim();

    // Check for explicit sensor error tokens
    for (const errToken of HARDWARE_CONFIG.ERROR_TOKENS) {
      if (cleanLine.includes(errToken)) {
        return {
          timestamp: Date.now(),
          thigh_ax: 0, thigh_ay: 0, thigh_az: 0,
          thigh_gx: 0, thigh_gy: 0, thigh_gz: 0,
          lower_ax: 0, lower_ay: 0, lower_az: 0,
          lower_gx: 0, lower_gy: 0, lower_gz: 0,
          knee_angle: 0,
          isValid: false,
          errorMessage: `Sensor Read Error: ${errToken}`
        };
      }
    }

    const parts = cleanLine.split(HARDWARE_CONFIG.FIELD_DELIMITER);

    // Expecting either 14 values (with timestamp) or 13 values
    if (parts.length < 13) {
      return {
        timestamp: Date.now(),
        thigh_ax: 0, thigh_ay: 0, thigh_az: 0,
        thigh_gx: 0, thigh_gy: 0, thigh_gz: 0,
        lower_ax: 0, lower_ay: 0, lower_az: 0,
        lower_gx: 0, lower_gy: 0, lower_gz: 0,
        knee_angle: 0,
        isValid: false,
        errorMessage: `Incomplete Packet: Received ${parts.length} fields`
      };
    }

    try {
      let idx = 0;
      let timestamp = Date.now();

      if (parts.length >= 14) {
        const parsedTime = parseFloat(parts[0]);
        if (!isNaN(parsedTime) && parsedTime > 0) {
          timestamp = parsedTime;
        }
        idx = 1;
      }

      const thigh_ax = parseFloat(parts[idx++]);
      const thigh_ay = parseFloat(parts[idx++]);
      const thigh_az = parseFloat(parts[idx++]);
      const thigh_gx = parseFloat(parts[idx++]);
      const thigh_gy = parseFloat(parts[idx++]);
      const thigh_gz = parseFloat(parts[idx++]);

      const lower_ax = parseFloat(parts[idx++]);
      const lower_ay = parseFloat(parts[idx++]);
      const lower_az = parseFloat(parts[idx++]);
      const lower_gx = parseFloat(parts[idx++]);
      const lower_gy = parseFloat(parts[idx++]);
      const lower_gz = parseFloat(parts[idx++]);

      const knee_angle = parseFloat(parts[idx++]);

      // Check if any numbers parsed as NaN
      const values = [
        thigh_ax, thigh_ay, thigh_az, thigh_gx, thigh_gy, thigh_gz,
        lower_ax, lower_ay, lower_az, lower_gx, lower_gy, lower_gz, knee_angle
      ];

      if (values.some(v => isNaN(v))) {
        return {
          timestamp,
          thigh_ax: 0, thigh_ay: 0, thigh_az: 0,
          thigh_gx: 0, thigh_gy: 0, thigh_gz: 0,
          lower_ax: 0, lower_ay: 0, lower_az: 0,
          lower_gx: 0, lower_gy: 0, lower_gz: 0,
          knee_angle: 0,
          isValid: false,
          errorMessage: 'Corrupted numerical values in BLE packet'
        };
      }

      return {
        timestamp,
        thigh_ax, thigh_ay, thigh_az,
        thigh_gx, thigh_gy, thigh_gz,
        lower_ax, lower_ay, lower_az,
        lower_gx, lower_gy, lower_gz,
        knee_angle,
        isValid: true
      };
    } catch (err: any) {
      return {
        timestamp: Date.now(),
        thigh_ax: 0, thigh_ay: 0, thigh_az: 0,
        thigh_gx: 0, thigh_gy: 0, thigh_gz: 0,
        lower_ax: 0, lower_ay: 0, lower_az: 0,
        lower_gx: 0, lower_gy: 0, lower_gz: 0,
        knee_angle: 0,
        isValid: false,
        errorMessage: `Parsing exception: ${err.message}`
      };
    }
  }
}
