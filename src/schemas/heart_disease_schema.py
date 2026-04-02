from pydantic import BaseModel, Field

class HeartDiseaseInput(BaseModel):
	Age: int = Field(..., ge=0, description="Age in years")
	sex: int = Field(..., ge=0, le=1, description="Sex (1 = male, 0 = female)")
	cp: int = Field(..., ge=0, le=3, description="Chest pain type (0–3)")
	trestbps: int = Field(..., ge=0, description="Resting blood pressure (mm Hg)")
	chol: int = Field(..., ge=0, description="Serum cholesterol (mg/dl)")
	fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)")
	restecg: int = Field(..., ge=0, le=2, description="Resting electrocardiographic results (0–2)")
	thalach: int = Field(..., ge=0, description="Maximum heart rate achieved")
	exang: int = Field(..., ge=0, le=1, description="Exercise-induced angina (1 = yes, 0 = no)")
	oldpeak: float = Field(..., ge=0, description="ST depression induced by exercise relative to rest")
	slope: int = Field(..., ge=0, le=2, description="Slope of the peak exercise ST segment (0–2)")
	ca: int = Field(..., ge=0, le=3, description="Number of major vessels colored by fluoroscopy (0–3)")
	thal: int = Field(..., ge=0, le=3, description="Thalassemia (1–3, dataset encoded)")

	class Config:
		example = {
			"example": {
				"Age": 57,
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
			}
		}


class HeartDiseaseResponse(BaseModel):
	"""Standardized response for heart disease risk predictions."""

	risk_score: float
	patient_profile: str
	explanations: list[str]
