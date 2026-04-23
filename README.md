# XAI Health Risk Assessment System

An end-to-end health risk assessment system for **diabetes**, **heart disease**, and **stroke**. The project combines:

- **Supervised learning** for disease risk prediction
- **Unsupervised K-Means clustering** for patient profile grouping
- **SHAP-based explanations** translated into plain language
- A **FastAPI** backend and **Next.js** frontend for interactive assessment

Each prediction now returns a structured result with:

- `risk_score`
- `patient_profile`
- `explanations`

## What The System Does

- Predicts risk for **diabetes**, **heart disease** and **stroke**
- Supports a **unified assessment flow** where shared inputs are entered once
- Uses a **patient profile** derived from a K-Means cluster for each condition
- Generates **natural-language contributing factors** from SHAP values
- Supports **standalone condition pages** and a **unified dashboard**
- Reuses the heart disease result inside the stroke workflow when a diagnosed heart condition is not supplied

## Current Prediction Output

All assessment endpoints now return the same high-level response shape:

```json
{
  "risk_score": 0.82,
  "patient_profile": "Advanced Coronary Risk Profile",
  "explanations": [
    "Patient matches the 'Advanced Coronary Risk Profile'. ",
    "High risk is strongly driven by Chest Pain Type.",
    "Risk is increased by Maximum Heart Rate Achieved."
  ]
}
```

For the unified endpoint, each condition is returned under its own key:

```json
{
  "diabetes": {
    "risk_score": 0.64,
    "patient_profile": "Elevated Metabolic Risk Profile",
    "explanations": [
      "Patient matches the 'Elevated Metabolic Risk Profile'. ",
      "High risk is strongly driven by Glucose."
    ]
  },
  "heart_disease": {
    "risk_score": 0.82,
    "patient_profile": "Advanced Coronary Risk Profile",
    "explanations": [
      "Patient matches the 'Advanced Coronary Risk Profile'. "
    ]
  },
  "stroke": {
    "risk_score": 0.18,
    "patient_profile": "Middle-Aged / Elevated BMI Profile",
    "explanations": [
      "Patient matches the 'Middle-Aged / Elevated BMI Profile'. "
    ]
  }
}
```

## Model Summary

### Supervised Models

- **Diabetes**: Random Forest
- **Heart Disease**: Lasso Logistic Regression
- **Stroke**: Logistic Regression with categorical encoding

### Unsupervised Models

Each supervised pipeline is now paired with a **K-Means clustering model**:

- `output/diabetes_cluster_model.joblib`
- `output/heart_cluster_model.joblib`
- `output/stroke_cluster_model.joblib`

These cluster models produce the `patient_profile` value returned by the API.

## Key Features

- **Unified shared-field workflow**
  - Shared inputs such as `Age`, `BMI`, `gender` and `Glucose` are entered once and mapped into the relevant model formats.
- **Cluster-aware explanations**
  - Each condition returns both a predicted risk score and a cluster-derived patient profile.
- **SHAP natural-language summaries**
  - SHAP attributions are converted into readable explanation text for the frontend and API consumers.
- **Stroke heart-condition fallback**
  - If `diagnosed_heart_condition` is not supplied as `true`, the unified service uses the heart disease prediction to derive the stroke model’s `heart_disease` input.
- **Standalone and unified assessment flows**
  - The app supports:
    - `/assess/diabetes`
    - `/assess/heart`
    - `/assess/stroke`
    - `/assess/unified`

## System Architecture

1. **Data science notebooks** in `notebooks/`
   - data cleaning
   - EDA
   - correlation analysis
   - model training
   - clustering experiments
2. **Serialized model artifacts** in `output/`
   - predictors
   - scalers
   - encoders
   - clustering models
3. **Backend application** in `src/`
   - `predictors/`: preprocessing and inference
   - `services/`: orchestration and explanation assembly
   - `schemas/`: request/response validation
   - `explainabilility/`: SHAP integration and explanation generation
4. **Frontend application** in `frontend/`
   - unified dashboard
   - standalone disease pages
   - result cards and explanation display

## Project Structure

```text
xai-health-risk-system/
├── data/
│   ├── processed/
│   └── raw/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── diabetes/page.tsx
│   │   │   ├── heart-disease/page.tsx
│   │   │   └── stroke/page.tsx
│   │   └── components/
│   ├── .env.example
│   ├── .env.production
│   └── package.json
├── notebooks/
├── output/
│   ├── diabetes_cluster_model.joblib
│   ├── diabetes_rf_model.joblib
│   ├── diabetes_rf_scaler.joblib
│   ├── heart_cluster_model.joblib
│   ├── heart_disease_lasso_model.joblib
│   ├── heart_disease_scaler.joblib
│   ├── stroke_cluster_model.joblib
│   ├── stroke_encoder.joblib
│   ├── stroke_model.joblib
│   └── stroke_scaler.joblib
├── src/
│   ├── cli/
│   ├── explainabilility/
│   ├── models/
│   ├── predictors/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── main.py
└── requirements.txt
```

## Requirements

### Backend

- Python 3.10+ recommended
- `pip`
- virtual environment support

### Frontend

- Node.js **20.9+** recommended
- `npm`

The frontend currently uses **Next.js 16**, so Node 18 may cause local development issues.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/KarikariSamuelZachary/xai-health-risk-system.git
cd xai-health-risk-system
```

### 2. Set up the backend

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

On Windows:

```bash
venv\Scripts\activate
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

### 4. Configure the frontend API URL

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The app also includes a fallback to `http://localhost:8000` in the frontend code, but a local env file is still recommended.

## Running The Application

Run the backend and frontend in separate terminals.

### Backend

From the project root:

```bash
uvicorn src.main:app --reload
```

Backend URLs:

- API: `http://localhost:8000`
- Swagger docs: `http://localhost:8000/docs`

### Frontend

From the `frontend/` directory:

```bash
npm run dev
```

Frontend URL:

- App: `http://localhost:3000`

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Health check |
| `/assess/diabetes` | POST | Diabetes assessment |
| `/assess/heart` | POST | Heart disease assessment |
| `/assess/stroke` | POST | Stroke assessment |
| `/assess/unified` | POST | Combined multi-condition assessment |

## Unified Input Notes

The unified endpoint accepts shared fields plus condition-specific fields.

Shared fields include:

- `Age`
- `BMI`
- `gender`
- `Glucose`

Additional mappings performed by the backend:

- `gender` -> `sex` for heart disease
- `Glucose` -> `avg_glucose_level` for stroke
- `Age` -> `age` for stroke
- `BMI` -> `bmi` for stroke

## Example Unified Request

```json
{
  "Age": 57,
  "BMI": 33.6,
  "gender": "Male",
  "Glucose": 148,
  "Pregnancies": 2,
  "BloodPressure": 72,
  "SkinThickness": 35,
  "Insulin": 168,
  "DiabetesPedigreeFunction": 0.627,
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
  "hypertension": 0,
  "ever_married": "Yes",
  "work_type": "Private",
  "smoking_status": "formerly smoked",
  "diagnosed_heart_condition": false
}
```

## Training And Local Model Utilities

To retrain models from the backend code:

```bash
python -m src.models.diabetes_model_training
python -m src.models.heart_disease_model
python -m src.models.stroke_model
```

To run the backend CLI test flow:

```bash
python -m src.cli.unified_risk_test
```

## Frontend Notes

- The unified dashboard consumes structured responses for all three conditions.
- The standalone pages also expect:
  - `risk_score`
  - `patient_profile`
  - `explanations`
- `NEXT_PUBLIC_API_URL` is used to point the frontend at the backend API.

## Technologies Used

### Backend

- FastAPI
- Uvicorn
- Pydantic
- Pandas
- NumPy
- scikit-learn
- imbalanced-learn
- SHAP
- Joblib

### Frontend

- Next.js
- React
- Tailwind CSS
- Axios

## Deployment

- Frontend: Vercel
- Backend: Render

## License

[MIT License](LICENSE)
