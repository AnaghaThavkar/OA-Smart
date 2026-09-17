import { SensorPacket } from '../../types/sensor';

export type SensorDataListener = (packet: SensorPacket) => void;
export type StatusListener = (status: ConnectionStatus) => void;

export type ConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

export interface BluetoothService {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  startStreaming(): Promise<void>;
  stopStreaming(): Promise<void>;
  getStatus(): ConnectionStatus;
  getDeviceName(): string;
  getLastError?(): string;
  subscribeToSensorData(listener: SensorDataListener): () => void;
  subscribeToStatus(listener: StatusListener): () => void;
}
