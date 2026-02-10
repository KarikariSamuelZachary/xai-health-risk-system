#!/usr/bin/env python3
"""
Stroke Prediction Model Training Script

This script trains a Lasso Logistic Regression model for stroke prediction
with optimized parameters based on notebook analysis.
"""

import numpy as np
import pandas as pd
import joblib
import os
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, recall_score, f1_score, precision_score
from imblearn.over_sampling import SMOTE
import warnings
warnings.filterwarnings('ignore')


def load_data(path):
    """Load and prepare stroke dataset"""
    df = pd.read_csv(path)
    
    # Drop patient ID - it's a unique identifier, not a predictive feature
    if 'id' in df.columns:
        df = df.drop(columns=['id'])
    
    # Set proper data types for categorical variables
    df['gender'] = df['gender'].astype('category')
    df['ever_married'] = df['ever_married'].astype('category')
    df['work_type'] = df['work_type'].astype('category')
    if 'Residence_type' in df.columns:
        df['Residence_type'] = df['Residence_type'].astype('category')
    df['smoking_status'] = df['smoking_status'].astype('category')
    df['stroke'] = df['stroke'].astype('bool')
    
    return df


def preprocess_data(df):
    """Apply transformations to features"""
    # Log1p transform for skewed numerical features
    for col in ['avg_glucose_level', 'bmi']:
        df[col] = np.log1p(df[col])
    
    # Drop Residence_type (no significant relationship to target)
    if 'Residence_type' in df.columns:
        df = df.drop(columns=['Residence_type'])
    
    return df


def encode_and_split(df):
    """Encode categorical variables and split data"""
    X = df.drop('stroke', axis=1)
    y = df['stroke']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )
    
    # Separate categorical and numerical columns
    categorical_cols = ['gender', 'ever_married', 'work_type', 'smoking_status']
    numerical_cols = ['age', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi']
    
    # One-hot encode categorical variables
    encoder = OneHotEncoder(drop='first', sparse_output=False)
    X_train_cat = encoder.fit_transform(X_train[categorical_cols])
    X_test_cat = encoder.transform(X_test[categorical_cols])
    
    # Get feature names for one-hot encoded columns
    cat_feature_names = encoder.get_feature_names_out(categorical_cols)
    
    # Convert to DataFrames
    X_train_cat_df = pd.DataFrame(X_train_cat, columns=cat_feature_names, index=X_train.index)
    X_test_cat_df = pd.DataFrame(X_test_cat, columns=cat_feature_names, index=X_test.index)
    
    # Combine with numerical columns
    X_train_processed = pd.concat([X_train[numerical_cols], X_train_cat_df], axis=1)
    X_test_processed = pd.concat([X_test[numerical_cols], X_test_cat_df], axis=1)
    
    return X_train_processed, X_test_processed, y_train, y_test, encoder


def apply_smote_and_scale(X_train, X_test, y_train):
    """Apply SMOTE for class balancing and StandardScaler for normalization"""
    # Apply SMOTE to handle class imbalance
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X_train, y_train)
    
    print(f"Before SMOTE: {y_train.value_counts().to_dict()}")
    print(f"After SMOTE: {y_resampled.value_counts()}")
    
    # Scale the features (after SMOTE)
    scaler = StandardScaler()
    X_train_norm = scaler.fit_transform(X_resampled)
    X_test_norm = scaler.transform(X_test)
    
    return X_train_norm, X_test_norm, y_resampled, scaler


def train_lasso_model(X_train, y_train, X_test, y_test):
    """Train and evaluate Lasso Logistic Regression with optimized parameters"""
    print("\n" + "="*80)
    print("Training Lasso Logistic Regression...")
    print("Parameters: C=0.01, solver='liblinear'")
    print("="*80)
    
    # Train with optimized parameters from notebook analysis
    lasso_lr = LogisticRegression(
        penalty='l1', 
        C=0.01, 
        solver='liblinear', 
        max_iter=5000, 
        random_state=42
    )
    lasso_lr.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = lasso_lr.predict(X_test)
    y_proba = lasso_lr.predict_proba(X_test)[:, 1]
    
    roc_auc = roc_auc_score(y_test, y_proba)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    
    print(f"\nModel Performance:")
    print(f"ROC-AUC: {roc_auc:.3f}")
    print(f"Recall: {recall:.3f}")
    print(f"F1 Score: {f1:.3f}")
    print(f"Precision: {precision:.3f}")
    
    return lasso_lr


def save_model(model, scaler, encoder, output_dir='../../output'):
    """Save model and preprocessing objects"""
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Save model, scaler, and encoder
    model_path = os.path.join(output_dir, 'stroke_model.joblib')
    scaler_path = os.path.join(output_dir, 'stroke_scaler.joblib')
    encoder_path = os.path.join(output_dir, 'stroke_encoder.joblib')
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(encoder, encoder_path)
    
    print("\n" + "="*80)
    print("Model and preprocessing objects saved:")
    print(f"  Model: {model_path}")
    print(f"  Scaler: {scaler_path}")
    print(f"  Encoder: {encoder_path}")
    print("="*80)


def train_and_evaluate():
    """Main training pipeline"""
    print("="*80)
    print("STROKE PREDICTION MODEL TRAINING")
    print("="*80)
    
    # Load data
    print("\nLoading data...")
    df = load_data("../../data/processed/stroke_processed.csv")
    print(f"Dataset shape: {df.shape}")
    print(f"Stroke cases: {df['stroke'].value_counts().to_dict()}")
    
    # Preprocess data
    print("\nPreprocessing data...")
    df = preprocess_data(df)
    
    # Encode and split
    print("\nEncoding categorical variables and splitting data...")
    X_train, X_test, y_train, y_test, encoder = encode_and_split(df)
    print(f"Training set shape: {X_train.shape}")
    print(f"Test set shape: {X_test.shape}")
    
    # Apply SMOTE and scaling
    print("\nApplying SMOTE and scaling...")
    X_train_norm, X_test_norm, y_resampled, scaler = apply_smote_and_scale(
        X_train, X_test, y_train
    )
    
    # Train Lasso model with optimized parameters
    model = train_lasso_model(X_train_norm, y_resampled, X_test_norm, y_test)
    
    # Save model and preprocessing objects
    save_model(model, scaler, encoder)
    
    print("\nTraining complete!")
    return model


if __name__ == "__main__":
    train_and_evaluate()
