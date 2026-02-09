import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", BASE_DIR / "output"))
DATA_DIR = Path(os.getenv("DATA_DIR", BASE_DIR / "data"))

DIABETES_MODEL_PATH = OUTPUT_DIR / "diabetes_rf_model.joblib"
DIABETES_SCALER_PATH = OUTPUT_DIR / "diabetes_rf_scaler.joblib"

HEART_MODEL_PATH = OUTPUT_DIR / "heart_disease_lasso_model.joblib"
HEART_SCALER_PATH = OUTPUT_DIR / "heart_disease_scaler.joblib"

STROKE_MODEL_PATH = OUTPUT_DIR / "stroke_model.joblib"
STROKE_SCALER_PATH = OUTPUT_DIR / "stroke_scaler.joblib"
STROKE_ENCODER_PATH = OUTPUT_DIR / "stroke_encoder.joblib"