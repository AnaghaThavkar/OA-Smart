export const getApiBaseUrl = (): string => {
  const customUrl = localStorage.getItem('OASMART_API_BASE_URL');
  if (customUrl) return customUrl;
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
};

export class ApiClient {
  static async getDashboardSummary() {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/dashboard/summary`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend API unreachable for dashboard summary:', err);
      return null;
    }
  }

  static async createPatient(patient: { id?: string; name: string; age: number; gender: string; phone?: string }) {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: patient.id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender.toUpperCase(),
          phone: patient.phone
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend API unreachable for patient registration:', err);
      return null;
    }
  }

  static async listPatients() {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/patients`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend API unreachable for listing patients:', err);
      return null;
    }
  }

  static async analyzeScreening(
    screeningId: string,
    packets: any[],
    symptomAssessment?: any,
    patientContext?: {
      patientId?: string;
      age?: number;
      sex?: string;
      gender?: string;
      height?: number;
      weight?: number;
      bmi?: number;
    }
  ) {
    try {
      const baseUrl = getApiBaseUrl();
      const payload: any = {
        sensor_packets: packets,
        symptom_assessment: symptomAssessment,
        test_type: 'SIT_TO_STAND'
      };

      if (patientContext) {
        if (patientContext.patientId) payload.patient_id = patientContext.patientId;
        if (patientContext.age !== undefined) payload.age = patientContext.age;
        if (patientContext.sex || patientContext.gender) payload.sex = patientContext.sex || patientContext.gender;
        if (patientContext.height !== undefined) payload.height = patientContext.height;
        if (patientContext.weight !== undefined) payload.weight = patientContext.weight;
        if (patientContext.bmi !== undefined) {
          payload.bmi = patientContext.bmi;
        } else if (patientContext.height && patientContext.weight) {
          const h_m = patientContext.height / 100.0;
          payload.bmi = Number((patientContext.weight / (h_m * h_m)).toFixed(2));
        }
      }

      const res = await fetch(`${baseUrl}/screenings/${screeningId}/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend ML analysis API unreachable:', err);
      return null;
    }
  }

  static async getScreening(screeningId: string) {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/screenings/${screeningId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend API unreachable for screening details:', err);
      return null;
    }
  }

  static async syncData(payload: { patients: any[]; screenings: any[] }) {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Sync HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend API unreachable for data sync:', err);
      return null;
    }
  }

  static async signup(userData: { email: string; password: string; full_name?: string }) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  }

  static async login(credentials: { email: string; password: string }) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  }

  static async getCurrentUser(token: string) {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  static async sendChatMessage(message: string, language: string = 'en', screeningContext?: any) {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language, screening_context: screeningContext })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        reply: language === 'hi' 
          ? "सर्वर से कनेक्ट करने में असमर्थ। कृपया नेटवर्क जांचें।" 
          : language === 'mr'
          ? "सर्व्हरशी संपर्क होऊ शकला नाही. कृपया नेटवर्क तपासा."
          : "Unable to reach assistant server. Please check backend connection.",
        suggested_actions: ["How to place MPU6050 sensors?", "Sit-to-stand instructions", "Explain 15 features"],
        language
      };
    }
  }
}
