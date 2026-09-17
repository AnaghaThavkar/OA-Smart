import os
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix
from ml.training.train_rf import generate_synthetic_dataset

def evaluate_trained_model():
    model_path = os.path.join(os.path.dirname(__file__), "..", "models", "rf_oa_model.joblib")
    model_path = os.path.abspath(model_path)

    if not os.path.exists(model_path):
        print(f"[ERROR] Trained model artifact not found at {model_path}.")
        print("Please run 'python ml/training/train_rf.py' first.")
        return

    artifact = joblib.load(model_path)
    rf_model = artifact["model"]
    feature_names = artifact["feature_names"]
    target_classes = artifact["target_classes"]

    print(f"=== OA-SMART Random Forest Model Evaluation ===")
    print(f"Model Version: {artifact.get('model_version', '1.0.0')}")
    print(f"Artifact Location: {model_path}\n")

    # Generate test dataset (200 samples)
    df_test, y_test = generate_synthetic_dataset(n_samples=200)
    
    y_pred = rf_model.predict(df_test[feature_names])

    print("--- Classification Report ---")
    print(classification_report(y_test, y_pred, target_names=target_classes))

    print("--- Feature Importances ---")
    importances = rf_model.feature_importances_
    for name, imp in sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True):
        print(f"  • {name:25s}: {imp:.4f} ({imp*100:.1f}%)")

if __name__ == "__main__":
    evaluate_trained_model()
