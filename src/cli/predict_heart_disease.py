from services.health_explanation_service import explain_heart_prediction

patient = {
    "age": 55,
    "sex": 1,
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
    "thal": 2
}

explanations = explain_heart_prediction(patient)

for e in explanations:
    print("•", e)
