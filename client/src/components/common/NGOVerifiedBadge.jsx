import React, { useState } from 'react';
import { ShieldCheck, Info, X, Clock, AlertTriangle, XCircle } from 'lucide-react';

export default function NGOVerifiedBadge({
  status = 'VERIFIED',
  darpanId,
  status12A = 'YES',
  status80G = 'YES',
  size = 'sm'
}) {
  const [showPopup, setShowPopup] = useState(false);

  // Normalize status string
  const normalizedStatus = (status || 'VERIFIED').toUpperCase();
  const isVerified = normalizedStatus === 'VERIFIED';
  const isPending = normalizedStatus === 'PENDING' || normalizedStatus === 'UNDER_REVIEW';
  const isRejected = normalizedStatus === 'REJECTED';

  if (isPending) {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowPopup(!showPopup);
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition shadow-2xs"
          title="Verification Pending Admin Review • Click for details"
        >
          <Clock className={size === 'sm' ? 'w-3.5 h-3.5 text-amber-600 animate-pulse' : 'w-4 h-4 text-amber-600 animate-pulse'} />
          <span>Verification Pending</span>
          <Info className="w-3 h-3 text-amber-600/70 ml-0.5" />
        </button>

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
              className="absolute left-0 top-full mt-1.5 w-64 p-3.5 bg-white text-slate-800 text-xs rounded-xl shadow-xl z-50 border border-amber-200"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Compliance Review in Progress
                </span>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <p className="leading-relaxed">
                  This organization has uploaded statutory documents. A ClearImpact compliance officer is verifying the Darpan ID and 12A/80G filings.
                </p>
                <div className="pt-1.5 border-t border-slate-100 text-slate-500">
                  <div>Status: <span className="font-bold text-amber-700">Awaiting Admin Sign-off</span></div>
                  <div>Milestone Payouts: <span className="font-semibold text-slate-700">Protected in Escrow</span></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowPopup(!showPopup);
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold hover:bg-rose-100 transition shadow-2xs"
          title="Verification Rejected • Click for details"
        >
          <XCircle className={size === 'sm' ? 'w-3.5 h-3.5 text-rose-600' : 'w-4 h-4 text-rose-600'} />
          <span>Verification Rejected</span>
        </button>
      </div>
    );
  }

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

      {/* Clean, Non-Intrusive Popover */}
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
            className="absolute left-0 top-full mt-1.5 w-64 p-3.5 bg-white text-slate-800 text-xs rounded-xl shadow-xl z-50 border border-slate-200"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
            <div className="space-y-1.5 text-[11px] text-slate-600">
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
              <div className="pt-1.5 border-t border-slate-100 text-[10px] text-emerald-800 font-medium">
                ✓ Accredited for Milestone Escrow Disbursement
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
