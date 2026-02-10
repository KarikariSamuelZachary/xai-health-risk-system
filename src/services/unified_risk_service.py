from .health_explanation_service import explain_heart_prediction
from .diabetes_explanation_service import explain_diabetes_prediction
from .stroke_explanation_service import explain_stroke_prediction
from src.predictors.heart_predictor import predict_heart_risk
from src.predictors.diabetes_predictor import predict_diabetes_risk
from src.predictors.stroke_predictor import predict_stroke_risk
from src.utils.risk_stratification import stratify_risk


def _gender_to_sex(gender: str) -> int:
    """Map gender string to numeric sex value for heart disease model."""
    return 1 if gender.lower() == "male" else 0


def unified_risk_assessment(patient_json):
    """
    Unified risk assessment for all three health conditions.
    Only runs models for which required data is provided.
    
    Shared field mappings:
      - gender (str) → sex (int) for heart disease, gender (str) for stroke
      - Glucose (float) → avg_glucose_level (float) for stroke
      - Age (int) → age (lowercase) for stroke
      - BMI (float) → bmi (lowercase) for stroke
    
    Stroke heart_disease logic:
      - If diagnosed_heart_condition is True → heart_disease = 1
      - Otherwise → use heart disease prediction (0 or 1) if available, else 0
    """
    results = {}
    
    # Check which models can run based on available data
    has_diabetes_data = all(
        patient_json.get(k) is not None
        for k in ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'DiabetesPedigreeFunction']
    )
    has_heart_data = all(
        patient_json.get(k) is not None
        for k in ['gender', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
    )
    has_stroke_data = all(
        patient_json.get(k) is not None
        for k in ['gender', 'Glucose', 'hypertension', 'ever_married', 'work_type', 'smoking_status']
    )
    
    # --- Diabetes ---
    if has_diabetes_data:
        diabetes_data = patient_json.copy()
        if 'Age' in diabetes_data:
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
        heart_data = patient_json.copy()
        # Map shared gender → numeric sex for heart model
        heart_data['sex'] = _gender_to_sex(patient_json.get('gender', 'Male'))
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
        stroke_data = patient_json.copy()
        
        # Map shared fields to stroke format
        if 'Age' in stroke_data:
            stroke_data['age'] = stroke_data.get('Age')
        if 'BMI' in stroke_data:
            stroke_data['bmi'] = stroke_data.get('BMI')
        # Map shared Glucose → avg_glucose_level for stroke
        if 'Glucose' in stroke_data:
            stroke_data['avg_glucose_level'] = stroke_data.get('Glucose')
        # gender is already a string and used as-is by stroke model
        
        # Determine heart_disease value for stroke model
        diagnosed = patient_json.get('diagnosed_heart_condition', False)
        if diagnosed:
            stroke_data['heart_disease'] = 1
        elif "heart_disease" in results:
            # Use heart disease prediction: >= 0.5 means positive
            stroke_data['heart_disease'] = 1 if results["heart_disease"]["risk_score"] >= 0.5 else 0
        else:
            stroke_data['heart_disease'] = 0
            
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

