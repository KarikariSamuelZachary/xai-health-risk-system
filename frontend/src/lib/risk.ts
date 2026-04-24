export type RiskLevel = "Low" | "Moderate" | "High" | "Unavailable";

export const getRiskLevel = (riskScore?: number): RiskLevel => {
  if (riskScore === undefined || Number.isNaN(riskScore)) {
    return "Unavailable";
  }

  if (riskScore < 0.3) {
    return "Low";
  }

  if (riskScore < 0.5) {
    return "Moderate";
  }

  return "High";
};

export const getRiskBadgeClass = (riskLevel: RiskLevel) => {
  switch (riskLevel) {
    case "Low":
      return "border-risk-low/30 bg-risk-low/10 text-risk-low";
    case "Moderate":
      return "border-risk-moderate/30 bg-risk-moderate/10 text-risk-moderate";
    case "High":
      return "border-risk-high/30 bg-risk-high/10 text-risk-high";
    default:
      return "border-slate-300 bg-slate-100 text-slate-500";
  }
};

export const getRiskTextClass = (riskLevel: RiskLevel) => {
  switch (riskLevel) {
    case "Low":
      return "text-risk-low";
    case "Moderate":
      return "text-risk-moderate";
    case "High":
      return "text-risk-high";
    default:
      return "text-slate-500";
  }
};
