# heart_shap.py
import pandas as pd
import joblib
import shap

# ---------- Load artifacts ----------
DATA_PATH = 'data/processed/heart_processed.csv'
SCALER_PATH = 'output/heart_disease_scaler.joblib'
MODEL_PATH = 'output/heart_disease_lasso_model.joblib'

data = pd.read_csv(DATA_PATH)

categorical_cols = ['sex', 'fbs', 'exang', 'cp', 'restecg', 'slope', 'thal', 'ca']
for col in categorical_cols:
    data[col] = data[col].astype('category')

X = data.drop('target', axis=1)

scaler = joblib.load(SCALER_PATH)
model = joblib.load(MODEL_PATH)

X_norm = scaler.transform(X)
explainer = shap.Explainer(model, X_norm)

# ---------- Public Functions ----------
def explain_instance(input_df: pd.DataFrame):
    """
    Returns SHAP Explanation object for one row
    """
    input_df = input_df.reindex(columns=X.columns)
    X_norm_input = scaler.transform(input_df)
    return explainer(X_norm_input)[0]


def get_feature_names():
    return X.columns.tolist()
