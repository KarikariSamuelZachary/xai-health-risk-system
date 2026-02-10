"use client";

import React, { useState } from 'react';
import axios from 'axios';

const FormSection = ({ title, isOpen, onToggle, children }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) => (
    <div className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden mb-3">
        <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 transition-colors text-left"
        >
            <span className="font-semibold text-sm text-[#0f151a] dark:text-gray-200">{title}</span>
            <span className="material-symbols-outlined text-gray-400 text-lg transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
        </button>
        {isOpen && (
            <div className="p-4 bg-white dark:bg-transparent grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-1 duration-200">
                {children}
            </div>
        )}
    </div>
);

const UnifiedRiskForm = ({ onResult }: { onResult: (data: any) => void }) => {
  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState({ cardio: false, diabetes: false, clinical: false, stroke: false });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const [formData, setFormData] = useState({
    age: '' as string | number, gender: 'Male', BMI: '' as string | number, Glucose: '' as string | number,
    
    trestbps: '' as string | number, chol: '' as string | number, thalach: '' as string | number, restecg: 1,
    
    Pregnancies: '' as string | number, BloodPressure: '' as string | number, SkinThickness: '' as string | number, Insulin: '' as string | number, DiabetesPedigreeFunction: 0.5,
    
    cp: 2, fbs: 0, exang: 0, oldpeak: 1.0, slope: 1, ca: 0, thal: 2,

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
        ca: formData.ca === '' ? 0 : Number(formData.ca),
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/assess/unified`, payload);
      onResult(response.data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch risk assessment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-[#0f151a] dark:text-white">Patient Data</h3>
        
        {/* --- 1. CORE VITALS (Always Visible) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:text-white">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Body Mass Index (BMI)</label>
                <input type="number" step="0.1" name="BMI" value={formData.BMI} onChange={handleChange} className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:text-white" />
            </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Average Glucose Level (mg/dL)</label>
                <input type="number" name="Glucose" value={formData.Glucose} onChange={handleChange} className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:text-white" />
            </div>
        </div>

        {/* --- 2. CARDIOVASCULAR HEALTH (Examples: BP, Cholesterol) --- */}
        <FormSection title="Cardiovascular Metrics" isOpen={openSections.cardio} onToggle={() => toggleSection('cardio')}>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Resting Blood Pressure (trestbps)</label>
                <input type="number" name="trestbps" value={formData.trestbps} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Serum Cholesterol (chol)</label>
                <input type="number" name="chol" value={formData.chol} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Maximum Heart Rate (thalach)</label>
                <input type="number" name="thalach" value={formData.thalach} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Exercise Induced Angina (exang)</label>
                <select name="exang" value={formData.exang} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>
            </div>
        </FormSection>

        {/* --- 3. METABOLIC & DIABETES INDICATORS --- */}
        <FormSection title="Metabolic & Diabetes Indicators" isOpen={openSections.diabetes} onToggle={() => toggleSection('diabetes')}>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Diastolic Blood Pressure (BloodPressure)</label>
                <input type="number" name="BloodPressure" value={formData.BloodPressure} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Serum Insulin (Insulin)</label>
                <input type="number" name="Insulin" value={formData.Insulin} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Triceps Skin Thickness (SkinThickness)</label>
                <input type="number" name="SkinThickness" value={formData.SkinThickness} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Number of Pregnancies (Pregnancies)</label>
                <input type="number" name="Pregnancies" value={formData.Pregnancies} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
        </FormSection>

         {/* --- 4. ADVANCED CLINICAL HISTORY --- */}
         <FormSection title="Clinical History (ECG & Angiography)" isOpen={openSections.clinical} onToggle={() => toggleSection('clinical')}>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Chest Pain Type (cp)</label>
                <select name="cp" value={formData.cp} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value={0}>Typical Angina</option>
                    <option value={1}>Atypical Angina</option>
                    <option value={2}>Non-anginal</option>
                    <option value={3}>Asymptomatic</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Thalassemia (thal)</label>
                <select name="thal" value={formData.thal} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value={0}>Unknown</option>
                    <option value={1}>Fixed Defect</option>
                    <option value={2}>Normal</option>
                    <option value={3}>Reversible Defect</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Number of Major Vessels (ca)</label>
                <select name="ca" value={formData.ca} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                </select>
            </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">ST Segment Slope (slope)</label>
                <select name="slope" value={formData.slope} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value={0}>Upsloping</option>
                    <option value={1}>Flat</option>
                    <option value={2}>Downsloping</option>
                </select>
            </div>
        </FormSection>

        {/* --- 5. STROKE RISK FACTORS --- */}
        <FormSection title="Stroke Risk Factors" isOpen={openSections.stroke} onToggle={() => toggleSection('stroke')}>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Hypertension</label>
                <select name="hypertension" value={formData.hypertension} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Ever Married</label>
                <select name="ever_married" value={formData.ever_married} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Work Type</label>
                <select name="work_type" value={formData.work_type} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value="Private">Private</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Govt_job">Government Job</option>
                    <option value="children">Children</option>
                    <option value="Never_worked">Never Worked</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Smoking Status</label>
                <select name="smoking_status" value={formData.smoking_status} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value="formerly smoked">Formerly Smoked</option>
                    <option value="never smoked">Never Smoked</option>
                    <option value="smokes">Smokes</option>
                    <option value="Unknown">Unknown</option>
                </select>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <input
                    type="checkbox"
                    name="diagnosed_heart_condition"
                    checked={formData.diagnosed_heart_condition}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <div>
                    <label className="text-sm font-semibold text-[#0f151a] dark:text-white cursor-pointer">
                        Diagnosed Heart Condition
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Check if you have a diagnosed heart condition. If unchecked, the heart disease prediction will be used for stroke assessment.
                    </p>
                </div>
            </div>
        </FormSection>

        <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
        >
            {loading ? 'Processing Assessment...' : 'Calculate Risk Profile'}
            {!loading && <span className="material-symbols-outlined text-sm">monitor_heart</span>}
        </button>
    </form>
  );
};

export default UnifiedRiskForm;