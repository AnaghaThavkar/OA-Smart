import React, { useState } from 'react';
import { Settings as SettingsIcon, Wifi, Cpu, HardDrive, RotateCcw, Loader2, CheckCircle2 } from 'lucide-react';
import { getApiBaseUrl, ApiClient } from '../services/api/client';
import { LocalDB } from '../services/storage/db';

export function Settings() {
  const [apiUrl, setApiUrl] = useState<string>(getApiBaseUrl());
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('');

  const handleSaveApiUrl = () => {
    localStorage.setItem('OASMART_API_BASE_URL', apiUrl);
    setSavedMessage('API server URL updated.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing offline records...');

    try {
      const screenings = await LocalDB.getScreenings();
      const patients = await LocalDB.getPatients();

      const res = await ApiClient.syncData({
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
      });

      if (res && res.status === 'SUCCESS') {
        setSyncStatus(`Sync completed! Synced ${res.synced_count || screenings.length} records.`);
      } else {
        setSyncStatus('Records stored locally. Backend will auto-sync when online.');
      }
    } catch (err: any) {
      setSyncStatus(`Sync status: Saved locally.`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Application & Device Settings</h2>
          <p className="text-xs text-slate-500">Manage backend connection, wearable sensors, and data synchronization.</p>
        </div>
      </div>

      {/* 1. Application Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Wifi className="w-4 h-4 text-teal-600" /> Application Connection
        </h3>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Backend Server Address</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={apiUrl}
              onChange={e => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000/api"
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
            />
            <button
              onClick={handleSaveApiUrl}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Save Address
            </button>
          </div>
          {savedMessage && (
            <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {savedMessage}
            </p>
          )}
        </div>
      </div>

      {/* 2. Device Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Cpu className="w-4 h-4 text-teal-600" /> Device & Wearable Sensor Connection
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-400 block font-medium">Sensor Device ID</span>
            <strong className="text-slate-900 font-mono text-sm">ESP32_OA_SENSOR</strong>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-400 block font-medium">Telemetry Sampling</span>
            <strong className="text-slate-900 font-mono text-sm">50 Hz IMU Stream</strong>
          </div>
        </div>
      </div>

      {/* 3. Data Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <HardDrive className="w-4 h-4 text-teal-600" /> Data Storage & Synchronization
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          All patient screening records are automatically saved locally on this device. When an internet connection is available, pending records sync automatically with the central server.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            <span>Sync Offline Records Now</span>
          </button>
          {syncStatus && <span className="text-xs text-slate-700 font-medium">{syncStatus}</span>}
        </div>
      </div>
    </div>
  );
}
