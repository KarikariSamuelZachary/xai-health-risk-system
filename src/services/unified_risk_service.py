from .health_explanation_service import explain_heart_prediction
from .diabetes_explanation_service import explain_diabetes_prediction
from .stroke_explanation_service import explain_stroke_prediction
from src.predictors.heart_predictor import predict_heart_risk
from src.predictors.diabetes_predictor import predict_diabetes_risk
from src.predictors.stroke_predictor import predict_stroke_risk
from src.utils.risk_stratification import stratify_risk

def unified_risk_assessment(patient_json):
    """
    Unified risk assessment for all three health conditions.
    Only runs models for which required data is provided.
    """
    results = {}
    
    # Check which models can run based on available data
    has_diabetes_data = all(k in patient_json for k in ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'DiabetesPedigreeFunction'])
    has_heart_data = all(k in patient_json for k in ['sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'])
    has_stroke_data = all(k in patient_json for k in ['gender', 'hypertension', 'heart_disease', 'ever_married', 'work_type', 'avg_glucose_level', 'smoking_status'])
    
    # --- Diabetes ---
    if has_diabetes_data:
        # Map unified Age/BMI to diabetes format
        diabetes_data = patient_json.copy()
        if 'Age' in diabetes_data and 'age' not in diabetes_data:
            diabetes_data['Age'] = diabetes_data.get('Age')
        if 'BMI' in diabetes_data:
            diabetes_data['BMI'] = diabetes_data.get('BMI')
            
        diabetes_risk = float(predict_diabetes_risk(diabetes_data))
        diabetes_level = stratify_risk(diabetes_risk)
        diabetes_explanations = explain_diabetes_prediction(diabetes_data)

        diabetes_summary = (
            f"{diabetes_level.capitalize()} diabetes risk driven by "
            f"{', '.join([f.split(' = ')[0] for f in diabetes_explanations[:2]])}."
        )

        results["diabetes"] = {
            "risk_score": round(diabetes_risk, 2),
            "risk_level": diabetes_level,
            "summary": diabetes_summary,
            "top_factors": diabetes_explanations
        }
    
    # --- Heart Disease ---
    if has_heart_data:
        # Map unified Age to heart disease format
        heart_data = patient_json.copy()
        if 'Age' in heart_data:
            heart_data['Age'] = heart_data.get('Age')
            
        heart_risk = float(predict_heart_risk(heart_data))
        heart_level = stratify_risk(heart_risk)
        heart_explanations = explain_heart_prediction(heart_data)

        heart_summary = (
            f"{heart_level.capitalize()} heart disease risk driven by "
            f"{', '.join([f.split(' = ')[0] for f in heart_explanations[:2]])}."
        )

        results["heart_disease"] = {
            "risk_score": round(heart_risk, 2),
            "risk_level": heart_level,
            "summary": heart_summary,
            "top_factors": heart_explanations
        }
    
    # --- Stroke ---
    if has_stroke_data:
        # Map unified Age/BMI to stroke format (lowercase)
        stroke_data = patient_json.copy()
        if 'Age' in stroke_data:
            stroke_data['age'] = stroke_data.get('Age')
        if 'BMI' in stroke_data:
            stroke_data['bmi'] = stroke_data.get('BMI')
            
        stroke_risk = float(predict_stroke_risk(stroke_data))
        stroke_level = stratify_risk(stroke_risk)
        stroke_explanations = explain_stroke_prediction(stroke_data)

        stroke_summary = (
            f"{stroke_level.capitalize()} stroke risk driven by "
            f"{', '.join([f.split(' = ')[0] for f in stroke_explanations[:2]])}."
        )

        results["stroke"] = {
            "risk_score": round(stroke_risk, 2),
            "risk_level": stroke_level,
            "summary": stroke_summary,
            "top_factors": stroke_explanations
        }
    
    return results

