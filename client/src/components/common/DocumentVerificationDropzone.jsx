import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Clock,
  Eye
} from 'lucide-react';

export const SAMPLE_DOCUMENTS = [
  {
    docType: 'TAX_12A_80G',
    title: 'Section 12A & 80G Statutory Exemption Order',
    fileName: 'Income_Tax_12A_80G_Order_AY2024.pdf',
    fileSize: '1.24 MB',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    verificationConfidence: 98,
    verificationStatus: 'VERIFIED',
    hash: 'sha256:4f8c92a17e0b51de89a3...',
    extractedData: {
      entityName: 'Pratham Shiksha Foundation',
      pan: 'AABCP9871D',
      darpanId: 'MH/2024/0291845',
      entityNameMatch: true,
      panMatch: true,
      darpanMatch: true,
      ocrSummary: 'Form 10AC Verified. Assessment Years 2024-2029 under Section 12AB and 80G(5)(iv).',
    }
  },
  {
    docType: 'REGISTRATION_DEED',
    title: 'Public Charitable Trust Deed & Registration Certificate',
    fileName: 'Trust_Registration_Deed_Maharashtra.pdf',
    fileSize: '2.85 MB',
    fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    verificationConfidence: 96,
    verificationStatus: 'VERIFIED',
    hash: 'sha256:91b2c4e58a70df1247c1...',
    extractedData: {
      entityName: 'Pratham Shiksha Foundation',
      pan: 'AABCP9871D',
      darpanId: 'MH/2024/0291845',
      entityNameMatch: true,
      panMatch: true,
      darpanMatch: true,
      ocrSummary: 'Registered under Bombay Public Trusts Act, 1950. Registrar seal authenticated.',
    }
  },
  {
    docType: 'PAN_CARD',
    title: 'Organization Entity PAN Card Document',
    fileName: 'Pratham_Shiksha_PAN_Card.jpg',
    fileSize: '0.92 MB',
    fileUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=800&q=80',
    verificationConfidence: 99,
    verificationStatus: 'VERIFIED',
    hash: 'sha256:1a8e990c764fb4138e02...',
    extractedData: {
      entityName: 'Pratham Shiksha Foundation',
      pan: 'AABCP9871D',
      darpanId: 'MH/2024/0291845',
      entityNameMatch: true,
      panMatch: true,
      darpanMatch: true,
      ocrSummary: 'NSDL Entity PAN format valid. Alphanumeric checksum matched.',
    }
  },
  {
    docType: 'BANK_PROOF',
    title: 'Bank Account Cancelled Cheque / Bank Mandate Proof',
    fileName: 'Bank_Cancelled_Cheque_HDFC.jpg',
    fileSize: '1.15 MB',
    fileUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    verificationConfidence: 95,
    verificationStatus: 'VERIFIED',
    hash: 'sha256:739af0e19cd82b4a3c10...',
    extractedData: {
      entityName: 'Pratham Shiksha Foundation',
      pan: 'AABCP9871D',
      darpanId: 'MH/2024/0291845',
      entityNameMatch: true,
      panMatch: true,
      darpanMatch: true,
      ocrSummary: 'IFSC Code HDFC0001234 validated. Beneficiary title matches Trust deed exactly.',
    }
  }
];

export default function DocumentVerificationDropzone({
  documents = [],
  onChange,
  orgName = '',
  pan = '',
  darpanId = '',
}) {
  const [verifyingDocType, setVerifyingDocType] = useState(null);

  // Default slots
  const REQUIRED_SLOTS = [
    {
      docType: 'TAX_12A_80G',
      title: 'Section 12A & 80G Statutory Exemption Order',
      desc: 'Form 10AC or 80G order letter from Income Tax Department',
    },
    {
      docType: 'REGISTRATION_DEED',
      title: 'Trust Deed / Society Registration Certificate',
      desc: 'State Charity Commissioner or Registrar of Societies certificate',
    },
    {
      docType: 'PAN_CARD',
      title: 'Organization Entity PAN Card Document',
      desc: 'NSDL / UTI Trust PAN copy matching organization name',
    },
    {
      docType: 'BANK_PROOF',
      title: 'Bank Account Cancelled Cheque / Mandate',
      desc: 'Institutional bank account proof for milestone escrow deposits',
    },
  ];

  const handleFileUpload = (docType, file) => {
    if (!file) return;

    setVerifyingDocType(docType);

    // Simulate instant real-time document OCR & cryptographic hash verification
    setTimeout(() => {
      const cleanPan = (pan || 'AABCP9871D').trim().toUpperCase();
      const cleanOrg = (orgName || 'Pratham Shiksha Foundation').trim();
      const cleanDarpan = (darpanId || 'MH/2024/0291845').trim();

      const newDoc = {
        docType,
        title: REQUIRED_SLOTS.find(s => s.docType === docType)?.title || 'Statutory Document',
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        fileUrl: URL.createObjectURL(file),
        verificationConfidence: 96,
        verificationStatus: 'VERIFIED',
        hash: `sha256:${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}...`,
        extractedData: {
          entityName: cleanOrg,
          pan: cleanPan,
          darpanId: cleanDarpan,
          entityNameMatch: true,
          panMatch: true,
          darpanMatch: true,
          ocrSummary: `Security signature verified. Entity matched "${cleanOrg}" and Tax ID "${cleanPan}".`,
        },
        uploadedAt: new Date(),
      };

      const updated = documents.filter(d => d.docType !== docType);
      updated.push(newDoc);
      onChange(updated);
      setVerifyingDocType(null);
    }, 700);
  };

  const handleLoadSampleDocuments = () => {
    setVerifyingDocType('ALL');
    setTimeout(() => {
      const cleanPan = (pan || 'AABCP9871D').trim().toUpperCase();
      const cleanOrg = (orgName || 'Pratham Shiksha Foundation').trim();
      const cleanDarpan = (darpanId || 'MH/2024/0291845').trim();

      const verifiedSamples = SAMPLE_DOCUMENTS.map(doc => ({
        ...doc,
        extractedData: {
          ...doc.extractedData,
          entityName: cleanOrg,
          pan: cleanPan,
          darpanId: cleanDarpan,
          ocrSummary: `Security signature verified. Entity matched "${cleanOrg}" and Tax ID "${cleanPan}".`,
        }
      }));

      onChange(verifiedSamples);
      setVerifyingDocType(null);
    }, 500);
  };

  const handleRemoveDoc = (docType) => {
    const updated = documents.filter(d => d.docType !== docType);
    onChange(updated);
  };

  const verifiedCount = documents.filter(d => d.verificationStatus === 'VERIFIED').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/80 p-4 rounded-2xl border border-indigo-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-700" />
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
              Statutory Document Submission & Verification Engine
            </h4>
          </div>
          <p className="text-[11px] text-indigo-900/80 mt-0.5">
            Submit required statutory proofs. ClearImpact automatically scans documents, extracts OCR credentials, and checks entity alignment.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSampleDocuments}
          disabled={verifyingDocType !== null}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span>⚡ 1-Click Attach & Verify All 4 Documents</span>
        </button>
      </div>

      {/* Verification Summary Pill */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-800">
            {verifiedCount} of 4 Statutory Documents Attached & Verified
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
          verifiedCount === 4
            ? 'bg-emerald-100 text-emerald-800'
            : verifiedCount > 0
            ? 'bg-amber-100 text-amber-800'
            : 'bg-slate-200 text-slate-700'
        }`}>
          {verifiedCount === 4 ? '✓ Ready for Compliance Submission' : `${4 - verifiedCount} Required`}
        </span>
      </div>

      {/* 4 Document Dropzone Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {REQUIRED_SLOTS.map((slot) => {
          const doc = documents.find(d => d.docType === slot.docType);
          const isVerifying = verifyingDocType === slot.docType || verifyingDocType === 'ALL';

          return (
            <div
              key={slot.docType}
              className={`p-4 rounded-2xl border transition ${
                doc
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <FileText className={`w-4 h-4 ${doc ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {slot.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    {slot.desc}
                  </p>
                </div>

                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded shrink-0">
                  Required
                </span>
              </div>

              {isVerifying ? (
                <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200 flex items-center justify-center gap-2 text-xs font-bold text-indigo-700 animate-pulse">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Scanning Document OCR & Security Hash...</span>
                </div>
              ) : doc ? (
                /* Uploaded & Verified Document Card */
                <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-900 block truncate">{doc.fileName}</span>
                        <span className="text-[10px] text-slate-400">{doc.fileSize}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(slot.docType)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove document"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Verification Result Pill */}
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-emerald-900 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        AI & OCR Verified ({doc.verificationConfidence}%)
                      </span>
                      <span className="font-mono text-emerald-800 text-[9px]">{doc.hash?.slice(0, 16)}</span>
                    </div>
                    <div className="text-[10px] text-emerald-800 leading-snug">
                      {doc.extractedData?.ocrSummary || 'Headers match entity registration and PAN.'}
                    </div>
                  </div>

                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1 pt-0.5"
                    >
                      <span>Preview Document File</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ) : (
                /* Empty Upload Zone */
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-brand-500 hover:bg-brand-50/20 cursor-pointer transition">
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(slot.docType, e.target.files[0]);
                      }
                    }}
                  />
                  <Upload className="w-5 h-5 text-slate-400 mb-1 group-hover:text-brand-600" />
                  <span className="text-xs font-bold text-slate-700">Choose File or Drag & Drop</span>
                  <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</span>
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
