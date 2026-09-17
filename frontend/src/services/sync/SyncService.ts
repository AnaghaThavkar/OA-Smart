import { LocalDB } from '../storage/db';
import { ApiClient } from '../api/client';

export class SyncService {
  private static isSyncing = false;
  private static listenersInitialized = false;

  static initAutoSyncListeners(onSyncComplete?: (count: number) => void) {
    if (this.listenersInitialized) return;
    this.listenersInitialized = true;

    window.addEventListener('online', async () => {
      console.log('[AutoSync] Internet connection restored. Triggering background sync queue...');
      const res = await this.syncPendingRecords();
      if (res.success && res.syncedCount > 0 && onSyncComplete) {
        onSyncComplete(res.syncedCount);
      }
    });
  }

  static async syncPendingRecords(): Promise<{ success: boolean; syncedCount: number }> {
    if (this.isSyncing) return { success: false, syncedCount: 0 };
    this.isSyncing = true;

    try {
      const screenings = await LocalDB.getScreenings();
      const patients = await LocalDB.getPatients();

      if (screenings.length === 0 && patients.length === 0) {
        this.isSyncing = false;
        return { success: true, syncedCount: 0 };
      }

      const payload = {
        patients: patients.map(p => ({
          id: p.patientId || p.id,
          name: p.name,
          age: p.age,
          gender: p.gender || p.sex,
          phone: p.phone
        })),
        screenings: screenings.map(s => ({
          id: s.id,
          patient_id: s.patientId,
          test_type: 'SIT_TO_STAND',
          status: 'COMPLETED'
        }))
      };

      const res = await ApiClient.syncData(payload);

      if (res && res.status === 'SUCCESS') {
        this.isSyncing = false;
        return { success: true, syncedCount: res.synced_count || screenings.length };
      }

      this.isSyncing = false;
      return { success: false, syncedCount: 0 };
    } catch (err) {
      console.warn('Sync failed (offline mode active):', err);
      this.isSyncing = false;
      return { success: false, syncedCount: 0 };
    }
  }
}
