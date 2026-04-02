"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import RiskCard from "@/components/riskcard";
import UnifiedRiskForm, { UnifiedAssessmentResponse } from "@/components/UnifiedRiskForm";

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

export default function Home() {
  const [results, setResults] = useState<UnifiedAssessmentResponse | null>(null);

  const defaultHeartExplanations = ["Submit form to see AI insights."];
  const defaultDiabetesExplanations = ["Submit form to see AI insights."];
  const defaultStrokeExplanations = ["Submit form to see AI insights."];

  const heartRiskLevel = getRiskLevel(results?.heart_disease?.risk_score);
  const diabetesRiskLevel = getRiskLevel(results?.diabetes?.risk_score);
  const strokeRiskLevel = getRiskLevel(results?.stroke?.risk_score);

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0f151a] dark:text-gray-100 font-display min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 lg:px-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#0f151a] dark:text-white mb-2">Unified Risk Assessment</h1>
          <p className="text-[#537893] dark:text-gray-400 max-w-2xl">
            Enter patient clinical data below to generate explainable AI risk predictions.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
             <UnifiedRiskForm onResult={setResults} />
          </div>

          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sticky top-24">
            
            {/* Heart Card - Fixed Key: heart_disease */}
            <RiskCard
              title="Heart Disease Risk"
              icon="ecg_heart"
              percent={results?.heart_disease?.risk_score ? Math.round(results.heart_disease.risk_score * 100) : 0}
              riskLevel={heartRiskLevel}
              colorClass={heartRiskLevel === "High" ? "text-risk-high" : heartRiskLevel === "Moderate" ? "text-risk-moderate" : "text-risk-low"}
              gradientClass={heartRiskLevel === "High" ? "risk-gradient-high" : "risk-gradient-low"}
              patientProfile={results?.heart_disease?.patient_profile}
              explanations={results?.heart_disease?.explanations ?? defaultHeartExplanations}
            />

            {/* Diabetes Card - Fixed Key: diabetes */}
            <RiskCard
              title="Diabetes Risk"
              icon="bloodtype"
              percent={results?.diabetes?.risk_score ? Math.round(results.diabetes.risk_score * 100) : 0}
              riskLevel={diabetesRiskLevel}
              colorClass={diabetesRiskLevel === "High" ? "text-risk-high" : diabetesRiskLevel === "Moderate" ? "text-risk-moderate" : "text-risk-low"}
              gradientClass={diabetesRiskLevel === "High" ? "risk-gradient-high" : "risk-gradient-low"}
              patientProfile={results?.diabetes?.patient_profile}
              explanations={results?.diabetes?.explanations ?? defaultDiabetesExplanations}
            />

            {/* Stroke Card - Fixed Key: stroke */}
            <RiskCard
              title="Stroke Risk"
              icon="neurology"
              percent={results?.stroke?.risk_score ? Math.round(results.stroke.risk_score * 100) : 0}
              riskLevel={strokeRiskLevel}
              colorClass={strokeRiskLevel === "High" ? "text-risk-high" : strokeRiskLevel === "Moderate" ? "text-risk-moderate" : "text-risk-low"}
              gradientClass={strokeRiskLevel === "High" ? "risk-gradient-high" : "risk-gradient-low"}
              patientProfile={results?.stroke?.patient_profile}
              explanations={results?.stroke?.explanations ?? defaultStrokeExplanations}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
