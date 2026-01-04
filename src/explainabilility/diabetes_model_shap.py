import pandas as pd
import numpy as np
import joblib
import shap
import matplotlib.pyplot as plt
from scipy.stats.mstats import winsorize

# Load processed data
DATA_PATH = '../../data/processed/diabetes_processed.csv'
data = pd.read_csv(DATA_PATH)

# Preprocess as in training
for col in ['Insulin', 'DiabetesPedigreeFunction', 'Age']:
    data[col] = np.log1p(data[col])
for col in ['Pregnancies', 'Glucose', 'SkinThickness', 'BMI']:
    data[col] = winsorize(data[col], limits=[0.01, 0.01])

data['Outcome'] = data['Outcome'].astype('category')

# Split features and target
X = data.drop('Outcome', axis=1)
y = data['Outcome']

# Load scaler and model
scaler = joblib.load('../../output/diabetes_rf_scaler.joblib')
model = joblib.load('../../output/diabetes_rf_model.joblib')

# Standardize features (as in training)
X_norm = scaler.transform(X)

# Create SHAP explainer and values
explainer = shap.Explainer(model, X_norm)
shap_values = explainer(X_norm)

# Summary plot (bar and beeswarm)
shap.summary_plot(shap_values, X, plot_type='bar', show=False)
plt.tight_layout()
plt.savefig('../../output/diabetes_shap_summary_bar.png')
plt.close()

shap.summary_plot(shap_values, X, show=False)
plt.tight_layout()
plt.savefig('../../output/diabetes_shap_summary_beeswarm.png')
plt.close()

print('SHAP summary plots saved to output/.')

# --- SHAP explanation for a single prediction ---
sample_idx = 0  # Change this index to explain a different patient
X_sample = X.iloc[[sample_idx]]
X_norm_sample = scaler.transform(X_sample)
shap_values_sample = explainer(X_norm_sample)

print(f'\nSHAP explanation for sample index {sample_idx}:')
for feature, value, shap_val in zip(X_sample.columns, X_sample.iloc[0], shap_values_sample.values[0]):
    print(f'{feature}: value={value}, SHAP contribution={shap_val:.4f}')

# Visualize the SHAP force plot for this prediction
force_plot = shap.plots.force(shap_values_sample[0], matplotlib=True, show=False, feature_names=X_sample.columns)
plt.tight_layout()
plt.savefig('../../output/diabetes_shap_force_sample.png')
plt.close()
