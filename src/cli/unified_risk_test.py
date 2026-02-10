from services.unified_risk_service import unified_risk_assessment

patient = {
    # Shared fields
    "Age": 55,
    "BMI": 33.6,
    "gender": "Male",
    "Glucose": 148,

    # Heart disease fields
    "cp": 2,
    "trestbps": 140,
    "chol": 250,
    "fbs": 0,
    "restecg": 1,
    "thalach": 150,
    "exang": 0,
    "oldpeak": 2.3,
    "slope": 1,
    "ca": 0,
    "thal": 2,

    # Diabetes fields
    "Pregnancies": 2,
    "BloodPressure": 72,
    "SkinThickness": 35,
    "Insulin": 168,
    "DiabetesPedigreeFunction": 0.627,

    # Stroke fields
    "hypertension": 0,
    "ever_married": "Yes",
    "work_type": "Private",
    "smoking_status": "formerly smoked",
    "diagnosed_heart_condition": False,
}

result = unified_risk_assessment(patient)

print(result)
