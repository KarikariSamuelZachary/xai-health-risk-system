from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from src.schemas.diabetes_schema import DiabetesInput, DiabetesResponse
from src.schemas.heart_disease_schema import HeartDiseaseInput, HeartDiseaseResponse
from src.schemas.stroke_schema import StrokeInput, StrokeResponse
from src.schemas.unified_schema import UnifiedHealthInput, UnifiedHealthResponse

from src.services.diabetes_explanation_service import explain_diabetes_prediction
from src.services.health_explanation_service import explain_heart_prediction
from src.services.stroke_explanation_service import explain_stroke_prediction
from src.services.unified_risk_service import unified_risk_assessment

app = FastAPI(
    title="XAI Health Risk System",
    description="API for predicting health risks with explanations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://xai-health-risk-system.vercel.app",
        "https://xai-health-risk-system-a1ecf2w4t.vercel.app",
        "https://xai-health-risk-system-bgrlqf76w.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Health Risk System API is running"}

@app.post("/assess/diabetes", response_model=DiabetesResponse)
def assess_diabetes(patient: DiabetesInput):
    return explain_diabetes_prediction(patient.dict())

@app.post("/assess/heart", response_model=HeartDiseaseResponse)
def assess_heart(patient: HeartDiseaseInput):
    return explain_heart_prediction(patient.dict())

@app.post("/assess/stroke", response_model=StrokeResponse)
def assess_stroke(patient: StrokeInput):
    """
    Assess stroke risk for a single patient.
    """
    return explain_stroke_prediction(patient.dict())

@app.post("/assess/unified", response_model=UnifiedHealthResponse)
def assess_patient_risk(patient: UnifiedHealthInput):
    """
    Takes patient data, runs all applicable risk models, and returns
    risk scores + SHAP explanations for each.
    Only models with complete data will be executed.
    """
    data = patient.dict()
    return unified_risk_assessment(data)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
