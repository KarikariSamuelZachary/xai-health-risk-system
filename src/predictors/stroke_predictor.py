import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder

# Load artifacts once
stroke_model = joblib.load("output/stroke_model.joblib")
stroke_scaler = joblib.load("output/stroke_scaler.joblib")
stroke_encoder = joblib.load("output/stroke_encoder.joblib")

# Categorical and numerical feature lists (must match training)
CATEGORICAL_FEATURES = ['gender', 'ever_married', 'work_type', 'smoking_status']
NUMERICAL_FEATURES = ['age', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi']

def predict_stroke_risk(patient_data: dict) -> float:
    """
    Returns probability of stroke
    
    Args:
        patient_data: dict with keys: gender, age, hypertension, heart_disease,
                     ever_married, work_type, avg_glucose_level, bmi, smoking_status
                     (Residence_type is optional but will be dropped)
    
    Returns:
        float: Probability of stroke (0-1)
    """
    
    df = pd.DataFrame([patient_data])
    
    # Apply same transformations as training
    for col in ['avg_glucose_level', 'bmi']:
        if col in df.columns:
            df[col] = np.log1p(df[col])
    
    # Drop Residence_type if present (not used in model)
    if 'Residence_type' in df.columns:
        df = df.drop(columns=['Residence_type'])
    
    # One-hot encode categorical variables
    X_cat = stroke_encoder.transform(df[CATEGORICAL_FEATURES])
    cat_feature_names = stroke_encoder.get_feature_names_out(CATEGORICAL_FEATURES)
    X_cat_df = pd.DataFrame(X_cat, columns=cat_feature_names, index=df.index)
    
    # Combine numerical and encoded categorical features
    X_processed = pd.concat([df[NUMERICAL_FEATURES], X_cat_df], axis=1)
    
    # Scale features
    X_scaled = stroke_scaler.transform(X_processed)
    
    # Get probability
    probability = stroke_model.predict_proba(X_scaled)[0][1]
    
    return probability