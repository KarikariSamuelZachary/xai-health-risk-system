"use client";

import React, { useState } from "react";
import Header from "@/components/header";

export default function StrokeAssessment() {
  const [formData, setFormData] = useState({
    gender: "Male",
    age: 67,
    hypertension: 0,
    heart_disease: 1,
    ever_married: "Yes",
    work_type: "Private",
    Residence_type: "Urban",
    avg_glucose_level: 228.69,
    bmi: 36.6,
    smoking_status: "formerly smoked",
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/assess/stroke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error running analysis:", error);
      alert("Failed to run analysis. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const riskScore = result?.risk_score ? result.risk_score * 100 : 0;
  const riskLevel = result?.risk_level || "Unknown";
  const riskColor = riskLevel === "high" ? "#e65151" : riskLevel === "moderate" ? "#f59e0b" : "#10b981";

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col font-display">
      <Header />

      <main className="flex-grow flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1400px] flex flex-col gap-6">
          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                Stroke Risk Assessment
              </h2>
              <p className="text-secondary dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">neurology</span>
                Cerebrovascular Risk Analysis
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
                  {/* Gender */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</span>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  {/* Age */}
                  <label className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Age</span>
                      <span className="text-xs text-slate-500">years</span>
                    </div>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", parseFloat(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    />
                  </label>

                  {/* Hypertension */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hypertension</span>
                    <select
                      value={formData.hypertension}
                      onChange={(e) => handleInputChange("hypertension", parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </label>

                  {/* Heart Disease */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Heart Disease</span>
                    <select
                      value={formData.heart_disease}
                      onChange={(e) => handleInputChange("heart_disease", parseInt(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </label>

                  {/* Ever Married */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ever Married</span>
                    <select
                      value={formData.ever_married}
                      onChange={(e) => handleInputChange("ever_married", e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </label>

                  {/* Work Type */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Work Type</span>
                    <select
                      value={formData.work_type}
                      onChange={(e) => handleInputChange("work_type", e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value="Private">Private</option>
                      <option value="Self-employed">Self-employed</option>
                      <option value="Govt_job">Government Job</option>
                      <option value="children">Children</option>
                      <option value="Never_worked">Never Worked</option>
                    </select>
                  </label>

                  {/* Residence Type */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Residence Type</span>
                    <select
                      value={formData.Residence_type}
                      onChange={(e) => handleInputChange("Residence_type", e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value="Urban">Urban</option>
                      <option value="Rural">Rural</option>
                    </select>
                  </label>

                  {/* Average Glucose Level */}
                  <label className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Average Glucose Level</span>
                      <span className="text-xs text-slate-500">mg/dL</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.avg_glucose_level}
                      onChange={(e) => handleInputChange("avg_glucose_level", parseFloat(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    />
                  </label>

                  {/* BMI */}
                  <label className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Body Mass Index (BMI)</span>
                      <span className="text-xs text-slate-500">kg/m²</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.bmi}
                      onChange={(e) => handleInputChange("bmi", parseFloat(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    />
                  </label>

                  {/* Smoking Status */}
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Smoking Status</span>
                    <select
                      value={formData.smoking_status}
                      onChange={(e) => handleInputChange("smoking_status", e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white font-medium transition-all outline-none"
                    >
                      <option value="formerly smoked">Formerly Smoked</option>
                      <option value="never smoked">Never Smoked</option>
                      <option value="smokes">Smokes</option>
                      <option value="Unknown">Unknown</option>
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

                      <p className="text-center text-sm text-slate-500 dark:text-slate-400 px-4">
                        {result.summary}
                      </p>
                    </div>

                    {/* Explainable AI (XAI) Breakdown */}
                    <div className="md:w-7/12 p-8 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">lightbulb</span>
                          Key Contributing Factors
                        </h3>
                      </div>

                      <div className="flex flex-col gap-6">
                        {result.top_factors?.slice(0, 5).map((factor: string, index: number) => {
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
                        {riskLevel === "high"
                          ? "Immediate neurological evaluation recommended. Consider CT/MRI scan and vascular assessment."
                          : riskLevel === "moderate"
                          ? "Regular monitoring of stroke risk factors advised. Consider lifestyle modifications and preventive measures."
                          : "Continue regular health monitoring. Maintain healthy lifestyle and manage risk factors."}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg dark:border dark:border-slate-700 p-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">neurology</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Analysis Yet</h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Enter patient data and click "Run Analysis" to see results
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
