import pandas as pd
import joblib
import shap
import matplotlib.pyplot as plt

# Load processed data
DATA_PATH = '../../data/processed/heart_processed.csv'
data = pd.read_csv(DATA_PATH)

# Convert categorical columns (as in model training)
categorical_cols = ['sex', 'fbs', 'exang', 'target', 'cp', 'restecg', 'slope', 'thal', 'ca']
for col in categorical_cols:
    data[col] = data[col].astype('category')

# Split features and target
X = data.drop('target', axis=1)
y = data['target']

# Load scaler and model
scaler = joblib.load('../../output/heart_disease_scaler.joblib')
model = joblib.load('../../output/heart_disease_lasso_model.joblib')

# Standardize features (as in training)
X_norm = scaler.transform(X)

# Create SHAP explainer and values
explainer = shap.Explainer(model, X_norm)
shap_values = explainer(X_norm)

# Summary plot (bar and beeswarm)
shap.summary_plot(shap_values, X, plot_type='bar', show=False)
plt.tight_layout()
plt.savefig('../../output/heart_shap_summary_bar.png')
plt.close()

shap.summary_plot(shap_values, X, show=False)
plt.tight_layout()
plt.savefig('../../output/heart_shap_summary_beeswarm.png')
plt.close()

print('SHAP summary plots saved to output/.')
print('SHAP summary plots saved to output/.')

# --- SHAP explanation for a single prediction ---
# Select a single sample (e.g., the first row)
sample_idx = 0  # Change this index to explain a different patient
X_sample = X.iloc[[sample_idx]]
X_norm_sample = scaler.transform(X_sample)

# Get SHAP values for the single prediction
shap_values_sample = explainer(X_norm_sample)

# Print feature contributions for this prediction
print(f'\nSHAP explanation for sample index {sample_idx}:')
for feature, value, shap_val in zip(X_sample.columns, X_sample.iloc[0], shap_values_sample.values[0]):
    print(f'{feature}: value={value}, SHAP contribution={shap_val:.4f}')

# Visualize the SHAP force plot for this prediction
force_plot = shap.plots.force(shap_values_sample[0], matplotlib=True, show=False, feature_names=X_sample.columns)
plt.tight_layout()
plt.savefig('../../output/heart_shap_force_sample.png')
plt.close()
print('SHAP force plot for the sample saved to output/heart_shap_force_sample.png')
