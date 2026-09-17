import numpy as np

class FeatureExtractor:
    """Calculates statistical summary and kinetic features from time-series sensor streams."""

    FEATURE_VERSION = "2.0.0"

    FEATURE_NAMES = [
        "lower_leg_acc_mag_mean",
        "lower_leg_acc_mag_std",
        "lower_leg_acc_mag_rms",
        "lower_leg_acc_mag_range",
        "lower_leg_free_acc_mag_mean",
        "lower_leg_free_acc_mag_std",
        "lower_leg_free_acc_mag_rms",
        "lower_leg_gyr_mag_mean",
        "lower_leg_gyr_mag_std",
        "lower_leg_gyr_mag_rms",
        "lower_leg_gyr_mag_range",
        "lower_leg_peak_angular_velocity"
    ]

    @staticmethod
    def extract_features(sensor_packets: list) -> dict:
        """
        Input: List of dict packets with lower_ax..az, lower_gx..gz
        Returns: Key-value dictionary of the exact 12 lower-leg magnitude features.
        """
        if not sensor_packets:
            return {name: 0.0 for name in FeatureExtractor.FEATURE_NAMES}

        lower_ax = np.array([float(p.get('lower_ax', 0.0)) for p in sensor_packets], dtype=float)
        lower_ay = np.array([float(p.get('lower_ay', 0.0)) for p in sensor_packets], dtype=float)
        lower_az = np.array([float(p.get('lower_az', 0.0)) for p in sensor_packets], dtype=float)

        lower_gx = np.array([float(p.get('lower_gx', 0.0)) for p in sensor_packets], dtype=float)
        lower_gy = np.array([float(p.get('lower_gy', 0.0)) for p in sensor_packets], dtype=float)
        lower_gz = np.array([float(p.get('lower_gz', 0.0)) for p in sensor_packets], dtype=float)

        # Magnitudes
        acc_mag = np.sqrt(lower_ax**2 + lower_ay**2 + lower_az**2)
        free_acc_mag = np.abs(acc_mag - 1.0)
        gyr_mag = np.sqrt(lower_gx**2 + lower_gy**2 + lower_gz**2)

        def rms(arr):
            return float(np.sqrt(np.mean(np.square(arr)))) if len(arr) > 0 else 0.0

        features = {
            "lower_leg_acc_mag_mean": float(np.mean(acc_mag)) if len(acc_mag) > 0 else 0.0,
            "lower_leg_acc_mag_std": float(np.std(acc_mag)) if len(acc_mag) > 0 else 0.0,
            "lower_leg_acc_mag_rms": rms(acc_mag),
            "lower_leg_acc_mag_range": float(np.max(acc_mag) - np.min(acc_mag)) if len(acc_mag) > 0 else 0.0,

            "lower_leg_free_acc_mag_mean": float(np.mean(free_acc_mag)) if len(free_acc_mag) > 0 else 0.0,
            "lower_leg_free_acc_mag_std": float(np.std(free_acc_mag)) if len(free_acc_mag) > 0 else 0.0,
            "lower_leg_free_acc_mag_rms": rms(free_acc_mag),

            "lower_leg_gyr_mag_mean": float(np.mean(gyr_mag)) if len(gyr_mag) > 0 else 0.0,
            "lower_leg_gyr_mag_std": float(np.std(gyr_mag)) if len(gyr_mag) > 0 else 0.0,
            "lower_leg_gyr_mag_rms": rms(gyr_mag),
            "lower_leg_gyr_mag_range": float(np.max(gyr_mag) - np.min(gyr_mag)) if len(gyr_mag) > 0 else 0.0,
            "lower_leg_peak_angular_velocity": float(np.max(gyr_mag)) if len(gyr_mag) > 0 else 0.0,
        }

        return features
