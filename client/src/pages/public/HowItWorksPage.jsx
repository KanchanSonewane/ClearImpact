import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  Camera,
  Coins,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileCheck2,
  Users,
  Search,
  Eye
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Proof-of-Impact Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          How ClearImpact Works
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          The step-by-step architecture that guarantees every donated rupee is tied to verifiable, on-ground evidence.
        </p>
      </div>

      {/* Step 1: NGO Verification */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="md:col-span-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm">
            01
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Statutory NGO Verification
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Before an NGO can create a campaign, our compliance team manually inspects:
          </p>
          <ul className="text-xs text-slate-700 space-y-2 pt-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>NGO Darpan Portal ID & Registration Certificate</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Section 12A Non-Profit Entity Status</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Section 80G Tax Exemption Eligibility</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Official Organization PAN & Bank Details</span>
            </li>
          </ul>
        </div>

        <div className="md:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pb-2 border-b">
            <span>Prototype Note</span>
            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-800">Compliance Flow</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            ClearImpact explicitly separates manual review in the current prototype from future official NGO Darpan API integration. Verified NGOs receive the badge:
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>✓ Verified NGO</span>
          </div>
        </div>
      </div>

      {/* Step 2: Grounded AI Campaign Studio */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="md:col-span-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm">
            02
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Grounded AI Campaign Studio
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            NGOs submit structured requirements (target amount, beneficiaries count, location, problem, solution, expected impact). The AI generates a 10-part outreach package:
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700 font-medium pt-1">
            <span>• Campaign Story</span>
            <span>• Instagram Caption</span>
            <span>• LinkedIn Post</span>
            <span>• WhatsApp Message</span>
            <span>• Email Appeal</span>
            <span>• 30s Video Script</span>
          </div>
        </div>

        <div className="md:col-span-7 bg-indigo-50/70 p-6 rounded-2xl border border-indigo-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Claim Validation & Protection Layer</span>
          </div>
          <p className="text-xs text-indigo-950 leading-relaxed">
            AI generates communication, but NEVER truth. If generated content hallucinates or alters beneficiary counts (e.g. "thousands" instead of 500), our validation engine flags:
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>⚠ Unsupported claim detected</span>
            </div>
            <div className="text-[11px]">
              "Beneficiary count mismatch. Align with exact verified count of 500 beneficiaries."
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Milestone-Based Escrow Fund Release */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="md:col-span-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm">
            03
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Milestone Escrow Protocol
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Campaign funds are not disbursed immediately upon donation. They move through a 7-stage lifecycle:
          </p>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-bold font-mono">
            <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">PENDING</span>
            <span>→</span>
            <span className="px-2 py-1 bg-blue-100 rounded text-blue-800">FUNDED</span>
            <span>→</span>
            <span className="px-2 py-1 bg-amber-100 rounded text-amber-800">EVIDENCE_SUBMITTED</span>
            <span>→</span>
            <span className="px-2 py-1 bg-purple-100 rounded text-purple-800">UNDER_REVIEW</span>
            <span>→</span>
            <span className="px-2 py-1 bg-emerald-100 rounded text-emerald-800">RELEASED</span>
          </div>
        </div>

        <div className="md:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="text-xs font-bold text-slate-900">Escrow Release Lifecycle:</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            For example, on a ₹2,00,000 campaign, Milestone 1 (₹75,000) is released only when procurement invoices and warehouse photos pass evidence inspection. Milestone 2 (₹75,000) is released when distribution photos pass risk analysis.
          </p>
        </div>
      </div>

      {/* Step 4: Explainable Evidence Risk Engine */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="md:col-span-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-sm">
            04
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Explainable Risk Scoring Engine
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every photo uploaded by an NGO is audited using explainable algorithmic heuristics:
          </p>
          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
              <span>Duplicate photo detected:</span>
              <span className="font-bold text-amber-700">+50 risk</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
              <span>Tamper signal / editing software:</span>
              <span className="font-bold text-amber-700">+40 risk</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
              <span>Old photo capture date in EXIF:</span>
              <span className="font-bold text-amber-700">+30 risk</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg border">
              <span>Missing hardware EXIF metadata:</span>
              <span className="font-bold text-slate-600">+10 risk</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-brand-600" />
            <span>Human In The Loop Philosophy</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            A score ≥ 40 flags the submission as <strong className="text-amber-800">"Requires review"</strong>, NOT "fraud detected". The human administrator evaluates the anomaly and makes the final determination to approve, reject, or request more information.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition"
        >
          <span>Explore Verified Campaigns</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
