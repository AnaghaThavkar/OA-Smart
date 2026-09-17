import React from 'react';
import { Activity, ArrowRight, ArrowLeft } from 'lucide-react';

interface Step2SymptomsProps {
  painScore: number;
  setPainScore: (val: number) => void;
  painLocation: string;
  setPainLocation: (val: string) => void;
  mobilityDifficulty: string;
  setMobilityDifficulty: (val: string) => void;
  activities: string[];
  setActivities: (val: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Symptoms({
  painScore, setPainScore, painLocation, setPainLocation,
  mobilityDifficulty, setMobilityDifficulty, activities, setActivities,
  onNext, onBack
}: Step2SymptomsProps) {
  const toggleActivity = (act: string) => {
    setActivities(
      activities.includes(act)
        ? activities.filter(a => a !== act)
        : [...activities, act]
    );
  };

  const mobilityOptions = [
    { id: 'None', label: 'No difficulty' },
    { id: 'Mild', label: 'Mild difficulty' },
    { id: 'Moderate', label: 'Moderate difficulty' },
    { id: 'Severe', label: 'Severe difficulty' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-xs space-y-6 transition-colors">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Symptom Assessment
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Record the patient's current joint pain severity, location, and functional mobility.
        </p>
      </div>

      {/* Pain Level Slider */}
      <div className="space-y-3 p-5 bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 rounded-2xl">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Joint Pain Severity</label>
          <span className="text-sm font-bold text-teal-700 dark:text-teal-300 font-mono bg-white dark:bg-slate-700 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-600 shadow-2xs">
            {painScore} / 10
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={painScore}
          onChange={e => setPainScore(parseInt(e.target.value))}
          className="w-full accent-teal-600 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-1">
          <span>0 — No pain</span>
          <span>5 — Moderate</span>
          <span>10 — Severe pain</span>
        </div>
      </div>

      {/* Primary Pain Location */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Primary Joint Location</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {['Left Knee', 'Right Knee', 'Both Knees', 'General Joint'].map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setPainLocation(loc)}
              className={`py-3 px-3 text-xs rounded-xl border font-semibold transition-all ${
                painLocation === loc
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-200 shadow-2xs'
                  : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-650'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Mobility Difficulty Cards */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Mobility Impairment</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {mobilityOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setMobilityDifficulty(opt.id)}
              className={`py-3 px-3 text-xs rounded-xl border font-semibold transition-all ${
                mobilityDifficulty === opt.id
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-200 shadow-2xs'
                  : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-650'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Activities Affected */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Daily Activities Affected</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {['Walking', 'Standing', 'Stairs', 'Sit-to-Stand'].map((act) => {
            const isSelected = activities.includes(act);
            return (
              <button
                key={act}
                type="button"
                onClick={() => toggleActivity(act)}
                className={`py-3 px-3 text-xs rounded-xl border font-semibold transition-all ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-200 shadow-2xs'
                    : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-650'
                }`}
              >
                {act}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all active:scale-[0.98]"
        >
          <span>Continue to Movement Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
