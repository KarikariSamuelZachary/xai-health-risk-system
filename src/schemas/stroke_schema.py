from pydantic import BaseModel, Field

class StrokeInput(BaseModel):
    gender: str = Field(..., description='Gender: Male, Female, or Other')
    age: float = Field(..., ge=0, le=120, description='Age in years')
    hypertension: int = Field(..., ge=0, le=1, description='0 = no hypertension, 1 = has hypertension')
    heart_disease: int = Field(..., ge=0, le=1, description='0 = no heart disease, 1 = has heart disease')
    ever_married: str = Field(..., description='Marital status: Yes or No')
    work_type: str = Field(..., description='Type of work: Private, Self-employed, Govt_job, children, or Never_worked')
    Residence_type: str = Field(..., description='Residence type: Urban or Rural')
    avg_glucose_level: float = Field(..., ge=0, description='Average glucose level in blood')
    bmi: float = Field(..., ge=0, description='Body mass index')
    smoking_status: str = Field(..., description='Smoking status: formerly smoked, never smoked, smokes, or Unknown')

    class Config:
        json_schema_extra = {
            'example': {
                'gender': 'Male',
                'age': 67,
                'hypertension': 0,
                'heart_disease': 1,
                'ever_married': 'Yes',
                'work_type': 'Private',
                'Residence_type': 'Urban',
                'avg_glucose_level': 228.69,
                'bmi': 36.6,
                'smoking_status': 'formerly smoked'
            }
        }

class StrokeResponse(BaseModel):
    """Standardized response for stroke risk predictions."""
    
    risk_score: float
    risk_level: str
    summary: str
    top_factors: list[str]