import React from 'react';

interface Insight {
  icon: string;
  color: string;
  text: string;
}

interface RiskCardProps {
  title: string;
  icon: string;
  percent: number;
  riskLevel: string;
  insights: Insight[];
  gradientClass: string;
  colorClass: string;
}

const RiskCard: React.FC<RiskCardProps> = ({
  title,
  icon,
  percent,
  riskLevel,
  insights,
  gradientClass,
  colorClass,
}) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-[#e8eef2] dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-[#e8eef2] dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-surface-dark dark:to-surface-dark">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-[#0f151a] dark:text-white text-lg font-bold flex items-center gap-2`}>
            <span className={`material-symbols-outlined ${colorClass}`}>{icon}</span>
            {title}
          </h3>
          <span className="material-symbols-outlined text-[#537893] cursor-help opacity-50 hover:opacity-100" title={`Based on dataset`}>info</span>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative size-20 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <div className={`absolute inset-0 rounded-full ${gradientClass}`} style={{ mask: 'radial-gradient(transparent 60%, black 61%)', WebkitMask: 'radial-gradient(transparent 60%, black 61%)' }}></div>
            <span className="text-xl font-black text-[#0f151a] dark:text-white z-10">{percent}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#537893] uppercase tracking-wide">Prediction</span>
            <span className={`text-2xl font-extrabold ${colorClass} leading-none mt-1`}>{riskLevel}</span>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white dark:bg-surface-dark">
        <h4 className="text-xs font-bold text-[#537893] dark:text-gray-400 uppercase tracking-wider mb-3">AI Insights (Explainability)</h4>
        <ul className="space-y-3">
          {insights.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-[#0f151a] dark:text-gray-200">
              <span className={`material-symbols-outlined ${insight.color} text-lg shrink-0 mt-0.5`}>{insight.icon}</span>
              <span dangerouslySetInnerHTML={{ __html: insight.text }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RiskCard;
