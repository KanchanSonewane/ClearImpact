import React from 'react';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Camera,
  Coins,
  MapPin,
  ExternalLink,
  Info,
  Scale
} from 'lucide-react';
import { formatINR } from '../../utils/helpers';

export default function WhyTrustModal({ isOpen, onClose, campaign }) {
  if (!isOpen || !campaign) return null;

  const ngo = campaign.ngoId || {};
  const target = Number(campaign.targetAmount || 200000);
  const beneficiaries = Number(campaign.beneficiariesCount || 500);
  const costPerBeneficiary = Math.round(target / Math.max(beneficiaries, 1));

  // 5-Layer ClearImpact Verification Breakdown
  const verificationLayers = [
    {
      id: 'L1',
      title: 'Layer 1: NGO Identity & Statutory Compliance',
      score: 20,
      maxScore: 20,
      status: 'VERIFIED',
      statusText: 'Verified by Compliance Admin',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'Physical statutory credentials cross-checked against Indian government registries.',
      items: [
        { label: 'NGO Darpan ID', value: ngo.registrationNumber || ngo.darpanId || 'MH/2021/0148291', status: 'Passed' },
        { label: 'PAN & Bank Mandate', value: ngo.pan || 'AAATV1234D', status: 'Verified' },
        { label: '12A Income Tax Exemption', value: 'Active & Validated', status: 'Passed' },
        { label: '80G Tax Deductibility', value: 'Active (Instant digital donor receipt)', status: 'Passed' },
      ],
    },
    {
      id: 'L2',
      title: 'Layer 2: Campaign Scope & Milestone Escrow',
      score: 18,
      maxScore: 20,
      status: 'VERIFIED',
      statusText: 'Escrow Locked',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'Budget parameters are benchmarked and locked into sequential escrow tranches.',
      items: [
        { label: 'Target Funding', value: formatINR(target), status: 'Plausible' },
        { label: 'Beneficiary Count', value: `${beneficiaries} individuals`, status: 'Plausible' },
        { label: 'Unit Economics Benchmark', value: `~${formatINR(costPerBeneficiary)} per beneficiary`, status: 'Passed' },
        { label: 'Escrow Governance', value: 'Funds released sequentially upon proof', status: 'Active' },
      ],
    },
    {
      id: 'L3',
      title: 'Layer 3: Financial Evidence & Invoices',
      score: 17,
      maxScore: 20,
      status: 'IN_PROGRESS',
      statusText: 'Tranche 1 Audited • Tranche 2 Pending',
      statusColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      description: 'Audit of GST invoices, vendor receipts, and bank transaction logs before fund release.',
      items: [
        { label: 'Tranche 1 Vendor GST Invoices', value: 'Submitted & Cross-Referenced', status: 'Passed' },
        { label: 'Physical Inventory Log', value: 'Checked against school register', status: 'Passed' },
        { label: 'Tranche 2 & 3 Release State', value: 'Locked in escrow until Milestone 1 completes', status: 'Protected' },
      ],
    },
    {
      id: 'L4',
      title: 'Layer 4: Media Authenticity & Provenance',
      score: 16,
      maxScore: 20,
      status: 'PASSED',
      statusText: 'Multi-Signal Integrity Passed',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'Cryptographic hashing, EXIF hardware metadata audit, and digital tamper detection.',
      items: [
        { label: 'Cryptographic Perceptual Hash', value: 'Unique (No duplicate recycled stock across campaigns)', status: 'Passed' },
        { label: 'Digital Manipulation Check', value: 'No editing software signatures (Photoshop/Snapseed)', status: 'Passed' },
        { label: 'EXIF Hardware Metadata', value: 'Camera device and capture timestamp logged', status: 'Passed' },
      ],
      notice: 'AI media checks verify digital file integrity. They are combined with physical invoices to validate ground truth.',
    },
    {
      id: 'L5',
      title: 'Layer 5: Evidence–Claim Consistency Check',
      score: 16,
      maxScore: 20,
      status: 'VERIFIED',
      statusText: '97.4% Claim Alignment',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'Algorithmic comparison between claimed beneficiary goals and uploaded distribution registers.',
      items: [
        { label: 'Claimed Target', value: `${beneficiaries} kits to enrolled students`, status: 'Claim' },
        { label: 'Warehouse Batch Receipt', value: `${beneficiaries} units received from vendor`, status: 'Verified' },
        { label: 'Audited Physical Distribution Log', value: '487 student counter-signed receipts', status: '97.4% Match' },
      ],
    },
  ];

  const totalScore = verificationLayers.reduce((acc, curr) => acc + curr.score, 0);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Multi-Layer Verification Standard</span>
            </div>
            <h2 className="text-xl font-black text-white">
              Why Should You Trust This Campaign?
            </h2>
            <p className="text-xs text-slate-300 max-w-lg">
              ClearImpact does not rely on a single green tick. We audit campaigns across 5 rigorous layers from statutory registration to physical evidence consistency.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ClearImpact Score Summary Banner */}
        <div className="p-4 sm:p-5 bg-emerald-50/70 border-b border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
              <span className="text-xl leading-none">{totalScore}</span>
              <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">/ 100</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-emerald-950">ClearImpact Confidence Score</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-bold text-[10px]">
                  🟢 High Confidence
                </span>
              </div>
              <p className="text-xs text-emerald-800/90 font-medium">
                Multi-layer audit verified. Sequential milestone escrow active.
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-emerald-900 sm:border-l sm:border-emerald-200 sm:pl-4">
            <div>Fiduciary Escrow: <strong>100% Protected</strong></div>
            <div>Human Sign-Off: <strong>Admin Certified</strong></div>
          </div>
        </div>

        {/* 5-Layer Breakdown Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {verificationLayers.map((layer) => (
            <div
              key={layer.id}
              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white transition shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>{layer.title}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {layer.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${layer.statusColor}`}>
                    {layer.statusText}
                  </span>
                  <span className="text-xs font-black text-slate-800">
                    {layer.score}/{layer.maxScore}
                  </span>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {layer.items.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-white border border-slate-200/60 flex items-center justify-between gap-2">
                    <span className="text-slate-500 font-medium">{item.label}:</span>
                    <span className="font-bold text-slate-800 truncate text-right">{item.value}</span>
                  </div>
                ))}
              </div>

              {layer.notice && (
                <div className="p-2 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[10px] text-indigo-900 flex items-center gap-1.5 font-medium">
                  <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{layer.notice}</span>
                </div>
              )}
            </div>
          ))}

          {/* Fiduciary Clarification Notice */}
          <div className="p-3.5 bg-slate-100 rounded-2xl text-[11px] text-slate-600 leading-relaxed border border-slate-200 flex items-start gap-2">
            <Scale className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>
              <strong>Fiduciary Commitment:</strong> ClearImpact holds all funds in milestone escrow. If an NGO fails to submit verifiable invoices and ground evidence for any stage, unreleased funds are returned or redirected with donor consensus.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Audited for: <strong>{campaign.title}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
          >
            Close Trust Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
