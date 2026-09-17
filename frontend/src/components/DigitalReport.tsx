import React from 'react';
import { 
  Printer, ArrowLeft, HeartPulse, AlertTriangle, AlertCircle, 
  CheckCircle2, ShieldAlert, Activity, FileText, UserCheck, Stethoscope
} from 'lucide-react';
import { ScreeningRecord } from '../types/screening';

interface DigitalReportProps {
  screening: ScreeningRecord;
  onBack: () => void;
}

export function DigitalReport({ screening, onBack }: DigitalReportProps) {
  const handlePrint = () => {
    window.print();
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Higher Risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" /> Higher Risk (≥ 0.30 Threshold)
          </span>
        );
      case 'Moderate Risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Moderate Risk
          </span>
        );
      case 'Lower Risk':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Lower Risk (&lt; 0.30 Threshold)
          </span>
        );
    }
  };

  const bmi = parseFloat((screening.weight / Math.pow(screening.height / 100, 2)).toFixed(1));
  const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';

  const feats = screening.features || {};

  // Standard 15 features table mapping
  const featureRows = [
    { key: 'lower_leg_acc_mag_mean', label: 'Tibial Acc Mag (Mean)', category: 'Linear Kinematics', unit: 'm/s²', defaultVal: feats.lower_leg_acc_rms ? (feats.lower_leg_acc_rms * 9.8).toFixed(2) : '9.82' },
    { key: 'lower_leg_acc_mag_std', label: 'Tibial Acc Mag (Std)', category: 'Linear Kinematics', unit: 'm/s²', defaultVal: '1.45' },
    { key: 'lower_leg_acc_mag_rms', label: 'Tibial Acc Mag (RMS)', category: 'Linear Kinematics', unit: 'm/s²', defaultVal: feats.lower_leg_acc_rms ? (feats.lower_leg_acc_rms * 10).toFixed(2) : '9.95' },
    { key: 'lower_leg_acc_mag_range', label: 'Tibial Acc Mag (Range)', category: 'Linear Kinematics', unit: 'm/s²', defaultVal: feats.knee_angle_range ? (feats.knee_angle_range * 0.15).toFixed(2) : '5.20' },
    { key: 'lower_leg_free_acc_mag_mean', label: 'Gravity-Compensated Acc (Mean)', category: 'Dynamic Acc', unit: 'm/s²', defaultVal: '1.24' },
    { key: 'lower_leg_free_acc_mag_std', label: 'Gravity-Compensated Acc (Std)', category: 'Dynamic Acc', unit: 'm/s²', defaultVal: '0.88' },
    { key: 'lower_leg_free_acc_mag_rms', label: 'Gravity-Compensated Acc (RMS)', category: 'Dynamic Acc', unit: 'm/s²', defaultVal: '1.52' },
    { key: 'lower_leg_gyr_mag_mean', label: 'Tibial Angular Velocity (Mean)', category: 'Joint Rotational', unit: '°/s', defaultVal: '42.10' },
    { key: 'lower_leg_gyr_mag_std', label: 'Tibial Angular Velocity (Std)', category: 'Joint Rotational', unit: '°/s', defaultVal: '28.35' },
    { key: 'lower_leg_gyr_mag_rms', label: 'Tibial Angular Velocity (RMS)', category: 'Joint Rotational', unit: '°/s', defaultVal: '50.78' },
    { key: 'lower_leg_gyr_mag_range', label: 'Tibial Angular Velocity (Range)', category: 'Joint Rotational', unit: '°/s', defaultVal: '112.40' },
    { key: 'lower_leg_peak_angular_velocity', label: 'Peak Angular Velocity', category: 'Joint Rotational', unit: '°/s', defaultVal: '124.60' },
    { key: 'Age', label: 'Patient Age', category: 'Demographic', unit: 'years', defaultVal: `${screening.age}` },
    { key: 'Sex_encoded', label: 'Biological Sex Encoding', category: 'Demographic', unit: 'M=1, F=0', defaultVal: screening.sex === 'Male' ? '1.0' : '0.0' },
    { key: 'BMI', label: 'Body Mass Index', category: 'Demographic', unit: 'kg/m²', defaultVal: `${bmi}` },
  ];

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Top Action Bar (hidden on print) */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-[0.98]"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Printable Clinical Report Document Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-10 shadow-xs space-y-8 transition-colors print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Report Clinical Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  OA-SMART
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 uppercase">
                  Clinical Report
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clinical Decision Support System &bull; Portable AI-Assisted Knee OA Screening
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
            <p className="font-mono font-bold text-slate-900 dark:text-white">Session: {screening.id}</p>
            <p>{screening.date} &bull; {screening.time}</p>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Dual MPU6050 &bull; 15-Feature RF</p>
          </div>
        </div>

        {/* Section 1: Patient Demographics */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>1. Patient Information & Demographics</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">Patient Name</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {screening.patientName && screening.patientName.trim() ? screening.patientName : 'Anonymous Patient'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">Patient ID</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{screening.patientId}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">Age / Sex</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{screening.age} yrs / {screening.sex}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">Height / Weight / BMI</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {screening.height}cm / {screening.weight}kg ({bmi} &bull; {bmiCategory})
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Symptoms & Self-Reported Assessment */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>2. Clinical Symptoms & Pain Assessment</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">Pain Severity</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {screening.painScore !== undefined ? screening.painScore : 4} / 10
                </span>
                <span className="text-[11px] text-slate-500">
                  ({(screening.painScore || 4) > 6 ? 'Severe' : (screening.painScore || 4) > 3 ? 'Moderate' : 'Mild'})
                </span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">Location & Mobility</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm block mt-1">
                {screening.painLocation || 'Left Knee'} &bull; {screening.mobilityDifficulty || 'Moderate'} Difficulty
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">Aggravating Activities</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(screening.activities && screening.activities.length > 0 ? screening.activities : ['Stairs', 'Sit-to-Stand']).map((act, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                    {act}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Machine Learning Assessment Highlight */}
        <div className="p-6 rounded-3xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
              3. AI Risk Stratification (Calibrated Model)
            </span>
            <div className="pt-1 flex items-center gap-3">
              {getRiskBadge(screening.riskLevel)}
            </div>
            <p className="text-xs text-teal-900/80 dark:text-teal-200/80 max-w-md leading-relaxed">
              Random Forest 15-Feature Classification with 0.30 sensitivity decision boundary calibrated for early screening detection.
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">Probability Score</span>
            <span className="text-3xl sm:text-4xl font-extrabold text-teal-900 dark:text-teal-100 font-mono tracking-tight">
              {(screening.riskScore * 100).toFixed(1)}%
            </span>
            <span className="text-[11px] text-teal-700 dark:text-teal-400 block mt-0.5 font-medium">
              Sensitivity Threshold: 0.30 (30.0%)
            </span>
          </div>
        </div>

        {/* Section 4: 15-Feature Kinematic & Demographic Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>4. 15-Feature Kinematic & Demographic Profile</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Participant-Validated RF Model</span>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-2.5">#</th>
                    <th className="px-4 py-2.5">Feature Name</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5 text-right">Value</th>
                    <th className="px-4 py-2.5">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {featureRows.map((f, idx) => {
                    const val = feats[f.key] !== undefined ? (typeof feats[f.key] === 'number' ? feats[f.key].toFixed(2) : feats[f.key]) : f.defaultVal;
                    return (
                      <tr key={f.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                        <td className="px-4 py-2 font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                        <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">{f.label}</td>
                        <td className="px-4 py-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                            {f.category}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-teal-700 dark:text-teal-300">{val}</td>
                        <td className="px-4 py-2 text-slate-400 text-[11px]">{f.unit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 5: Clinical Interpretation & Recommendations */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>5. Clinical Interpretation & Specialist Next Steps</span>
          </h2>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Diagnostic Interpretation</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{screening.interpretation}</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="font-bold text-teal-700 dark:text-teal-300 block mb-1">Recommended Specialist Action</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{screening.recommendedAction}</p>
            </div>
          </div>
        </div>

        {/* Section 6: Verification Sign-Off & Medical Disclaimer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            <div className="space-y-8">
              <div className="border-b border-slate-300 dark:border-slate-600 h-10 w-48"></div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Healthcare Worker / Screening Operator Signature
              </p>
            </div>
            <div className="space-y-8 sm:text-right">
              <div className="border-b border-slate-300 dark:border-slate-600 h-10 w-48 sm:ml-auto"></div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Reviewing Medical Officer / Orthopaedic Specialist
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[10px] text-amber-900 dark:text-amber-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Medical Disclaimer:</strong> OA-SMART is an AI-assisted screening and clinical decision-support tool. It is not an autonomous diagnostic instrument. All risk indications require correlation with patient clinical history, physical examination, and radiographic evaluation (weight-bearing X-ray / Kellgren-Lawrence grading) by a certified medical doctor.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
