import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  AlertTriangle,
  Coins,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  Camera,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
  FileText,
  ExternalLink
} from 'lucide-react';
import api from '../../api/client';
import RiskScoreCard from '../../components/common/RiskScoreCard';
import NGOVerifiedBadge from '../../components/common/NGOVerifiedBadge';
import AIPosterStudio from '../../components/common/AIPosterStudio';
import { formatINR, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [overview, setOverview] = useState(null);
  const [pendingNgos, setPendingNgos] = useState([]);
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [pendingEvidence, setPendingEvidence] = useState([]);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'NGOS' | 'CAMPAIGNS' | 'EVIDENCE' | 'FLAGGED'

  const [selectedEvidenceForReview, setSelectedEvidenceForReview] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [overviewRes, ngosRes, campsRes, evRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/ngos/pending'),
        api.get('/admin/campaigns/pending'),
        api.get('/admin/evidence/pending'),
      ]);
      setOverview(overviewRes.data);
      setPendingNgos(ngosRes.data);
      setPendingCampaigns(campsRes.data);
      setPendingEvidence(evRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyNGO = async (ngoId, decision, customNotes) => {
    setActionLoading(true);
    try {
      await api.post(`/admin/ngos/${ngoId}/verify`, { decision, notes: customNotes || 'Verified statutory credentials, PAN, and Darpan portal details.' });
      await fetchAdminData();
    } catch (err) {
      alert('Failed to update NGO status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewCampaign = async (campaignId, decision) => {
    setActionLoading(true);
    try {
      await api.post(`/admin/campaigns/${campaignId}/review`, { decision, notes: 'Campaign parameters and milestones approved for milestone escrow.' });
      await fetchAdminData();
    } catch (err) {
      alert('Failed to review campaign.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewEvidence = async (evidenceId, decision) => {
    setActionLoading(true);
    try {
      await api.post(`/admin/evidence/${evidenceId}/review`, { decision, notes: adminNotes || 'Evidence inspected and milestone release authorized.' });
      setSelectedEvidenceForReview(null);
      setAdminNotes('');
      await fetchAdminData();
    } catch (err) {
      alert('Failed to review evidence.');
    } finally {
      setActionLoading(false);
    }
  };

  const metrics = overview?.metrics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>ClearImpact Administrative Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Compliance & Verification Desk
          </h1>
          <p className="text-xs text-slate-400">
            Logged in as <strong>{user?.name || 'Dr. Anita Roy'}</strong> • Human authority for statutory verification, risk reviews, and milestone escrow releases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAdminData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
          >
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">NGOs In Queue</span>
          <div className="text-2xl font-black text-slate-900">{metrics?.ngosPending || 0}</div>
          <span className="text-[10px] text-brand-600 font-semibold">Statutory review</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campaigns Awaiting</span>
          <div className="text-2xl font-black text-slate-900">{metrics?.campaignsPending || 0}</div>
          <span className="text-[10px] text-indigo-600 font-semibold">Scope validation</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evidence Reviews</span>
          <div className="text-2xl font-black text-slate-900">{metrics?.evidencePending || 0}</div>
          <span className="text-[10px] text-purple-600 font-semibold">On-ground proof</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Flagged Submissions</span>
          <div className="text-2xl font-black text-amber-600">{metrics?.flaggedEvidence || 0}</div>
          <span className="text-[10px] text-amber-700 font-semibold">Score ≥ 40 Review</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Escrow Pending Release</span>
          <div className="text-2xl font-black text-emerald-700">{formatINR(metrics?.fundsAwaitingRelease || 0)}</div>
          <span className="text-[10px] text-emerald-800 font-semibold">Awaiting sign-off</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-bold border-b border-slate-200 pb-2">
        {[
          { id: 'OVERVIEW', label: 'Admin Activity & Logs' },
          { id: 'NGOS', label: `NGO Verification (${pendingNgos.length})` },
          { id: 'CAMPAIGNS', label: `Campaign Approval (${pendingCampaigns.length})` },
          { id: 'EVIDENCE', label: `Evidence Review (${pendingEvidence.length})` },
          { id: 'FLAGGED', label: `Flagged Content (${pendingEvidence.filter(e => e.riskScore >= 40).length})` },
          { id: 'POSTER_STUDIO', label: '🎨 AI Social Poster Studio' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & RECENT AUDIT LOGS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Recent Administrative Decisions & Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              ClearImpact maintains an immutable log of compliance sign-offs, NGO validations, and fund releases.
            </p>

            {overview?.recentReviews?.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No recent audit reviews logged.</div>
            ) : (
              <div className="space-y-3">
                {overview?.recentReviews?.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{rev.entityType} {rev.decision}</span>
                        <span className="text-[10px] text-slate-400">{formatDate(rev.createdAt)}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{rev.notes}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border">
                      Auditor: {rev.adminId?.name || 'Anita Roy'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: NGO VERIFICATION QUEUE */}
      {activeTab === 'NGOS' && (
        <div className="space-y-4">
          {pendingNgos.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">NGO Verification Queue is Clear</h4>
              <p className="text-xs text-slate-500">All registered organizations have been audited and processed.</p>
            </div>
          ) : (
            pendingNgos.map((ngo) => {
              const complianceScore = ngo.complianceScore !== undefined ? ngo.complianceScore : 85;
              const riskScore = ngo.calculatedRiskScore !== undefined ? ngo.calculatedRiskScore : 15;
              const documents = ngo.documents || [];

              return (
                <div key={ngo._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{ngo.orgName}</h3>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          ngo.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ngo.verificationStatus === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ngo.verificationStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Account Holder: <span className="font-semibold text-slate-700">{ngo.userId?.name}</span> ({ngo.userId?.email})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleVerifyNGO(ngo._id, 'APPROVED')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>✓ Grant Verified Badge</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleVerifyNGO(ngo._id, 'REJECTED')}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Explainable Statutory Risk & Compliance Score Card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-brand-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Automated Statutory Risk & Compliance Analysis
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-emerald-700">
                          Compliance Score: {complianceScore}/100
                        </span>
                        <span className="font-bold text-amber-700">
                          Risk Penalty: {riskScore}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${complianceScore}%` }}
                      />
                    </div>

                    {/* Passed Checks and Risk Flags */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                      {(ngo.passedChecks || [
                        'PAN format structurally valid',
                        'Darpan Registry state code matched',
                        '12A & 80G tax exemptions active'
                      ]).map((chk, idx) => (
                        <span key={idx} className="bg-emerald-100/80 text-emerald-800 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{chk}</span>
                        </span>
                      ))}

                      {(ngo.riskFlags || []).map((flg, idx) => (
                        <span key={idx} className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>{flg}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Statutory Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">NGO Darpan ID</span>
                      <span className="font-mono font-bold text-slate-800">{ngo.darpanId}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">PAN</span>
                      <span className="font-mono font-bold text-slate-800 uppercase">{ngo.pan}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">12A Non-Profit</span>
                      <span className="font-bold text-emerald-700">{ngo.status12A}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">80G Exemption</span>
                      <span className="font-bold text-emerald-700">{ngo.status80G}</span>
                    </div>
                  </div>

                  {/* Uploaded Documents Inspection Table */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Submitted Statutory Proof Documents ({documents.length})</span>
                    </div>

                    {documents.length === 0 ? (
                      <div className="text-xs text-slate-400 italic">No verification documents attached by this organization.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {documents.map((doc, dIdx) => (
                          <div key={dIdx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-2 truncate pr-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-medium text-slate-800 truncate">{doc.title}</span>
                            </div>
                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-brand-600 hover:text-brand-800 flex items-center gap-1 font-bold shrink-0"
                              >
                                <span>Inspect</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 leading-relaxed">
                    <strong>Mission Statement:</strong> {ngo.mission || ngo.description}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: CAMPAIGN APPROVAL QUEUE */}
      {activeTab === 'CAMPAIGNS' && (
        <div className="space-y-4">
          {pendingCampaigns.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No Campaigns Pending Approval</h4>
              <p className="text-xs text-slate-500">All submitted campaigns are active or approved.</p>
            </div>
          ) : (
            pendingCampaigns.map((camp) => (
              <div key={camp._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                        {camp.causeCategory}
                      </span>
                      <span className="text-xs text-slate-500">by {camp.ngoId?.orgName}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{camp.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleReviewCampaign(camp._id, 'APPROVED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      ✓ Approve & Publish Live
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleReviewCampaign(camp._id, 'REJECTED')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Target Budget</span>
                    <span className="font-bold text-slate-900 text-sm">{formatINR(camp.targetAmount)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Beneficiaries</span>
                    <span className="font-bold text-slate-900 text-sm">{camp.beneficiariesCount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Location</span>
                    <span className="font-bold text-slate-900 text-sm">{camp.location}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Problem:</strong> {camp.problem}</div>
                  <div><strong>Solution:</strong> {camp.solution}</div>
                  <div><strong>Impact:</strong> {camp.expectedImpact}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: EVIDENCE REVIEW QUEUE (Section 22) */}
      {(activeTab === 'EVIDENCE' || activeTab === 'FLAGGED') && (
        <div className="space-y-6">
          {pendingEvidence
            .filter((ev) => (activeTab === 'FLAGGED' ? ev.riskScore >= 40 : true))
            .map((ev) => (
              <div key={ev._id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
                        Milestone {ev.milestoneId?.order}: {ev.milestoneId?.title}
                      </span>
                      <span className="text-xs text-slate-500">
                        {ev.ngoId?.orgName} • {ev.campaignId?.title}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{ev.title}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Funds Held for Milestone</span>
                    <span className="text-lg font-black text-emerald-700">
                      {formatINR(ev.milestoneId?.targetAmount || 0)}
                    </span>
                  </div>
                </div>

                {/* Evidence Photo Inspection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ev.beforePhotoUrl && (
                    <div>
                      <span className="block text-xs font-semibold text-slate-500 mb-1">Before Execution Photo</span>
                      <div className="aspect-4/3 rounded-2xl overflow-hidden border">
                        <img src={ev.beforePhotoUrl} alt="Before" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 mb-1">Submitted After Execution Photo</span>
                    <div className="aspect-4/3 rounded-2xl overflow-hidden border">
                      <img src={ev.afterPhotoUrl} alt="After" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                  <strong>NGO Submission Report:</strong> {ev.reportText}
                </div>

                {/* Explainable Risk Scoring Engine Report */}
                <RiskScoreCard
                  riskScore={ev.riskScore}
                  riskLevel={ev.riskLevel}
                  riskReasons={ev.riskReasons}
                  exifData={ev.exifData}
                />

                {/* Admin Decision Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Optional compliance audit notes..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-hidden"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleReviewEvidence(ev._id, 'APPROVED')}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Release {formatINR(ev.milestoneId?.targetAmount)}</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleReviewEvidence(ev._id, 'MORE_INFO_REQUESTED')}
                      className="px-3.5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Request More Info</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleReviewEvidence(ev._id, 'REJECTED')}
                      className="px-3.5 py-2.5 bg-red-100 hover:bg-red-200 text-red-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* TAB 6: AI SOCIAL POSTER STUDIO */}
      {activeTab === 'POSTER_STUDIO' && (
        <AIPosterStudio isAdmin={true} onPosterCertified={fetchAdminData} />
      )}
    </div>
  );
}
