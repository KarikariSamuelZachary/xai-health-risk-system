import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

# Load processed data
data = pd.read_csv('../../data/processed/heart_processed.csv')

# Convert categorical columns if needed (adjust as per your notebook)
categorical_cols = ['sex', 'fbs', 'exang', 'target', 'cp', 'restecg', 'slope', 'thal', 'ca']
for col in categorical_cols:
    data[col] = data[col].astype('category')

# Apply same transformations as used in predictor
data['oldpeak'] = np.log1p(data['oldpeak'])
data['chol'] = np.log1p(data['chol'])

# Split features and target
X = data.drop('target', axis=1)
y = data['target']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Standardize features
scaler = StandardScaler()
X_train_norm = scaler.fit_transform(X_train)
X_test_norm = scaler.transform(X_test)

# Train Lasso Logistic Regression
lasso_lr = LogisticRegression(penalty='l1', max_iter=5000, C=0.1, solver='saga', random_state=42)
lasso_lr.fit(X_train_norm, y_train)

# Save model and scaler
joblib.dump(lasso_lr, '../../output/heart_disease_lasso_model.joblib')
joblib.dump(scaler, '../../output/heart_disease_scaler.joblib')
