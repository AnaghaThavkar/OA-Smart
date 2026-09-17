import { ScreeningRecord } from '../../types/screening';
import { Patient } from '../../types/patient';

// Clean state: No hardcoded demo screenings
export const INITIAL_SCREENINGS: ScreeningRecord[] = [];

const DB_NAME = 'OASmartDB';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;
      if (!db.objectStoreNames.contains('patients')) {
        db.createObjectStore('patients', { keyPath: 'patientId' });
      }
      if (!db.objectStoreNames.contains('screenings')) {
        db.createObjectStore('screenings', { keyPath: 'id' });
      }
    };
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = (event: any) => reject(event.target.error);
  });
}

export const LocalDB = {
  async savePatient(patientData: Partial<Patient>): Promise<Patient> {
    const db = await openDB();
    const tx = db.transaction('patients', 'readwrite');
    const store = tx.objectStore('patients');
    const patientId = patientData.patientId || patientData.id || `ARC-${Math.floor(100 + Math.random() * 900)}`;
    const height = parseFloat(String(patientData.height || 165));
    const weight = parseFloat(String(patientData.weight || 68));
    const bmi = parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));

    const record: Patient = {
      id: patientId,
      patientId,
      name: patientData.name || `Patient ${patientId}`,
      age: parseInt(String(patientData.age)) || 50,
      sex: (patientData.sex as any) || 'Female',
      gender: patientData.gender || patientData.sex || 'Female',
      height,
      weight,
      bmi,
      phone: patientData.phone || '',
      createdAt: new Date().toISOString(),
      sync_status: 'PENDING'
    };
    store.put(record);
    await new Promise((res) => (tx.oncomplete = res));
    return record;
  },

  async getPatients(): Promise<Patient[]> {
    const db = await openDB();
    const tx = db.transaction('patients', 'readonly');
    const store = tx.objectStore('patients');
    return new Promise((res) => {
      const req = store.getAll();
      req.onsuccess = () => res(req.result || []);
    });
  },

  async saveScreening(screeningData: Partial<ScreeningRecord>): Promise<ScreeningRecord> {
    const db = await openDB();
    const tx = db.transaction('screenings', 'readwrite');
    const store = tx.objectStore('screenings');
    const record: ScreeningRecord = {
      id: screeningData.id || `SCR-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: screeningData.patientId || (screeningData as any).patient_id || 'ARC-001',
      patientName: screeningData.patientName || `Patient ${screeningData.patientId || 'ARC-001'}`,
      age: parseInt(String(screeningData.age)) || 50,
      sex: (screeningData.sex as any) || 'Female',
      height: parseFloat(String(screeningData.height)) || 165,
      weight: parseFloat(String(screeningData.weight)) || 68,
      date: screeningData.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: screeningData.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      painScore: parseInt(String(screeningData.painScore)) || 0,
      painLocation: screeningData.painLocation || 'Left Knee',
      mobilityDifficulty: screeningData.mobilityDifficulty || 'None',
      activities: screeningData.activities || [],
      accelerationStability: screeningData.accelerationStability || '68.4 m/s²',
      gyroscopeRange: screeningData.gyroscopeRange || '88.6 °/s',
      movementStabilityScore: parseFloat(String(screeningData.movementStabilityScore || 72)),
      gaitConsistency: screeningData.gaitConsistency || '76%',
      movementSymmetry: screeningData.movementSymmetry || '78%',
      steps: parseInt(String(screeningData.steps)) || 24,
      walkingDuration: screeningData.walkingDuration || '15s',
      riskLevel: screeningData.riskLevel || 'Moderate Risk',
      riskScore: parseFloat(String(screeningData.riskScore || 0.5)),
      interpretation: screeningData.interpretation || 'Movement and symptom patterns indicate a moderate OA-associated screening risk.',
      recommendedAction: screeningData.recommendedAction || 'Consider clinical evaluation and further assessment.',
      status: 'completed',
      features: screeningData.features || {},
      probabilities: screeningData.probabilities || {}
    };
    store.put(record);
    await new Promise((res) => (tx.oncomplete = res));
    return record;
  },

  async getScreenings(): Promise<ScreeningRecord[]> {
    const db = await openDB();
    const tx = db.transaction('screenings', 'readonly');
    const store = tx.objectStore('screenings');
    return new Promise((res) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const records: ScreeningRecord[] = req.result || [];
        res(records);
      };
      req.onerror = () => res([]);
    });
  }
};
