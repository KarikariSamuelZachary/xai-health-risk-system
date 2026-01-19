from pydantic import BaseModel
from .diabetes_schema import DiabetesInput
from .heart_disease_schema import HeartDiseaseInput

class UnifiedHealthInput(DiabetesInput, HeartDiseaseInput):
    """
    Combines input fields for both Diabetes and Heart Disease models.
    Since 'Age' is present in both with the same type, it merges cleanly.
    """
    pass

class UnifiedHealthResponse(BaseModel):
    """
    Response model for the unified risk assessment.
    """
    diabetes: dict
    heart_disease: dict
