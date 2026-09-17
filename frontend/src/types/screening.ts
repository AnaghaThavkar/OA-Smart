export type RiskLevel = 'Lower Risk' | 'Moderate Risk' | 'Higher Risk';

export interface ScreeningRecord {
  id: string;
  patientId: string;
  patientName?: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  height: number;
  weight: number;
  date: string;
  time: string;
  riskLevel: RiskLevel;
  riskScore: number;
  painScore: number;
  painLocation: string;
  mobilityDifficulty: string;
  activities: string[];
  accelerationStability: string;
  gyroscopeRange: string;
  movementStabilityScore: number;
  gaitConsistency: string;
  movementSymmetry: string;
  steps: number;
  walkingDuration: string;
  interpretation: string;
  recommendedAction: string;
  status?: string;
  features?: Record<string, number>;
  probabilities?: Record<string, number>;
}
