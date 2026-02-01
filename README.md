# XAI Health Risk Assessment System

An end-to-end **Explainable AI (XAI)** system designed to predict individual health risks for **Diabetes** and **Heart Disease**. This system goes beyond simple black-box predictions by providing transparent, human-interpretable explanations for every risk score generated, enabling trust and actionable insights for clinicians and users.

The project features a **FastAPI** backend for high-performance inference and a modern **Next.js** frontend for an interactive user experience.

## Key Features

- **Multi-Disease Prediction**: 
  - **Diabetes**: Random Forest model optimized with class balancing (SMOTE) and log-transformations.
  - **Heart Disease**: Lasso-penalized Logistic Regression for sparse feature selection.
- **Explainable AI (XAI) Integration**: 
  - Uses **SHAP (SHapley Additive exPlanations)** to generate local feature importance for every prediction.
  - Translates complex mathematical attributions into natural language summaries (e.g., *"High risk driven by elevated Glucose and BMI..."*).
- **Interactive Unified Dashboard**: 
  - A modern web interface built with **Next.js** and **Tailwind CSS**.
  - Visualizes risk levels, scores, and key contributing factors side-by-side.
- **Unified Risk Service**: 
  - Aggregates multiple disease models into a single patient health profile.
  - Provides risk stratification (Low/Medium/High).
- **Modern Backend Architecture**:
  - Built with **FastAPI** for high-performance, asynchronous inference.
  - Pydantic schemas for robust data validation.

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
├── frontend/               # Next.js Frontend Application
│   ├── src/
│   │   ├── app/            # App Router pages (Dashboard, etc.)
│   │   └── components/     # Reusable UI components (Forms, RiskCards)
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── notebooks/              # Jupyter notebooks for EDA and training
├── output/                 # Trained models (.joblib) and scalers
├── src/                    # Python Backend Source Code
│   ├── cli/                # Command-line tools for quick testing
│   ├── explainability/     # SHAP integration & text generation
│   ├── models/             # Training scripts
│   ├── predictors/         # Loading models & running inference
│   ├── schemas/            # Pydantic models for API validation
│   ├── services/           # Unified assessment logic
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
# or
python -m src.models.heart_disease_model
```

## Technologies Used

### Backend & AI
-   **Python**: FastAPI, Uvicorn, Pydantic
-   **Machine Learning**: Scikit-Learn, NumPy, Pandas, SMOTE
-   **Explainability**: SHAP (SHapley Additive exPlanations)

### Frontend
-   **Framework**: Next.js 14+ (App Router), React
-   **Styling**: Tailwind CSS
-   **Networking**: Axios

## License

[MIT License](LICENSE)
