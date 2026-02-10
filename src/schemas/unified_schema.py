from pydantic import BaseModel, Field
from typing import Optional

class UnifiedHealthInput(BaseModel):
    """
    Unified input for all three health risk assessments.
    Common fields (Age, BMI) are shared across models.
    """
    # Shared fields across all models
    Age: int = Field(..., ge=0, description="Age in years (shared: diabetes, heart disease, stroke)")
    BMI: float = Field(..., ge=0, description="Body mass index (shared: diabetes, stroke)")
    
    # Diabetes-specific fields
    Pregnancies: Optional[int] = Field(None, ge=0, description="Number of times pregnant")
    Glucose: Optional[float] = Field(None, ge=0, description="Plasma glucose concentration")
    BloodPressure: Optional[float] = Field(None, ge=0, description="Diastolic blood pressure (mm Hg)")
    SkinThickness: Optional[float] = Field(None, ge=0, description="Triceps skin fold thickness (mm)")
    Insulin: Optional[float] = Field(None, ge=0, description="2-Hour serum insulin (mu U/ml)")
    DiabetesPedigreeFunction: Optional[float] = Field(None, ge=0, description="Diabetes pedigree function")
    
    # Heart disease-specific fields
    sex: Optional[int] = Field(None, ge=0, le=1, description="Sex (1 = male, 0 = female)")
    cp: Optional[int] = Field(None, ge=0, le=3, description="Chest pain type (0–3)")
    trestbps: Optional[int] = Field(None, ge=0, description="Resting blood pressure (mm Hg)")
    chol: Optional[int] = Field(None, ge=0, description="Serum cholesterol (mg/dl)")
    fbs: Optional[int] = Field(None, ge=0, le=1, description="Fasting blood sugar > 120 mg/dl")
    restecg: Optional[int] = Field(None, ge=0, le=2, description="Resting electrocardiographic results (0–2)")
    thalach: Optional[int] = Field(None, ge=0, description="Maximum heart rate achieved")
    exang: Optional[int] = Field(None, ge=0, le=1, description="Exercise-induced angina (1 = yes, 0 = no)")
    oldpeak: Optional[float] = Field(None, ge=0, description="ST depression induced by exercise")
    slope: Optional[int] = Field(None, ge=0, le=2, description="Slope of the peak exercise ST segment (0–2)")
    ca: Optional[int] = Field(None, ge=0, le=3, description="Number of major vessels (0–3)")
    thal: Optional[int] = Field(None, ge=0, le=3, description="Thalassemia (1–3)")
    
    # Stroke-specific fields
    gender: Optional[str] = Field(None, description='Gender: Male, Female, or Other')
    hypertension: Optional[int] = Field(None, ge=0, le=1, description='0 = no hypertension, 1 = has hypertension')
    heart_disease: Optional[int] = Field(None, ge=0, le=1, description='0 = no heart disease, 1 = has heart disease')
    ever_married: Optional[str] = Field(None, description='Marital status: Yes or No')
    work_type: Optional[str] = Field(None, description='Type of work: Private, Self-employed, Govt_job, children, Never_worked')
    Residence_type: Optional[str] = Field(None, description='Residence type: Urban or Rural')
    avg_glucose_level: Optional[float] = Field(None, ge=0, description='Average glucose level in blood')
    smoking_status: Optional[str] = Field(None, description='Smoking status: formerly smoked, never smoked, smokes, or Unknown')
    
    class Config:
        json_schema_extra = {
            "example": {
                # Shared fields
                "Age": 57,
                "BMI": 33.6,
                # Diabetes fields
                "Pregnancies": 2,
                "Glucose": 148,
                "BloodPressure": 72,
                "SkinThickness": 35,
                "Insulin": 168,
                "DiabetesPedigreeFunction": 0.627,
                # Heart disease fields
                "sex": 1,
                "cp": 2,
                "trestbps": 130,
                "chol": 250,
                "fbs": 0,
                "restecg": 1,
                "thalach": 165,
                "exang": 0,
                "oldpeak": 1.0,
                "slope": 2,
                "ca": 0,
                "thal": 2,
                # Stroke fields
                "gender": "Male",
                "hypertension": 0,
                "heart_disease": 1,
                "ever_married": "Yes",
                "work_type": "Private",
                "Residence_type": "Urban",
                "avg_glucose_level": 228.69,
                "smoking_status": "formerly smoked"
            }
        }

class UnifiedHealthResponse(BaseModel):
    """
    Response model for the unified risk assessment.
    Contains results from all requested models.
    """
    diabetes: Optional[dict] = None
    heart_disease: Optional[dict] = None
    stroke: Optional[dict] = None
