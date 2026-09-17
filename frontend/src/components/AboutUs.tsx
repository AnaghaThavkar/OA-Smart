import React from 'react';
import { Activity, ShieldAlert, Cpu, HeartPulse, CheckCircle2, FileText } from 'lucide-react';
import { translations, Language } from '../i18n/translations';

interface AboutUsProps {
  language: Language;
  onStartScreening?: () => void;
}

export function AboutUs({ language }: AboutUsProps) {
  const t = translations[language].about;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 sm:space-y-10 animate-in fade-in duration-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-3xl p-6 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-teal-100 text-xs font-semibold tracking-wider uppercase border border-white/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-200" /> Clinical Decision Support System
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t.title}
          </h1>
          <p className="text-lg text-teal-100 font-medium">
            {t.tagline}
          </p>
          <p className="text-sm text-teal-50 leading-relaxed font-normal">
            {t.missionDesc}
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <HeartPulse className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t.techTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Dual MPU6050 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t.techDualSensor}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.techDualSensorDesc}
            </p>
          </div>

          {/* 15-Feature ML Model */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t.techML}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.techMLDesc}
            </p>
          </div>

          {/* Edge / Offline Architecture */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t.techEdge}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.techEdgeDesc}
            </p>
          </div>

        </div>
      </div>

      {/* 15-Feature Specification Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            {t.features15Title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.features15Desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {[
            { name: "lower_leg_acc_mag_mean", type: "Kinematic", desc: "Mean tibial acceleration magnitude" },
            { name: "lower_leg_acc_mag_std", type: "Kinematic", desc: "Standard deviation of acceleration" },
            { name: "lower_leg_acc_mag_rms", type: "Kinematic", desc: "Root Mean Square movement energy" },
            { name: "lower_leg_acc_mag_range", type: "Kinematic", desc: "Peak-to-peak acceleration range" },
            { name: "lower_leg_free_acc_mag_mean", type: "Kinematic", desc: "Gravity-compensated dynamic mean" },
            { name: "lower_leg_free_acc_mag_std", type: "Kinematic", desc: "Gravity-compensated dynamic spread" },
            { name: "lower_leg_free_acc_mag_rms", type: "Kinematic", desc: "Gravity-compensated RMS energy" },
            { name: "lower_leg_gyr_mag_mean", type: "Rotational", desc: "Mean tibial angular rotational rate" },
            { name: "lower_leg_gyr_mag_std", type: "Rotational", desc: "Standard deviation of angular rate" },
            { name: "lower_leg_gyr_mag_rms", type: "Rotational", desc: "RMS tibial angular power" },
            { name: "lower_leg_gyr_mag_range", type: "Rotational", desc: "Peak rotational angular excursion" },
            { name: "lower_leg_peak_angular_velocity", type: "Rotational", desc: "Max angular velocity during extension" },
            { name: "Age", type: "Demographic", desc: "Subject chronological age in years" },
            { name: "Sex_encoded", type: "Demographic", desc: "Biological sex encoding (M=1.0, F=0.0)" },
            { name: "BMI", type: "Demographic", desc: "Body Mass Index (kg/m²)" },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-teal-700 dark:text-teal-300 text-[11px]">{idx + 1}. {item.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold">{item.type}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Deployment & Validation Card */}
      <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Community & Rural Field Deployment</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Engineered for rapid, non-invasive triage in primary health centers and rural camps, delivering quantitative biomechanical assessment before irreversible structural cartilage damage occurs.
          </p>
        </div>
      </div>
    </div>
  );
}
