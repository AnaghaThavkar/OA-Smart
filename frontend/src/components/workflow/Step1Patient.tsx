import React from 'react';
import { User, ArrowRight } from 'lucide-react';

interface Step1PatientProps {
  patientId: string;
  setPatientId: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  age: number;
  setAge: (val: number) => void;
  sex: 'Female' | 'Male' | 'Other';
  setSex: (val: 'Female' | 'Male' | 'Other') => void;
  height: number;
  setHeight: (val: number) => void;
  weight: number;
  setWeight: (val: number) => void;
  bmi: number;
  onNext: () => void;
  onCancel: () => void;
}

export function Step1Patient({
  patientId, setPatientId, name, setName, age, setAge,
  sex, setSex, height, setHeight, weight, setWeight, bmi,
  onNext, onCancel
}: Step1PatientProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-xs space-y-6 transition-colors">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Patient Information
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter patient parameters for the 15-feature biomechanical model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Patient ID *</label>
          <input
            type="text"
            required
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name (Optional)</label>
          <input
            type="text"
            placeholder="Anonymous Patient (or enter name)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Age (Years) *</label>
          <input
            type="number"
            required
            min="18"
            max="110"
            value={age}
            onChange={e => setAge(parseInt(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Sex *</label>
          <select
            value={sex}
            onChange={e => setSex(e.target.value as any)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            <option value="Female">Female (0.0)</option>
            <option value="Male">Male (1.0)</option>
            <option value="Other">Other (0.5)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Height (cm) *</label>
          <input
            type="number"
            required
            min="100"
            max="230"
            value={height}
            onChange={e => setHeight(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Weight (kg) *</label>
          <input
            type="number"
            required
            min="30"
            max="200"
            value={weight}
            onChange={e => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Auto-calculated BMI Box */}
      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
        <span>Calculated Body Mass Index (BMI): <strong className="text-slate-900 dark:text-white font-bold text-sm ml-1">{bmi} kg/m²</strong></span>
        <span className="text-slate-400 dark:text-slate-500">Auto-calculated</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all active:scale-[0.98]"
        >
          <span>Continue to Symptoms</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
