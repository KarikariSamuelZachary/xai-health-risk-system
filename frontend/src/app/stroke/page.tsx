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
    return "Elevated stroke risk warrants prompt review with routine neurologic and vascular follow-up as clinically appropriate.";
  }

  if (riskLevel === "Moderate") {
    return "Moderate stroke risk should be reviewed alongside preventive care planning and surveillance of vascular risk factors.";
  }

  if (riskLevel === "Low") {
    return "Current stroke risk remains in the lower range. Continue standard preventive follow-up and risk factor management.";
  }

  return "Submit the assessment to review the stroke risk estimate and contributing clinical factors.";
};

const sectionGridClassName = "grid gap-4 md:grid-cols-2";

export default function StrokeAssessment() {
  const [formData, setFormData] = useState({
    gender: "Male",
    age: "" as string | number,
    hypertension: 0,
    heart_disease: 1,
    ever_married: "Yes",
    work_type: "Private",
    Residence_type: "Urban",
    avg_glucose_level: "" as string | number,
    bmi: "" as string | number,
    smoking_status: "formerly smoked",
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
      const response = await fetch(`${API_BASE_URL}/assess/stroke`, {
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
          Stroke Risk Assessment
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
                <h2 className="text-sm font-semibold text-slate-900">Patient and Vascular Profile</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Capture demographics and established vascular risk indicators used by the stroke assessment.
                </p>
              </div>

              <div className={sectionGridClassName}>
                <div>
                  <label className="clinical-label">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(event) => handleInputChange("gender", event.target.value)}
                    className="clinical-select"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="clinical-label">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(event) =>
                      handleInputChange(
                        "age",
                        event.target.value === "" ? "" : parseFloat(event.target.value)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div>
                  <label className="clinical-label">Hypertension</label>
                  <select
                    value={formData.hypertension}
                    onChange={(event) =>
                      handleInputChange("hypertension", parseInt(event.target.value, 10))
                    }
                    className="clinical-select"
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>

                <div>
                  <label className="clinical-label">Heart Disease</label>
                  <select
                    value={formData.heart_disease}
                    onChange={(event) =>
                      handleInputChange("heart_disease", parseInt(event.target.value, 10))
                    }
                    className="clinical-select"
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>

                <div>
                  <label className="clinical-label">Ever Married</label>
                  <select
                    value={formData.ever_married}
                    onChange={(event) => handleInputChange("ever_married", event.target.value)}
                    className="clinical-select"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="clinical-label">Work Type</label>
                  <select
                    value={formData.work_type}
                    onChange={(event) => handleInputChange("work_type", event.target.value)}
                    className="clinical-select"
                  >
                    <option value="Private">Private</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Govt_job">Government Job</option>
                    <option value="children">Children</option>
                    <option value="Never_worked">Never Worked</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="border-t border-border-soft pt-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Metabolic and Lifestyle Factors</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Complete glucose, anthropometric, residence, and smoking variables used by the model.
                </p>
              </div>

              <div className={`${sectionGridClassName} mt-4`}>
                <div>
                  <label className="clinical-label">Residence Type</label>
                  <select
                    value={formData.Residence_type}
                    onChange={(event) =>
                      handleInputChange("Residence_type", event.target.value)
                    }
                    className="clinical-select"
                  >
                    <option value="Urban">Urban</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>

                <div>
                  <label className="clinical-label">Average Glucose Level</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.avg_glucose_level}
                    onChange={(event) =>
                      handleInputChange(
                        "avg_glucose_level",
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
                    value={formData.bmi}
                    onChange={(event) =>
                      handleInputChange(
                        "bmi",
                        event.target.value === "" ? "" : parseFloat(event.target.value)
                      )
                    }
                    className="clinical-input"
                  />
                </div>

                <div>
                  <label className="clinical-label">Smoking Status</label>
                  <select
                    value={formData.smoking_status}
                    onChange={(event) =>
                      handleInputChange("smoking_status", event.target.value)
                    }
                    className="clinical-select"
                  >
                    <option value="formerly smoked">Formerly Smoked</option>
                    <option value="never smoked">Never Smoked</option>
                    <option value="smokes">Smokes</option>
                    <option value="Unknown">Unknown</option>
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
            title="Stroke Assessment Detail"
            riskScore={result?.risk_score}
            patientProfile={result?.patient_profile}
            explanations={result?.explanations}
            placeholderTitle="No assessment submitted"
            placeholderDescription="Enter patient data and run the assessment to review the stroke risk profile and contributing clinical factors."
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
