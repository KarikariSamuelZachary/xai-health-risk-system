"use client";

import React, { useState } from "react";
import ConditionDetailPanel from "@/components/ConditionDetailPanel";
import { getRiskLevel, type RiskLevel } from "@/lib/risk";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AnalysisResponse {
  risk_score: number;
  patient_profile?: string;
  explanations: string[];
}

const getRecommendation = (riskLevel: RiskLevel) => {
  if (riskLevel === "High") {
    return "Elevated diabetes risk warrants prompt clinical review, glycemic confirmation, and follow-up planning.";
  }

  if (riskLevel === "Moderate") {
    return "Moderate diabetes risk should be reviewed alongside routine laboratory monitoring and longitudinal lifestyle counseling.";
  }

  if (riskLevel === "Low") {
    return "Current diabetes risk remains in the lower range. Continue standard preventive follow-up and periodic screening.";
  }

  return "Submit the assessment to review the diabetes risk estimate and contributing clinical factors.";
};

const sectionGridClassName = "grid gap-4 md:grid-cols-2";

export default function DiabetesAssessment() {
  const [formData, setFormData] = useState({
    Pregnancies: "" as string | number,
    Glucose: "" as string | number,
    BloodPressure: "" as string | number,
    SkinThickness: "" as string | number,
    Insulin: "" as string | number,
    BMI: "" as string | number,
    DiabetesPedigreeFunction: "" as string | number,
    Age: "" as string | number,
  });

  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasEmptyField = Object.values(formData).some((value) => value === "");

    if (hasEmptyField) {
      alert("Please fill in all fields before running analysis.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/assess/diabetes`, {
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

  const riskScore = result?.risk_score;
  const riskLevel = getRiskLevel(riskScore);

  return (
    <section className="mx-auto w-full max-w-[1480px] space-y-6">
      <div className="border-b border-border-soft pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Single Condition Review
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-[-0.03em] text-slate-900">
          Diabetes Risk Assessment
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter patient data for comprehensive risk assessment
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="clinical-panel overflow-hidden">
          <div className="clinical-section-heading">Patient Data</div>

          <div className="space-y-5 p-5">
            <section className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Core Measurements</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Enter glucose, anthropometric, and demographic measurements used by the diabetes assessment.
                </p>
              </div>

              <div className={sectionGridClassName}>
                <div>
                  <label className="clinical-label">Age</label>
                  <input
                    type="number"
                    value={formData.Age}
                    onChange={(event) =>
                      handleInputChange(
                        "Age",
                        event.target.value === "" ? "" : parseInt(event.target.value, 10)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div>
                  <label className="clinical-label">Pregnancies</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.Pregnancies}
                    onChange={(event) =>
                      handleInputChange(
                        "Pregnancies",
                        event.target.value === "" ? "" : parseInt(event.target.value, 10)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div>
                  <label className="clinical-label">Glucose Level</label>
                  <input
                    type="number"
                    value={formData.Glucose}
                    onChange={(event) =>
                      handleInputChange(
                        "Glucose",
                        event.target.value === "" ? "" : parseFloat(event.target.value)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div>
                  <label className="clinical-label">Body Mass Index</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.BMI}
                    onChange={(event) =>
                      handleInputChange(
                        "BMI",
                        event.target.value === "" ? "" : parseFloat(event.target.value)
                      )
                    }
                    className="clinical-input"
                  />
                </div>
              </div>
            </section>

            <section className="border-t border-border-soft pt-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Metabolic Indicators</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Complete the remaining laboratory and family history fields used by the model.
                </p>
              </div>

              <div className={`${sectionGridClassName} mt-4`}>
                <div>
                  <label className="clinical-label">Diastolic Blood Pressure</label>
                  <input
                    type="number"
                    value={formData.BloodPressure}
                    onChange={(event) =>
                      handleInputChange(
                        "BloodPressure",
                        event.target.value === "" ? "" : parseFloat(event.target.value)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div>
                  <label className="clinical-label">Triceps Skin Thickness</label>
                  <input
                    type="number"
                    value={formData.SkinThickness}
                    onChange={(event) =>
                      handleInputChange(
                        "SkinThickness",
                        event.target.value === "" ? "" : parseFloat(event.target.value)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div>
                  <label className="clinical-label">Serum Insulin</label>
                  <input
                    type="number"
                    value={formData.Insulin}
                    onChange={(event) =>
                      handleInputChange(
                        "Insulin",
                        event.target.value === "" ? "" : parseFloat(event.target.value)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div>
                  <label className="clinical-label">Diabetes Pedigree Function</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.DiabetesPedigreeFunction}
                    onChange={(event) =>
                      handleInputChange(
                        "DiabetesPedigreeFunction",
                        event.target.value === "" ? "" : parseFloat(event.target.value)
                      )
                    }
                    className="clinical-input"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border-soft px-5 py-4">
            <p className="text-sm leading-6 text-slate-600">
              Submit to populate the clinical detail panel.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="clinical-button shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Run assessment"}
            </button>
          </div>
        </form>

        <section className="space-y-6">
          <ConditionDetailPanel
            title="Diabetes Assessment Detail"
            riskScore={result?.risk_score}
            patientProfile={result?.patient_profile}
            explanations={result?.explanations}
            placeholderTitle="No assessment submitted"
            placeholderDescription="Enter patient data and run the assessment to review the diabetes risk profile and contributing clinical factors."
          />

          <section className="clinical-panel overflow-hidden">
            <div className="clinical-section-heading">Clinical Considerations</div>
            <div className="p-5">
              <p className="text-3xl font-bold tracking-[-0.03em] text-slate-900">
                {riskScore !== undefined ? `${Math.round(riskScore * 100)}%` : "--"}
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                {riskLevel}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {getRecommendation(riskLevel)}
              </p>
            </div>
          </section>
        </section>
      </div>
    </section>
  );
}
