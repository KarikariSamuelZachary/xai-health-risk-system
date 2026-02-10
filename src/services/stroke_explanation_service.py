import pandas as pd
from src.explainabilility.stroke_model_shap import explain_instance, get_feature_names
from src.explainabilility.explanation_generator import shap_to_natural_language

def explain_stroke_prediction(input_features: dict):
    input_df = pd.DataFrame([input_features])

    shap_exp = explain_instance(input_df)

    explanations = shap_to_natural_language(
        feature_names=get_feature_names(),
        feature_values=shap_exp.data,
        shap_values=shap_exp.values
    )

    return explanations