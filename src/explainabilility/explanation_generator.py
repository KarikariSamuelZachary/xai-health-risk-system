# nl_explainer.py
import numpy as np

def shap_to_natural_language(
    feature_names,
    feature_values,
    shap_values,
    top_k=5
):
    """
    Converts SHAP values into human-readable explanations
    """

    contributions = list(zip(feature_names, feature_values, shap_values))

    # Sort by absolute impact
    contributions.sort(key=lambda x: abs(x[2]), reverse=True)

    explanations = []

    for feature, value, shap_val in contributions[:top_k]:
        direction = "increased" if shap_val > 0 else "decreased"

        explanations.append(
            f"{feature.replace('_', ' ')} = {value} {direction} the risk "
            f"(impact score: {abs(shap_val):.3f})"
        )

    return explanations
