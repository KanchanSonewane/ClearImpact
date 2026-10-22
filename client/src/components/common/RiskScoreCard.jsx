import React from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, Camera, FileSearch, Clock, ShieldAlert } from 'lucide-react';

export default function RiskScoreCard({ riskScore = 10, riskLevel = 'LOW', riskReasons = [], exifData = null }) {
  const isFlagged = riskScore >= 40;

  return (
    <div className={`rounded-xl border p-4 ${isFlagged ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            {isFlagged ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Requires Review (Risk Score: {riskScore}/100)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Low Risk (Risk Score: {riskScore}/100)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Explainable automated verification signals. Notice: Flagged items prompt compliance review, not presumption of fraud.
          </p>
        </div>

        <div className="text-right">
          <span className={`text-2xl font-black ${isFlagged ? 'text-amber-600' : 'text-emerald-600'}`}>
            {riskScore}
          </span>
          <span className="text-xs text-slate-400">/100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-500 ${isFlagged ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${Math.min(riskScore, 100)}%` }}
        />
      </div>

      {/* Explainable Factor Checklist */}
      <div className="space-y-2 mt-3 pt-3 border-t border-slate-200/80">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Explainable Verification Signals
        </p>

        {riskReasons && riskReasons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {riskReasons.map((reason, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 p-2 rounded-lg border ${
                  !reason.passed
                    ? 'bg-amber-100/60 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {!reason.passed ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-[11px] flex items-center gap-1.5">
                    <span>{reason.title}</span>
                    {!reason.passed && (
                      <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.2 rounded font-mono">
                        +{reason.weight}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 leading-tight mt-0.5">
                    {reason.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic">No automated risk anomalies detected.</div>
        )}
      </div>

      {/* EXIF Metadata Summary if available */}
      {exifData && (
        <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-slate-400" />
            <span>Device: {exifData.make ? `${exifData.make} ${exifData.model || ''}` : 'Metadata Stripped'}</span>
          </div>
          {exifData.dateTimeOriginal && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Captured: {new Date(exifData.dateTimeOriginal).toLocaleDateString()}</span>
            </div>
          )}
          {exifData.software && (
            <div className="flex items-center gap-1 text-amber-700">
              <FileSearch className="w-3.5 h-3.5" />
              <span>Software Tag: {exifData.software}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
