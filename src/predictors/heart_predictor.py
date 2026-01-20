import joblib
import pandas as pd
import numpy as np

# Load artifacts once
heart_model = joblib.load("output/heart_disease_lasso_model.joblib")
heart_scaler = joblib.load("output/heart_disease_scaler.joblib")

# Must match training order exactly
HEART_FEATURES = [
    "Age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak",
    "slope", "ca", "thal"
]

def predict_heart_risk(patient_data: dict) -> float:
    """
    Returns probability of heart disease
    """

    df = pd.DataFrame([patient_data])
    df = df.reindex(columns=HEART_FEATURES)

    # Apply same transformations as training
    df["oldpeak"] = np.log1p(df["oldpeak"])
    df["chol"] = np.log1p(df["chol"])

    X_scaled = heart_scaler.transform(df)

    probability = heart_model.predict_proba(X_scaled)[0][1]

    return probability
