from pydantic import BaseModel, Field

# This is the "Shape" of the data sent BY the user
class DiabetesInput(BaseModel):
    Pregnancies: int = Field(..., ge=0, description="Number of times pregnant")
    Glucose: float = Field(..., ge=0, description="Plasma glucose concentration")
    BloodPressure: float = Field(..., ge=0, description="Diastolic blood pressure (mm Hg)")
    SkinThickness: float = Field(..., ge=0, description="Triceps skin fold thickness (mm)")
    Insulin: float = Field(..., ge=0, description="2-Hour serum insulin (mu U/ml)")
    BMI: float = Field(..., ge=0, description="Body mass index")
    DiabetesPedigreeFunction: float = Field(..., ge=0, description="Diabetes pedigree function")
    Age: int = Field(..., ge=0, description="Age in years")

    class Config:
        json_schema_extra = {
            "example": {
                "Pregnancies": 2,
                "Glucose": 148,
                "BloodPressure": 72,
                "SkinThickness": 35,
                "Insulin": 168,
                "BMI": 33.6,
                "DiabetesPedigreeFunction": 0.627,
                "Age": 50
            }
        }

# This is the "Shape" of the data returned TO the user
class DiabetesResponse(BaseModel):
    risk_score: float
    risk_level: str
    summary: str
    top_factors: list[str]