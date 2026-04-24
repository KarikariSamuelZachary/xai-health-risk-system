"use client";

import React from "react";
import {
  getRiskBadgeClass,
  getRiskLevel,
  getRiskTextClass,
  type RiskLevel,
} from "@/lib/risk";

interface ConditionDetailPanelProps {
  title: string;
  riskScore?: number;
  patientProfile?: string;
  explanations?: string[];
  placeholderTitle: string;
  placeholderDescription: string;
}

const statusCopy: Record<RiskLevel, string> = {
  Low: "Current risk appears lower relative to the model threshold.",
  Moderate: "Risk sits in an intermediate range and deserves clinical context.",
  High: "Risk is elevated and should be reviewed alongside standard clinical workup.",
  Unavailable: "Submit patient data to populate this panel.",
};

export default function ConditionDetailPanel({
  title,
  riskScore,
  patientProfile,
  explanations,
  placeholderTitle,
  placeholderDescription,
}: ConditionDetailPanelProps) {
  const riskLevel = getRiskLevel(riskScore);
  const hasResult = riskScore !== undefined;

  return (
    <section className="clinical-panel overflow-hidden">
      <div className="clinical-section-heading">{title}</div>

      {!hasResult ? (
        <div className="p-5">
          <h2 className="text-base font-semibold text-slate-900">{placeholderTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {placeholderDescription}
          </p>
        </div>
      ) : (
        <div className="space-y-5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-soft pb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Assessment Summary
              </p>
              <p className="mt-3 text-4xl font-bold tracking-[-0.04em] text-slate-900">
                {Math.round((riskScore || 0) * 100)}%
              </p>
            </div>

            <div className="max-w-sm text-right">
              <span
                className={`inline-flex rounded-sm border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getRiskBadgeClass(
                  riskLevel
                )}`}
              >
                {riskLevel}
              </span>
              <p className={`mt-3 text-sm font-medium ${getRiskTextClass(riskLevel)}`}>
                {statusCopy[riskLevel]}
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
            <div className="rounded-sm border border-border-soft bg-surface-muted p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Patient Profile
              </p>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-900">
                {patientProfile || "Profile not available"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Contributing Factors
              </p>
              {explanations && explanations.length > 0 ? (
                <ul className="mt-3 space-y-3">
                  {explanations.map((explanation, index) => (
                    <li
                      key={`${title}-${index}`}
                      className="rounded-sm border border-border-soft bg-white px-4 py-3 text-sm leading-6 text-slate-700"
                    >
                      {explanation}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Explanation factors were not returned for this assessment.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
