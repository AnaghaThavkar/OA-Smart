import { BluetoothService, ConnectionStatus, SensorDataListener, StatusListener } from './BluetoothService';
import { HARDWARE_CONFIG } from './hardware.config';
import { PacketParser } from './PacketParser';

export class WebBluetoothService implements BluetoothService {
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private status: ConnectionStatus = 'DISCONNECTED';
  private dataListeners: Set<SensorDataListener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();
  private textDecoder = new TextDecoder();
  private buffer = '';
  private lastErrorMessage = '';
  private boundValueHandler: ((event: any) => void) | null = null;

  async connect(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.bluetooth) {
      this.lastErrorMessage = 'Web Bluetooth API is not supported in this browser. Please open OA-SMART in Google Chrome, Microsoft Edge, or a Chromium-based browser with Bluetooth enabled.';
      console.warn(this.lastErrorMessage);
      this.updateStatus('ERROR');
      return false;
    }

    try {
      this.updateStatus('CONNECTING');
      this.lastErrorMessage = '';

      // Request device with specific filter for ESP32 Wearable sensor
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: HARDWARE_CONFIG.DEVICE_NAME_PREFIX },
          { namePrefix: 'ESP32' },
          { namePrefix: 'OA-SMART' },
          { services: [HARDWARE_CONFIG.SERVICE_UUID] }
        ],
        optionalServices: [HARDWARE_CONFIG.SERVICE_UUID]
      });

      this.device.addEventListener('gattserverdisconnected', () => {
        this.updateStatus('DISCONNECTED');
        this.characteristic = null;
      });

      const server = await this.device.gatt?.connect();
      if (!server) {
        throw new Error('Could not connect to ESP32 GATT server.');
      }

      const service = await server.getPrimaryService(HARDWARE_CONFIG.SERVICE_UUID);
      this.characteristic = await service.getCharacteristic(HARDWARE_CONFIG.CHARACTERISTIC_UUID) || null;

      if (this.characteristic) {
        this.updateStatus('CONNECTED');
        return true;
      }

      throw new Error('Required GATT Characteristic not found on ESP32 service.');
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('cancelled') || msg.includes('canceled') || msg.includes('User cancelled')) {
        this.lastErrorMessage = 'Bluetooth device pairing dialog was cancelled.';
        this.updateStatus('DISCONNECTED');
      } else {
        this.lastErrorMessage = `Bluetooth connection failed: ${msg}`;
        console.error('BLE connection failure:', err);
        this.updateStatus('ERROR');
      }
      return false;
    }
  }

  async disconnect(): Promise<void> {
    await this.stopStreaming();
    if (this.device && this.device.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.characteristic = null;
    this.updateStatus('DISCONNECTED');
  }

  async startStreaming(): Promise<void> {
    if (!this.characteristic) {
      console.warn('Cannot start streaming: characteristic is not available.');
      return;
    }

    await this.characteristic.startNotifications();

    if (!this.boundValueHandler) {
      this.boundValueHandler = (event: any) => {
        const value: DataView = event.target.value;
        const chunk = this.textDecoder.decode(value);
        this.buffer += chunk;

        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || ''; // Keep incomplete trailing fragment in buffer

        for (const line of lines) {
          if (line.trim()) {
            const packet = PacketParser.parseLine(line);
            this.dataListeners.forEach(listener => listener(packet));
          }
        }
      };
      this.characteristic.addEventListener('characteristicvaluechanged', this.boundValueHandler);
    }
  }

  async stopStreaming(): Promise<void> {
    if (this.characteristic) {
      try {
        if (this.boundValueHandler) {
          this.characteristic.removeEventListener('characteristicvaluechanged', this.boundValueHandler);
          this.boundValueHandler = null;
        }
        await this.characteristic.stopNotifications();
      } catch (err) {
        console.warn('Error stopping BLE notifications:', err);
      }
    }
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  getLastError(): string {
    return this.lastErrorMessage;
  }

  getDeviceName(): string {
    return this.device?.name || 'ESP32 Hardware Wearable';
  }

  subscribeToSensorData(listener: SensorDataListener): () => void {
    this.dataListeners.add(listener);
    return () => this.dataListeners.delete(listener);
  }

  subscribeToStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  private updateStatus(newStatus: ConnectionStatus) {
    this.status = newStatus;
    this.statusListeners.forEach(l => l(newStatus));
  }
}
