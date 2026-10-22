import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

export default function NGOVerifiedBadge({ darpanId, status12A = 'YES', status80G = 'YES', size = 'sm' }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowPopup(!showPopup);
        }}
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition shadow-2xs"
        title="ClearImpact Verified NGO • Click for details"
      >
        <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
        <span>Verified NGO</span>
        <Info className="w-3 h-3 text-emerald-600/70 ml-0.5" />
      </button>

      {/* Clean, Non-Intrusive Popover (Positioned below the badge so it NEVER obscures photos) */}
      {showPopup && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setShowPopup(false);
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-full mt-1.5 w-60 p-3 bg-white text-slate-800 text-xs rounded-xl shadow-xl z-50 border border-slate-200"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Statutory Verified
              </span>
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              {darpanId && (
                <div className="flex justify-between">
                  <span className="text-slate-400">NGO Darpan:</span>
                  <span className="font-mono font-bold text-slate-800">{darpanId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Section 12A:</span>
                <span className="font-semibold text-emerald-700">Verified Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Section 80G:</span>
                <span className="font-semibold text-emerald-700">Tax Exemption Active</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
