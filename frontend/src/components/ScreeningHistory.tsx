import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, AlertTriangle, AlertCircle, CheckCircle2, 
  History, Plus, Users, Calendar, Activity, RefreshCw 
} from 'lucide-react';
import { ScreeningRecord } from '../types/screening';
import { ApiClient } from '../services/api/client';
import { LocalDB } from '../services/storage/db';

interface ScreeningHistoryProps {
  screenings: ScreeningRecord[];
  onViewReport: (screening: ScreeningRecord) => void;
  onStartNewScreening?: () => void;
}

export function ScreeningHistory({ screenings, onViewReport, onStartNewScreening }: ScreeningHistoryProps) {
  const [activeTab, setActiveTab] = useState<'patients' | 'screenings'>('patients');
  const [patients, setPatients] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      // 1. Fetch from backend SQLite database
      const backendPatients = await ApiClient.listPatients();
      if (backendPatients && backendPatients.length > 0) {
        setPatients(backendPatients);
      } else {
        // Fallback to local DB if backend offline or empty
        const local = await LocalDB.getPatients();
        setPatients(local);
      }
    } catch (err) {
      const local = await LocalDB.getPatients();
      setPatients(local);
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Higher Risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> Higher Risk
          </span>
        );
      case 'Moderate Risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Moderate Risk
          </span>
        );
      case 'Lower Risk':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Lower Risk
          </span>
        );
    }
  };

  // Filter Screenings
  const filteredScreenings = screenings.filter(s => {
    const matchesSearch =
      s.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.patientName && s.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk =
      selectedRisk === 'ALL' ||
      (selectedRisk === 'HIGHER' && s.riskLevel === 'Higher Risk') ||
      (selectedRisk === 'MODERATE' && s.riskLevel === 'Moderate Risk') ||
      (selectedRisk === 'LOWER' && s.riskLevel === 'Lower Risk');

    return matchesSearch && matchesRisk;
  });

  // Filter Patients
  const filteredPatients = patients.filter(p => {
    const pId = (p.id || p.patientId || '').toLowerCase();
    const pName = (p.name || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return pId.includes(query) || pName.includes(query);
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Patient Records & History
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Database of registered patients and completed biomechanical screening sessions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadPatients}
            disabled={loadingPatients}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loadingPatients ? 'animate-spin text-teal-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs: Registered Patients vs Screening Records */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('patients')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'patients'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registered Patients ({patients.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('screenings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'screenings'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Screening Records ({screenings.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={
              activeTab === 'patients'
                ? "Search patients by ID or Name..."
                : "Search screenings by Patient ID, Name, or Screening ID..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
          />
        </div>

        {activeTab === 'screenings' && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="ALL">All Risk Categories</option>
              <option value="HIGHER">Higher Risk Only</option>
              <option value="MODERATE">Moderate Risk Only</option>
              <option value="LOWER">Lower Risk Only</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Registered Patients Table (from backend GET /api/patients) */}
      {activeTab === 'patients' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden transition-colors">
          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              {loadingPatients ? "Loading patients from backend database..." : "No matching registered patients found."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-3.5">Patient ID</th>
                    <th className="px-5 py-3.5">Full Name</th>
                    <th className="px-5 py-3.5">Age</th>
                    <th className="px-5 py-3.5">Gender / Sex</th>
                    <th className="px-5 py-3.5">Contact</th>
                    <th className="px-5 py-3.5">Registered At</th>
                    <th className="px-5 py-3.5">Sync Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredPatients.map((p) => {
                    const id = p.id || p.patientId;
                    const name = p.name && p.name.trim() ? p.name : 'Anonymous Patient';
                    const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently';
                    return (
                      <tr key={id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          {id}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          {name}
                        </td>
                        <td className="px-5 py-3.5">
                          {p.age} yrs
                        </td>
                        <td className="px-5 py-3.5">
                          {p.gender || p.sex || 'Unknown'}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                          {p.phone || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                          {dateStr}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {p.sync_status || 'SYNCED'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={onStartNewScreening}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 text-teal-700 dark:text-teal-300 font-semibold text-xs transition-colors"
                          >
                            <Activity className="w-3.5 h-3.5" />
                            <span>Screen</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Screening Sessions Table */}
      {activeTab === 'screenings' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden transition-colors">
          {filteredScreenings.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching screening records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-3.5">Patient ID</th>
                    <th className="px-5 py-3.5">Patient Name</th>
                    <th className="px-5 py-3.5">Age / Sex</th>
                    <th className="px-5 py-3.5">Risk Level</th>
                    <th className="px-5 py-3.5">Probability</th>
                    <th className="px-5 py-3.5">Date & Time</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredScreenings.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        {s.patientId}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                        {s.patientName && s.patientName.trim() ? s.patientName : 'Anonymous Patient'}
                      </td>
                      <td className="px-5 py-3.5">
                        {s.age} yrs &bull; {s.sex}
                      </td>
                      <td className="px-5 py-3.5">
                        {getRiskBadge(s.riskLevel)}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-semibold">
                        {(s.riskScore * 100).toFixed(0)}%
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                        {s.date} {s.time}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onViewReport(s)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 text-teal-700 dark:text-teal-300 font-semibold text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Report</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
