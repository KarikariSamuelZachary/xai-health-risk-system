# Contributing to XAI Health Risk Prediction System

Thank you for your interest in contributing to this project!  
This repository focuses on building an explainable, multi-disease health risk prediction system using machine learning.

---

## Project Scope

This system currently predicts risk for **Diabetes**, **Heart Disease**, and **Stroke** using a unified assessment form with shared fields and SHAP-based explainability.

Contributions are welcome in the following areas:
- Machine Learning models (classification & risk scoring)
- Model explainability (SHAP, feature importance, natural language explanations)
- Backend APIs (FastAPI endpoints, schemas, services)
- Frontend (Next.js dashboard, forms, result visualization)
- Dataset integration and preprocessing
- Documentation and testing

---

## Tech Stack

### Backend
- **Python 3.12+**
- **FastAPI** — REST API framework
- **Pydantic** — schema validation
- **scikit-learn** — model training (Random Forest, Logistic Regression)
- **SHAP** — model explainability
- **imbalanced-learn** — SMOTE for class imbalance
- **Joblib** — model serialization
- **Uvicorn** — ASGI server

### Frontend
- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript**
- **Tailwind CSS**
- **Axios** — HTTP client

### Deployment
- **Vercel** — frontend hosting (auto-deploy from `main`)
- **Render** — backend hosting (auto-deploy from `main`)

---

## Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/<your-username>/xai-health-risk-system.git
cd xai-health-risk-system

# Create and activate a virtual environment
python -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn src.main:app --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env.local

# Start the development server
npm run dev
```

---

## How to Contribute

1. **Fork** the repository
2. **Create** a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make** your changes — keep commits focused and descriptive
4. **Test** your changes:
   ```bash
   # Backend tests
   pytest

   # Frontend lint
   cd frontend && npm run lint
   ```
5. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** with a clear description of:
   - What the change does
   - Why it's needed
   - How it was tested

---

## Project Structure Overview

| Directory | Purpose |
|-----------|---------|
| `src/` | Backend — API, models, predictors, services, schemas |
| `frontend/` | Next.js frontend application |
| `notebooks/` | Jupyter notebooks for EDA and model training |
| `data/` | Raw and processed datasets |
| `output/` | Trained model artifacts (.joblib) |

---

## Code Style

- **Python**: Follow PEP 8, use type hints where possible
- **TypeScript/React**: Follow ESLint rules configured in the project
- **Commits**: Use clear, descriptive messages (e.g., `feat: add stroke prediction endpoint`)

---

## Reporting Issues

If you find a bug or have a feature request, please open an issue with:
- A clear title and description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

---

Thank you for helping improve this project!
