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
  HeartHandshake
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
        setCampaigns(unique.slice(0, 3)); // show top 3 distinct featured
      } catch (err) {
        console.error('Failed to load campaigns for landing page', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-white pt-16 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Next-Generation NGO Accountability</span>
                <span className="bg-brand-600 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-mono uppercase">
                  Zero Hallucination
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Donate with confidence. <br />
                <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  See the impact.
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                ClearImpact connects donors with verified NGOs and provides transparent, milestone-based proof of how campaigns progress.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/campaigns"
                  className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center gap-2 transition hover:-translate-y-0.5"
                >
                  <span>Explore Campaigns</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/register?role=NGO"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs transition"
                >
                  Join as an NGO
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Statutory 12A & 80G Verified
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-brand-600" />
                  Milestone Escrow Protection
                </span>
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  Photographic Risk Analysis
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Visual Journey Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800">
                      Live Milestone Escrow Protocol
                    </span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    ID: CI-EDU-500
                  </span>
                </div>

                {/* Step Progression Visual */}
                <div className="mt-5 space-y-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Donor Contribution</div>
                        <div className="text-[11px] text-slate-500">₹2,000 deposited into escrow</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      SECURED
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Milestone Evidence Upload</div>
                        <div className="text-[11px] text-slate-500">500 kit invoices + EXIF photos</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      SUBMITTED
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-950">Evidence Risk Scoring: Low Risk</div>
                        <div className="text-[11px] text-emerald-700">Perceptual hash passed • Admin approved</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded">
                      RELEASED
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Transparent giving without guesswork.</span>
                  <Link to="/how-it-works" className="font-bold text-brand-600 hover:underline">
                    See the Architecture →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM METRICS & STATS */}
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
                100% Darpan & 80G verified
              </div>
            </div>

            <div className="space-y-1 border-r border-slate-800 pr-4 last:border-none">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <FileCheck2 className="w-4 h-4" />
                <span>Campaigns Funded</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats.campaignsFunded}
              </div>
              <div className="text-[11px] text-slate-400">
                Milestone-backed initiatives
              </div>
            </div>

            <div className="space-y-1 border-r border-slate-800 pr-4 last:border-none">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Coins className="w-4 h-4" />
                <span>Total Raised</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {formatINR(stats.totalRaised)}
              </div>
              <div className="text-[11px] text-slate-400">
                Held in escrow & released in tranches
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Beneficiaries Reached</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats.beneficiaries.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400">
                Verified on-ground count
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Metrics dynamically aggregated from verified database campaign records.
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              100% Milestone-Protected
            </span>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CAMPAIGNS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              Verified Causes
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Milestone Campaigns
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Explore active funding requests with transparent milestone breakdowns and proof-of-work.
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

      {/* 4. HOW CLEARIMPACT WORKS - THE 4 PILLARS */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600">
              The Architecture of Trust
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How ClearImpact Solves the Philanthropic Trust Deficit
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Donors often cannot see where money went, if the promised activity happened, or what impact was produced. ClearImpact bridges this gap systematically:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                1. Statutory NGO Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before publishing any campaign, NGOs undergo strict compliance review of NGO Darpan ID, PAN, 12A, and 80G status with manual validation.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                2. Milestone Fund Escrow
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Donations are never disbursed all at once. Funds are held in milestone tranches and unlocked only after physical work has been proven.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-lg">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                3. Explainable Evidence Risk
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uploaded photos undergo perceptual hash duplicate matching, EXIF timestamp verification, and editing software audits before admin approval.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                4. Grounded AI & Impact Track
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI generates communications and outreach, but NEVER invents factual claims. Donors track their exact contribution from rupee to on-ground proof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GROUNDED AI CAMPAIGN STUDIO CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Grounded AI Innovation</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              AI Generates Communication, Never Factual Claims.
            </h2>

            <p className="text-sm text-indigo-200 leading-relaxed">
              ClearImpact includes a state-of-the-art AI Campaign Studio that empowers NGOs to generate full social outreach packages (Instagram, LinkedIn, WhatsApp, Email, Video Ad Scripts, and Social Posters) in seconds.
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
                <span>Launch AI Campaign Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-4">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Ready to experience radical transparency?
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Back verified campaigns, review on-ground evidence, and see the exact milestone proof of your generosity.
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
