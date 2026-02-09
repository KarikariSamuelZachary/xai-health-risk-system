import numpy as np
import pandas as pd
import joblib
import shap
from sklearn.preprocessing import OneHotEncoder

# ---------- Paths ----------
DATA_PATH = 'data/processed/stroke_processed.csv'
SCALER_PATH = 'output/stroke_scaler.joblib'
MODEL_PATH = 'output/stroke_model.joblib'
ENCODER_PATH = 'output/stroke_encoder.joblib'

# ---------- Load Data ----------
data = pd.read_csv(DATA_PATH)

# Drop ID column if present
if 'id' in data.columns:
    data = data.drop(columns=['id'])

# Set proper data types
data['gender'] = data['gender'].astype('category')
data['ever_married'] = data['ever_married'].astype('category')
data['work_type'] = data['work_type'].astype('category')
data['smoking_status'] = data['smoking_status'].astype('category')

def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    """Apply same preprocessing as training"""
    df = df.copy()
    
    # Log1p transform for skewed features
    for col in ['avg_glucose_level', 'bmi']:
        if col in df.columns:
            df[col] = np.log1p(df[col])
    
    # Drop Residence_type if present
    if 'Residence_type' in df.columns:
        df = df.drop(columns=['Residence_type'])
    
    return df

# Preprocess data
data = preprocess(data)

# Drop target if present
if 'stroke' in data.columns:
    X = data.drop('stroke', axis=1)
else:
    X = data

# Separate categorical and numerical columns
categorical_cols = ['gender', 'ever_married', 'work_type', 'smoking_status']
numerical_cols = ['age', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi']

# ---------- Load Model and Preprocessing Objects ----------
scaler = joblib.load(SCALER_PATH)
model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)

# Create sample processed data for explainer
X_cat = encoder.transform(X[categorical_cols])
cat_feature_names = encoder.get_feature_names_out(categorical_cols)
X_cat_df = pd.DataFrame(X_cat, columns=cat_feature_names, index=X.index)
X_processed = pd.concat([X[numerical_cols], X_cat_df], axis=1)
X_norm = scaler.transform(X_processed)

explainer = shap.Explainer(model, X_norm)

# ---------- Public API ----------
def explain_instance(input_df: pd.DataFrame):
    """
    Returns SHAP Explanation for stroke prediction (class 1)
    
    Args:
        input_df: DataFrame with columns: gender, age, hypertension, heart_disease,
                  ever_married, work_type, avg_glucose_level, bmi, smoking_status
    """
    input_df = preprocess(input_df)
    
    # Ensure columns are in correct order
    input_df = input_df.reindex(columns=X.columns)
    
    # One-hot encode categorical variables
    X_cat_input = encoder.transform(input_df[categorical_cols])
    X_cat_df_input = pd.DataFrame(X_cat_input, columns=cat_feature_names, index=input_df.index)
    
    # Combine with numerical columns
    X_processed_input = pd.concat([input_df[numerical_cols], X_cat_df_input], axis=1)
    
    # Scale
    X_norm_input = scaler.transform(X_processed_input)
    
    # Get SHAP values
    shap_exp = explainer(X_norm_input)
    
    # Handle binary classification output
    if shap_exp.values.ndim == 3:
        # (samples, features, classes) - take class 1 (stroke positive)
        shap_exp.values = shap_exp.values[:, :, 1]
    
    return shap_exp[0]


def get_feature_names():
    """Returns list of feature names after preprocessing"""
    return X_processed.columns.tolist()