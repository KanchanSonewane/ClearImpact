import React, { useState } from 'react';
import { ShieldCheck, Info, ChevronRight, Award } from 'lucide-react';
import WhyTrustModal from './WhyTrustModal';

export default function ClearImpactScoreBadge({ campaign, score = 87, size = 'default' }) {
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);

  const getConfidenceLevel = (s) => {
    if (s >= 85) return { label: 'High Confidence', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (s >= 70) return { label: 'Medium Confidence', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    return { label: 'Review Pending', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  };

  const confidence = getConfidenceLevel(score);

  if (size === 'compact') {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsTrustModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold shadow-xs hover:bg-slate-800 transition group"
        >
          <Award className="w-3 h-3 text-amber-400" />
          <span>Score: {score}/100</span>
          <span className="text-[9px] text-emerald-400 font-semibold group-hover:underline">
            Why Trust?
          </span>
        </button>
        <WhyTrustModal
          isOpen={isTrustModalOpen}
          onClose={() => setIsTrustModalOpen(false)}
          campaign={campaign}
        />
      </>
    );
  }

  return (
    <>
      <div className="inline-flex flex-wrap items-center gap-2 p-1.5 pr-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center gap-1.5 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ClearImpact Score: {score}/100</span>
        </div>

        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${confidence.color}`}>
          {confidence.label}
        </span>

        <button
          type="button"
          onClick={() => setIsTrustModalOpen(true)}
          className="text-[11px] font-bold text-brand-600 hover:text-brand-800 flex items-center gap-0.5 ml-1 transition"
        >
          <span>Why trust this?</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <WhyTrustModal
        isOpen={isTrustModalOpen}
        onClose={() => setIsTrustModalOpen(false)}
        campaign={campaign}
      />
    </>
  );
}
