import joblib
import pandas as pd
import numpy as np

# Load artifacts once
diabetes_model = joblib.load("output/diabetes_rf_model.joblib")
diabetes_scaler = joblib.load("output/diabetes_rf_scaler.joblib")

DIABETES_FEATURES = [
    "Pregnancies", "Glucose", "BloodPressure",
    "SkinThickness", "Insulin", "BMI",
    "DiabetesPedigreeFunction", "Age"
]

def predict_diabetes_risk(patient_data: dict) -> float:
    """
    Returns probability of diabetes
    """

    df = pd.DataFrame([patient_data])

    for col in ['Insulin', 'DiabetesPedigreeFunction', 'Age']:
         if col in df.columns:
             df[col] = np.log1p(df[col])
             
    df = df.reindex(columns=DIABETES_FEATURES)

    X_scaled = diabetes_scaler.transform(df)

    probability = diabetes_model.predict_proba(X_scaled)[0][1]

    return probability
