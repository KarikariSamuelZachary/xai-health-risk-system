from .health_explanation_service import explain_heart_prediction
from .diabetes_explanation_service import explain_diabetes_prediction
from .stroke_explanation_service import explain_stroke_prediction


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

        results["diabetes"] = explain_diabetes_prediction(diabetes_data)
    
    # --- Heart Disease ---
    if has_heart_data:
        heart_data = patient_json.copy()
        # Map shared gender → numeric sex for heart model
        heart_data['sex'] = _gender_to_sex(patient_json.get('gender', 'Male'))
        if 'Age' in heart_data:
            heart_data['Age'] = heart_data.get('Age')

        results["heart_disease"] = explain_heart_prediction(heart_data)
    
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

        results["stroke"] = explain_stroke_prediction(stroke_data)
    
    return results
