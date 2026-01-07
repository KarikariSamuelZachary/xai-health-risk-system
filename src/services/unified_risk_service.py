from .health_explanation_service import explain_heart_prediction
from .diabetes_explanation_service import explain_diabetes_prediction
from predictors.heart_predictor import predict_heart_risk
from predictors.diabetes_predictor import predict_diabetes_risk

def unified_risk_assessment(patient_data: dict):
    """
    Returns a multi-disease risk view
    """

    heart_risk = predict_heart_risk(patient_data)
    diabetes_risk = predict_diabetes_risk(patient_data)

    heart_explanations = explain_heart_prediction(patient_data)
    diabetes_explanations = explain_diabetes_prediction(patient_data)

    return {
        "heart_disease": {
            "risk": round(heart_risk, 2),
            "top_factors": heart_explanations[:3]
        },
        "diabetes": {
            "risk": round(diabetes_risk, 2),
            "top_factors": diabetes_explanations[:3]
        }
    }
