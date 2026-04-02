"use client";

import React, { useEffect, useMemo, useState } from "react";
import ConditionDetailPanel from "@/components/ConditionDetailPanel";
import RiskMeter from "@/components/RiskMeter";
import UnifiedRiskForm, {
  PredictionResponse,
  UnifiedAssessmentResponse,
} from "@/components/UnifiedRiskForm";
import { getRiskBadgeClass, getRiskLevel } from "@/lib/risk";

type ConditionKey = "heart_disease" | "diabetes" | "stroke";

const conditionDefinitions: Array<{
  key: ConditionKey;
  label: string;
}> = [
  { key: "heart_disease", label: "Heart Disease" },
  { key: "diabetes", label: "Diabetes" },
  { key: "stroke", label: "Stroke" },
];

export default function Home() {
  const [results, setResults] = useState<UnifiedAssessmentResponse | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<ConditionKey>("heart_disease");

  const conditionResults = useMemo(
    () =>
      conditionDefinitions.map((condition) => {
        const prediction = results?.[condition.key] as PredictionResponse | undefined;

        return {
          ...condition,
          prediction,
          riskScore: prediction?.risk_score,
          riskLevel: getRiskLevel(prediction?.risk_score),
        };
      }),
    [results]
  );

  useEffect(() => {
    const highestRiskCondition = conditionResults
      .filter((condition) => condition.riskScore !== undefined)
      .sort((left, right) => (right.riskScore || 0) - (left.riskScore || 0))[0];

    if (highestRiskCondition) {
      setSelectedCondition(highestRiskCondition.key);
    }
  }, [conditionResults]);

  const activeCondition =
    conditionResults.find((condition) => condition.key === selectedCondition) ||
    conditionResults[0];

  return (
    <section className="mx-auto w-full max-w-[1480px] space-y-6">
      <div className="border-b border-border-soft pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Clinical Dashboard
        </p>
        <h1 className="mt-2 text-[30px] font-bold tracking-[-0.03em] text-slate-900">
          Clinical Risk Assessment Platform
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Enter patient data for comprehensive risk assessment
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,36rem)_minmax(0,1fr)]">
        <UnifiedRiskForm onResult={setResults} />

        <div className="space-y-6">
          <section className="clinical-panel overflow-hidden">
            <div className="clinical-section-heading flex items-center justify-between gap-4">
              <span>Risk Overview</span>
              <span className="text-xs font-medium text-slate-500">
                {results ? "Assessment completed" : "Awaiting patient data"}
              </span>
            </div>

            <div className="divide-y divide-border-soft">
              {conditionResults.map((condition) => (
                <button
                  key={condition.key}
                  type="button"
                  onClick={() => setSelectedCondition(condition.key)}
                  className={`w-full px-5 py-4 text-left transition-colors ${
                    selectedCondition === condition.key
                      ? "bg-slate-50"
                      : "bg-white hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-slate-900">
                        {condition.label}
                      </h2>
                      <p className="mt-1 truncate text-sm text-slate-600">
                        {condition.prediction?.patient_profile ||
                          "No assessment available yet"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-bold tracking-[-0.03em] text-slate-900">
                        {condition.riskScore !== undefined
                          ? `${Math.round(condition.riskScore * 100)}%`
                          : "--"}
                      </p>
                      <span
                        className={`mt-2 inline-flex rounded-sm border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getRiskBadgeClass(
                          condition.riskLevel
                        )}`}
                      >
                        {condition.riskLevel}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <RiskMeter score={condition.riskScore} compact />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <ConditionDetailPanel
            title={
              activeCondition
                ? `${activeCondition.label} Assessment Detail`
                : "Assessment Detail"
            }
            riskScore={activeCondition?.riskScore}
            patientProfile={activeCondition?.prediction?.patient_profile}
            explanations={activeCondition?.prediction?.explanations}
            placeholderTitle="No assessment submitted"
            placeholderDescription="Submit patient data to populate the comparative risk meters and review the contributing risk factors for the selected condition."
          />
        </div>
      </div>
    </section>
  );
}
