import joblib
import pandas as pd
import numpy as np

# Load artifacts once
diabetes_model = joblib.load("output/diabetes_rf_model.joblib")
diabetes_scaler = joblib.load("output/diabetes_rf_scaler.joblib")
diabetes_cluster_model = joblib.load("output/diabetes_cluster_model.joblib")

DIABETES_FEATURES = [
    "Pregnancies", "Glucose", "BloodPressure",
    "SkinThickness", "Insulin", "BMI",
    "DiabetesPedigreeFunction", "Age"
]

CLUSTER_PROFILES = {
    1: "Baseline / Lower Risk Profile",
    0: "Elevated Metabolic Risk Profile",
    2: "Severe Insulin Resistance Profile"
}


def predict_diabetes_risk(patient_data: dict) -> dict:
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
    cluster_id = int(diabetes_cluster_model.predict(X_scaled)[0])
    profile_name = CLUSTER_PROFILES.get(cluster_id, "Unknown Profile")

    return {
        "probability": float(probability),
        "cluster_id": cluster_id,
        "profile_name": profile_name
    }
