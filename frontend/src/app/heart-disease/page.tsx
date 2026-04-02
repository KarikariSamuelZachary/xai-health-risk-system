"use client";

import React, { useState } from "react";
import Header from "@/components/header";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AnalysisResponse {
  risk_score: number;
  patient_profile?: string;
  explanations: string[];
}

const getRiskLevel = (riskScore?: number) => {
  if (riskScore === undefined) {
    return "Unknown";
  }

  if (riskScore < 0.3) {
    return "Low";
  }

  if (riskScore < 0.5) {
    return "Moderate";
  }

  return "High";
};

export default function HeartDiseaseAssessment() {
  const [formData, setFormData] = useState({
    Age: '' as string | number,
    sex: 1,
    cp: 2,
    trestbps: '' as string | number,
    chol: '' as string | number,
    fbs: 0,
    restecg: 1,
    thalach: '' as string | number,
    exang: 0,
    oldpeak: '' as string | number,
    slope: 2,
    ca: '' as string | number,
    thal: 2,
  });

  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const runAnalysis = async () => {
    const hasEmptyField = Object.values(formData).some((value) => value === "");

    if (hasEmptyField) {
      alert("Please fill in all fields before running analysis.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/assess/heart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: AnalysisResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error running analysis:", error);
      alert(`Failed to run analysis. Check that the backend is running at ${API_BASE_URL}.`);
    } finally {
      setLoading(false);
    }
  };

  const riskScore = result?.risk_score ? result.risk_score * 100 : 0;
  const riskLevel = getRiskLevel(result?.risk_score);
  const riskColor = riskLevel === "High" ? "#e65151" : riskLevel === "Moderate" ? "#f59e0b" : "#10b981";

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display">
      <Header />

      <main className="flex-grow flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1400px] flex flex-col gap-6">
          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                Heart Disease Risk Assessment
              </h2>
              <p className="text-secondary dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">ecg_heart</span>
                Cardiovascular Health Analysis
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary dark:text-slate-400">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              {new Date().toLocaleString()}
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Clinical Inputs */}
            <section className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-md dark:border dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">clinical_notes</span>
                    Clinical Inputs
                  </h3>
                  <span className="text-xs font-medium text-slate-500 bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                    Manual Entry
                  </span>
                </div>

                <div className="p-6 flex flex-col gap-5">
                  {/* Age */}
                  <label className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Age</span>
                      <span className="text-xs text-slate-500">years</span>
                    </div>
                    <input
                      type="number"
                      value={formData.Age}
                      onChange={(e) => handleInputChange("Age", e.target.value === "" ? "" : parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    />
                  </label>

                  {/* Sex */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sex</span>
                    <select
                      value={formData.sex}
                      onChange={(e) => handleInputChange("sex", parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value={1}>Male</option>
                      <option value={0}>Female</option>
                    </select>
                  </label>

                  {/* Chest Pain Type */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Chest Pain Type</span>
                    <select
                      value={formData.cp}
                      onChange={(e) => handleInputChange("cp", parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value={0}>Typical Angina</option>
                      <option value={1}>Atypical Angina</option>
                      <option value={2}>Non-anginal Pain</option>
                      <option value={3}>Asymptomatic</option>
                    </select>
                  </label>

                  {/* Resting Blood Pressure */}
                  <label className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Resting Blood Pressure</span>
                      <span className="text-xs text-slate-500">mm Hg</span>
                    </div>
                    <input
                      type="number"
                      value={formData.trestbps}
                      onChange={(e) => handleInputChange("trestbps", e.target.value === "" ? "" : parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    />
                  </label>

                  {/* Cholesterol */}
                  <label className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Serum Cholesterol</span>
                      <span className="text-xs text-slate-500">mg/dl</span>
                    </div>
                    <input
                      type="number"
                      value={formData.chol}
                      onChange={(e) => handleInputChange("chol", e.target.value === "" ? "" : parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    />
                  </label>

                  {/* Fasting Blood Sugar */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Fasting Blood Sugar &gt; 120 mg/dl</span>
                    <select
                      value={formData.fbs}
                      onChange={(e) => handleInputChange("fbs", parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </label>

                  {/* Resting ECG */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Resting ECG Results</span>
                    <select
                      value={formData.restecg}
                      onChange={(e) => handleInputChange("restecg", parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value={0}>Normal</option>
                      <option value={1}>ST-T Wave Abnormality</option>
                      <option value={2}>Left Ventricular Hypertrophy</option>
                    </select>
                  </label>

                  {/* Max Heart Rate */}
                  <label className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Maximum Heart Rate Achieved</span>
                      <span className="text-xs text-slate-500">bpm</span>
                    </div>
                    <input
                      type="number"
                      value={formData.thalach}
                      onChange={(e) => handleInputChange("thalach", e.target.value === "" ? "" : parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    />
                  </label>

                  {/* Exercise Induced Angina */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Exercise Induced Angina</span>
                    <select
                      value={formData.exang}
                      onChange={(e) => handleInputChange("exang", parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </label>

                  {/* ST Depression */}
                  <label className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ST Depression (Oldpeak)</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.oldpeak}
                      onChange={(e) => handleInputChange("oldpeak", e.target.value === "" ? "" : parseFloat(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    />
                  </label>

                  {/* Slope */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ST Slope</span>
                    <select
                      value={formData.slope}
                      onChange={(e) => handleInputChange("slope", parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value={0}>Upsloping</option>
                      <option value={1}>Flat</option>
                      <option value={2}>Downsloping</option>
                    </select>
                  </label>

                  {/* Number of Major Vessels */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Number of Major Vessels (0-3)</span>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={formData.ca}
                      onChange={(e) => handleInputChange("ca", e.target.value === "" ? "" : parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    />
                  </label>

                  {/* Thalassemia */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Thalassemia</span>
                    <select
                      value={formData.thal}
                      onChange={(e) => handleInputChange("thal", parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value={1}>Normal</option>
                      <option value={2}>Fixed Defect</option>
                      <option value={3}>Reversible Defect</option>
                    </select>
                  </label>

                  <button
                    onClick={runAnalysis}
                    disabled={loading}
                    className="mt-4 w-full h-12 bg-primary hover:bg-sky-700 text-white font-bold rounded-lg shadow-md shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined group-hover:animate-pulse">analytics</span>
                    {loading ? "Analyzing..." : "Run Analysis"}
                  </button>
                </div>
              </div>
            </section>

            {/* Right Column: Results & XAI */}
            <section className="lg:col-span-8 flex flex-col gap-6">
              {result ? (
                <>
                  {/* Main Result Card */}
                  <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg dark:border dark:border-slate-700 overflow-hidden flex flex-col md:flex-row">
                    {/* Visualization Area */}
                    <div className="md:w-5/12 p-8 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50">
                      <h3 className="text-secondary dark:text-slate-400 font-medium text-sm mb-6 uppercase tracking-wider">
                        Prediction Probability
                      </h3>

                      {/* Gauge */}
                      <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                        <div className="absolute inset-0 rounded-full border-[16px] border-slate-100 dark:border-slate-700"></div>
                        <div
                          className="absolute inset-0 rounded-full rotate-[-90deg]"
                          style={{
                            background: `conic-gradient(${riskColor} ${riskScore}%, #e2e8f0 0deg)`,
                            borderRadius: "50%",
                          }}
                        ></div>
                        <div className="absolute inset-[16px] rounded-full bg-surface-light dark:bg-slate-800 flex flex-col items-center justify-center z-10">
                          <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                            {Math.round(riskScore)}%
                          </span>
                          <span
                            className="font-bold text-sm mt-1 uppercase"
                            style={{ color: riskColor }}
                          >
                            {riskLevel} Risk
                          </span>
                        </div>
                      </div>

                      {result.patient_profile && (
                        <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-center text-sm font-semibold text-primary dark:border-primary/30 dark:bg-primary/15">
                          Patient Profile: {result.patient_profile}
                        </div>
                      )}
                    </div>

                    {/* Explainable AI (XAI) Breakdown */}
                    <div className="md:w-7/12 p-8 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">lightbulb</span>
                          AI Risk Analysis
                        </h3>
                      </div>

                      <div className="flex flex-col gap-6">
                        {result.explanations?.slice(0, 5).map((factor: string, index: number) => {
                          const percentage = Math.max(20, 85 - index * 15);
                          const impact = index === 0 ? "Critical Impact" : index === 1 ? "High Impact" : "Moderate Impact";
                          const impactColor = index === 0 ? "bg-risk-high" : index === 1 ? "bg-risk-medium" : "bg-slate-400";

                          return (
                            <div key={index} className="group">
                              <div className="flex justify-between items-end mb-2">
                                <div className="flex flex-col">
                                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{factor}</span>
                                </div>
                                <span className={`text-xs font-bold text-white ${impactColor} px-2 py-0.5 rounded shadow-sm`}>
                                  {impact}
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className={`${impactColor} h-2.5 rounded-full transition-all duration-500`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Box */}
                  <div className="bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-primary p-5 rounded-r-lg flex items-start gap-4">
                    <div className="p-2 bg-white dark:bg-blue-900/40 rounded-full text-primary shrink-0">
                      <span className="material-symbols-outlined">medical_services</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Clinical Recommendation</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {riskLevel === "High"
                          ? "Urgent cardiology consultation recommended. Consider ECG, stress test, and cardiac biomarkers."
                          : riskLevel === "Moderate"
                          ? "Cardiology follow-up advised. Monitor cardiovascular risk factors closely."
                          : "Continue regular cardiovascular health monitoring. Maintain healthy lifestyle choices."}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg dark:border dark:border-slate-700 p-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">ecg_heart</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Analysis Yet</h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Enter patient data and click &ldquo;Run Analysis&rdquo; to see results
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
