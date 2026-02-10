# XAI Health Risk Assessment System

An end-to-end **Explainable AI (XAI)** system designed to predict individual health risks for **Diabetes**, **Heart Disease**, and **Stroke**. This system goes beyond simple black-box predictions by providing transparent, human-interpretable explanations for every risk score generated, enabling trust and actionable insights for clinicians and users.

The project features a **FastAPI** backend for high-performance inference and a modern **Next.js** frontend for an interactive user experience.

## Key Features

- **Multi-Disease Prediction**: 
  - **Diabetes**: Random Forest model optimized with class balancing (SMOTE) and log-transformations.
  - **Heart Disease**: Lasso-penalized Logistic Regression for sparse feature selection.
  - **Stroke**: Lasso Logistic Regression with one-hot encoding for categorical features and SMOTE balancing.
- **Unified Shared Fields**:
  - Common patient data (Age, BMI, Gender, Glucose) is entered once and intelligently mapped to each model.
  - Gender string is automatically converted to numeric sex for the heart disease model.
  - Glucose level is shared between diabetes (as Glucose) and stroke (as avg_glucose_level).
- **Smart Heart Disease Integration for Stroke**:
  - An optional "Diagnosed Heart Condition" checkbox lets users self-report.
  - If unchecked, the heart disease model prediction is used as input for stroke assessment.
- **Explainable AI (XAI) Integration**: 
  - Uses **SHAP (SHapley Additive exPlanations)** to generate local feature importance for every prediction.
  - Translates complex mathematical attributions into natural language summaries (e.g., *"High risk driven by elevated Glucose and BMI..."*).
- **Interactive Unified Dashboard**: 
  - A modern web interface built with **Next.js** and **Tailwind CSS**.
  - Visualizes risk levels, scores, and key contributing factors side-by-side.
  - Standalone assessment pages for each condition (`/diabetes`, `/heart-disease`, `/stroke`).
- **Unified Risk Service**: 
  - Aggregates all three disease models into a single patient health profile.
  - Provides risk stratification (Low/Moderate/High).
- **Modern Backend Architecture**:
  - Built with **FastAPI** for high-performance, asynchronous inference.
  - Pydantic schemas for robust data validation.
  - Environment-variable-based API configuration for easy local/production switching.

## System Architecture

The project follows a modular MLOps structure:
1.  **Data Science Lab (`notebooks/`)**: Interactive environment for EDA, feature engineering, and model training.
2.  **Model Registry (`output/`)**: Serialized artifacts (models & scalers) saved for production use.
3.  **Core Logic (`src/`)**:
    -   `models/`: Training pipelines and algorithms.
    -   `predictors/`: Inference logic ensuring consistent preprocessing.
    -   `explainability/`: SHAP value generation and natural language parsing.
    -   `services/`: Business logic orchestration.
4.  **API Layer (`src/main.py`)**: REST API entry point.

## Project Structure

```plaintext
xai-health-risk-system/
├── data/                   # Raw and processed datasets
│   ├── raw/                # Original CSV files (diabetes, heart, stroke)
│   └── processed/          # Cleaned datasets ready for training
├── frontend/               # Next.js Frontend Application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   │   ├── page.tsx    # Unified Dashboard
│   │   │   ├── diabetes/   # Standalone diabetes assessment
│   │   │   ├── heart-disease/ # Standalone heart disease assessment
│   │   │   └── stroke/     # Standalone stroke assessment
│   │   └── components/     # Reusable UI (UnifiedRiskForm, RiskCard, Header)
│   ├── .env.production     # Production API URL configuration
│   ├── .env.example        # Environment variable template
│   └── package.json        # Frontend dependencies
├── notebooks/              # Jupyter notebooks for EDA and training
├── output/                 # Trained models, scalers, encoders (.joblib)
├── src/                    # Python Backend Source Code
│   ├── cli/                # Command-line tools for quick testing
│   ├── explainability/     # SHAP integration & text generation
│   ├── models/             # Training scripts (diabetes, heart, stroke)
│   ├── predictors/         # Loading models & running inference
│   ├── schemas/            # Pydantic models for API validation
│   ├── services/           # Unified assessment & explanation services
│   └── main.py             # FastAPI application entry point
└── requirements.txt        # Backend dependencies
```

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/KarikariSamuelZachary/xai-health-risk-system.git
cd xai-health-risk-system
```

### 2. Backend Setup
Create a virtual environment and install Python dependencies.

```bash
python -m venv venv
# Activate: source venv/bin/activate (Linux/Mac) or venv\Scripts\activate (Windows)
pip install -r requirements.txt
```

### 3. Frontend Setup
Navigate to the frontend directory and install Node dependencies.

```bash
cd frontend
npm install
```

## Usage

To run the full application, you need to start both the Backend (API) and the Frontend (UI) in separate terminals.

### 1. Start the Backend API
From the root project directory:
```bash
uvicorn src.main:app --reload --app-dir src
```
The API will run at **`http://localhost:8000`**.
-   **Swagger Docs**: Visit `http://localhost:8000/docs`.

### 2. Start the Frontend UI
Open a new terminal, navigate to the `frontend` folder:
```bash
cd frontend
npm run dev
```
The Dashboard will be accessible at **`http://localhost:3000`**.

### 3. Testing via CLI (Backend Only)
You can test the unified risk assessment logic directly from the terminal.

```bash
python -m src.cli.unified_risk_test
```

### 3. Training Models
To retrain the models, run the training scripts located in the `src` folder (ensure you are in the project root):

```bash
python -m src.models.diabetes_model_training
python -m src.models.heart_disease_model
python -m src.models.stroke_model
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Health check |
| `/assess/diabetes` | POST | Standalone diabetes risk assessment |
| `/assess/heart` | POST | Standalone heart disease risk assessment |
| `/assess/stroke` | POST | Standalone stroke risk assessment |
| `/assess/unified` | POST | Unified assessment for all three conditions |

## Environment Variables

### Frontend
| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` (dev) or `https://xai-health-risk-system.onrender.com` (prod) |

See `frontend/.env.example` for a template.

## Technologies Used

### Backend & AI
-   **Python**: FastAPI, Uvicorn, Pydantic
-   **Machine Learning**: Scikit-Learn, NumPy, Pandas, SMOTE (imbalanced-learn)
-   **Explainability**: SHAP (SHapley Additive exPlanations)
-   **Serialization**: Joblib

### Frontend
-   **Framework**: Next.js 14+ (App Router), React
-   **Styling**: Tailwind CSS
-   **Networking**: Axios

### Deployment
-   **Frontend**: Vercel
-   **Backend**: Render

## License

[MIT License](LICENSE)
