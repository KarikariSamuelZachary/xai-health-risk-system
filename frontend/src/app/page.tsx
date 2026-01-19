"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import RiskCard from "@/components/riskcard";
import UnifiedRiskForm from "@/components/UnifiedRiskForm";

export default function Home() {
  const [results, setResults] = useState<any>(null);

  const defaultHeartInsights = [
    { icon: "info", color: "text-gray-400", text: "Submit form to see AI insights." }
  ];
  const defaultDiabetesInsights = [
    { icon: "info", color: "text-gray-400", text: "Submit form to see AI insights." }
  ];

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
              riskLevel={results?.heart_disease ? results.heart_disease.risk_level : "Unknown"}
              colorClass={results?.heart_disease?.risk_level === "High" ? "text-risk-high" : "text-risk-low"}
              gradientClass={results?.heart_disease?.risk_level === "High" ? "risk-gradient-high" : "risk-gradient-low"}
              insights={results?.heart_disease ? results.heart_disease.top_factors.map((f: string) => ({
                 icon: "warning", 
                 color: "text-risk-moderate", 
                 text: f 
              })) : defaultHeartInsights}
            />

            {/* Diabetes Card - Fixed Key: diabetes */}
            <RiskCard
              title="Diabetes Risk"
              icon="bloodtype"
              percent={results?.diabetes?.risk_score ? Math.round(results.diabetes.risk_score * 100) : 0}
              riskLevel={results?.diabetes ? results.diabetes.risk_level : "Unknown"}
              colorClass={results?.diabetes?.risk_level === "High" ? "text-risk-high" : "text-risk-low"}
              gradientClass={results?.diabetes?.risk_level === "High" ? "risk-gradient-high" : "risk-gradient-low"}
              insights={results?.diabetes ? results.diabetes.top_factors.map((f: string) => ({
                 icon: "warning", 
                 color: "text-risk-moderate", 
                 text: f 
              })) : defaultDiabetesInsights}
            />
          </div>
        </div>
      </main>
    </div>
  );
}