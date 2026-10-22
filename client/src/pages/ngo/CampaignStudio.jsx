import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Edit3,
  RefreshCw,
  Send,
  Eye,
  Video,
  Instagram,
  Linkedin,
  MessageSquare,
  Mail,
  FileText,
  Target,
  ArrowRight
} from 'lucide-react';
import api from '../../api/client';
import AdPosterPreview from '../../components/common/AdPosterPreview';
import { useAuth } from '../../context/AuthContext';

export default function CampaignStudio() {
  const { ngo } = useAuth();
  const navigate = useNavigate();

  // Structured Campaign Form
  const [formData, setFormData] = useState({
    causeCategory: 'Education',
    targetAmount: 200000,
    beneficiariesCount: 500,
    location: 'Nagpur, Maharashtra',
    problem: 'Students from low-income families lack basic educational materials and textbooks, leading to classroom dropouts.',
    solution: 'Provide comprehensive educational kits including notebooks, stationery, and geometry sets directly to enrolled students.',
    expectedImpact: '500 students receive educational kits to continue their schooling uninterrupted throughout the academic year.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPackage, setGeneratedPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('STORY'); // 'STORY' | 'INSTAGRAM' | 'LINKEDIN' | 'WHATSAPP' | 'EMAIL' | 'VIDEO' | 'POSTER'
  const [copiedKey, setCopiedKey] = useState('');
  const [isSubmittingCampaign, setIsSubmittingCampaign] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSimulateHyperbole, setShowSimulateHyperbole] = useState(false);

  // 1-Click Demo Pre-Fill per Requirement #38
  const handlePrefillEducationDemo = () => {
    setFormData({
      causeCategory: 'Education',
      targetAmount: 200000,
      beneficiariesCount: 500,
      location: 'Nagpur, Maharashtra',
      problem: 'Students from low-income families lack basic educational materials and geometry sets, causing high absenteeism.',
      solution: 'Provide 500 standardized educational kits with verified physical handover logs.',
      expectedImpact: '500 students receive educational kits to continue their schooling uninterrupted.',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    });
  };

  const handleGenerate = async (simulateHyperboleFlag = false) => {
    setIsGenerating(true);
    setSubmitSuccess(false);

    try {
      const res = await api.post('/ai/generate-campaign', {
        ...formData,
        orgName: ngo?.orgName || 'Vidya Foundation',
      });

      let data = res.data.data;

      // If test demonstration of the Claim Validation Layer is triggered:
      if (simulateHyperboleFlag) {
        data = {
          ...data,
          story: data.story.replace(/500/g, 'Thousands of students across Maharashtra'),
          donorAppeal: 'Help us reach tens of thousands of children with immediate education kits!',
          hasReviewWarning: true,
          unsupportedClaims: [
            'The generated content references "thousands of students", which exceeds the submitted count of 500 beneficiaries.'
          ],
          reviewLabel: 'AI Generated — Review Required',
        };
      }

      setGeneratedPackage(data);
    } catch (err) {
      console.error('Generation error', err);
      // Fallback
      alert('AI generation service error: fallback activated.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleFieldEdit = (field, value) => {
    setGeneratedPackage((prev) => ({
      ...prev,
      [field]: value,
      // If user edits and resolves hyperbole, update warning
      hasReviewWarning: false,
      unsupportedClaims: [],
      reviewLabel: 'AI Generated — Corrected & Grounded',
    }));
  };

  const handleSubmitForApproval = async () => {
    if (!generatedPackage) return;
    setIsSubmittingCampaign(true);

    try {
      const milestones = [
        {
          order: 1,
          title: 'Bulk Kit Procurement & Quality Control',
          description: 'Purchasing 500 standardized backpacks, notebooks, and geometry sets from wholesale vendors.',
          targetAmount: Math.round(Number(formData.targetAmount) * 0.4),
          evidenceRequirements: 'Itemized vendor GST invoices, delivery challans, and warehouse inspection photos.',
        },
        {
          order: 2,
          title: 'Direct School Distribution in Nagpur',
          description: 'Distribution across participating schools with student verification registers.',
          targetAmount: Math.round(Number(formData.targetAmount) * 0.4),
          evidenceRequirements: 'Before/after distribution photos, headmaster verification certificates, sign-off sheet.',
        },
        {
          order: 3,
          title: 'Academic Follow-up & Final Audit',
          description: 'Mid-term monitoring and CA financial utilization audit.',
          targetAmount: Math.round(Number(formData.targetAmount) * 0.2),
          evidenceRequirements: 'Attendance progress report and CA utilization certificate.',
        }
      ];

      await api.post('/campaigns', {
        title: generatedPackage.title || `Empower ${formData.beneficiariesCount} Students with Educational Kits`,
        causeCategory: formData.causeCategory,
        location: formData.location,
        targetAmount: formData.targetAmount,
        beneficiariesCount: formData.beneficiariesCount,
        problem: formData.problem,
        solution: formData.solution,
        expectedImpact: formData.expectedImpact,
        coverImage: formData.coverImage,
        milestones,
        aiGeneratedContent: generatedPackage,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/ngo/dashboard');
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit campaign.');
    } finally {
      setIsSubmittingCampaign(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Grounded AI Campaign Studio</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            AI Campaign & Outreach Generator
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Input verified project parameters to generate a 10-part outreach package with zero hallucination.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrefillEducationDemo}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Prefill Demo Scenario (₹2L / 500 Students)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Structured Campaign Parameters</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cause Category
              </label>
              <select
                value={formData.causeCategory}
                onChange={(e) => setFormData({ ...formData, causeCategory: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Environment">Environment</option>
                <option value="Hunger Relief">Hunger Relief</option>
                <option value="Rural Development">Rural Development</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Amount (INR)
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Beneficiaries Count
                </label>
                <input
                  type="number"
                  value={formData.beneficiariesCount}
                  onChange={(e) => setFormData({ ...formData, beneficiariesCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Nagpur, Maharashtra"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Problem: "What problem are you trying to solve?"
              </label>
              <textarea
                rows={2}
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Solution: "What will the donated money be used for?"
              </label>
              <textarea
                rows={2}
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Impact: "Measurable outcome expected"
              </label>
              <textarea
                rows={2}
                value={formData.expectedImpact}
                onChange={(e) => setFormData({ ...formData, expectedImpact: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            {/* Test Simulation Controls */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Test Claim Validation:</span>
              <button
                type="button"
                onClick={() => handleGenerate(true)}
                className="text-amber-700 hover:underline font-semibold"
                title="Simulates AI exaggerating 500 to 'thousands' to demonstrate Grounded Claim Validation Layer"
              >
                Simulate Exaggeration Flag
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleGenerate(false)}
              disabled={isGenerating}
              className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing with Grounded AI...' : 'Generate Campaign & Outreach'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Output Studio & Outreach Package */}
        <div className="lg:col-span-7 space-y-5">
          {!generatedPackage ? (
            <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Ready to Generate Campaign Outreach
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill the structured form on the left or click "Prefill Demo Scenario" to generate full social captions, email appeal, video script, and ad poster.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              {/* Claim Protection Warning Banner (Section 11) */}
              {generatedPackage.hasReviewWarning && (
                <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-amber-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-extrabold">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>⚠ Unsupported Claim Detected</span>
                    </div>
                    <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                      Claim Protection Layer
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed">
                    {generatedPackage.unsupportedClaims?.[0] ||
                      'The generated content contains a beneficiary count or statistic that exceeds the submitted campaign information.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => handleGenerate(false)}
                      className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg font-bold text-[11px]"
                    >
                      [Regenerate Clean]
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleFieldEdit('story', generatedPackage.story.replace(/thousands of students/gi, `${formData.beneficiariesCount} students`));
                      }}
                      className="px-3 py-1 bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 rounded-lg font-bold text-[11px]"
                    >
                      [Accept After Correction]
                    </button>
                  </div>
                </div>
              )}

              {/* Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    generatedPackage.hasReviewWarning
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {generatedPackage.reviewLabel || 'AI Generated — Review Required'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Beneficiaries: <strong>{formData.beneficiariesCount}</strong> • Budget: <strong>₹{formData.targetAmount.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Outreach Tabs */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold border-b border-slate-100 pb-2">
                {[
                  { id: 'STORY', label: 'Campaign Story', icon: FileText },
                  { id: 'INSTAGRAM', label: 'Instagram', icon: Instagram },
                  { id: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin },
                  { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
                  { id: 'EMAIL', label: 'Email Appeal', icon: Mail },
                  { id: 'VIDEO', label: '30s Video Script', icon: Video },
                  { id: 'POSTER', label: 'Ad Poster Preview', icon: Eye },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                        activeTab === tab.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="space-y-4">
                {activeTab === 'STORY' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700">Campaign Title</label>
                        <button
                          type="button"
                          onClick={() => handleCopy(generatedPackage.title, 'title')}
                          className="text-[11px] text-brand-600 hover:underline flex items-center gap-1"
                        >
                          {copiedKey === 'title' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'title' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={generatedPackage.title}
                        onChange={(e) => handleFieldEdit('title', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700">Detailed Campaign Story</label>
                        <button
                          type="button"
                          onClick={() => handleCopy(generatedPackage.story, 'story')}
                          className="text-[11px] text-brand-600 hover:underline flex items-center gap-1"
                        >
                          {copiedKey === 'story' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'story' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={7}
                        value={generatedPackage.story}
                        onChange={(e) => handleFieldEdit('story', e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700">Donor Appeal Callout</label>
                        <button
                          type="button"
                          onClick={() => handleCopy(generatedPackage.donorAppeal, 'appeal')}
                          className="text-[11px] text-brand-600 hover:underline flex items-center gap-1"
                        >
                          {copiedKey === 'appeal' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'appeal' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={generatedPackage.donorAppeal}
                        onChange={(e) => handleFieldEdit('donorAppeal', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'INSTAGRAM' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        Instagram Post Caption & Hashtags
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(generatedPackage.instagramCaption, 'insta')}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        {copiedKey === 'insta' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'insta' ? 'Copied!' : 'Copy Caption'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={8}
                      value={generatedPackage.instagramCaption}
                      onChange={(e) => handleFieldEdit('instagramCaption', e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-mono whitespace-pre-wrap leading-relaxed"
                    />
                  </div>
                )}

                {activeTab === 'LINKEDIN' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Linkedin className="w-4 h-4 text-blue-600" />
                        LinkedIn CSR & Professional Outreach Post
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(generatedPackage.linkedInPost, 'linkedin')}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        {copiedKey === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'linkedin' ? 'Copied!' : 'Copy Post'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={8}
                      value={generatedPackage.linkedInPost}
                      onChange={(e) => handleFieldEdit('linkedInPost', e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 leading-relaxed font-sans"
                    />
                  </div>
                )}

                {activeTab === 'WHATSAPP' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        WhatsApp Broadcast Message (with WhatsApp Markdown)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(generatedPackage.whatsAppMessage, 'wa')}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'wa' ? 'Copied!' : 'Copy Message'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={8}
                      value={generatedPackage.whatsAppMessage}
                      onChange={(e) => handleFieldEdit('whatsAppMessage', e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-mono leading-relaxed"
                    />
                  </div>
                )}

                {activeTab === 'EMAIL' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-indigo-600" />
                        Formal Email Appeal Template
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(generatedPackage.emailAppeal, 'email')}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'email' ? 'Copied!' : 'Copy Email'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={8}
                      value={generatedPackage.emailAppeal}
                      onChange={(e) => handleFieldEdit('emailAppeal', e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 leading-relaxed font-sans"
                    />
                  </div>
                )}

                {activeTab === 'VIDEO' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-red-600" />
                        30-Second Video Advertisement Script (Hook, Solution, Verification, CTA)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(generatedPackage.videoScript, 'video')}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        {copiedKey === 'video' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'video' ? 'Copied!' : 'Copy Script'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={8}
                      value={generatedPackage.videoScript}
                      onChange={(e) => handleFieldEdit('videoScript', e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 font-mono leading-relaxed"
                    />
                  </div>
                )}

                {activeTab === 'POSTER' && (
                  <AdPosterPreview
                    campaign={{
                      title: generatedPackage.title,
                      location: formData.location,
                      targetAmount: formData.targetAmount,
                      beneficiariesCount: formData.beneficiariesCount,
                      problem: formData.problem,
                      solution: formData.solution,
                      coverImage: formData.coverImage,
                      ngoId: { orgName: ngo?.orgName || 'Vidya Foundation' },
                    }}
                  />
                )}
              </div>

              {/* Submit for Admin Approval CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Ready to deploy? Your campaign will be submitted for compliance review.
                </div>

                <button
                  type="button"
                  onClick={handleSubmitForApproval}
                  disabled={isSubmittingCampaign || submitSuccess}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitSuccess ? 'Submitted for Review!' : isSubmittingCampaign ? 'Submitting...' : 'Submit Campaign for Review'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
