# XAI Health Risk Assessment System

An end-to-end health risk assessment stack for **diabetes**, **heart disease**, and **stroke**. It combines supervised risk models, **K-Means patient profiles**, **SHAP** attributions turned into short natural-language explanations, and a **FastAPI** backend with a **Next.js** frontend. A parallel track of **Jupyter notebooks** studies attack surfaces, clinical plausibility constraints, defences, and explanation stability under adversarial input.

Each successful assessment returns:

- `risk_score` — model probability of the positive class  
- `patient_profile` — human-readable label from the condition-specific cluster model  
- `explanations` — ordered strings (cluster context plus top SHAP-driven factors)

## What the system does

- Predicts risk for diabetes, heart disease, and stroke from tabular patient features.  
- Offers a **unified** flow: shared fields (e.g. age, BMI, gender, glucose) are mapped into each model’s schema where applicable.  
- Derives **cluster-based profiles** per disease and prefixes explanations with that context.  
- For stroke, if `diagnosed_heart_condition` is not explicitly true, the unified flow can infer `heart_disease` for the stroke model from the **heart disease** prediction when that model ran in the same request.  
- Serves standalone JSON endpoints plus a web UI for single-disease and unified assessment.

## Research: robustness, constraints, and explanation behaviour

Beyond the production API path, the `notebooks/` folder contains reproducible experiments (mostly using **scikit-learn**, **SHAP**, **Adversarial Robustness Toolbox**, and **statsmodels**):

| Notebook | Topic |
|----------|--------|
| `01_*`–`05_*` | Loading, cleaning, EDA, correlation / redundancy, merged-dataset views |
| `06_train_*` | Supervised training for diabetes, heart, and stroke |
| `07_train_heart_disease_prediction_model.ipynb` | Heart model training pipeline |
| `08_diabetes_clustering.ipynb`–`10_stroke_clustering.ipynb` | K-Means profiles aligned with each predictor |
| `11_attack_surface_mapping.ipynb` | Attack-surface analysis; figures such as `output/*_attack_surface.png` |
| `12_clinical_plausibility_constraint.ipynb` | Clinically plausible input ranges; feeds `output/clinical_constraints.json` |
| `13_constrained_attacks.ipynb` | Attacks under clinical bounds |
| `14_vulnerability_comparison.ipynb` | Comparative vulnerability summaries; `output/vulnerability_report.json` |
| `15_defence_implementation.ipynb` | Defence strategies (e.g. winsorisation); `output/defence_report.json` |
| `16_explanation_evasion.ipynb` | Prediction vs explanation behaviour under perturbation; `output/sec5_report.json` and related plots |

These artefacts are **not required** to run the API: they document and support robustness / XAI research. The diabetes predictor optionally applies **fixed winsorisation bounds** from `output/diabetes_winsorize_bounds.json` for consistency with the trained pipeline.

## API response shape

Single-condition endpoints and each block inside the unified response follow:

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

Unified assessment returns a JSON object with **only the keys for models whose required inputs were all present** (for example `diabetes`, `heart_disease`, `stroke`), not necessarily all three every time.

## Model summary

### Supervised models

- **Diabetes**: Random Forest (with log transforms and winsorisation bounds from training).  
- **Heart disease**: Lasso logistic regression.  
- **Stroke**: Logistic regression with a fitted categorical encoder.

### Unsupervised (patient profiles)

Per-condition **K-Means** models in `output/`:

- `diabetes_cluster_model.joblib`  
- `heart_cluster_model.joblib`  
- `stroke_cluster_model.joblib`  

Their cluster IDs map to named profiles inside the predictors.

## Notable product features

- **Unified shared-field workflow** — shared inputs are mapped to heart (`gender` → `sex`), stroke (`Glucose` → `avg_glucose_level`, etc.), and diabetes as appropriate.  
- **Cluster-aware explanations** — SHAP text is combined with the cluster profile line.  
- **Stroke / heart linkage** — unified stroke inference uses the heart result when `diagnosed_heart_condition` is false or omitted and heart assessment ran in the same call.  
- **Standalone and unified routes** — `/assess/diabetes`, `/assess/heart`, `/assess/stroke`, `/assess/unified`.

## Architecture

1. **`notebooks/`** — data prep, training, clustering, and robustness / XAI experiments.  
2. **`output/`** — serialised models, scalers, encoders, cluster models, JSON reports from research notebooks, and exported figures.  
3. **`src/`** — FastAPI app and libraries:  
   - `predictors/` — preprocessing and inference (loads `output/` artefacts; cluster labels for profiles).  
   - `services/` — orchestration and explanation assembly.  
   - `schemas/` — Pydantic request/response models.  
   - `explainabilility/` — SHAP helpers and natural-language explanation generation (folder name kept as in code).  
   - `models/` — training entrypoints callable as modules.  
   - `cli/` — smoke tests and one-off prediction CLIs.  
4. **`frontend/`** — Next.js App Router UI (unified dashboard and per-disease pages).

## Project structure

```text
xai-health-risk-system/
├── data/
│   ├── processed/
│   └── raw/
├── frontend/
│   ├── src/app/          # pages: home, diabetes, heart-disease, stroke
│   ├── src/components/
│   ├── .env.example
│   └── package.json
├── notebooks/            # 01–16: EDA through defences / explanation evasion
├── output/               # models, scalers, encoders, clusters, research JSON/PNGs
├── src/
│   ├── cli/
│   ├── explainabilility/
│   ├── models/
│   ├── predictors/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── main.py
├── requirements.txt
├── CONTRIBUTING.md
└── README.md
```

**`output/` contents (overview)**  

- **Serving**: `diabetes_rf_model.joblib`, `diabetes_rf_scaler.joblib`, `diabetes_winsorize_bounds.json`, `heart_disease_lasso_model.joblib`, `heart_disease_scaler.joblib`, `stroke_model.joblib`, `stroke_scaler.joblib`, `stroke_encoder.joblib`, and the three `*_cluster_model.joblib` files.  
- **Research / optional**: adversarial bundles (`*_adv_trained_bundle.joblib`), `adversarial_examples.joblib`, `clinical_constraints.json`, `vulnerability_report.json`, `defence_report.json`, `sec5_report.json`, SHAP and section-specific PNG exports.

## Requirements

- **Backend**: Python **3.10+** (the repo is commonly used with **3.12**), `pip`, virtualenv.  
- **Frontend**: **Node.js 20.9+** recommended; the app targets **Next.js 16** (older Node majors may fail locally).

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/KarikariSamuelZachary/xai-health-risk-system.git
cd xai-health-risk-system
```

### 2. Backend

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend

```bash
cd frontend
npm install
```

### 4. Frontend API URL

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The client may fall back to `http://localhost:8000`, but an explicit env file is recommended.

## Running the application

Use two terminals.

**Backend** (from repository root):

```bash
uvicorn src.main:app --reload
```

- API: `http://localhost:8000`  
- OpenAPI: `http://localhost:8000/docs`

**Frontend** (from `frontend/`):

```bash
npm run dev
```

- UI: `http://localhost:3000`

## API endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/assess/diabetes` | POST | Diabetes assessment |
| `/assess/heart` | POST | Heart disease assessment |
| `/assess/stroke` | POST | Stroke assessment |
| `/assess/unified` | POST | Multi-condition assessment; returns only models with complete inputs |

## Unified input notes

Shared fields typically include **Age**, **BMI**, **gender**, and **Glucose**. The backend maps them into each model’s expected names (e.g. `gender` → `sex` for heart, `Glucose` → `avg_glucose_level` for stroke). Condition-specific columns must still be supplied for each model you want evaluated; see `src/schemas/unified_schema.py` for the full unified payload.

Example (trim fields as needed for your scenario):

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

## Training and CLI utilities

Retrain serialized artefacts from Python modules:

```bash
python -m src.models.diabetes_model_training
python -m src.models.heart_disease_model
python -m src.models.stroke_model
```

Example unified call via CLI:

```bash
python -m src.cli.unified_risk_test
```

## Technologies

**Backend:** FastAPI, Uvicorn, Pydantic, NumPy, Pandas, scikit-learn, imbalanced-learn, SHAP, Joblib, **Adversarial Robustness Toolbox**, **statsmodels** (notebooks / analysis), Matplotlib and Seaborn (notebooks).

**Frontend:** Next.js 16, React 18, TypeScript, Tailwind CSS, Axios, Lucide React.

**Tooling:** `pytest` and `pytest-cov` are listed in `requirements.txt` for optional test development.

## Deployment

Typical setup: frontend on **Vercel**, backend on **Render** (adjust CORS in `src/main.py` if you add new production origins).

## License

[MIT License](LICENSE)
