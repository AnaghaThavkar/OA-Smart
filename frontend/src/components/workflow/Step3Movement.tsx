import React, { useState, useEffect } from 'react';
import { 
  Cpu, Play, CheckCircle2, ArrowLeft, Loader2, RefreshCw, 
  Bluetooth, Square, AlertCircle, Radio, Activity, Wifi
} from 'lucide-react';
import { SensorPacket } from '../../types/sensor';
import { ConnectionStatus } from '../../services/bluetooth/BluetoothService';
import { HARDWARE_CONFIG } from '../../services/bluetooth/hardware.config';

interface Step3MovementProps {
  bluetoothService: any;
  collectedPackets: SensorPacket[];
  setCollectedPackets: React.Dispatch<React.SetStateAction<SensorPacket[]>>;
  onAnalyze: () => void;
  onBack: () => void;
}

export function Step3Movement({
  bluetoothService,
  collectedPackets,
  setCollectedPackets,
  onAnalyze,
  onBack
}: Step3MovementProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(15);
  const [bleStatus, setBleStatus] = useState<ConnectionStatus>('DISCONNECTED');
  const [latestPacket, setLatestPacket] = useState<SensorPacket | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  // Subscribe to sensor telemetry and status
  useEffect(() => {
    if (!bluetoothService) return;

    if (bluetoothService.getStatus) {
      setBleStatus(bluetoothService.getStatus());
    }

    const unsubStatus = bluetoothService.subscribeToStatus ? bluetoothService.subscribeToStatus((status: ConnectionStatus) => {
      setBleStatus(status);
      if (status === 'CONNECTED') {
        setConnectError(null);
      }
    }) : () => {};

    const unsubData = bluetoothService.subscribeToSensorData ? bluetoothService.subscribeToSensorData((packet: SensorPacket) => {
      setLatestPacket(packet);
      if (isRecording) {
        setCollectedPackets(prev => [...prev, packet]);
      }
    }) : () => {};

    return () => {
      if (unsubStatus) unsubStatus();
      if (unsubData) unsubData();
    };
  }, [bluetoothService, isRecording, setCollectedPackets]);

  // Recording countdown
  useEffect(() => {
    let timer: any = null;
    if (isRecording && recordingSeconds > 0) {
      timer = setInterval(() => {
        setRecordingSeconds(prev => prev - 1);
      }, 1000);
    } else if (isRecording && recordingSeconds === 0) {
      handleStopRecording();
    }
    return () => clearInterval(timer);
  }, [isRecording, recordingSeconds]);

  const handleConnectHardware = async () => {
    setConnectError(null);
    if (!bluetoothService) return;
    try {
      const ok = await bluetoothService.connect();
      if (!ok) {
        const lastErr = bluetoothService.getLastError ? bluetoothService.getLastError() : 'Connection could not be established.';
        setConnectError(lastErr || 'Could not connect to ESP32 device.');
      }
    } catch (err: any) {
      setConnectError(err?.message || 'Bluetooth connection failed.');
    }
  };

  const handleDisconnectHardware = async () => {
    if (!bluetoothService) return;
    try {
      await bluetoothService.disconnect();
    } catch (err) {
      console.warn('Error disconnecting:', err);
    }
  };

  const handleStartRecording = async () => {
    if (!bluetoothService || bleStatus !== 'CONNECTED') {
      setConnectError('Please pair and connect the physical ESP32 wearable sensor before starting the movement test.');
      return;
    }

    setCollectedPackets([]);
    setRecordingSeconds(15);
    setConnectError(null);

    try {
      await bluetoothService.startStreaming();
      setIsRecording(true);
    } catch (err: any) {
      setConnectError(err?.message || 'Failed to start sensor data stream.');
    }
  };

  const handleStopRecording = async () => {
    if (bluetoothService) {
      try {
        await bluetoothService.stopStreaming();
      } catch (err) {
        console.warn('Error stopping BLE notifications:', err);
      }
    }
    setIsRecording(false);
  };

  const isComplete = !isRecording && collectedPackets.length > 0;
  const isConnected = bleStatus === 'CONNECTED';
  const isConnecting = bleStatus === 'CONNECTING';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 shadow-xs space-y-6 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Movement Assessment
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real ESP32 Dual-MPU6050 Sit-to-Stand Functional Kinematics Test (50 Hz)
          </p>
        </div>

        {/* Hardware Status Tag */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>ESP32 Connected</span>
            </span>
          ) : isConnecting ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
              <Loader2 className="w-3.5 h-3.5 text-sky-600 animate-spin" />
              <span>Pairing ESP32...</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
              <Bluetooth className="w-3.5 h-3.5 text-slate-400" />
              <span>Wearable Standby</span>
            </span>
          )}
        </div>
      </div>

      {/* Hardware Connection Card */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isConnected
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
          : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Wifi className={`w-4 h-4 ${isConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {isConnected
                  ? (bluetoothService?.getDeviceName ? bluetoothService.getDeviceName() : 'ESP32 Wearable Connected')
                  : 'Physical ESP32 Wearable Sensor'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              GATT Service UUID: <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">{HARDWARE_CONFIG.SERVICE_UUID}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isConnected ? (
              <button
                type="button"
                onClick={handleDisconnectHardware}
                disabled={isRecording}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                Disconnect Wearable
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnectHardware}
                disabled={isConnecting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm disabled:opacity-50 transition-all active:scale-98"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4" />
                    <span>Pair &amp; Connect ESP32</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Error Notice */}
        {connectError && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">{connectError}</span>
              <p className="text-[11px] text-red-600 dark:text-red-400 leading-relaxed">
                Ensure ESP32 is powered on and advertising ({HARDWARE_CONFIG.DEVICE_NAME_PREFIX}), Bluetooth is enabled in Windows settings, and you are using Google Chrome or Microsoft Edge.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Sensor Channel Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Thigh Sensor */}
        <div className="p-4 bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Thigh IMU (0x68)</span>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span>{isConnected ? 'Active (Mid-Femur)' : 'Standby / Unpaired'}</span>
          </div>
        </div>

        {/* Shin Sensor */}
        <div className="p-4 bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Shin IMU (0x69)</span>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span>{isConnected ? 'Active (Mid-Tibia)' : 'Standby / Unpaired'}</span>
          </div>
        </div>

        {/* Telemetry Channel */}
        <div className="p-4 bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Telemetry Channel</span>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-300">
            {isRecording ? (
              <>
                <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                <span>Streaming @ 50 Hz</span>
              </>
            ) : isComplete ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{collectedPackets.length} Samples Captured</span>
              </>
            ) : isConnected ? (
              <>
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ready to Stream</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>Awaiting Connection</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Movement Recording Stage */}
      <div className="bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 text-center space-y-6">
        
        {/* State 1: Hardware Not Connected */}
        {!isConnected && !isComplete && (
          <div className="space-y-4 max-w-md mx-auto py-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
              <Bluetooth className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Connect ESP32 Wearable to Begin
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Click <strong>"Pair &amp; Connect ESP32"</strong> above. Ensure the wearable device is turned on with both MPU6050 sensors attached securely to the patient's leg.
              </p>
            </div>
          </div>
        )}

        {/* State 2: Hardware Connected & Ready to Record */}
        {isConnected && !isRecording && !isComplete && (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Hardware Paired &amp; Calibrated
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Measurement Duration: 15 Seconds
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Clinical Protocol: Instruct patient to sit upright on a standard chair. When recording begins, instruct patient to perform 3 to 5 continuous, smooth Sit-to-Stand repetitions with arms crossed over chest.
            </p>
            <button
              type="button"
              onClick={handleStartRecording}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start 15-Second Motion Test</span>
            </button>
          </div>
        )}

        {/* State 3: Active Recording in Progress */}
        {isRecording && (
          <div className="space-y-5 max-w-md mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
              Recording Physical Kinematics (50 Hz Real Stream)
            </span>
            <div className="text-6xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${((15 - recordingSeconds) / 15) * 100}%` }}
                className="bg-teal-600 h-full transition-all duration-1000"
              />
            </div>

            {/* Live Telemetry Display */}
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs font-mono space-y-1">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Packets Captured:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{collectedPackets.length}</span>
              </div>
              {latestPacket && (
                <>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Thigh Acc (X, Y, Z):</span>
                    <span>{latestPacket.thigh_ax.toFixed(2)}, {latestPacket.thigh_ay.toFixed(2)}, {latestPacket.thigh_az.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Shin Acc (X, Y, Z):</span>
                    <span>{latestPacket.lower_ax.toFixed(2)}, {latestPacket.lower_ay.toFixed(2)}, {latestPacket.lower_az.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Instantaneous Knee Angle:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{latestPacket.knee_angle.toFixed(1)}°</span>
                  </div>
                </>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse font-medium">
              Patient is executing Sit-to-Stand transitions...
            </p>

            {/* Stop Early */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStopRecording}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 text-xs font-bold transition-all shadow-xs active:scale-98"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Finish Recording Now ({collectedPackets.length} packets)</span>
              </button>
            </div>
          </div>
        )}

        {/* State 4: Recording Completed */}
        {isComplete && (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Movement Test Complete
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Captured {collectedPackets.length} Real Kinematic Samples
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Real sensor telemetry validated. Ready to compute the 15 biomechanical features and evaluate risk using the calibrated Random Forest model (threshold: 0.30).
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartRecording}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-record Test</span>
              </button>
              <button
                type="button"
                onClick={onAnalyze}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all active:scale-[0.98]"
              >
                <span>Execute ML Assessment</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
        <button
          type="button"
          onClick={onBack}
          disabled={isRecording}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Symptoms</span>
        </button>
      </div>

    </div>
  );
}
