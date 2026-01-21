from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from src.schemas.diabetes_schema import DiabetesInput, DiabetesResponse
from src.schemas.heart_disease_schema import HeartDiseaseInput, HeartDiseaseResponse
from src.schemas.unified_schema import UnifiedHealthInput, UnifiedHealthResponse

from src.predictors.diabetes_predictor import predict_diabetes_risk
from src.predictors.heart_predictor import predict_heart_risk
from src.services.diabetes_explanation_service import explain_diabetes_prediction
from src.services.health_explanation_service import explain_heart_prediction
from src.services.unified_risk_service import unified_risk_assessment
from src.utils.risk_stratification import stratify_risk

app = FastAPI(
    title="XAI Health Risk System",
    description="API for predicting health risks with explanations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Health Risk System API is running"}

@app.post("/assess/diabetes", response_model=DiabetesResponse)
def assess_diabetes(patient: DiabetesInput):
    data = patient.dict()
    risk = float(predict_diabetes_risk(data))
    level = stratify_risk(risk)
    explanations = explain_diabetes_prediction(data)

    summary = (
        f"{level.capitalize()} diabetes risk driven by "
        f"{', '.join([f.split(' = ')[0] for f in explanations[:2]])}."
    )

    return {
        "risk_score": round(risk, 2),
        "risk_level": level,
        "summary": summary,
        "top_factors": explanations,
    }

@app.post("/assess/heart", response_model=HeartDiseaseResponse)
def assess_heart(patient: HeartDiseaseInput):
    data = patient.dict()
    risk = float(predict_heart_risk(data))
    level = stratify_risk(risk)
    explanations = explain_heart_prediction(data)

    summary = (
        f"{level.capitalize()} heart disease risk driven by "
        f"{', '.join([f.split(' = ')[0] for f in explanations[:2]])}."
    )

    return {
        "risk_score": round(risk, 2),
        "risk_level": level,
        "summary": summary,
        "top_factors": explanations,
    }

@app.post("/assess/unified", response_model=UnifiedHealthResponse)
def assess_patient_risk(patient: UnifiedHealthInput):
    """
    Takes patient data, runs both risk models, and returns
    risk scores + SHAP explanations.
    """
    data = patient.dict()
    return unified_risk_assessment(data)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)