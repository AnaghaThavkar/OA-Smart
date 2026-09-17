export interface Patient {
  id?: string;
  patientId?: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  gender?: string;
  height: number;
  weight: number;
  bmi?: number;
  phone?: string;
  createdAt?: string;
  sync_status?: string;
}
