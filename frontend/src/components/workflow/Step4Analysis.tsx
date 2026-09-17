import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface Step4AnalysisProps {
  onCompleteAnalysis: () => void;
}

export function Step4Analysis({ onCompleteAnalysis }: Step4AnalysisProps) {
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStep1Done(true), 600);
    const t2 = setTimeout(() => setStep2Done(true), 1200);
    const t3 = setTimeout(() => {
      setStep3Done(true);
      setTimeout(onCompleteAnalysis, 500);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onCompleteAnalysis]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-12 shadow-xs max-w-lg mx-auto text-center space-y-8 transition-colors">
      <div className="space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-2xs">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analyzing Screening</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Processing movement kinematics and evaluating 15-feature ML indicators.</p>
      </div>

      <div className="space-y-4 text-left max-w-xs mx-auto border-t border-b border-slate-100 dark:border-slate-700 py-6">
        <div className="flex items-center gap-3 text-xs">
          {step1Done ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <Loader2 className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-spin shrink-0" />
          )}
          <span className={step1Done ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}>
            Movement telemetry processed
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {step2Done ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <span className={`w-5 h-5 rounded-full border-2 ${step1Done ? 'border-teal-600 border-t-transparent animate-spin' : 'border-slate-200 dark:border-slate-700'} shrink-0`} />
          )}
          <span className={step2Done ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}>
            15 features extracted
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {step3Done ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <span className={`w-5 h-5 rounded-full border-2 ${step2Done ? 'border-teal-600 border-t-transparent animate-spin' : 'border-slate-200 dark:border-slate-700'} shrink-0`} />
          )}
          <span className={step3Done ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}>
            Calibrated RF model evaluated (0.30)
          </span>
        </div>
      </div>
    </div>
  );
}
