import React from 'react';
import { Plus, Users, Calendar, AlertTriangle, Eye, Activity, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { ScreeningRecord } from '../types/screening';
import { translations, Language } from '../i18n/translations';

interface DashboardProps {
  stats: {
    totalScreenings: number;
    higherRisk: number;
    moderateRisk: number;
    lowerRisk: number;
  };
  screenings: ScreeningRecord[];
  onStartNewScreening: () => void;
  onViewReport: (screening: ScreeningRecord) => void;
  language?: Language;
}

export function Dashboard({ 
  stats, 
  screenings, 
  onStartNewScreening, 
  onViewReport,
  language = 'en'
}: DashboardProps) {
  const t = translations[language].dashboard;
  const recentScreenings = screenings.slice(0, 6);

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Higher Risk':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
            <span>Higher Risk (≥ 0.30)</span>
          </span>
        );
      case 'Moderate Risk':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Moderate Risk</span>
          </span>
        );
      case 'Lower Risk':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Lower Risk</span>
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-150">
      
      {/* 
        CLEAN DASHBOARD HERO: EXACTLY ONE PRIMARY "START NEW SCREENING" CALL-TO-ACTION BUTTON
      */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>OA-SMART v2.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* THE SOLE PROMINENT "START NEW SCREENING" ACTION ON DASHBOARD */}
        <button
          onClick={onStartNewScreening}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.98] shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>{t.startScreening}</span>
        </button>
      </div>

      {/* Metrics & Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Screenings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.totalScreenings}
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalScreenings}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Patients Evaluated</span>
          </div>
        </div>

        {/* High Risk Detected */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
              {t.highRiskDetected}
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-600 dark:text-red-400">
              {stats.higherRisk}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Threshold ≥ 0.30</span>
          </div>
        </div>

        {/* Low / Normal Risk */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {t.lowRiskNormal}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.lowerRisk}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Normative Kinematics</span>
          </div>
        </div>

        {/* Device Readiness */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-2xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.systemStatus}
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-teal-700 dark:text-teal-300">
              15 Features Active
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Dual MPU6050 &bull; BLE Telemetry &bull; Local DB
          </p>
        </div>

      </div>

      {/* Protocol Guidance Banner for Field Workers */}
      <div className="bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 transition-colors">
        <HeartPulse className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200">
            {t.quickGuidanceTitle}
          </h4>
          <p className="text-xs text-teal-700 dark:text-teal-300/90 leading-relaxed">
            {t.quickGuidanceDesc}
          </p>
        </div>
      </div>

      {/* Recent Screenings Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden transition-colors">
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.recentScreenings}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Latest subject kinematics and calibrated predictions
            </p>
          </div>
        </div>

        {recentScreenings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            {t.noScreenings}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-5 py-3.5">{t.patientId}</th>
                  <th className="px-5 py-3.5">{t.patientName}</th>
                  <th className="px-5 py-3.5">{t.age} / {t.sex}</th>
                  <th className="px-5 py-3.5">{t.riskLevel}</th>
                  <th className="px-5 py-3.5">{t.riskScore}</th>
                  <th className="px-5 py-3.5">{t.date}</th>
                  <th className="px-5 py-3.5 text-right">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {recentScreenings.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {s.patientId}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {s.patientName && s.patientName.trim() ? s.patientName : t.anonymousPatient}
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
                      {s.date}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onViewReport(s)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 text-teal-700 dark:text-teal-300 font-semibold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.viewReport}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
