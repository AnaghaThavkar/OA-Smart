from typing import List, Dict, Any
from ml.preprocessing.cleaner import SensorDataCleaner
from ml.features.extractor import FeatureExtractor

class DataPreprocessingService:
    """Backend service for validating raw sensor packets, applying noise reduction, and computing features."""

    @staticmethod
    def preprocess_and_extract(sensor_packets: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not sensor_packets:
            return {}

        # 1. Validation & Filter Invalid Packets
        valid_packets = [p for p in sensor_packets if SensorDataCleaner.validate_packet(p)]
        if not valid_packets:
            valid_packets = sensor_packets

        # 2. Moving Average Noise Filter
        keys_to_smooth = [
            'thigh_ax', 'thigh_ay', 'thigh_az',
            'thigh_gx', 'thigh_gy', 'thigh_gz',
            'lower_ax', 'lower_ay', 'lower_az',
            'lower_gx', 'lower_gy', 'lower_gz',
            'knee_angle'
        ]

        cleaned_packets = [dict(p) for p in valid_packets]
        for key in keys_to_smooth:
            raw_signal = [p[key] for p in cleaned_packets if key in p]
            smoothed_signal = SensorDataCleaner.apply_moving_average(raw_signal, window_size=3)
            for i, val in enumerate(smoothed_signal):
                cleaned_packets[i][key] = val

        # 3. Feature Extraction
        return FeatureExtractor.extract_features(cleaned_packets)
