import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, HeartHandshake, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import NGOVerifiedBadge from './NGOVerifiedBadge';
import TransparencyScoreBadge from './TransparencyScoreBadge';
import ClearImpactScoreBadge from './ClearImpactScoreBadge';
import DonationModal from './DonationModal';
import { formatINR, calculateExplainableMatch } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function CampaignCard({ campaign, onDonationComplete }) {
  const { user } = useAuth();
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const raised = campaign.raisedAmount || 0;
  const target = campaign.targetAmount || 1;
  const pct = Math.min(Math.round((raised / target) * 100), 100);

  // Match score if user is logged in
  const matchResult = user?.role === 'DONOR'
    ? calculateExplainableMatch(campaign, user.preferences)
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Card Image Banner */}
      <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
        <img
          src={campaign.coverImage}
          alt={campaign.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=1200&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Cause Category Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-md text-brand-700 shadow-xs">
            {campaign.causeCategory}
          </span>
          {campaign.isDemo && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/80 text-slate-200 border border-slate-700">
              Demo Project
            </span>
          )}
        </div>

        {/* Explainable Match Score Pill (if Donor) */}
        {matchResult && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{matchResult.score}% Match</span>
            </span>
          </div>
        )}

        {/* Location at bottom of photo */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium drop-shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{campaign.location}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* NGO Info Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {campaign.ngoId?.logoUrl ? (
                <img
                  src={campaign.ngoId.logoUrl}
                  alt={campaign.ngoId.orgName}
                  className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : null}
              <span className="text-xs font-semibold text-slate-700 truncate">
                {campaign.ngoId?.orgName || 'Verified Organization'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <ClearImpactScoreBadge
                campaign={campaign}
                score={campaign.transparencyScore || 87}
                size="compact"
              />
              <NGOVerifiedBadge
                darpanId={campaign.ngoId?.darpanId}
                status12A={campaign.ngoId?.status12A}
                status80G={campaign.ngoId?.status80G}
              />
            </div>
          </div>

          {/* Title */}
          <Link to={`/campaign/${campaign._id}`} className="block">
            <h3 className="text-base font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
              {campaign.title}
            </h3>
          </Link>

          {/* Beneficiaries & Scope */}
          <div className="flex items-center gap-4 text-xs text-slate-500 py-0.5">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span><strong>{campaign.beneficiariesCount}</strong> beneficiaries</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Milestone proof</span>
            </div>
          </div>
        </div>

        {/* Progress and Funding Section */}
        <div className="pt-4 mt-3 border-t border-slate-100 space-y-3">
          <div className="flex justify-between items-baseline text-xs">
            <div>
              <span className="font-extrabold text-slate-900 text-sm">{formatINR(raised)}</span>
              <span className="text-slate-400 font-medium ml-1">of {formatINR(target)}</span>
            </div>
            <span className="font-bold text-brand-600">{pct}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* DUAL ACTION BUTTONS: Instant Donate & Details */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDonateOpen(true)}
              className="flex-1 py-2.5 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition flex items-center justify-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Donate Now</span>
            </button>

            <Link
              to={`/campaign/${campaign._id}`}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
              title="View full milestone breakdown and evidence photos"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Instant Donation Modal directly from Card */}
      <DonationModal
        campaign={campaign}
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onDonationComplete={(data) => {
          if (onDonationComplete) onDonationComplete(data);
        }}
      />
    </div>
  );
}
