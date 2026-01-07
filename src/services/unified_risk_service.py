from .health_explanation_service import explain_heart_prediction
from .diabetes_explanation_service import explain_diabetes_prediction
from predictors.heart_predictor import predict_heart_risk
from predictors.diabetes_predictor import predict_diabetes_risk
from utils.risk_stratification import stratify_risk

def unified_risk_assessment(patient_json):
    # --- Heart ---
    heart_risk = float(predict_heart_risk(patient_json))
    heart_level = stratify_risk(heart_risk)
    heart_explanations = explain_heart_prediction(patient_json)

    heart_summary = (
        f"{heart_level.capitalize()} heart disease risk driven by "
        f"{', '.join([f.split(' = ')[0] for f in heart_explanations[:2]])}."
    )

    # --- Diabetes ---
    diabetes_risk = float(predict_diabetes_risk(patient_json))
    diabetes_level = stratify_risk(diabetes_risk)
    diabetes_explanations = explain_diabetes_prediction(patient_json)

    diabetes_summary = (
        f"{diabetes_level.capitalize()} diabetes risk driven by "
        f"{', '.join([f.split(' = ')[0] for f in diabetes_explanations[:2]])}."
    )

    return {
        "heart_disease": {
            "risk_score": round(heart_risk, 2),
            "risk_level": heart_level,
            "summary": heart_summary,
            "top_factors": heart_explanations
        },
        "diabetes": {
            "risk_score": round(diabetes_risk, 2),
            "risk_level": diabetes_level,
            "summary": diabetes_summary,
            "top_factors": diabetes_explanations
        }
    }

