"use client";

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface PredictionResponse {
  risk_score: number;
  patient_profile?: string;
  explanations: string[];
}

export interface UnifiedAssessmentResponse {
  diabetes?: PredictionResponse;
  heart_disease?: PredictionResponse;
  stroke?: PredictionResponse;
}

interface UnifiedRiskFormProps {
  onResult: (data: UnifiedAssessmentResponse) => void;
}

const sectionClassName =
  "rounded-sm border border-border-soft bg-surface-muted";
const inputClassName = "clinical-input";
const selectClassName = "clinical-select";

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className={sectionClassName}>
    <div className="border-b border-border-soft px-4 py-3">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
    </div>
    <div className="grid gap-4 p-4 md:grid-cols-2">{children}</div>
  </section>
);

const normalizePrediction = (
  prediction?: PredictionResponse
): PredictionResponse | undefined => {
  if (!prediction) {
    return undefined;
  }

  return {
    risk_score: prediction.risk_score,
    patient_profile: prediction.patient_profile,
    explanations: Array.isArray(prediction.explanations) ? prediction.explanations : [],
  };
};

const UnifiedRiskForm = ({ onResult }: UnifiedRiskFormProps) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: '' as string | number, gender: 'Male', BMI: '' as string | number, Glucose: '' as string | number,

    trestbps: '' as string | number, chol: '' as string | number, thalach: '' as string | number, restecg: 1,

    Pregnancies: '' as string | number, BloodPressure: '' as string | number, SkinThickness: '' as string | number, Insulin: '' as string | number, DiabetesPedigreeFunction: '' as string | number,

    cp: 2, fbs: 0, exang: 0, oldpeak: '' as string | number, slope: 1, ca: 0, thal: 2,

    hypertension: 0, ever_married: 'Yes', work_type: 'Private', smoking_status: 'never smoked',
    diagnosed_heart_condition: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (e.target.tagName === 'SELECT') {
      setFormData(prev => ({ ...prev, [name]: isNaN(Number(value)) ? value : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
        // Shared fields
        Age: formData.age === '' ? 0 : Number(formData.age),
        gender: formData.gender,
        Glucose: formData.Glucose === '' ? 0 : Number(formData.Glucose),
        BMI: formData.BMI === '' ? 0 : Number(formData.BMI),
        
        // Heart Disease
        cp: Number(formData.cp),
        trestbps: formData.trestbps === '' ? 0 : Number(formData.trestbps),
        chol: formData.chol === '' ? 0 : Number(formData.chol),
        fbs: Number(formData.fbs),
        restecg: Number(formData.restecg),
        thalach: formData.thalach === '' ? 0 : Number(formData.thalach),
        exang: Number(formData.exang),
        oldpeak: Number(formData.oldpeak),
        slope: Number(formData.slope),
        ca: Number(formData.ca),
        thal: Number(formData.thal),

        // Diabetes
        Pregnancies: formData.Pregnancies === '' ? 0 : Number(formData.Pregnancies),
        BloodPressure: formData.BloodPressure === '' ? 0 : Number(formData.BloodPressure),
        SkinThickness: formData.SkinThickness === '' ? 0 : Number(formData.SkinThickness),
        Insulin: formData.Insulin === '' ? 0 : Number(formData.Insulin),
        DiabetesPedigreeFunction: Number(formData.DiabetesPedigreeFunction),

        // Stroke
        hypertension: Number(formData.hypertension),
        ever_married: formData.ever_married,
        work_type: formData.work_type,
        smoking_status: formData.smoking_status,
        diagnosed_heart_condition: Boolean(formData.diagnosed_heart_condition),
    };

    try {
      const response = await axios.post<UnifiedAssessmentResponse>(
        `${API_BASE_URL}/assess/unified`,
        payload
      );

      onResult({
        diabetes: normalizePrediction(response.data.diabetes),
        heart_disease: normalizePrediction(response.data.heart_disease),
        stroke: normalizePrediction(response.data.stroke),
      });
    } catch (error) {
      console.error("API Error:", error);
      alert(`Failed to fetch risk assessment from ${API_BASE_URL}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="clinical-panel overflow-hidden">
      <div className="border-b border-border-soft px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Patient Data</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Complete the shared and condition-specific fields below to generate a
          comparative risk review.
        </p>
      </div>

      <div className="space-y-4 p-5">
        <Section
          title="Patient Demographics"
          description="Shared patient data used across the clinical risk models."
        >
          <div>
            <label className="clinical-label">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="clinical-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="clinical-label">Body Mass Index</label>
            <input
              type="number"
              step="0.1"
              name="BMI"
              value={formData.BMI}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="clinical-label">Average Glucose Level</label>
            <input
              type="number"
              name="Glucose"
              value={formData.Glucose}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
        </Section>

        <Section
          title="Metabolic and Diabetes Markers"
          description="Diabetes-specific measurements and family history indicators."
        >
          <div>
            <label className="clinical-label">Pregnancies</label>
            <input
              type="number"
              name="Pregnancies"
              value={formData.Pregnancies}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="clinical-label">Diastolic Blood Pressure</label>
            <input
              type="number"
              name="BloodPressure"
              value={formData.BloodPressure}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="clinical-label">Triceps Skin Thickness</label>
            <input
              type="number"
              name="SkinThickness"
              value={formData.SkinThickness}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="clinical-label">Serum Insulin</label>
            <input
              type="number"
              name="Insulin"
              value={formData.Insulin}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div className="md:col-span-2">
            <label className="clinical-label">Diabetes Pedigree Function</label>
            <input
              type="number"
              step="0.001"
              name="DiabetesPedigreeFunction"
              value={formData.DiabetesPedigreeFunction}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
        </Section>

        <Section
          title="Cardiovascular Findings"
          description="Findings used for the heart disease assessment and stroke linkage logic."
        >
          <div>
            <label className="clinical-label">Chest Pain Type</label>
            <select
              name="cp"
              value={formData.cp}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value={0}>Typical Angina</option>
              <option value={1}>Atypical Angina</option>
              <option value={2}>Non-anginal</option>
              <option value={3}>Asymptomatic</option>
            </select>
          </div>
          <div>
            <label className="clinical-label">Resting Blood Pressure</label>
            <input
              type="number"
              name="trestbps"
              value={formData.trestbps}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="clinical-label">Serum Cholesterol</label>
            <input
              type="number"
              name="chol"
              value={formData.chol}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="clinical-label">Fasting Blood Sugar {'>'} 120</label>
            <select
              name="fbs"
              value={formData.fbs}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>
          <div>
            <label className="clinical-label">Resting ECG</label>
            <select
              name="restecg"
              value={formData.restecg}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value={0}>Normal</option>
              <option value={1}>ST-T Wave Abnormality</option>
              <option value={2}>Left Ventricular Hypertrophy</option>
            </select>
          </div>
          <div>
            <label className="clinical-label">Maximum Heart Rate</label>
            <input
              type="number"
              name="thalach"
              value={formData.thalach}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="clinical-label">Exercise Induced Angina</label>
            <select
              name="exang"
              value={formData.exang}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>
          <div>
            <label className="clinical-label">ST Depression</label>
            <input
              type="number"
              step="0.1"
              name="oldpeak"
              value={formData.oldpeak}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="clinical-label">ST Segment Slope</label>
            <select
              name="slope"
              value={formData.slope}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value={0}>Upsloping</option>
              <option value={1}>Flat</option>
              <option value={2}>Downsloping</option>
            </select>
          </div>
          <div>
            <label className="clinical-label">Major Vessels</label>
            <select
              name="ca"
              value={formData.ca}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="clinical-label">Thalassemia</label>
            <select
              name="thal"
              value={formData.thal}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value={0}>Unknown</option>
              <option value={1}>Fixed Defect</option>
              <option value={2}>Normal</option>
              <option value={3}>Reversible Defect</option>
            </select>
          </div>
        </Section>

        <Section
          title="Stroke Risk Factors"
          description="Factors used directly in the stroke model and the heart condition override."
        >
          <div>
            <label className="clinical-label">Hypertension</label>
            <select
              name="hypertension"
              value={formData.hypertension}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>
          <div>
            <label className="clinical-label">Ever Married</label>
            <select
              name="ever_married"
              value={formData.ever_married}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="clinical-label">Work Type</label>
            <select
              name="work_type"
              value={formData.work_type}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value="Private">Private</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Govt_job">Government Job</option>
              <option value="children">Children</option>
              <option value="Never_worked">Never Worked</option>
            </select>
          </div>
          <div>
            <label className="clinical-label">Smoking Status</label>
            <select
              name="smoking_status"
              value={formData.smoking_status}
              onChange={handleChange}
              className={selectClassName}
            >
              <option value="formerly smoked">Formerly Smoked</option>
              <option value="never smoked">Never Smoked</option>
              <option value="smokes">Smokes</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          <div className="md:col-span-2 rounded-sm border border-border-soft bg-white px-4 py-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="diagnosed_heart_condition"
                checked={formData.diagnosed_heart_condition}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded-sm border-border-soft text-primary focus:ring-0"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  Diagnosed Heart Condition
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  If checked, the stroke assessment uses a known heart condition.
                  If unchecked, the heart disease assessment is used as the input.
                </span>
              </span>
            </label>
          </div>
        </Section>
      </div>

      <div className="flex flex-col gap-3 border-t border-border-soft px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-slate-600">
          Results update in the dashboard after submission.
        </p>
        <button type="submit" disabled={loading} className="clinical-button w-full md:w-auto">
          {loading ? 'Processing assessment...' : 'Run assessment'}
        </button>
      </div>
    </form>
  );
};

export default UnifiedRiskForm;
