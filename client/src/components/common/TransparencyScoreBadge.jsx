import React from 'react';
import { Award, Info } from 'lucide-react';

export default function TransparencyScoreBadge({ score = 88, showDetails = false }) {
  const getBadgeColor = (s) => {
    if (s >= 90) return 'bg-indigo-50 border-indigo-200 text-indigo-700';
    if (s >= 75) return 'bg-blue-50 border-blue-200 text-blue-700';
    return 'bg-amber-50 border-amber-200 text-amber-700';
  };

  return (
    <div className="relative group inline-block">
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${getBadgeColor(score)} cursor-help`}>
        <Award className="w-3.5 h-3.5 text-indigo-600" />
        <span>Impact Transparency Score: {score}/100</span>
      </div>

      <div className="hidden group-hover:block absolute left-0 top-full mt-2 w-72 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-2xl z-50 border border-slate-700 pointer-events-none">
        <p className="font-semibold text-indigo-300 mb-1 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          Transparency Score Factors
        </p>
        <p className="text-slate-300 text-[11px] mb-2">
          An explainable assessment of NGO reporting consistency and verified proof-of-impact.
        </p>
        <div className="space-y-1 text-[11px] text-slate-300 border-t border-slate-800 pt-1.5">
          <div className="flex justify-between"><span>NGO Verification & 80G:</span> <span className="font-semibold text-emerald-400">Verified</span></div>
          <div className="flex justify-between"><span>Milestones Completed:</span> <span className="font-semibold text-indigo-300">High Reliability</span></div>
          <div className="flex justify-between"><span>Evidence Hash Integrity:</span> <span className="font-semibold text-emerald-400">100% Passed</span></div>
          <div className="flex justify-between"><span>Reporting Timeliness:</span> <span className="font-semibold text-indigo-300">Prompt</span></div>
        </div>
      </div>
    </div>
  );
}
