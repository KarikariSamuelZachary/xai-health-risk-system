import pandas as pd
import numpy as np
import joblib
import shap
from scipy.stats.mstats import winsorize

# ---------- Paths ----------
DATA_PATH = 'data/processed/diabetes_processed.csv'
SCALER_PATH = 'output/diabetes_rf_scaler.joblib'
MODEL_PATH = 'output/diabetes_rf_model.joblib'

# ---------- Load Data ----------
data = pd.read_csv(DATA_PATH)

def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    for col in ['Insulin', 'DiabetesPedigreeFunction', 'Age']:
        if col in df.columns:
            df[col] = np.log1p(df[col])

    for col in ['Pregnancies', 'Glucose', 'SkinThickness', 'BMI']:
        if col in df.columns:
            df[col] = winsorize(df[col], limits=[0.01, 0.01])

    return df


data = preprocess(data)
X = data.drop('Outcome', axis=1)

# ---------- Load Model ----------
scaler = joblib.load(SCALER_PATH)
model = joblib.load(MODEL_PATH)

X_norm = scaler.transform(X)
explainer = shap.Explainer(model, X_norm)

# ---------- Public API ----------
def explain_instance(input_df: pd.DataFrame):
    """
    Returns SHAP Explanation for class 1 (diabetes positive)
    """
    input_df = preprocess(input_df)
    input_df = input_df.reindex(columns=X.columns)

    X_norm_input = scaler.transform(input_df)
    shap_exp = explainer(X_norm_input, check_additivity=False)

    # Handle RF binary output
    if shap_exp.values.ndim == 3:
        # (samples, features, classes)
        shap_exp.values = shap_exp.values[:, :, 1]

    return shap_exp[0]


def get_feature_names():
    return X.columns.tolist()
