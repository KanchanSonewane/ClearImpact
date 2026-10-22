import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Users,
  Target,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Camera,
  Coins,
  Share2,
  Building2,
  ExternalLink
} from 'lucide-react';
import api from '../../api/client';
import NGOVerifiedBadge from '../../components/common/NGOVerifiedBadge';
import TransparencyScoreBadge from '../../components/common/TransparencyScoreBadge';
import RiskScoreCard from '../../components/common/RiskScoreCard';
import DonationModal from '../../components/common/DonationModal';
import AdPosterPreview from '../../components/common/AdPosterPreview';
import { formatINR, formatDate, calculateExplainableMatch } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'MILESTONES' | 'EVIDENCE' | 'NGO'

  const fetchCampaign = async () => {
    try {
      const res = await api.get(`/campaigns/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load campaign', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/2" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!data || !data.campaign) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Campaign Not Found</h2>
        <Link to="/campaigns" className="text-brand-600 font-semibold text-sm">
          ← Return to all campaigns
        </Link>
      </div>
    );
  }

  const { campaign, milestones = [], evidence = [], recentDonations = [] } = data;
  const ngo = campaign.ngoId;

  const raised = campaign.raisedAmount || 0;
  const target = campaign.targetAmount || 1;
  const pct = Math.min(Math.round((raised / target) * 100), 100);

  const matchData = user?.role === 'DONOR'
    ? calculateExplainableMatch(campaign, user.preferences)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Link to="/campaigns" className="hover:text-brand-600">Campaigns</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold line-clamp-1">{campaign.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <TransparencyScoreBadge score={campaign.transparencyScore || 92} />
          <NGOVerifiedBadge darpanId={ngo?.darpanId} status12A={ngo?.status12A} status80G={ngo?.status80G} />
        </div>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            {campaign.causeCategory}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            {campaign.location}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            Deadline: {formatDate(campaign.deadline)}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {campaign.title}
        </h1>

        <div className="flex items-center gap-3">
          {ngo?.logoUrl && (
            <img src={ngo.logoUrl} alt={ngo.orgName} className="w-8 h-8 rounded-full object-cover border" />
          )}
          <div>
            <span className="text-xs text-slate-500 block">Organized by</span>
            <span className="text-sm font-bold text-slate-900">{ngo?.orgName || 'Verified Partner'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Details & Right Escrow Funding Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Cover Photo */}
          <div className="relative aspect-16/9 rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 group">
            <img
              src={campaign.coverImage}
              alt={campaign.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover"
            />
            {/* Watch Official AI Video Ad Button */}
            <div className="absolute bottom-4 right-4 z-10">
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-xl text-xs font-bold backdrop-blur-md shadow-xl flex items-center gap-2 border border-white/20 transition hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>Watch AI Video Ad (With Voice)</span>
              </button>
            </div>
          </div>

          {/* Explainable Match Card (if donor) */}
          {matchData && (
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Explainable Match Compatibility: {matchData.score}%</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Verified Match
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                {matchData.breakdown.map((item, idx) => (
                  <div key={idx} className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                    <span className="block text-slate-500 text-[10px]">{item.label}</span>
                    <span className="font-bold text-emerald-700">+{item.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`pb-3 transition relative ${
                activeTab === 'OVERVIEW'
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Problem & Solution
            </button>
            <button
              onClick={() => setActiveTab('MILESTONES')}
              className={`pb-3 transition relative flex items-center gap-1.5 ${
                activeTab === 'MILESTONES'
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Milestone Roadmap</span>
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                {milestones.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('EVIDENCE')}
              className={`pb-3 transition relative flex items-center gap-1.5 ${
                activeTab === 'EVIDENCE'
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Verified Evidence & Risk</span>
              <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800 font-bold">
                {evidence.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('NGO')}
              className={`pb-3 transition relative ${
                activeTab === 'NGO'
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              NGO Credentials
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  What problem are we trying to solve?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {campaign.problem}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  What will the donated funds be used for?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {campaign.solution}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  Expected Measurable Impact
                </h3>
                <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 space-y-1">
                  <div className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-brand-600" />
                    <span>Beneficiary Outcome Goal</span>
                  </div>
                  <p className="text-sm text-brand-950 font-medium">
                    {campaign.expectedImpact}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Milestones Roadmap */}
          {activeTab === 'MILESTONES' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800">Milestone Escrow Rules:</span> Funds are unlocked sequentially. NGOs cannot access subsequent tranches until the prior milestone evidence is risk-checked and approved by ClearImpact.
              </div>

              <div className="space-y-3">
                {milestones.map((m, idx) => (
                  <div
                    key={m._id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                          {m.order}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {m.title}
                        </h4>
                      </div>

                      {/* Status Badges */}
                      <div>
                        {m.status === 'RELEASED' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Released ({formatINR(m.targetAmount)})
                          </span>
                        )}
                        {m.status === 'UNDER_REVIEW' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Evidence Under Review
                          </span>
                        )}
                        {m.status === 'FUNDED' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            Funded in Escrow
                          </span>
                        )}
                        {m.status === 'PENDING' && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                            Awaiting Funding
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      <strong>Target Allocation:</strong> {formatINR(m.targetAmount)}
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-800">Required Evidence: </span>
                      {m.evidenceRequirements}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Verified Evidence & Risk Scores */}
          {activeTab === 'EVIDENCE' && (
            <div className="space-y-6">
              {evidence.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">No Evidence Uploaded Yet</h4>
                  <p className="text-xs text-slate-500">
                    Evidence will be published here as soon as the NGO completes milestone execution.
                  </p>
                </div>
              ) : (
                evidence.map((ev) => (
                  <div key={ev._id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">
                          Milestone Evidence Report
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-0.5">
                          {ev.title}
                        </h4>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        ev.adminStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ev.adminStatus === 'APPROVED' ? '✓ Verified by Admin' : 'Review in Progress'}
                      </span>
                    </div>

                    {/* Photos Before / After */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {ev.beforePhotoUrl && (
                        <div>
                          <span className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Before Execution
                          </span>
                          <div className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                            <img src={ev.beforePhotoUrl} alt="Before" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="block text-[11px] font-semibold text-slate-500 mb-1">
                          After Execution (Submitted Proof)
                        </span>
                        <div className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                          <img src={ev.afterPhotoUrl} alt="After" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-900 block mb-1">Field Report:</span>
                      {ev.reportText}
                    </div>

                    {/* Explainable Risk Analysis Card */}
                    <RiskScoreCard
                      riskScore={ev.riskScore}
                      riskLevel={ev.riskLevel}
                      riskReasons={ev.riskReasons}
                      exifData={ev.exifData}
                    />

                    {/* Grounded AI Impact Summary */}
                    {ev.aiImpactSummary?.text && (
                      <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span>AI Grounded Impact Summary</span>
                          <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.2 rounded font-mono">
                            Verified DB Facts
                          </span>
                        </div>
                        <p className="text-xs text-indigo-950 leading-relaxed">
                          {ev.aiImpactSummary.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: NGO Credentials */}
          {activeTab === 'NGO' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                {ngo?.logoUrl && (
                  <img src={ngo.logoUrl} alt={ngo.orgName} className="w-12 h-12 rounded-xl object-cover border" />
                )}
                <div>
                  <h4 className="text-base font-bold text-slate-900">{ngo?.orgName}</h4>
                  <NGOVerifiedBadge darpanId={ngo?.darpanId} />
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {ngo?.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">NGO Darpan Registration</span>
                  <span className="font-bold text-slate-800">{ngo?.darpanId || 'Verified'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">PAN / Registration</span>
                  <span className="font-bold text-slate-800">{ngo?.pan || 'AAATV1234D'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">12A Exemption</span>
                  <span className="font-bold text-emerald-700">Active</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">80G Tax Deductible</span>
                  <span className="font-bold text-emerald-700">Eligible</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Escrow & Donation Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6">
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-3xl font-black text-slate-900">{formatINR(raised)}</span>
                <span className="text-xs font-bold text-brand-600">{pct}% funded</span>
              </div>
              <span className="text-xs text-slate-500">
                Goal of {formatINR(target)} in milestone escrow
              </span>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mt-3">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Campaign Key Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  Beneficiaries
                </div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {campaign.beneficiariesCount}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Milestones
                </div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {milestones.length} Stages
                </div>
              </div>
            </div>

            {/* Escrow Guarantee Pill */}
            <div className="p-3.5 bg-brand-50/70 rounded-2xl border border-brand-100 text-xs space-y-1">
              <div className="font-bold text-brand-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>100% Escrow Protection</span>
              </div>
              <p className="text-brand-950/80 text-[11px] leading-relaxed">
                Your donation is held securely. Funds are only released to the NGO as each milestone evidence passes explainable audit and admin approval.
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => setIsDonateOpen(true)}
              className="w-full py-4 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
            >
              <span>Donate Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Recent Backers */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Recent Contributions ({recentDonations.length})
              </div>
              {recentDonations.length === 0 ? (
                <div className="text-xs text-slate-400 italic">Be the first verified supporter!</div>
              ) : (
                <div className="space-y-2">
                  {recentDonations.slice(0, 3).map((don, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-800">{don.donorName}</span>
                      <span className="font-bold text-emerald-700">{formatINR(don.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal
        campaign={campaign}
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onDonationComplete={() => fetchCampaign()}
      />

      {/* Official AI Video Ad Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                  CI
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Official Admin-Certified AI Campaign Video
                  </h3>
                  <p className="text-xs text-slate-500">
                    Topic: {campaign.title} ({formatINR(campaign.targetAmount)})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Close Video
              </button>
            </div>

            <AdPosterPreview campaign={campaign} />
          </div>
        </div>
      )}
    </div>
  );
}
