import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Coins,
  Camera,
  Award,
  Building2,
  FileCheck2,
  Download,
  AlertCircle
} from 'lucide-react';
import api from '../../api/client';
import RiskScoreCard from '../../components/common/RiskScoreCard';
import { formatINR, formatDate } from '../../utils/helpers';

export default function DonorImpactTracker() {
  const { id } = useParams(); // donationId
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await api.get(`/donations/impact/${id}`);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load impact timeline', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-3">
        <h3 className="text-lg font-bold text-slate-800">Donation Record Not Found</h3>
        <Link to="/donor/dashboard" className="text-brand-600 font-semibold text-xs">
          ← Return to Donor Dashboard
        </Link>
      </div>
    );
  }

  const { donation, campaign, journey = [] } = data;
  const ngo = campaign.ngoId;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Proof-of-Impact Chain</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Your {formatINR(donation.amount)} Impact Journey
            </h1>
            <p className="text-xs text-indigo-200">
              Allocated to: <strong>{campaign.title}</strong> • Organized by {ngo?.orgName || 'Verified NGO'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-right">
            <span className="block text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
              Tax Deductible Receipt
            </span>
            <span className="font-mono font-bold text-sm text-emerald-300">
              {donation.taxReceiptNumber || '80G-VERIFIED'}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Donated on {formatDate(donation.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Journey: Donation -> Campaign -> Milestone -> Evidence -> Verification -> Fund Release -> Impact */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-brand-600" />
            <span>End-to-End Milestone Escrow & Proof Pipeline</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status of your contribution moving through the verified execution chain.
          </p>
        </div>

        {/* Milestone Journey Steps */}
        <div className="space-y-8">
          {journey.map((stage, idx) => {
            const isCompleted = stage.status === 'RELEASED';
            const isReview = stage.status === 'UNDER_REVIEW' || stage.status === 'EVIDENCE_SUBMITTED';
            const isFunded = stage.status === 'FUNDED';

            return (
              <div
                key={stage.milestoneId}
                className={`relative pl-8 pb-8 border-l-2 ${
                  isCompleted ? 'border-emerald-500' : isReview ? 'border-amber-400' : 'border-slate-200'
                } last:border-none last:pb-0`}
              >
                {/* Step Marker Circle */}
                <div
                  className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-4 ring-emerald-50'
                      : isReview
                      ? 'bg-amber-500 text-white shadow-md ring-4 ring-amber-50'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : stage.order}
                </div>

                {/* Milestone Details Card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-brand-600">
                          Milestone {stage.order}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isReview
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {stage.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {stage.title}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">
                        {formatINR(stage.targetAmount)}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        {isCompleted ? 'Funds Released' : 'Held in Escrow'}
                      </span>
                    </div>
                  </div>

                  {/* Step Checklist */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold text-slate-700">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Campaign Backed</span>
                    </div>

                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
                      {stage.evidence ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span>Evidence Uploaded</span>
                    </div>

                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
                      {stage.evidence?.riskScore !== undefined ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span>Risk Audit Checked</span>
                    </div>

                    <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span>Funds Released</span>
                    </div>
                  </div>

                  {/* If Evidence Exists: Render On-Ground Photos & Verified Risk Score */}
                  {stage.evidence && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-brand-600" />
                          <span>Submitted Verification Proof</span>
                        </span>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          ✓ Verified by ClearImpact Compliance
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {stage.evidence.beforePhotoUrl && (
                          <div>
                            <span className="block text-[10px] text-slate-500 mb-1">Before</span>
                            <div className="aspect-4/3 rounded-lg overflow-hidden border">
                              <img src={stage.evidence.beforePhotoUrl} alt="Before" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="block text-[10px] text-slate-500 mb-1">After Execution Proof</span>
                          <div className="aspect-4/3 rounded-lg overflow-hidden border">
                            <img src={stage.evidence.afterPhotoUrl} alt="After" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-900 block mb-0.5">Execution Summary:</span>
                        {stage.evidence.reportText}
                      </div>

                      {/* AI Impact Update Grounded in verified DB facts (Section 24) */}
                      {stage.evidence.aiImpactSummary?.text && (
                        <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-200 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Verified Impact Update (AI Grounded Summary)</span>
                            <span className="text-[9px] bg-indigo-200 text-indigo-800 px-1.5 py-0.2 rounded font-mono">
                              DB Grounded
                            </span>
                          </div>
                          <p className="text-xs text-indigo-950 leading-relaxed">
                            {stage.evidence.aiImpactSummary.text}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link to="/donor/dashboard" className="text-xs font-bold text-brand-600 hover:underline">
            ← Return to Donor Dashboard
          </Link>
          <Link to={`/campaign/${campaign._id}`} className="text-xs font-bold text-slate-700 hover:text-brand-600">
            View Public Campaign Page →
          </Link>
        </div>
      </div>
    </div>
  );
}
