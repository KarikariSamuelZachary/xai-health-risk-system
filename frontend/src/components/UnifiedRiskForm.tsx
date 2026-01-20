"use client";

import React, { useState } from 'react';
import axios from 'axios';

// --- Helper Component for Accordion Sections ---
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
  const [openSections, setOpenSections] = useState({ cardio: false, diabetes: false, clinical: false });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const [formData, setFormData] = useState({
    // Vitals
    age: 55, Age: 55, sex: 1, BMI: 28.5, Glucose: 100,
    
    // Cardio
    trestbps: 130, chol: 240, thalach: 150, restecg: 1,
    
    // Diabetes / Metabolic
    Pregnancies: 1, BloodPressure: 72, SkinThickness: 30, Insulin: 100, DiabetesPedigreeFunction: 0.5,
    
    // Clinical History
    cp: 2, fbs: 0, exang: 0, oldpeak: 1.0, slope: 1, ca: 0, thal: 2,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'age') {
        setFormData({ ...formData, age: Number(value), Age: Number(value) });
    } else {
        setFormData({ ...formData, [name]: Number(value) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/assess/unified', formData);
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
                <label className="text-xs font-semibold uppercase text-primary">Sex</label>
                <select name="sex" value={formData.sex} onChange={handleChange} className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:text-white">
                    <option value={1}>Male</option>
                    <option value={0}>Female</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">BMI</label>
                <input type="number" step="0.1" name="BMI" value={formData.BMI} onChange={handleChange} className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:text-white" />
            </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-primary">Avg Glucose (mg/dL)</label>
                <input type="number" name="Glucose" value={formData.Glucose} onChange={handleChange} className="w-full p-2 border rounded text-sm dark:bg-gray-800 dark:text-white" />
            </div>
        </div>

        {/* --- 2. CARDIOVASCULAR HEALTH (Examples: BP, Cholesterol) --- */}
        <FormSection title="Cardiovascular Metrics" isOpen={openSections.cardio} onToggle={() => toggleSection('cardio')}>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Systolic BP</label>
                <input type="number" name="trestbps" value={formData.trestbps} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Cholesterol</label>
                <input type="number" name="chol" value={formData.chol} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Max Heart Rate</label>
                <input type="number" name="thalach" value={formData.thalach} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Exercise Angina</label>
                <select name="exang" value={formData.exang} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>
            </div>
        </FormSection>

        {/* --- 3. METABOLIC & DIABETES INDICATORS --- */}
        <FormSection title="Metabolic & Diabetes Indicators" isOpen={openSections.diabetes} onToggle={() => toggleSection('diabetes')}>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Diastolic BP</label>
                <input type="number" name="BloodPressure" value={formData.BloodPressure} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Insulin</label>
                <input type="number" name="Insulin" value={formData.Insulin} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Skin Thickness</label>
                <input type="number" name="SkinThickness" value={formData.SkinThickness} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Pregnancies</label>
                <input type="number" name="Pregnancies" value={formData.Pregnancies} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
        </FormSection>

         {/* --- 4. ADVANCED CLINICAL HISTORY --- */}
         <FormSection title="Clinical History (ECG & Angiography)" isOpen={openSections.clinical} onToggle={() => toggleSection('clinical')}>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Chest Pain Type</label>
                <select name="cp" value={formData.cp} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value={0}>Typical Angina</option>
                    <option value={1}>Atypical Angina</option>
                    <option value={2}>Non-anginal</option>
                    <option value={3}>Asymptomatic</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Thalassemia</label>
                <select name="thal" value={formData.thal} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value={0}>Unknown</option>
                    <option value={1}>Fixed Defect</option>
                    <option value={2}>Normal</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Major Vessels (0-3)</label>
                <input type="number" name="ca" value={formData.ca} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
            </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-gray-500">ST Slope</label>
                <select name="slope" value={formData.slope} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value={0}>Upsloping</option>
                    <option value={1}>Flat</option>
                    <option value={2}>Downsloping</option>
                </select>
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