import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Coins,
  FileCheck2,
  Users,
  Clock,
  Sparkles,
  PlusCircle,
  Camera,
  ArrowRight,
  Share2,
  AlertCircle
} from 'lucide-react';
import api from '../../api/client';
import NGOVerifiedBadge from '../../components/common/NGOVerifiedBadge';
import TransparencyScoreBadge from '../../components/common/TransparencyScoreBadge';
import { formatINR } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function NGODashboard() {
  const { user, ngo } = useAuth();
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, campsRes] = await Promise.all([
          api.get('/ngo/stats'),
          api.get('/campaigns/ngo/my'),
        ]);
        setStats(statsRes.data);
        setCampaigns(campsRes.data.campaigns || []);
      } catch (err) {
        console.error('Failed to load NGO dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Org Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-black text-2xl shrink-0">
            {ngo?.orgName ? ngo.orgName.slice(0, 2).toUpperCase() : 'VF'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">
                {ngo?.orgName || 'Vidya Foundation'}
              </h1>
              <NGOVerifiedBadge darpanId={ngo?.darpanId} status12A={ngo?.status12A} status80G={ngo?.status80G} />
            </div>
            <p className="text-xs text-slate-500">
              NGO Darpan ID: <span className="font-mono text-slate-700 font-semibold">{ngo?.darpanId || 'MH/2021/0148291'}</span> • PAN: <span className="font-mono text-slate-700">{ngo?.pan || 'AAATV1234D'}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/ngo/campaign-studio"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Campaign Studio</span>
          </Link>

          <Link
            to="/ngo/milestones"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition"
          >
            <Camera className="w-4 h-4" />
            <span>Submit Evidence</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Raised</span>
          <div className="text-xl font-black text-slate-900">
            {formatINR(stats?.totalRaised || 0)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Across campaigns</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Campaigns</span>
          <div className="text-xl font-black text-slate-900">
            {stats?.activeCampaigns || 0}
          </div>
          <span className="text-[10px] text-slate-500">Milestone enabled</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Beneficiaries</span>
          <div className="text-xl font-black text-slate-900">
            {(stats?.totalBeneficiaries || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-indigo-600 font-semibold">Direct impact</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pending Milestones</span>
          <div className="text-xl font-black text-slate-900">
            {stats?.pendingMilestones || 0}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">In pipeline</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Evidence In Review</span>
          <div className="text-xl font-black text-slate-900">
            {stats?.evidencePendingReview || 0}
          </div>
          <span className="text-[10px] text-purple-600 font-semibold">Admin audit</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Transparency</span>
          <div className="text-xl font-black text-indigo-600">
            {stats?.transparencyScore || 94}/100
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Verified score</span>
        </div>
      </div>

      {/* Main Campaign List Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Managed Campaigns & Milestone Progress
            </h2>
            <p className="text-xs text-slate-500">
              Track fundraising, submit proof-of-work, and monitor milestone fund releases
            </p>
          </div>

          <Link
            to="/ngo/campaign-studio"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Campaign</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No campaigns created yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Use the AI Campaign Studio to generate a complete structured funding request and social outreach package.
            </p>
            <Link
              to="/ngo/campaign-studio"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Studio</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((camp) => {
              const raised = camp.raisedAmount || 0;
              const target = camp.targetAmount || 1;
              const pct = Math.min(Math.round((raised / target) * 100), 100);

              return (
                <div
                  key={camp._id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={camp.coverImage}
                      alt={camp.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                          {camp.causeCategory}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          camp.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : camp.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {camp.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                        {camp.title}
                      </h4>
                      <div className="text-xs text-slate-500">
                        {formatINR(raised)} raised of {formatINR(target)} ({pct}%) • {camp.beneficiariesCount} beneficiaries
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <Link
                      to={`/campaign/${camp._id}`}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      View Public
                    </Link>
                    <Link
                      to={`/campaign/${camp._id}?tab=poster`}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>AI Posters</span>
                    </Link>
                    <Link
                      to="/ngo/milestones"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Proof</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
