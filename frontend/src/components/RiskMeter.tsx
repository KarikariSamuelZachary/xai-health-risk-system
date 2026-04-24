"use client";

import React from "react";
import { getRiskLevel, getRiskTextClass } from "@/lib/risk";

interface RiskMeterProps {
  score?: number;
  compact?: boolean;
}

export default function RiskMeter({ score, compact = false }: RiskMeterProps) {
  const safeScore = score === undefined || Number.isNaN(score) ? undefined : score;
  const percentage = safeScore !== undefined ? Math.max(0, Math.min(100, safeScore * 100)) : 0;
  const riskLevel = getRiskLevel(safeScore);

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-risk-low via-risk-moderate to-risk-high transition-[width] duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        <span>0%</span>
        <span className={getRiskTextClass(riskLevel)}>
          {safeScore !== undefined ? `${Math.round(percentage)}% ${riskLevel}` : "No score"}
        </span>
        <span>100%</span>
      </div>
    </div>
  );
}
