import numpy as np

class SensorDataCleaner:
    """Validates raw sensor records and applies moving average noise reduction."""
    
    @staticmethod
    def validate_packet(packet: dict) -> bool:
        """Returns True if packet contains valid numerical telemetry."""
        required_keys = [
            'thigh_ax', 'thigh_ay', 'thigh_az',
            'thigh_gx', 'thigh_gy', 'thigh_gz',
            'lower_ax', 'lower_ay', 'lower_az',
            'lower_gx', 'lower_gy', 'lower_gz',
            'knee_angle'
        ]
        for key in required_keys:
            val = packet.get(key)
            if val is None or not isinstance(val, (int, float)) or np.isnan(val):
                return False
        return True

    @staticmethod
    def apply_moving_average(signal: list, window_size: int = 3) -> list:
        """Filters high-frequency jitter using simple moving average."""
        if len(signal) < window_size:
            return signal
        weights = np.ones(window_size) / window_size
        return np.convolve(signal, weights, mode='same').tolist()
