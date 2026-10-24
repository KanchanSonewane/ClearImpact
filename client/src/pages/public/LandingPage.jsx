import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Coins,
  FileCheck2,
  Eye,
  Camera,
  Layers,
  HeartHandshake,
  Scale,
  Check,
  X,
  AlertCircle,
  FileText,
  Receipt,
  ScanLine,
  ExternalLink
} from 'lucide-react';
import api from '../../api/client';
import CampaignCard from '../../components/common/CampaignCard';
import { formatINR } from '../../utils/helpers';

export default function LandingPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    verifiedNgos: 3,
    campaignsFunded: 5,
    totalRaised: 885000,
    beneficiaries: 4900,
  });
  const [loading, setLoading] = useState(true);

  // Interactive Simulation Demo State (Flaw #15 & #4)
  const [activeSimulation, setActiveSimulation] = useState('MISMATCH'); // 'CLEAN' | 'MISMATCH' | 'TAMPER'

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const res = await api.get('/campaigns');
        const unique = [];
        const seen = new Set();
        for (const c of res.data) {
          if (!seen.has(c.title)) {
            seen.add(c.title);
            unique.push(c);
          }
        }
        setCampaigns(unique.slice(0, 3));
      } catch (err) {
        console.error('Failed to load campaigns for landing page', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* 1. HERO SECTION: 10-SECOND VALUE PROPOSITION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white pt-20 pb-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Hero Header */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Next-Gen Fiduciary Accountability • 5-Layer Verification Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              The AI-Assisted <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                Impact Verification Platform.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Traditional fundraising operates on a <em>"fund-and-forget"</em> lump-sum model. ClearImpact creates an unbroken, traceable link between your donation, uploaded GST invoices, and AI-audited physical evidence before funds are released.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/campaigns"
                className="px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition hover:-translate-y-0.5"
              >
                <span>Explore Verified Campaigns</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#comparison-matrix"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition"
              >
                Compare with Traditional Platforms
              </a>
            </div>
          </div>

          {/* VISUAL CENTERPIECE: The 5-Step Continuous Impact Verification Chain (Flaw #1) */}
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl backdrop-blur-md">
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                The ClearImpact Verification Protocol
              </span>
              <h2 className="text-base sm:text-lg font-black text-white mt-1">
                How We Prove Money Was Actually Used & Delivered
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>STEP 1</span>
                  <Coins className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-xs font-bold text-white">Targeted Donation</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Donor contributes ₹2,000 with instant 80G tax receipt generation.
                </p>
                <div className="text-[10px] font-mono text-emerald-300 pt-1">
                  Status: Earmarked
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                  <span>STEP 2</span>
                  <Lock className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="text-xs font-bold text-white">Milestone Escrow Vault</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  100% of funds locked into sequential tranches (40% - 40% - 20%).
                </p>
                <div className="text-[10px] font-mono text-indigo-300 pt-1">
                  Status: Protected
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>STEP 3</span>
                  <Receipt className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-xs font-bold text-white">GST Invoices & Proof</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  NGO submits vendor bills, warehouse logs, and distribution photos.
                </p>
                <div className="text-[10px] font-mono text-amber-300 pt-1">
                  Status: Uploaded
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                  <span>STEP 4</span>
                  <ScanLine className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="text-xs font-bold text-white">AI Multi-Signal Audit</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Perceptual hash duplicate check, EXIF metadata, and claim consistency.
                </p>
                <div className="text-[10px] font-mono text-purple-300 pt-1">
                  Status: Audited (0-100)
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span>STEP 5</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-xs font-bold text-white">Verified Tranche Release</h4>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Admin authorizes release. Donor sees verified impact timeline update.
                </p>
                <div className="text-[10px] font-mono text-emerald-300 pt-1">
                  Status: Disbursed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 5-LAYER VERIFICATION STANDARD (Flaw #3 & #6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
            <Layers className="w-3.5 h-3.5" />
            <span>Beyond Simple Green Checkmarks</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            The ClearImpact Multi-Layer Verification Standard
          </h2>
          <p className="text-sm text-slate-600">
            A real photograph can still be fake evidence. That’s why ClearImpact enforces 5 distinct layers of proof before any money leaves the escrow vault.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-emerald-500 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm">
              L1
            </div>
            <h4 className="text-xs font-bold text-slate-900">1. NGO Statutory Identity</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              PAN, NGO Darpan Portal ID, 12A exemption, and 80G tax-deductibility cross-checked against government records.
            </p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              Weight: 20 pts
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-emerald-500 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm">
              L2
            </div>
            <h4 className="text-xs font-bold text-slate-900">2. Scope & Unit Economics</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Budget per beneficiary benchmarking (e.g. ₹400/kit) and milestone tranche segregation before campaign activation.
            </p>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
              Weight: 20 pts
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-emerald-500 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-sm">
              L3
            </div>
            <h4 className="text-xs font-bold text-slate-900">3. Financial GST Invoices</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Audited procurement bills, vendor GST numbers, and warehouse freight challans proving goods were bought.
            </p>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
              Weight: 20 pts
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-emerald-500 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-sm">
              L4
            </div>
            <h4 className="text-xs font-bold text-slate-900">4. Media Authenticity</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Perceptual SHA-256 duplicate image detection, EXIF hardware metadata audit, and digital software tamper screening.
            </p>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
              Weight: 20 pts
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-emerald-500 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 font-bold flex items-center justify-center text-sm">
              L5
            </div>
            <h4 className="text-xs font-bold text-slate-900">5. Claim–Evidence Match</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Headcount verification: Algorithmic discrepancy matching between claimed goals and verified student receipt signatures.
            </p>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full inline-block">
              Weight: 20 pts
            </span>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SIMULATION: CLAIM-EVIDENCE DISCREPANCY & TAMPER DETECTION (Flaw #4 & #15) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Faculty / Judge Interactive Audit Simulator</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                How ClearImpact Handles Evidence Discrepancies & False Claims
              </h3>
              <p className="text-xs text-slate-400">
                Test how our risk engine handles clean submissions vs. beneficiary headcount mismatch vs. digital tampering.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-bold bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveSimulation('MISMATCH')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeSimulation === 'MISMATCH' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚠️ Scenario 1: Headcount Mismatch
              </button>
              <button
                type="button"
                onClick={() => setActiveSimulation('TAMPER')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeSimulation === 'TAMPER' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                🚨 Scenario 2: Software Tampering
              </button>
              <button
                type="button"
                onClick={() => setActiveSimulation('CLEAN')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeSimulation === 'CLEAN' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                ✓ Scenario 3: Clean Submission
              </button>
            </div>
          </div>

          {/* Simulation Output Card */}
          {activeSimulation === 'MISMATCH' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950/80 p-5 rounded-2xl border border-amber-500/30">
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    ⚠️ Evidence–Claim Mismatch Flagged
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Algorithm: Headcount Discrepancy Scanner</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Claim: "500 Education Kits Distributed in Nagpur"
                </h4>
                <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30 text-xs text-amber-200 space-y-1">
                  <div>• Claimed Beneficiaries: <strong>500 Students</strong></div>
                  <div>• Counter-Signed Student Receipts: <strong>487 Handover Slips</strong></div>
                  <div>• Discrepancy Flag: <strong>13 Kits Unaccounted For (Absentee Follow-Up Required)</strong></div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ClearImpact does not blindly approve round numbers. The system flags the 13-unit discrepancy for human compliance resolution before releasing subsequent tranches.
                </p>
              </div>

              <div className="md:col-span-5 flex flex-col justify-between p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">ClearImpact Score Impact</span>
                  <div className="text-2xl font-black text-amber-400">82 / 100</div>
                  <span className="text-[11px] text-amber-300">Action: Conditional Review Pending</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  Escrow Tranche 2 held safely in vault until absentee delivery register is uploaded.
                </div>
              </div>
            </div>
          )}

          {activeSimulation === 'TAMPER' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950/80 p-5 rounded-2xl border border-rose-500/30">
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-400/20 text-rose-300 border border-rose-400/30">
                    🚨 Tampering / Editing Software Signature Detected
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Algorithm: EXIF Software Binary Inspector</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Submission: Post-Processed Photo Asset Uploaded
                </h4>
                <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 text-xs text-rose-200 space-y-1">
                  <div>• EXIF Software Tag: <strong>"Adobe Photoshop 24.1 (Windows)"</strong></div>
                  <div>• Risk Weight Added: <strong>+40 Points (Tamper Signal)</strong></div>
                  <div>• Recommendation: <strong>Mandate uncompressed camera RAW/JPEG asset with original camera EXIF.</strong></div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Probabilistic notice: <em>"AI detection checks file container integrity. A modified photo does not prove fraud, but mandates inspection of unedited raw assets before fund release."</em>
                </p>
              </div>

              <div className="md:col-span-5 flex flex-col justify-between p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk Engine Assessment</span>
                  <div className="text-2xl font-black text-rose-400">Score: 50/100 (FLAGGED)</div>
                  <span className="text-[11px] text-rose-300">Requires Fiduciary Compliance Sign-off</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  Escrow release automatically blocked until human compliance review.
                </div>
              </div>
            </div>
          )}

          {activeSimulation === 'CLEAN' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950/80 p-5 rounded-2xl border border-emerald-500/30">
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    ✓ Clean Ground Verification
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Multi-Layer Audit Passed</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Full Alignment: Invoices, Physical Count & EXIF
                </h4>
                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                  <div>• GST Invoice #GST-MH-9941: <strong>Verified on GST Portal</strong></div>
                  <div>• Camera Device: <strong>Samsung SM-G998B (Timestamp: Validated)</strong></div>
                  <div>• Cryptographic Hash: <strong>Unique SHA-256 (No duplicate stock)</strong></div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fiduciary milestone released. Donor impact timeline updated in real time with receipt and before/after report.
                </p>
              </div>

              <div className="md:col-span-5 flex flex-col justify-between p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">ClearImpact Score</span>
                  <div className="text-2xl font-black text-emerald-400">88 / 100 • High Confidence</div>
                  <span className="text-[11px] text-emerald-300">Milestone Tranche 1 Disbursed</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  Donor receives notification with verified photographic audit trail.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. WHY CLEARIMPACT? TRADITIONAL CROWDFUNDING VS. CLEARIMPACT (Flaw #9) */}
      <section id="comparison-matrix" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700">
            <Scale className="w-3.5 h-3.5" />
            <span>Platform Differentiation Matrix</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Why ClearImpact? Traditional Fundraising vs. Verified Impact
          </h2>
          <p className="text-sm text-slate-600">
            Compare how traditional donation websites operate versus ClearImpact's fiduciary verification architecture:
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xs bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-[11px] w-1/3">Verification & Escrow Dimension</th>
                <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-[11px] text-slate-400 w-1/3">Traditional Crowdfunding Platforms (Ketto, Milaap, etc.)</th>
                <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-[11px] text-emerald-400 w-1/3">ClearImpact Verification Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-5 font-bold text-slate-900">
                  Fund Disbursal Method
                </td>
                <td className="p-4 sm:p-5 text-slate-600">
                  <span className="text-rose-600 font-bold">Lump-sum upfront:</span> 100% of money transferred to NGO without proof of spending.
                </td>
                <td className="p-4 sm:p-5 text-emerald-950 bg-emerald-50/40">
                  <span className="text-emerald-700 font-bold">Sequential Milestone Escrow:</span> Funds unlocked in tranches strictly upon verified proof.
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-5 font-bold text-slate-900">
                  Evidence Authenticity & Tamper Check
                </td>
                <td className="p-4 sm:p-5 text-slate-600">
                  <span className="text-rose-600 font-bold">None / Manual glance:</span> Photos uploaded without digital hashing or metadata audit.
                </td>
                <td className="p-4 sm:p-5 text-emerald-950 bg-emerald-50/40">
                  <span className="text-emerald-700 font-bold">Multi-Signal AI Audit:</span> EXIF metadata, timestamp verification, and perceptual duplicate hashing.
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-5 font-bold text-slate-900">
                  Claim vs. Evidence Consistency
                </td>
                <td className="p-4 sm:p-5 text-slate-600">
                  <span className="text-rose-600 font-bold">Unchecked promises:</span> Campaign can claim 10,000 helped without headcount receipt correlation.
                </td>
                <td className="p-4 sm:p-5 text-emerald-950 bg-emerald-50/40">
                  <span className="text-emerald-700 font-bold">Algorithmic Discrepancy Matching:</span> Physical beneficiary receipts compared against claimed targets.
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-5 font-bold text-slate-900">
                  Financial Expenditure Trail
                </td>
                <td className="p-4 sm:p-5 text-slate-600">
                  <span className="text-slate-500 font-bold">Limited:</span> Optional text updates without audited procurement bills.
                </td>
                <td className="p-4 sm:p-5 text-emerald-950 bg-emerald-50/40">
                  <span className="text-emerald-700 font-bold">Itemized GST Audit Trail:</span> Every rupee mapped to vendor GST invoices and freight challans.
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-5 font-bold text-slate-900">
                  Trust Rating & Confidence
                </td>
                <td className="p-4 sm:p-5 text-slate-600">
                  <span className="text-slate-500 font-bold">Generic Green Checkmark:</span> "Verified" without explaining what was checked.
                </td>
                <td className="p-4 sm:p-5 text-emerald-950 bg-emerald-50/40">
                  <span className="text-emerald-700 font-bold">0–100 Explainable ClearImpact Score:</span> Multi-layer point breakdown (Identity, Documents, Media, Invoices).
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-5 font-bold text-slate-900">
                  Donor Protection on Default
                </td>
                <td className="p-4 sm:p-5 text-slate-600">
                  <span className="text-rose-600 font-bold">Non-refundable:</span> Once given, money cannot be recouped if execution halts.
                </td>
                <td className="p-4 sm:p-5 text-emerald-950 bg-emerald-50/40">
                  <span className="text-emerald-700 font-bold">Escrow Protection:</span> Unreleased milestone funds protected and redirected with donor consensus.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. FEATURED CAMPAIGNS WITH CLEARIMPACT SCORES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              Active Verified Initiatives
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Featured Milestone Campaigns
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Every campaign displays its 0–100 ClearImpact Score and audited milestone roadmap.
            </p>
          </div>

          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition"
          >
            <span>View All Campaigns</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campaigns.map((camp) => (
              <CampaignCard key={camp._id} campaign={camp} />
            ))}
          </div>
        )}
      </section>

      {/* 6. PLATFORM AUDIT METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1 border-r border-slate-800 pr-4 last:border-none">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Verified NGOs</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats.verifiedNgos}
              </div>
              <div className="text-[11px] text-slate-400">
                100% Darpan, 12A & 80G validated
              </div>
            </div>

            <div className="space-y-1 border-r border-slate-800 pr-4 last:border-none">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <FileCheck2 className="w-4 h-4" />
                <span>Campaigns in Escrow</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats.campaignsFunded}
              </div>
              <div className="text-[11px] text-slate-400">
                Sequential milestone tranches
              </div>
            </div>

            <div className="space-y-1 border-r border-slate-800 pr-4 last:border-none">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Coins className="w-4 h-4" />
                <span>Total Protected</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {formatINR(stats.totalRaised)}
              </div>
              <div className="text-[11px] text-slate-400">
                Released strictly upon verified invoices
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Verified Beneficiaries</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats.beneficiaries.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400">
                Audited against student registers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GROUNDED AI CAMPAIGN STUDIO CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Grounded AI Innovation</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              AI Generates Communication, Never Truth.
            </h2>

            <p className="text-sm text-indigo-200 leading-relaxed">
              ClearImpact includes an AI Impact Campaign Studio and 14-archetype Ad Poster Studio that generates trilingual social assets (English, Hindi, Marathi) with locked factual metrics, live scannable QR codes, and zero hallucination.
            </p>

            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs space-y-2">
              <div className="font-semibold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Claim Validation Layer Active
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                If an AI output exaggerates or hallucinates beneficiary numbers, budgets, or locations, the system flags it: <strong className="text-amber-300">"⚠ Unsupported claim detected"</strong>, mandating human review before publication.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/register?role=NGO"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-brand-950 font-bold text-xs hover:bg-slate-100 transition shadow-lg"
              >
                <span>Launch AI Impact Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-4">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Ready to experience radical impact transparency?
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Back verified campaigns, review on-ground evidence, and track every single rupee from escrow to physical handover.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/campaigns"
            className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition"
          >
            Explore Campaigns Now
          </Link>
          <Link
            to="/login"
            className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition"
          >
            Sign In with Demo Accounts
          </Link>
        </div>
      </section>
    </div>
  );
}
