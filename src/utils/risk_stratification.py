def stratify_risk(risk_score: float) -> str:
    """
    Categorizes a numerical risk score into a descriptive risk level.

    Args:
        risk_score (float): A probability score between 0.0 and 1.0.

    Returns:
        str: 'Low', 'Moderate', or 'High' based on the score.
    """
    if risk_score < 0.3:
        return "Low"
    elif risk_score < 0.5:
        return "Moderate"
    else:
        return "High"