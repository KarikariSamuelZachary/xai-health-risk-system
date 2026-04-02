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
    return "Elevated cardiovascular risk warrants timely physician review and confirmation through standard cardiac workup.";
  }

  if (riskLevel === "Moderate") {
    return "Moderate cardiovascular risk should be interpreted with routine clinical follow-up and risk factor monitoring.";
  }

  if (riskLevel === "Low") {
    return "Current cardiovascular risk remains in the lower range. Continue preventive follow-up and routine surveillance.";
  }

  return "Submit the assessment to review the cardiovascular risk estimate and contributing clinical factors.";
};

const sectionGridClassName = "grid gap-4 md:grid-cols-2";

export default function HeartDiseaseAssessment() {
  const [formData, setFormData] = useState({
    Age: "" as string | number,
    sex: 1,
    cp: 2,
    trestbps: "" as string | number,
    chol: "" as string | number,
    fbs: 0,
    restecg: 1,
    thalach: "" as string | number,
    exang: 0,
    oldpeak: "" as string | number,
    slope: 2,
    ca: "" as string | number,
    thal: 2,
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

  const riskScore = result?.risk_score;
  const riskLevel = getRiskLevel(riskScore);

  return (
    <section className="mx-auto w-full max-w-[1480px] space-y-6">
      <div className="border-b border-border-soft pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Single Condition Review
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-[-0.03em] text-slate-900">
          Heart Disease Risk Assessment
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter patient data for comprehensive risk assessment
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,38rem)_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="clinical-panel overflow-hidden">
          <div className="clinical-section-heading">Patient Data</div>

          <div className="space-y-5 p-5">
            <section className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Patient and Symptom Profile</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Capture demographic information, symptom pattern, and baseline hemodynamic measures.
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
                  <label className="clinical-label">Sex</label>
                  <select
                    value={formData.sex}
                    onChange={(event) =>
                      handleInputChange("sex", parseInt(event.target.value, 10))
                    }
                    className="clinical-select"
                  >
                    <option value={1}>Male</option>
                    <option value={0}>Female</option>
                  </select>
                </div>

                <div>
                  <label className="clinical-label">Chest Pain Type</label>
                  <select
                    value={formData.cp}
                    onChange={(event) =>
                      handleInputChange("cp", parseInt(event.target.value, 10))
                    }
                    className="clinical-select"
                  >
                    <option value={0}>Typical Angina</option>
                    <option value={1}>Atypical Angina</option>
                    <option value={2}>Non-anginal Pain</option>
                    <option value={3}>Asymptomatic</option>
                  </select>
                </div>

                <div>
                  <label className="clinical-label">Resting Blood Pressure</label>
                  <input
                    type="number"
                    value={formData.trestbps}
                    onChange={(event) =>
                      handleInputChange(
                        "trestbps",
                        event.target.value === "" ? "" : parseInt(event.target.value, 10)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div>
                  <label className="clinical-label">Serum Cholesterol</label>
                  <input
                    type="number"
                    value={formData.chol}
                    onChange={(event) =>
                      handleInputChange(
                        "chol",
                        event.target.value === "" ? "" : parseInt(event.target.value, 10)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div>
                  <label className="clinical-label">Maximum Heart Rate</label>
                  <input
                    type="number"
                    value={formData.thalach}
                    onChange={(event) =>
                      handleInputChange(
                        "thalach",
                        event.target.value === "" ? "" : parseInt(event.target.value, 10)
                      )
                    }
                    className="clinical-input"
                  />
                </div>
              </div>
            </section>

            <section className="border-t border-border-soft pt-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Clinical Findings</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Document electrocardiographic, exercise, and vessel-related findings used in the assessment.
                </p>
              </div>

              <div className={`${sectionGridClassName} mt-4`}>
                <div>
                  <label className="clinical-label">Fasting Blood Sugar &gt; 120 mg/dL</label>
                  <select
                    value={formData.fbs}
                    onChange={(event) =>
                      handleInputChange("fbs", parseInt(event.target.value, 10))
                    }
                    className="clinical-select"
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>

                <div>
                  <label className="clinical-label">Resting ECG Results</label>
                  <select
                    value={formData.restecg}
                    onChange={(event) =>
                      handleInputChange("restecg", parseInt(event.target.value, 10))
                    }
                    className="clinical-select"
                  >
                    <option value={0}>Normal</option>
                    <option value={1}>ST-T Wave Abnormality</option>
                    <option value={2}>Left Ventricular Hypertrophy</option>
                  </select>
                </div>

                <div>
                  <label className="clinical-label">Exercise Induced Angina</label>
                  <select
                    value={formData.exang}
                    onChange={(event) =>
                      handleInputChange("exang", parseInt(event.target.value, 10))
                    }
                    className="clinical-select"
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>

                <div>
                  <label className="clinical-label">ST Depression</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.oldpeak}
                    onChange={(event) =>
                      handleInputChange(
                        "oldpeak",
                        event.target.value === "" ? "" : parseFloat(event.target.value)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div>
                  <label className="clinical-label">ST Segment Slope</label>
                  <select
                    value={formData.slope}
                    onChange={(event) =>
                      handleInputChange("slope", parseInt(event.target.value, 10))
                    }
                    className="clinical-select"
                  >
                    <option value={0}>Upsloping</option>
                    <option value={1}>Flat</option>
                    <option value={2}>Downsloping</option>
                  </select>
                </div>

                <div>
                  <label className="clinical-label">Major Vessels</label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={formData.ca}
                    onChange={(event) =>
                      handleInputChange(
                        "ca",
                        event.target.value === "" ? "" : parseInt(event.target.value, 10)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="clinical-label">Thalassemia</label>
                  <select
                    value={formData.thal}
                    onChange={(event) =>
                      handleInputChange("thal", parseInt(event.target.value, 10))
                    }
                    className="clinical-select"
                  >
                    <option value={1}>Normal</option>
                    <option value={2}>Fixed Defect</option>
                    <option value={3}>Reversible Defect</option>
                  </select>
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
            title="Heart Disease Assessment Detail"
            riskScore={result?.risk_score}
            patientProfile={result?.patient_profile}
            explanations={result?.explanations}
            placeholderTitle="No assessment submitted"
            placeholderDescription="Enter patient data and run the assessment to review the cardiovascular risk profile and contributing clinical factors."
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
