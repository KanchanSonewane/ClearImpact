import React, { useEffect, useState } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Sparkles
} from 'lucide-react';
import api from '../../api/client';
import RiskScoreCard from '../../components/common/RiskScoreCard';
import { formatINR } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function NGOMilestonesPage() {
  const { ngo } = useAuth();

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('');

  const [reportText, setReportText] = useState('Completed on-ground distribution of educational materials. All items inspected and signed off by the school principal.');
  const [beneficiariesReached, setBeneficiariesReached] = useState(500);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80');
  const [beforePhotoUrl, setBeforePhotoUrl] = useState('https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80');

  // Test flags to demonstrate explainable risk analysis
  const [forceDuplicate, setForceDuplicate] = useState(false);
  const [forceTamper, setForceTamper] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchNGOData = async () => {
      try {
        const res = await api.get('/campaigns/ngo/my');
        const camps = res.data.campaigns || [];
        setCampaigns(camps);
        if (camps.length > 0) {
          setSelectedCampaignId(camps[0]._id);
        }
      } catch (err) {
        console.error('Failed to load campaigns', err);
      }
    };
    fetchNGOData();
  }, []);

  useEffect(() => {
    if (!selectedCampaignId) return;
    const fetchCampaignMilestones = async () => {
      try {
        const res = await api.get(`/campaigns/${selectedCampaignId}`);
        const mList = res.data.milestones || [];
        setMilestones(mList);
        if (mList.length > 0) {
          // Select first funded or pending milestone
          const target = mList.find(m => m.status === 'FUNDED' || m.status === 'PENDING') || mList[0];
          setSelectedMilestoneId(target._id);
        }
      } catch (err) {
        console.error('Failed to load milestones', err);
      }
    };
    fetchCampaignMilestones();
  }, [selectedCampaignId]);

  const handleSubmitEvidence = async (e) => {
    e.preventDefault();
    if (!selectedCampaignId || !selectedMilestoneId) {
      setErrorMsg('Please select a campaign and milestone.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSubmissionResult(null);

    try {
      const selectedMilestone = milestones.find(m => m._id === selectedMilestoneId);

      const res = await api.post('/evidence/upload', {
        campaignId: selectedCampaignId,
        milestoneId: selectedMilestoneId,
        title: `Verified Execution Proof for ${selectedMilestone?.title || 'Milestone'}`,
        reportText,
        beneficiariesReached: Number(beneficiariesReached),
        afterPhotoUrl,
        beforePhotoUrl,
        forceDuplicate,
        forceTamper,
      });

      setSubmissionResult(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload evidence.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCampaign = campaigns.find(c => c._id === selectedCampaignId);
  const selectedMilestone = milestones.find(m => m._id === selectedMilestoneId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <Camera className="w-3.5 h-3.5 text-emerald-600" />
          <span>Proof-of-Work Evidence Submission</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Upload Milestone Execution Evidence
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl">
          Submit physical photos and verification reports to trigger automated risk scoring and unlock escrowed milestone funds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmitEvidence} className="space-y-5">
            {/* 1. Select Campaign */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Active Campaign
              </label>
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                {campaigns.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title} ({formatINR(c.raisedAmount)} raised)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Select Milestone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Milestone for Fund Release
              </label>
              <select
                value={selectedMilestoneId}
                onChange={(e) => setSelectedMilestoneId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                {milestones.map((m) => (
                  <option key={m._id} value={m._id}>
                    Milestone {m.order}: {m.title} — {formatINR(m.targetAmount)} [{m.status}]
                  </option>
                ))}
              </select>

              {selectedMilestone && (
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <strong className="text-slate-800">Required Evidence:</strong> {selectedMilestone.evidenceRequirements}
                </div>
              )}
            </div>

            {/* 3. Beneficiaries reached in this milestone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Beneficiaries Reached
                </label>
                <input
                  type="number"
                  value={beneficiariesReached}
                  onChange={(e) => setBeneficiariesReached(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location Verified
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedCampaign?.location || 'Nagpur, Maharashtra'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                />
              </div>
            </div>

            {/* 4. Photo Proof URLs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  After Execution Photo (Primary Proof)
                </label>
                <input
                  type="text"
                  value={afterPhotoUrl}
                  onChange={(e) => setAfterPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                />
                <div className="mt-2 aspect-16/9 max-w-xs rounded-xl overflow-hidden border border-slate-200">
                  <img src={afterPhotoUrl} alt="After Preview" className="w-full h-full object-cover" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Before Execution Photo (Context)
                </label>
                <input
                  type="text"
                  value={beforePhotoUrl}
                  onChange={(e) => setBeforePhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>

            {/* 5. Detailed Report */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Milestone Execution Report & Field Observations
              </label>
              <textarea
                rows={4}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 leading-relaxed"
              />
            </div>

            {/* Simulation test flags for demonstration */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-2">
              <span className="font-bold text-amber-900 block">
                Explainable Risk Engine Test Toggles (Demo Lab Feature):
              </span>
              <div className="flex flex-wrap gap-4 text-[11px] text-amber-800">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceDuplicate}
                    onChange={(e) => setForceDuplicate(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Simulate Duplicate Photo (+50 Risk)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceTamper}
                    onChange={(e) => setForceTamper(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Simulate Photoshop Tamper Signal (+40 Risk)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
            >
              <Upload className="w-4 h-4" />
              <span>{isSubmitting ? 'Analyzing File Hashes & EXIF...' : 'Submit Evidence for Risk Audit'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Real-Time Risk Analysis Output */}
        <div className="lg:col-span-5 space-y-5">
          {!submissionResult ? (
            <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">
                Automated Risk Scoring Engine
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                When you click submit, our engine immediately computes the perceptual hash, scans EXIF timestamp metadata, checks against past uploads, and evaluates tamper signals.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Evidence Uploaded • Status Moved to UNDER REVIEW</span>
              </div>

              {/* Risk Score Card */}
              <RiskScoreCard
                riskScore={submissionResult.riskSummary.riskScore}
                riskLevel={submissionResult.riskSummary.riskLevel}
                riskReasons={submissionResult.riskSummary.riskReasons}
                exifData={submissionResult.riskSummary.exifData}
              />

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-800">What happens next?</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  ClearImpact compliance administrators will review the evidence alongside the explainable risk checklist. Upon admin approval, the escrowed funds for this milestone will be released, and automated verified impact updates will be dispatched to donors!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
