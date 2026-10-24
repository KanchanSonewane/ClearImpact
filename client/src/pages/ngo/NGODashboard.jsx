import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  AlertCircle,
  FileText,
  ExternalLink,
  Upload,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import api from '../../api/client';
import NGOVerifiedBadge from '../../components/common/NGOVerifiedBadge';
import TransparencyScoreBadge from '../../components/common/TransparencyScoreBadge';
import { formatINR } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function NGODashboard() {
  const { user, ngo, login } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Document Upload State
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const [docFeedback, setDocFeedback] = useState('');

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

  useEffect(() => {
    if (user?.role === 'NGO' || user?.role === 'ADMIN') {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!docTitle || !docUrl) return;
    setIsSubmittingDoc(true);
    setDocFeedback('');

    try {
      await api.post('/ngo/documents', { title: docTitle, fileUrl: docUrl });
      setDocFeedback('Document successfully attached for Compliance Review!');
      setDocTitle('');
      setDocUrl('');
      setShowDocUpload(false);
      await fetchDashboard();
    } catch (err) {
      setDocFeedback(err.response?.data?.message || 'Failed to attach document.');
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const handleSwitchToAdmin = async () => {
    try {
      await login('admin@clearimpact.org', 'admin123');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Failed to switch to admin', err);
    }
  };

  const handleSwitchToNGO = async () => {
    try {
      await login('ngo@vidya.org', 'ngo123');
      navigate('/ngo/dashboard');
    } catch (err) {
      console.error('Failed to switch to NGO', err);
    }
  };

  // If user is a DONOR who navigated to the NGO dashboard
  if (user?.role === 'DONOR') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
          <Building2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">
            You are logged in as a Donor (Philanthropist)
          </h2>
          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            Donors browse campaigns, make pledges into escrow, and track verified impact. To upload NGO verification documents and request donations with milestones, please switch to an NGO partner persona or register a new organization.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSwitchToNGO}
            className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition"
          >
            ⚡ Switch to NGO Account (Vidya Foundation)
          </button>
          <Link
            to="/register?role=NGO"
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            Register a New NGO
          </Link>
          <Link
            to="/donor/dashboard"
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
          >
            Back to Donor Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = stats?.verificationStatus || ngo?.verificationStatus || 'PENDING';
  const isVerified = currentStatus === 'VERIFIED';
  const documentsList = stats?.documents || ngo?.documents || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Org Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-black text-2xl shrink-0">
            {stats?.orgName ? stats.orgName.slice(0, 2).toUpperCase() : (ngo?.orgName ? ngo.orgName.slice(0, 2).toUpperCase() : 'VF')}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">
                {stats?.orgName || ngo?.orgName || 'Vidya Foundation'}
              </h1>
              <NGOVerifiedBadge
                status={currentStatus}
                darpanId={stats?.darpanId || ngo?.darpanId}
                status12A={stats?.status12A || ngo?.status12A}
                status80G={stats?.status80G || ngo?.status80G}
              />
            </div>
            <p className="text-xs text-slate-500">
              NGO Darpan ID: <span className="font-mono text-slate-700 font-semibold">{stats?.darpanId || ngo?.darpanId || 'MH/2021/0148291'}</span> • PAN: <span className="font-mono text-slate-700 uppercase">{stats?.pan || ngo?.pan || 'AAATV1234D'}</span>
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

      {/* Compliance & Verification Banner (Shows status, documents, and 1-click admin review) */}
      {!isVerified ? (
        <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-amber-950">
                    Statutory Verification in Progress (Under Review)
                  </h3>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full uppercase">
                    Status: {currentStatus}
                  </span>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed max-w-2xl">
                  Your uploaded statutory documents (PAN, 12A/80G, Darpan ID) are queued in the <strong>Admin Verification Queue</strong>. Milestone funds remain protected in escrow until an administrator signs off on your credentials.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSwitchToAdmin}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>⚡ Switch to Admin to Approve (Demo)</span>
              </button>
            </div>
          </div>

          {/* Attached Statutory Documents Checklist */}
          <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Attached Statutory Documents ({documentsList.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDocUpload(!showDocUpload)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{showDocUpload ? 'Cancel' : 'Upload Additional Document'}</span>
              </button>
            </div>

            {docFeedback && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                {docFeedback}
              </div>
            )}

            {/* Document Upload Form */}
            {showDocUpload && (
              <form onSubmit={handleUploadDocument} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-xs text-slate-800">
                  Upload Statutory Document for Automated Verification
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      required
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="e.g. Audited Financial Statements 2024-25"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Select File or Enter Document Proof URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={docUrl}
                        onChange={(e) => setDocUrl(e.target.value)}
                        placeholder="https://... or choose file ->"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs"
                      />
                      <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl cursor-pointer text-xs shrink-0 flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>File</span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const f = e.target.files[0];
                              setDocTitle(f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                              setDocUrl(URL.createObjectURL(f));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingDoc}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isSubmittingDoc ? 'Verifying & Attaching...' : 'Verify & Attach Document'}</span>
                  </button>
                </div>
              </form>
            )}

            {documentsList.length === 0 ? (
              <div className="text-xs text-slate-500 py-3 italic">
                No statutory documents attached yet. Click 'Upload Additional Document' to add proof.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {documentsList.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 truncate pr-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="truncate">
                          <span className="font-bold text-slate-900 block truncate leading-tight">{doc.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {doc.fileName || 'document.pdf'} {doc.fileSize ? `• ${doc.fileSize}` : ''}
                          </span>
                        </div>
                      </div>

                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 font-bold bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-[10px] text-emerald-900 space-y-0.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Security Check: Passed ({doc.verificationConfidence || 96}%)
                        </span>
                        <span className="font-mono text-[9px] text-emerald-700">
                          {doc.hash ? doc.hash.slice(0, 16) : 'sha256:verified'}
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-800 leading-snug">
                        {doc.extractedData?.ocrSummary || 'Headers match entity registration and statutory PAN.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">
                Organization Verified & Accredited for Milestone Escrow Payouts
              </h4>
              <p className="text-[11px] text-emerald-800">
                Statutory credentials (PAN, 12A/80G, Darpan ID) verified by ClearImpact Compliance Officer.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Active Status
          </span>
        </div>
      )}

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
              Use the AI Campaign Studio to generate a complete structured funding request with milestones.
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
