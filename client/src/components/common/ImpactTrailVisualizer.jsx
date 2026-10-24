import React from 'react';
import {
  Coins,
  Receipt,
  Truck,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowDown,
  ArrowRight,
  FileCheck2,
  Camera,
  AlertCircle
} from 'lucide-react';
import { formatINR } from '../../utils/helpers';

export default function ImpactTrailVisualizer({ campaign }) {
  const target = Number(campaign?.targetAmount || 200000);
  const beneficiaries = Number(campaign?.beneficiariesCount || 500);

  // Financial Tranche Breakdown
  const trancheBreakdown = [
    {
      tranche: 'Tranche 1 (40%)',
      amount: Math.round(target * 0.4),
      title: 'Procurement of Core Educational Goods',
      status: 'VERIFIED_RELEASED',
      expenditures: [
        { item: '500 Standardized School Backpacks', amount: Math.round(target * 0.22), proof: 'GST Vendor Invoice #GST-MH-9941' },
        { item: 'Notebooks, Geometry & Stationery Sets', amount: Math.round(target * 0.14), proof: 'Batch Procurement Bill #VID-1029' },
        { item: 'Transit Logistics & Packing', amount: Math.round(target * 0.04), proof: 'Freight Challan #MH-LOG-88' },
      ],
      evidence: {
        title: 'Transit Warehouse Invoices & Headcount Batch Audit',
        claimedBeneficiaries: beneficiaries,
        verifiedBeneficiaries: 500,
        riskScore: 10,
        adminStatus: 'APPROVED',
      }
    },
    {
      tranche: 'Tranche 2 (40%)',
      amount: Math.round(target * 0.4),
      title: 'On-Ground School Handover & Distribution',
      status: 'AUDIT_IN_PROGRESS',
      expenditures: [
        { item: 'Physical Handover to Enrolled Students', amount: Math.round(target * 0.32), proof: 'Counter-signed Student Receipt Log' },
        { item: 'District Transit & Coordination', amount: Math.round(target * 0.08), proof: 'Field Expense Vouchers' },
      ],
      evidence: {
        title: 'Classroom Distribution Photos & Beneficiary Registers',
        claimedBeneficiaries: beneficiaries,
        verifiedBeneficiaries: 487, // 13-meal / student discrepancy highlight!
        discrepancyNote: '487 student receipts counter-signed. 13 students absent on distribution day (follow-up scheduled).',
        riskScore: 15,
        adminStatus: 'IN_REVIEW',
      }
    },
    {
      tranche: 'Tranche 3 (20%)',
      amount: Math.round(target * 0.2),
      title: 'Post-Impact Audit, Survey & 80G Final Filing',
      status: 'LOCKED_IN_ESCROW',
      expenditures: [
        { item: 'Quarterly Academic Retention Survey', amount: Math.round(target * 0.15), proof: 'School Attendance Report' },
        { item: 'Statutory Impact Reporting & Auditing', amount: Math.round(target * 0.05), proof: 'Chartered Accountant Certification' },
      ],
      evidence: {
        title: 'Comprehensive Retention Audit & Final Impact Report',
        claimedBeneficiaries: beneficiaries,
        verifiedBeneficiaries: 0,
        riskScore: 0,
        adminStatus: 'AWAITING_MILESTONE_2',
      }
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 mb-1">
            <Coins className="w-3.5 h-3.5" />
            <span>Fiduciary Impact & Expenditure Trail</span>
          </div>
          <h3 className="text-lg font-black text-slate-900">
            How Every Rupee is Tracked from Escrow to Physical Handover
          </h3>
          <p className="text-xs text-slate-500">
            ClearImpact proves where funds went. Money is unlocked sequentially only upon matching vendor invoices and physical beneficiary logs.
          </p>
        </div>

        <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Verified Expenditure</span>
          <span className="text-lg font-black text-emerald-950">{formatINR(Math.round(target * 0.4))} / {formatINR(target)}</span>
        </div>
      </div>

      {/* Tranches Flow */}
      <div className="space-y-6">
        {trancheBreakdown.map((t, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-5 transition-all space-y-4 ${
              t.status === 'VERIFIED_RELEASED'
                ? 'bg-emerald-50/40 border-emerald-200'
                : t.status === 'AUDIT_IN_PROGRESS'
                ? 'bg-indigo-50/40 border-indigo-200 ring-2 ring-indigo-500/10'
                : 'bg-slate-50/60 border-slate-200 opacity-80'
            }`}
          >
            {/* Tranche Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current/10 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                  t.status === 'VERIFIED_RELEASED'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : t.status === 'AUDIT_IN_PROGRESS'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-300 text-slate-700'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {t.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {t.tranche} • Allocation: <strong>{formatINR(t.amount)}</strong>
                  </span>
                </div>
              </div>

              <div>
                {t.status === 'VERIFIED_RELEASED' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Funds Released to NGO</span>
                  </span>
                )}
                {t.status === 'AUDIT_IN_PROGRESS' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Evidence Under Verification</span>
                  </span>
                )}
                {t.status === 'LOCKED_IN_ESCROW' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Locked in Escrow Vault</span>
                  </span>
                )}
              </div>
            </div>

            {/* Itemized Invoices & Expenditure Table */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Itemized Procurement & Expenditure Audit:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {t.expenditures.map((exp, eIdx) => (
                  <div key={eIdx} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                    <div className="flex justify-between items-start text-xs font-bold text-slate-800">
                      <span>{exp.item}</span>
                      <span className="text-emerald-700 font-extrabold">{formatINR(exp.amount)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Receipt className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{exp.proof}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence & Beneficiary Claim Matching */}
            <div className="p-3.5 bg-white/90 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Submitted Evidence: {t.evidence.title}</span>
                </div>
                {t.evidence.discrepancyNote ? (
                  <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span><strong>Claim-Evidence Audit:</strong> {t.evidence.discrepancyNote}</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500">
                    Target Headcount: <strong>{t.evidence.claimedBeneficiaries}</strong> • Verified Physical Receipts: <strong>{t.evidence.verifiedBeneficiaries}</strong>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px]">
                  Risk Score: {t.evidence.riskScore}/100
                </span>
                <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                  t.evidence.adminStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {t.evidence.adminStatus}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
