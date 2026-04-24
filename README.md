# XAI Health Risk Assessment System

This project combines two things:

1. A deployable health-risk application with a FastAPI backend and Next.js frontend.
2. A research notebook pipeline that studies adversarial robustness, clinical constraints, defences, and explanation stability.

The system assesses risk for three conditions:

- Diabetes
- Heart disease
- Stroke

Each prediction returns:

- `risk_score`: model probability for the positive class
- `patient_profile`: a cluster-derived profile label
- `explanations`: short natural-language explanation strings built from SHAP and profile context

## What This Repository Contains

There are two main tracks in this repo.

**Application track**

- FastAPI API in [src/main.py](/home/iaminspiredbro/my_projects/xai-health-risk-system/src/main.py)
- Disease-specific predictors and explanation services in [src/](/home/iaminspiredbro/my_projects/xai-health-risk-system/src)
- Next.js frontend in [frontend/](/home/iaminspiredbro/my_projects/xai-health-risk-system/frontend)
- Serialized serving artifacts in [output/](/home/iaminspiredbro/my_projects/xai-health-risk-system/output)

**Research track**

- Data cleaning, EDA, model training, clustering, attack analysis, constrained attacks, defence evaluation, and explanation-evasion notebooks in [notebooks/](/home/iaminspiredbro/my_projects/xai-health-risk-system/notebooks)

If you only want to run the app, you do not need to execute the notebooks first as long as the required artifacts already exist in [output/](/home/iaminspiredbro/my_projects/xai-health-risk-system/output).

## Project Goal

The project is designed to answer two related questions:

- Can we build interpretable health-risk prediction services for tabular medical data?
- How reliable are those predictions and explanations when inputs are perturbed adversarially but remain clinically plausible?

That is why the repo includes both production-style inference code and robustness/XAI experiments.

## How The System Works

For each disease, the serving flow is:

1. Validate the request with Pydantic schemas.
2. Preprocess the raw input into the model's training space.
3. Generate a risk prediction.
4. Assign the patient to a learned cluster/profile.
5. Produce SHAP-based explanation text.
6. Return a compact JSON response.

There is also a unified route that runs whichever disease models have enough fields present in a single request.

## Supported Models

### Supervised prediction models

- **Diabetes**: Random Forest
- **Heart disease**: L1-regularized logistic regression
- **Stroke**: Logistic regression with categorical encoding

### Patient profile models

Each disease also has a K-Means clustering model used to assign a human-readable profile:

- `output/diabetes_cluster_model.joblib`
- `output/heart_cluster_model.joblib`
- `output/stroke_cluster_model.joblib`

## API Overview

The backend exposes four main routes:

- `GET /`
- `POST /assess/diabetes`
- `POST /assess/heart`
- `POST /assess/stroke`
- `POST /assess/unified`

The unified route returns only the model blocks that have enough required inputs.

## Example Response

```json
{
  "risk_score": 0.82,
  "patient_profile": "Advanced Coronary Risk Profile",
  "explanations": [
    "Patient matches the 'Advanced Coronary Risk Profile'.",
    "High risk is strongly driven by Chest Pain Type.",
    "Risk is increased by Maximum Heart Rate Achieved."
  ]
}
```

## Repository Layout

```text
xai-health-risk-system/
├── data/
│   ├── raw/                 # original datasets
│   └── processed/           # cleaned/model-ready datasets used by notebooks
├── frontend/                # Next.js user interface
├── notebooks/               # Sectioned notebook workflow from EDA to robustness/XAI analysis
├── output/                  # trained models, scalers, encoders, reports, plots
├── src/
│   ├── cli/                 # small command-line helpers
│   ├── explainabilility/    # SHAP explanation helpers
│   ├── models/              # training scripts/modules
│   ├── predictors/          # inference + preprocessing logic
│   ├── schemas/             # request/response schemas
│   ├── services/            # orchestration and explanation assembly
│   ├── utils/
│   └── main.py              # FastAPI entrypoint
├── requirements.txt
├── CONTRIBUTING.md
└── README.md
```

## Notebooks Guide

The notebooks are organized roughly as a paper/report workflow:

- `01`-`05`: data loading, cleaning, EDA, correlation analysis, dataset comparison
- `06`-`10`: supervised training and clustering
- `11`: attack surface mapping
- `12`: clinical plausibility constraints
- `13`: constrained attacks
- `14`: vulnerability comparison baseline
- `15`: defence implementation
- `16`: explanation evasion and SHAP stability analysis

Important research outputs include:

- [output/adversarial_examples.joblib](/home/iaminspiredbro/my_projects/xai-health-risk-system/output/adversarial_examples.joblib)
- [output/clinical_constraints.json](/home/iaminspiredbro/my_projects/xai-health-risk-system/output/clinical_constraints.json)
- [output/vulnerability_report.json](/home/iaminspiredbro/my_projects/xai-health-risk-system/output/vulnerability_report.json)
- [output/defence_report.json](/home/iaminspiredbro/my_projects/xai-health-risk-system/output/defence_report.json)
- [output/sec5_report.json](/home/iaminspiredbro/my_projects/xai-health-risk-system/output/sec5_report.json)

## Core Artifacts In `output/`

These files matter for serving:

- `diabetes_rf_model.joblib`
- `diabetes_rf_scaler.joblib`
- `diabetes_winsorize_bounds.json`
- `heart_disease_lasso_model.joblib`
- `heart_disease_scaler.joblib`
- `stroke_model.joblib`
- `stroke_scaler.joblib`
- `stroke_encoder.joblib`
- `diabetes_cluster_model.joblib`
- `heart_cluster_model.joblib`
- `stroke_cluster_model.joblib`

Other files in `output/` are mostly research reports, figures, and defence artifacts.

## Requirements

### Backend

- Python 3.10+
- `pip`
- virtual environment support

### Frontend

- Node.js 20+ recommended
- npm

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

Windows:

```bash
venv\Scripts\activate
```

### 3. Set up the frontend

```bash
cd frontend
npm install
cd ..
```

### 4. Configure the frontend API URL

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running The Project

Use two terminals.

### Backend

From the repository root:

```bash
source venv/bin/activate
uvicorn src.main:app --reload
```

Available at:

- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

### Frontend

From [frontend/](/home/iaminspiredbro/my_projects/xai-health-risk-system/frontend):

```bash
npm run dev
```

Available at:

- UI: `http://localhost:3000`

## Unified Input Notes

The unified schema mixes shared and disease-specific fields.

Shared fields include:

- `Age`
- `BMI`
- `gender`
- `Glucose`

These are mapped into each model where applicable. Disease-specific fields are still required if you want that specific model to run.

See [src/schemas/unified_schema.py](/home/iaminspiredbro/my_projects/xai-health-risk-system/src/schemas/unified_schema.py) for the full request schema and example payload.

## Training Utilities

You can retrain the main predictive models with:

```bash
python -m src.models.diabetes_model_training
python -m src.models.heart_disease_model
python -m src.models.stroke_model
```

There is also a small unified CLI smoke test:

```bash
python -m src.cli.unified_risk_test
```

## Tech Stack

**Backend**

- FastAPI
- Uvicorn
- Pydantic
- NumPy
- Pandas
- scikit-learn
- imbalanced-learn
- SHAP
- Joblib

**Research / analysis**

- Matplotlib
- Seaborn
- statsmodels
- Adversarial Robustness Toolbox

**Frontend**

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

## Deployment Notes

The project is structured for a split deployment:

- Frontend on Vercel
- Backend on a Python host such as Render

If you deploy to new origins, update the CORS settings in [src/main.py](/home/iaminspiredbro/my_projects/xai-health-risk-system/src/main.py).

## Contributing

See [CONTRIBUTING.md](/home/iaminspiredbro/my_projects/xai-health-risk-system/CONTRIBUTING.md).

## License

This project is licensed under the terms in [LICENSE](/home/iaminspiredbro/my_projects/xai-health-risk-system/LICENSE).
