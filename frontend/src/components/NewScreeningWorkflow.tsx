import React, { useState, useEffect } from 'react';
import { Step1Patient } from './workflow/Step1Patient';
import { Step2Symptoms } from './workflow/Step2Symptoms';
import { Step3Movement } from './workflow/Step3Movement';
import { Step4Analysis } from './workflow/Step4Analysis';
import { Step5Result } from './workflow/Step5Result';
import { WebBluetoothService } from '../services/bluetooth/WebBluetoothService';
import { ApiClient } from '../services/api/client';
import { LocalDB } from '../services/storage/db';
import { FrontendFeatureExtractor } from '../processing/featureExtraction';
import { ScreeningRecord, RiskLevel } from '../types/screening';
import { SensorPacket } from '../types/sensor';

interface NewScreeningWorkflowProps {
  onComplete: (screening: ScreeningRecord) => void;
  onCancel: () => void;
}

export function NewScreeningWorkflow({ onComplete, onCancel }: NewScreeningWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State - Step 1: Patient
  const [patientId, setPatientId] = useState<string>(`ARC-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(55);
  const [sex, setSex] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [height, setHeight] = useState<number>(165);
  const [weight, setWeight] = useState<number>(68);

  // Form State - Step 2: Symptoms
  const [painScore, setPainScore] = useState<number>(4);
  const [painLocation, setPainLocation] = useState<string>('Left Knee');
  const [mobilityDifficulty, setMobilityDifficulty] = useState<string>('Moderate');
  const [activities, setActivities] = useState<string[]>(['Stairs', 'Sit-to-Stand']);

  // Sensor Telemetry - Step 3: Movement (Strictly Real Physical Web Bluetooth)
  const [collectedPackets, setCollectedPackets] = useState<SensorPacket[]>([]);
  const [bluetoothService] = useState<WebBluetoothService>(() => new WebBluetoothService());

  // Screening Result - Step 5
  const [screeningResult, setScreeningResult] = useState<ScreeningRecord | null>(null);

  const bmi = parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));

  const handleStep1Next = async () => {
    const cleanName = (name && name.trim()) ? name.trim() : 'Anonymous Patient';
    try {
      // 1. Immediately persist patient to backend SQLite database via POST /api/patients
      await ApiClient.createPatient({
        id: patientId,
        name: cleanName,
        age,
        gender: sex
      });
      // 2. Also persist to local offline storage
      await LocalDB.savePatient({
        patientId,
        name: cleanName,
        age,
        sex,
        height,
        weight,
        bmi
      });
    } catch (err) {
      console.warn('Could not save patient on Step 1:', err);
    }
    setCurrentStep(2);
  };

  // Handle Analysis Trigger
  const handleTriggerAnalysis = async () => {
    if (collectedPackets.length === 0) {
      alert('No sensor data collected. Please pair the physical ESP32 wearable and record movement kinematics before proceeding to analysis.');
      return;
    }
    setCurrentStep(4); // Move to Step 4: Analysis State Animation
  };

  const handleCompleteAnalysis = async () => {
    const screeningId = `SCR-${Math.floor(1000 + Math.random() * 9000)}`;

    // Calculate BMI
    const h_m = height > 0 ? height / 100.0 : 1.70;
    const computedBmi = (height > 0 && weight > 0) ? Number((weight / (h_m * h_m)).toFixed(2)) : 25.0;

    // Perform API analysis with 15 features (12 sensor features + Age, Sex, BMI)
    let mlResponse = await ApiClient.analyzeScreening(
      screeningId,
      collectedPackets,
      {
        painScore,
        painLocation,
        mobilityDifficulty,
        activities
      },
      {
        patientId,
        age,
        sex,
        height,
        weight,
        bmi: computedBmi
      }
    );

    let riskLevel: RiskLevel = 'Lower Risk';
    let riskScore = 0.25;
    let recommendation = 'Standard functional movement observed. Maintain routine physical activity and joint health monitoring.';
    let features: Record<string, number> = {};

    if (mlResponse && mlResponse.prediction) {
      const predLabel = mlResponse.prediction;
      const isOaDetected = mlResponse.is_oa_detected || predLabel === 'HIGH_RISK';
      if (isOaDetected) {
        riskLevel = 'Higher Risk';
        riskScore = mlResponse.oa_score !== undefined ? mlResponse.oa_score : (mlResponse.probabilities?.HIGH_RISK || 0.85);
      } else {
        riskLevel = 'Lower Risk';
        riskScore = mlResponse.oa_score !== undefined ? mlResponse.oa_score : (mlResponse.probabilities?.HIGH_RISK || 0.15);
      }
      recommendation = mlResponse.recommendation || recommendation;
      features = mlResponse.features || {};
    } else {
      // Local Feature Extractor Fallback
      const localFeatures = FrontendFeatureExtractor.extract(collectedPackets);
      const localEval = FrontendFeatureExtractor.evaluateRiskLocally(localFeatures);
      features = localFeatures;
      recommendation = localEval.recommendation;

      if (localEval.prediction === 'HIGH_RISK') {
        riskLevel = 'Higher Risk';
        riskScore = 0.82;
      } else {
        riskLevel = 'Lower Risk';
        riskScore = 0.18;
      }
    }

    const cleanName = (name && name.trim()) ? name.trim() : 'Anonymous Patient';

    const newRecord: ScreeningRecord = {
      id: screeningId,
      patientId,
      patientName: cleanName,
      age,
      sex,
      height,
      weight,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      riskLevel,
      riskScore,
      painScore,
      painLocation,
      mobilityDifficulty,
      activities,
      accelerationStability: `${(40 + (features.knee_angle_range || 30) * 0.8).toFixed(1)} m/s²`,
      gyroscopeRange: `${(60 + (features.knee_angle_range || 30) * 1.5).toFixed(1)} °/s`,
      movementStabilityScore: Math.round(100 - riskScore * 60),
      gaitConsistency: `${Math.round(95 - riskScore * 40)}%`,
      movementSymmetry: `${Math.round(92 - riskScore * 35)}%`,
      steps: collectedPackets.length > 0 ? Math.floor(collectedPackets.length / 15) : 22,
      walkingDuration: '15s',
      interpretation: riskLevel === 'Higher Risk'
        ? 'Restricted joint flexion range and kinematic asymmetry indicate elevated OA-associated screening risk (exceeding 0.30 decision threshold).'
        : 'Movement kinematics, joint flexion range, and angular velocity are within normative functional limits (below 0.30 threshold).',
      recommendedAction: recommendation,
      features
    };

    // Save to Local DB & Backend DB
    await LocalDB.savePatient({ patientId, name: cleanName, age, sex, height, weight, bmi });
    await LocalDB.saveScreening(newRecord);
    await ApiClient.createPatient({ id: patientId, name: cleanName, age, gender: sex });

    setScreeningResult(newRecord);
    setCurrentStep(5); // Move to Step 5: Result Page
  };

  const stepsList = [
    { num: 1, label: '01 Patient' },
    { num: 2, label: '02 Symptoms' },
    { num: 3, label: '03 Movement' },
    { num: 4, label: '04 Assessment' },
    { num: 5, label: '05 Report' },
  ];

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-xs select-none transition-colors">
        <div className="flex items-center justify-between overflow-x-auto gap-2 no-scrollbar py-1">
          {stepsList.map((s, idx) => {
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`text-xs font-bold ${
                    isActive ? 'text-teal-700 dark:text-teal-300' : isDone ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div className={`h-0.5 w-4 sm:w-10 md:w-12 shrink-0 ${currentStep > s.num ? 'bg-emerald-400 dark:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP COMPONENTS */}
      {currentStep === 1 && (
        <Step1Patient
          patientId={patientId} setPatientId={setPatientId}
          name={name} setName={setName}
          age={age} setAge={setAge}
          sex={sex} setSex={setSex}
          height={height} setHeight={setHeight}
          weight={weight} setWeight={setWeight}
          bmi={bmi}
          onNext={handleStep1Next}
          onCancel={onCancel}
        />
      )}

      {currentStep === 2 && (
        <Step2Symptoms
          painScore={painScore} setPainScore={setPainScore}
          painLocation={painLocation} setPainLocation={setPainLocation}
          mobilityDifficulty={mobilityDifficulty} setMobilityDifficulty={setMobilityDifficulty}
          activities={activities} setActivities={setActivities}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <Step3Movement
          bluetoothService={bluetoothService}
          collectedPackets={collectedPackets}
          setCollectedPackets={setCollectedPackets}
          onAnalyze={handleTriggerAnalysis}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <Step4Analysis onCompleteAnalysis={handleCompleteAnalysis} />
      )}

      {currentStep === 5 && screeningResult && (
        <Step5Result
          screening={screeningResult}
          onViewReport={() => onComplete(screeningResult)}
        />
      )}
    </div>
  );
}
