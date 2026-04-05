#!usr/bin/env python3
import numpy as np
import pandas as pd
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, f1_score, recall_score, precision_score
from scipy.stats.mstats import winsorize
from imblearn.over_sampling import SMOTE
import warnings
warnings.filterwarnings('ignore')

def load_data(path):
    df = pd.read_csv(path)
    df['Outcome'] = df['Outcome'].astype('category')
    return df

import json

def preprocess_data_and_save_bounds(df):
    # Log1p transform
    for col in ['Insulin', 'DiabetesPedigreeFunction', 'Age']:
        df[col] = np.log1p(df[col])
        
    winsorize_cols = ['Pregnancies', 'Glucose', 'SkinThickness', 'BMI']
    bounds = {}
    
    # Calculate, apply and save static bounds
    for col in winsorize_cols:
        lower_bound = df[col].quantile(0.01)
        upper_bound = df[col].quantile(0.99)
        
        # Save bounds for the backend
        bounds[col] = {"lower": lower_bound, "upper": upper_bound}
        
        # Apply clipping to training data
        df[col] = np.clip(df[col], lower_bound, upper_bound)
        
    # Save the bounds to a JSON file
    with open('../../output/diabetes_winsorize_bounds.json', 'w') as f:
        json.dump(bounds, f)
        
    return df

def train_and_evaluate(df):
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X_train, y_train)
    scaler = StandardScaler()
    X_train_norm = scaler.fit_transform(X_resampled)
    X_test_norm = scaler.transform(X_test)

    # Random Forest with threshold = 0.4
    rf = RandomForestClassifier(class_weight='balanced', random_state=42, n_estimators=100)
    rf.fit(X_train_norm, y_resampled)
    y_proba_rf = rf.predict_proba(X_test_norm)[:, 1]
    threshold = 0.4
    y_pred_rf = (y_proba_rf >= threshold).astype(int)
    print('Random Forest (threshold=0.4):')
    print('ROC-AUC:', roc_auc_score(y_test, y_proba_rf))
    print('Recall:', recall_score(y_test, y_pred_rf))
    print('F1 Score:', f1_score(y_test, y_pred_rf))
    print('Precision:', precision_score(y_test, y_pred_rf))

    # Save model and scaler
    joblib.dump(rf, '../../output/diabetes_rf_model.joblib')
    joblib.dump(scaler, '../../output/diabetes_rf_scaler.joblib')

if __name__ == "__main__":
    df = load_data("../../data/processed/diabetes_processed.csv")
    df = preprocess_data_and_save_bounds(df)
    train_and_evaluate(df)
