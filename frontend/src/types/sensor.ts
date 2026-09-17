export interface SensorPacket {
  timestamp: number;
  thigh_ax: number;
  thigh_ay: number;
  thigh_az: number;
  thigh_gx: number;
  thigh_gy: number;
  thigh_gz: number;
  lower_ax: number;
  lower_ay: number;
  lower_az: number;
  lower_gx: number;
  lower_gy: number;
  lower_gz: number;
  knee_angle: number;
  isValid?: boolean;
  errorMessage?: string;
}

export type MovementTestType = 'STRAIGHT' | 'SLIGHT_FLEXION' | 'WALKING_NORMAL' | 'SIT_TO_STAND';

export interface MovementTestConfig {
  id: MovementTestType;
  name: string;
  instructions: string;
  expectedDurationSec: number;
}
