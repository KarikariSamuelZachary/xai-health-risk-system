# XAI Health Risk Assessment System

An end-to-end **Explainable AI (XAI)** system designed to predict individual health risks for **Diabetes** and **Heart Disease**. This system goes beyond simple black-box predictions by providing transparent, human-interpretable explanations for every risk score generated, enabling trust and actionable insights for clinicians and users.

## 🚀 Key Features

- **Multi-Disease Prediction**: 
  - **Diabetes**: Random Forest model optimized with class balancing (SMOTE) and log-transformations.
  - **Heart Disease**: Lasso-penalized Logistic Regression for sparse feature selection.
- **Explainable AI (XAI) Integration**: 
  - Uses **SHAP (SHapley Additive exPlanations)** to generate local feature importance for every prediction.
  - Translates complex mathematical attributions into natural language summaries (e.g., *"High risk driven by elevated Glucose and BMI..."*).
- **Unified Risk Service**: 
  - Aggregates multiple disease models into a single patient health profile.
  - Provides risk stratification (Low/Medium/High).
- **Modern Backend Architecture**:
  - Built with **FastAPI** for high-performance, asynchronous inference.
  - Pydantic schemas for robust data validation.

## 🏗️ System Architecture

The project follows a modular MLOps structure:
1.  **Data Science Lab (`notebooks/`)**: Interactive environment for EDA, feature engineering, and model training.
2.  **Model Registry (`output/`)**: Serialized artifacts (models & scalers) saved for production use.
3.  **Core Logic (`src/`)**:
    -   `models/`: Training pipelines and algorithms.
    -   `predictors/`: Inference logic ensuring consistent preprocessing.
    -   `explainability/`: SHAP value generation and natural language parsing.
    -   `services/`: Business logic orchestration.
4.  **API Layer (`src/main.py`)**: REST API entry point.

## 📁 Project Structure

```plaintext
xai-health-risk-system/
├── data/                   # Raw and processed datasets
├── notebooks/              # Jupyter notebooks for EDA and training
├── output/                 # Trained models (.joblib) and scalers
├── src/
│   ├── cli/                # Command-line tools for quick testing
│   ├── explainability/     # SHAP integration & text generation
│   ├── models/             # Training scripts
│   ├── predictors/         # Loading models & running inference
│   ├── schemas/            # Pydantic models for API validation
│   ├── services/           # Unified assessment logic
│   └── main.py             # FastAPI application entry point
└── requirements.txt        # Project dependencies
```

## 🛠️ Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/KarikariSamuelZachary/xai-health-risk-system.git
    cd xai-health-risk-system
    ```

2.  **Create a Virtual Environment (Optional but Recommended)**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

## 💻 Usage

### 1. Running the API Server
Start the FastAPI server to handle requests locally.

```bash
cd src
uvicorn main:app --reload
```
*   **API Docs**: Visit `http://127.0.0.1:8000/docs` to interact with the API endpoints.

### 2. Testing via CLI
You can test the unified risk assessment logic directly from the terminal without running the server.

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

## 📊 Technologies Used

-   **Core**: Python 3.9+
-   **Machine Learning**: Scikit-Learn, NumPy, Pandas, Imbalanced-learn (SMOTE)
-   **Explainability**: SHAP (SHapley Additive exPlanations)
-   **API**: FastAPI, Uvicorn, Pydantic
-   **Serialization**: Joblib

## 📄 License

[MIT License](LICENSE)
