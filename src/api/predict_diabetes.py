from services.diabetes_explanation_service import explain_diabetes_prediction

patient = {
    "Pregnancies": 2,
    "Glucose": 148,
    "BloodPressure": 72,
    "SkinThickness": 35,
    "Insulin": 168,
    "BMI": 33.6,
    "DiabetesPedigreeFunction": 0.627,
    "Age": 50
}

explanations = explain_diabetes_prediction(patient)

for e in explanations:
    print("•", e)
