import React from 'react';
import { ShieldCheck, HeartHandshake, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const principles = [
    { title: 'Transparency over flashy features', desc: 'No empty promises or bloated gimmicks. Every feature serves accountable giving.' },
    { title: 'AI generates communication, not truth', desc: 'LLMs craft persuasive appeals and posts, but never invent beneficiary numbers or budgets.' },
    { title: 'Evidence is not blind truth', desc: 'Photographic submissions are audited via hashes, EXIF tags, and human compliance officers.' },
    { title: 'Admin has final authority', desc: 'Algorithms flag anomalies, but humans approve campaigns, verify NGOs, and release funds.' },
    { title: 'Risk score means "requires review"', desc: 'We flag technical discrepancies without making derogatory presumptions of fraud.' },
    { title: 'Never fabricate real NGO data', desc: 'All statutory records reflect realistic demonstration criteria clearly labeled as demo.' },
    { title: 'Never fabricate impact statistics', desc: 'Every number displayed is dynamically grounded in verified database transactions.' },
    { title: 'Safe sandbox payments', desc: 'Simulated Razorpay sandbox prevents accidental live transactions in demonstration environments.' },
    { title: 'API Key protection', desc: 'Zero API keys or secrets exposed in frontend client code.' },
    { title: 'Resilient offline fallback', desc: 'The entire application remains 100% operational even when external AI or payment APIs are unavailable.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>About ClearImpact</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Restoring Trust in Non-Profit Philanthropy
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Traditional NGO platforms often leave donors in the dark: Was the organization legitimate? Was the money actually spent on what was promised? Did the beneficiary receive help?
        </p>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-400" />
          Our Mission
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          ClearImpact creates a high-trust digital ecosystem where non-profits with proven integrity receive reliable funding, while donors enjoy complete visibility into every stage of project execution through milestone-locked escrow and explainable evidence verification.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Our 10 Core Engineering Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principles.map((p, idx) => (
            <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span>{p.title}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
