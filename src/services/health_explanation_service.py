import pandas as pd
from src.explainabilility.heart_disease_model_shap import explain_instance, get_feature_names
from src.explainabilility.explanation_generator import shap_to_natural_language
from src.predictors.heart_predictor import predict_heart_risk

def explain_heart_prediction(input_features: dict):
    prediction_data = predict_heart_risk(input_features)
    profile_name = prediction_data["profile_name"]
    input_df = pd.DataFrame([input_features])

    shap_exp = explain_instance(input_df)

    base_explanations = shap_to_natural_language(
        feature_names=get_feature_names(),
        feature_values=shap_exp.data,
        shap_values=shap_exp.values
    )

    cluster_context = f"Patient matches the '{profile_name}'. "

    if isinstance(base_explanations, list):
        base_explanations.insert(0, cluster_context)
    else:
        base_explanations = cluster_context + base_explanations

    return {
        "risk_score": prediction_data["probability"],
        "patient_profile": profile_name,
        "explanations": base_explanations
    }
