"use client";

import React, { useState } from 'react';
import axios from 'axios';

// Note: Using 'any' for simplicity, but you can define a strict interface if you prefer
const UnifiedRiskForm = ({ onResult }: { onResult: (data: any) => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // --- Heart Disease Fields ---
    age: 55,
    sex: 1,
    cp: 2,
    trestbps: 140,
    chol: 250,
    fbs: 0,
    restecg: 1,
    thalach: 150,
    exang: 0,
    oldpeak: 2.3,
    slope: 1,
    ca: 0,
    thal: 2,

    // --- Diabetes Fields ---
    Pregnancies: 2,
    Glucose: 148,
    BloodPressure: 72,
    SkinThickness: 35,
    Insulin: 168,
    BMI: 33.6,
    DiabetesPedigreeFunction: 0.627,
    Age: 50 // Note: Some models might use 'Age' (capitalized) for diabetes specific logic if dataset had it
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use localhost:8000 because this runs in the browser
      const response = await axios.post('http://localhost:8000/assess/unified', formData);
      onResult(response.data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch risk assessment. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-[#0f151a] dark:text-white">Patient Clinical Data</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Age (Heart)</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" />
            </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500">BMI</label>
                <input type="number" step="0.1" name="BMI" value={formData.BMI} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Glucose</label>
                <input type="number" name="Glucose" value={formData.Glucose} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Blood Pressure</label>
                <input type="number" name="trestbps" value={formData.trestbps} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" />
            </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Cholesterol</label>
                <input type="number" name="chol" value={formData.chol} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" />
            </div>
            {/* Add hidden inputs for hardcoded/default values if you don't want to show them all */}
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
        >
            {loading ? 'Processing...' : 'Run Analysis'}
            {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
        </button>
    </form>
  );
};

export default UnifiedRiskForm;