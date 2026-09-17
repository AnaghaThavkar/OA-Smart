import React, { useState } from 'react';
import {
  AlertTriangle, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, ChevronDown, ChevronUp, Code, FileText
} from 'lucide-react';
import { ScreeningRecord } from '../../types/screening';

interface Step5ResultProps {
  screening: ScreeningRecord;
  onViewReport: () => void;
}

export function Step5Result({ screening, onViewReport }: Step5ResultProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Higher Risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" /> Higher Risk (≥ 0.30)
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
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Lower Risk
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-xs space-y-6 transition-colors">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Screening Assessment</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Screening Result</h2>
        </div>
        <div className="text-left sm:text-right text-xs text-slate-400 dark:text-slate-500 font-mono">
          <div>ID: {screening.id}</div>
          <div>{screening.date}</div>
        </div>
      </div>

      {/* Main Result Card */}
      <div className={`p-6 rounded-3xl border ${
        screening.riskLevel === 'Higher Risk'
          ? 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-200'
          : screening.riskLevel === 'Moderate Risk'
          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-200'
          : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              OA-Associated Screening Risk
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {getRiskBadge(screening.riskLevel)}
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
                Score: {(screening.riskScore * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Interpretation</span>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            {screening.interpretation}
          </p>
        </div>
      </div>

      {/* Recommended Next Step */}
      <div className="bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 p-5 rounded-2xl space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Recommended Clinical Action</span>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{screening.recommendedAction}</p>
      </div>

      {/* Mandatory Clinical Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-300 flex items-start gap-2.5 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong>Clinical Notice:</strong> Model-based preliminary screening. Not an autonomous medical diagnosis. Refer patient to an orthopaedic specialist for radiographic correlation.
        </span>
      </div>

      {/* Expandable Technical Details */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-750 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Code className="w-4 h-4 text-slate-400" />
            <span>Technical Details (15-Feature Model Vectors)</span>
          </span>
          {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTechnicalDetails && (
          <div className="p-4 bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2 border-t border-slate-700">
            <p className="text-slate-400">// Feature Vectors & Accelerometer Telemetry</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div>Acceleration RMS: {screening.accelerationStability}</div>
              <div>Gyroscope Range: {screening.gyroscopeRange}</div>
              <div>Gait Stability: {screening.movementStabilityScore}/100</div>
              <div>Gait Symmetry: {screening.movementSymmetry}</div>
            </div>
            {screening.features && (
              <pre className="p-3 bg-slate-950 rounded-xl text-teal-400 overflow-x-auto text-[10px]">
                {JSON.stringify(screening.features, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={onViewReport}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
        >
          <FileText className="w-4 h-4" />
          <span>View Full Clinical Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
