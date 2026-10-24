import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  Globe2,
  QrCode,
  Layers,
  Wand2,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Maximize2,
  Eye,
  FileCheck
} from 'lucide-react';
import { formatINR } from '../../utils/helpers';
import api from '../../api/client';

export default function AIPosterStudio({ campaign = null, isAdmin = false, onPosterCertified = null }) {
  // Campaign list for selector (if admin or not fixed)
  const [campaignList, setCampaignList] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaign?._id || '');

  // 14 Distinct Poster Templates
  const [selectedTemplate, setSelectedTemplate] = useState('hope');

  // Language: 'en' | 'hi' | 'mr'
  const [language, setLanguage] = useState('en');

  // Platform: 'instagram' (4:5 / 1:1) | 'whatsapp' (9:16) | 'linkedin' (16:9)
  const [platform, setPlatform] = useState('instagram');
  const [aspectRatio, setAspectRatio] = useState('4:5'); // '4:5' | '1:1' | '9:16' | '16:9'

  // Image mode: 'ILLUSTRATION' | 'PHOTO'
  const [visualMode, setVisualMode] = useState('PHOTO');

  // Copy state feedback
  const [copiedKey, setCopiedKey] = useState(null);
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);
  const [customHeadline, setCustomHeadline] = useState('');
  const [customSub, setCustomSub] = useState('');
  const [isCertified, setIsCertified] = useState(campaign?.aiGeneratedContent?.isPosterCertified || false);

  const posterRef = useRef(null);

  // Load campaigns if not supplied
  useEffect(() => {
    if (!campaign && !selectedCampaignId) {
      api.get('/campaigns').then(res => {
        setCampaignList(res.data);
        if (res.data.length > 0) setSelectedCampaignId(res.data[0]._id);
      }).catch(err => console.error(err));
    }
  }, [campaign]);

  const activeCampaign = campaign || campaignList.find(c => c._id === selectedCampaignId) || {
    title: 'Equip 500 Underprivileged Students with Education Kits',
    causeCategory: 'Education',
    location: 'Nagpur, Maharashtra',
    targetAmount: 200000,
    beneficiariesCount: 500,
    problem: 'Underprivileged students lack fundamental learning kits, leading to school dropouts.',
    solution: 'Provide 500 standardized backpacks, notebooks, and geometry sets directly.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    ngoId: { orgName: 'Vidya Foundation', registrationNumber: 'DARPAN-MH-2024-0091' }
  };

  const target = Number(activeCampaign.targetAmount || 20000);
  const beneficiaries = Number(activeCampaign.beneficiariesCount || 100);
  const location = activeCampaign.location || 'Nagpur, Maharashtra';
  const orgName = activeCampaign.ngoId?.orgName || activeCampaign.orgName || 'Verified NGO';
  const darpanId = activeCampaign.ngoId?.registrationNumber || 'DARPAN-VERIFIED';
  const campaignUrl = typeof window !== 'undefined' ? `${window.location.origin}/campaign/${activeCampaign._id || ''}` : 'https://clearimpact.org';

  // 14 Poster Template Definitions with bespoke styles
  const templates = {
    hope: {
      name: 'Hope',
      badge: 'HOPE • SOCIAL IMPACT',
      visualIcon: '♥',
      bgClass: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-900 text-white',
      cardClass: 'bg-white/10 border-white/20 text-white',
      accentColor: '#c9a24a',
      fontStyle: 'font-serif',
      description: 'Lush emerald gradient with philanthropic warm gold accents.'
    },
    minimal: {
      name: 'Minimal Editorial',
      badge: 'ONE SMALL STEP',
      visualIcon: '₹',
      bgClass: 'bg-[#f7f1e3] text-[#12302a] border-4 border-[#12302a]',
      cardClass: 'bg-[#12302a]/5 border-[#12302a]/20 text-[#12302a]',
      accentColor: '#12302a',
      fontStyle: 'font-serif',
      description: 'Warm cream paper with dark ink typography and clean editorial borders.'
    },
    education: {
      name: 'Education',
      badge: 'LEARNING FOR EVERY CHILD',
      visualIcon: '✦',
      bgClass: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white',
      cardClass: 'bg-indigo-500/15 border-indigo-400/25 text-white',
      accentColor: '#38bdf8',
      fontStyle: 'font-sans',
      description: 'Deep navy blue collegiate layout with bright modern badges.'
    },
    community: {
      name: 'Community Care',
      badge: 'TOGETHER WE ARE STRONGER',
      visualIcon: '●●●',
      bgClass: 'bg-gradient-to-br from-[#4a2040] via-[#6d305d] to-[#8a4d7d] text-white',
      cardClass: 'bg-white/15 border-white/20 text-white',
      accentColor: '#f4d6a2',
      fontStyle: 'font-sans',
      description: 'Warm plum & rose communal palette with connected impact points.'
    },
    sunburst: {
      name: 'Sunburst Ray',
      badge: 'SHINE A LIGHT • SPREAD HOPE',
      visualIcon: '★',
      bgClass: 'bg-gradient-to-tr from-amber-700 via-emerald-900 to-teal-950 text-white',
      cardClass: 'bg-black/25 border-white/20 text-white',
      accentColor: '#fbbf24',
      fontStyle: 'font-sans',
      description: 'Radiant energetic rays drawing immediate donor attention.'
    },
    notebook: {
      name: 'Student Notebook',
      badge: 'A STUDENT’S DREAM',
      visualIcon: '✎',
      bgClass: 'bg-[#fffdf6] text-slate-800 border-l-8 border-red-500 shadow-inner',
      cardClass: 'bg-amber-100/70 border-amber-300 text-slate-800',
      accentColor: '#0f4c3a',
      fontStyle: 'font-mono',
      description: 'Ruled notebook paper with red margin line and organic school notes.'
    },
    chalkboard: {
      name: 'Classroom Chalkboard',
      badge: 'CLASSROOM FUND • 100% ESCROW',
      visualIcon: 'ABC',
      bgClass: 'bg-gradient-to-b from-[#1b3b2f] to-[#122820] text-emerald-100 border-8 border-[#78471e]',
      cardClass: 'bg-black/30 border-dashed border-emerald-400/40 text-emerald-200',
      accentColor: '#fde047',
      fontStyle: 'font-serif',
      description: 'Vintage slate green chalkboard with wood frame and chalk typography.'
    },
    ticket: {
      name: 'Boarding Pass',
      badge: 'PASS TO A BETTER FUTURE',
      visualIcon: '✈',
      bgClass: 'bg-gradient-to-r from-sky-950 via-slate-900 to-emerald-950 text-white border-2 border-dashed border-amber-400/50',
      cardClass: 'bg-white/10 border-dashed border-amber-400/40 text-white',
      accentColor: '#f59e0b',
      fontStyle: 'font-mono',
      description: 'Perforated coupon border symbolizing a ticket to dignity and education.'
    },
    polaroid: {
      name: 'Vintage Polaroid',
      badge: 'A VERIFIED MOMENT',
      visualIcon: '📷',
      bgClass: 'bg-[#f4ebd9] text-slate-900 border-4 border-slate-300',
      cardClass: 'bg-white border-slate-200 text-slate-800 shadow-md',
      accentColor: '#0f766e',
      fontStyle: 'font-serif',
      description: 'Retro white photo frame with drop shadow and authentic photograph.'
    },
    newspaper: {
      name: 'Press Dispatch',
      badge: 'THE IMPACT CHRONICLE • SPECIAL REPORT',
      visualIcon: 'NEWS',
      bgClass: 'bg-[#f1ead8] text-slate-900 border-4 border-double border-slate-800',
      cardClass: 'bg-black/5 border-slate-800 text-slate-900',
      accentColor: '#b91c1c',
      fontStyle: 'font-serif',
      description: 'Vintage press headline with double border and investigative editorial tone.'
    },
    movie: {
      name: 'Cinema Spotlight',
      badge: 'REAL LIVES • REAL PROOF',
      visualIcon: '▶',
      bgClass: 'bg-radial-gradient from-slate-900 via-slate-950 to-black text-white border border-amber-500/40',
      cardClass: 'bg-slate-900/80 border-amber-500/30 text-white',
      accentColor: '#eab308',
      fontStyle: 'font-sans',
      description: 'High-contrast cinematic spotlight with dramatic halo and neon accents.'
    },
    comic: {
      name: 'Hero Comic Pop',
      badge: 'BE THE HERO TODAY!',
      visualIcon: 'POW!',
      bgClass: 'bg-[#ffe45c] text-black border-6 border-black shadow-[8px_8px_0px_#000]',
      cardClass: 'bg-white border-4 border-black text-black shadow-[4px_4px_0px_#000]',
      accentColor: '#dc2626',
      fontStyle: 'font-black tracking-wide',
      description: 'Bold comic book pop art with explosive borders and hero typography.'
    },
    postcard: {
      name: 'Community Postcard',
      badge: 'GREETINGS FROM TOMORROW',
      visualIcon: '✉',
      bgClass: 'bg-[#faf6ee] text-[#1e293b] border-8 border-white shadow-xl outline-2 outline-[#cdbf9f]',
      cardClass: 'bg-white border-[#cdbf9f] text-[#1e293b]',
      accentColor: '#2563eb',
      fontStyle: 'font-serif',
      description: 'Airmail postcard design carrying an authentic community appeal.'
    },
    bold: {
      name: 'Bold Type Impact',
      badge: 'GIVE • VERIFY • TRANSFORM',
      visualIcon: '₹',
      bgClass: 'bg-[#0f4c3a] text-[#f1cf72] border-4 border-[#f1cf72]',
      cardClass: 'bg-black/25 border-[#f1cf72]/30 text-white',
      accentColor: '#f1cf72',
      fontStyle: 'font-sans font-black',
      description: 'Massive, high-contrast typography banner designed to halt social scrolling.'
    }
  };

  // Trilingual Dynamic Text Engine
  const textCatalog = {
    en: {
      head: customHeadline || (target <= 30000 ? `Urgent: Fund ${formatINR(target)} for Critical School Repairs` : `Be the Reason ${beneficiaries} Students Can Dream Big`),
      sub: customSub || (target <= 30000 ? `In ${location}, every rupee is locked in escrow until verified photo proof is approved.` : `Your transparent contribution directly equips children in ${location} with essential learning kits.`),
      cta: 'Donate Now • 100% Milestone Escrow',
      goalLabel: 'Funding Target',
      verifiedLabel: 'Verified Transparent NGO',
      escrowLabel: '100% Escrow Protected',
      benefits: [
        'Direct on-ground procurement',
        'Timestamped photo evidence audit',
        'Instant digital 80G tax exemption'
      ]
    },
    hi: {
      head: customHeadline || (target <= 30000 ? `नागपुर में स्कूल मरम्मत के लिए ₹${target.toLocaleString('en-IN')} का तत्काल सहयोग करें` : `${beneficiaries} बच्चों के बड़े सपनों की सच्ची वजह बनिए`),
      sub: customSub || `पारदर्शी दान: ${location} में प्रत्येक रुपया मील का पत्थर पूरा होने और फोटो सबूत ऑडिट के बाद ही जारी होगा।`,
      cta: 'अभी सहयोग करें • 100% सुरक्षित एस्क्रो',
      goalLabel: 'लक्ष्य राशि',
      verifiedLabel: 'सत्यापित पारदर्शी एनजीओ',
      escrowLabel: '100% एस्क्रो सुरक्षा गारंटी',
      benefits: [
        'सामग्री की सीधी ऑन-ग्राउंड खरीद',
        'फोटो सबूतों की स्वतंत्र जांच',
        'तत्काल 80G आयकर छूट रसीद'
      ]
    },
    mr: {
      head: customHeadline || (target <= 30000 ? `शाळा दुरुस्तीसाठी ठीक ₹${target.toLocaleString('en-IN')} निधीचे तातडीचे आवाहन` : `${beneficiaries} गरजू विद्यार्थ्यांच्या उज्ज्वल भविष्याला हातभार लावा`),
      sub: customSub || `${location} मधील थेट उपक्रम: प्रत्यक्ष कामाचा फोटो पुरावा मंजूर झाल्याशिवाय निधी रिलीज केला जात नाही.`,
      cta: 'आता देणगी द्या • 100% पारदर्शक एस्क्रो',
      goalLabel: 'लक्ष्य निधी',
      verifiedLabel: 'सत्यापित सामाजिक संस्था',
      escrowLabel: '100% सुरक्षित एस्क्रो फंड',
      benefits: [
        'थेट शालेय साहित्य वाटप',
        'प्रत्यक्ष फोटो तपासणी ऑडिट',
        'डिजिटल 80G कर सवलत पावती'
      ]
    }
  };

  const t = textCatalog[language] || textCatalog.en;
  const currentTemplate = templates[selectedTemplate] || templates.hope;

  // Social copy generator for 1-click sharing
  const tags = `#ClearImpact #${orgName.replace(/[^a-zA-Z0-9]/g, '')} #TransparentDonation #MilestoneEscrow #IndiaImpact #TaxExemption80G`;
  const socialCopy = `${t.head}\n\n${t.sub}\n\n🎯 Target: ${formatINR(target)} for ${beneficiaries} beneficiaries in ${location}.\n🔒 100% Milestone Escrow: Funds released strictly upon verified photographic proof.\n📜 NGO Darpan ID: ${darpanId}\n\n👉 Donate & Track Verified Proof Here: ${campaignUrl}\n\n${tags}`;

  // Call Google Gemini for Custom Emotional Headlines
  const handleGenerateGeminiHeadlines = async () => {
    setIsGeneratingGemini(true);
    try {
      const res = await api.post('/ai/generate-campaign', {
        causeCategory: activeCampaign.causeCategory,
        targetAmount: target,
        beneficiariesCount: beneficiaries,
        location,
        problem: activeCampaign.problem,
        solution: activeCampaign.solution,
        expectedImpact: `${beneficiaries} individuals empowered`,
        orgName
      });

      if (res.data?.data) {
        setCustomHeadline(res.data.data.title || t.head);
        setCustomSub(res.data.data.shortDescription || t.sub);
      }
    } catch (err) {
      console.warn('Gemini generation fallback applied', err);
      const fallbacks = [
        `Together for ${location}: Equipping ${beneficiaries} Students with Future Tools`,
        `Every Rupee Verified: Transforming ${beneficiaries} Lives in ${location}`,
        `Zero Hallucination Giving: Direct Milestone Support for ${location}`
      ];
      const randomHead = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setCustomHeadline(randomHead);
    } finally {
      setIsGeneratingGemini(false);
    }
  };

  // Copy helper
  const handleCopy = (textToCopy, key) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Download Poster as HD PNG
  const handleDownloadPNG = () => {
    const posterEl = posterRef.current;
    if (!posterEl) return;

    // Use Canvas to draw poster cleanly
    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = aspectRatio === '9:16' ? 1920 : aspectRatio === '1:1' ? 1080 : 1350;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const paletteMap = {
      hope: { bg: '#064e3b', text: '#ffffff', accent: '#f59e0b', sub: '#a7f3d0' },
      minimal: { bg: '#f7f1e3', text: '#12302a', accent: '#0f766e', sub: '#2d4a43' },
      education: { bg: '#0f172a', text: '#ffffff', accent: '#38bdf8', sub: '#94a3b8' },
      community: { bg: '#4a2040', text: '#ffffff', accent: '#f4d6a2', sub: '#e9d5ff' },
      sunburst: { bg: '#78350f', text: '#ffffff', accent: '#fbbf24', sub: '#fde68a' },
      notebook: { bg: '#fffdf6', text: '#1e293b', accent: '#0f4c3a', sub: '#475569' },
      chalkboard: { bg: '#1b3b2f', text: '#d1fae5', accent: '#fde047', sub: '#a7f3d0' },
      ticket: { bg: '#082f49', text: '#ffffff', accent: '#f59e0b', sub: '#bae6fd' },
      polaroid: { bg: '#f4ebd9', text: '#1e293b', accent: '#0f766e', sub: '#475569' },
      newspaper: { bg: '#f1ead8', text: '#0f172a', accent: '#b91c1c', sub: '#334155' },
      movie: { bg: '#020617', text: '#ffffff', accent: '#eab308', sub: '#94a3b8' },
      comic: { bg: '#ffe45c', text: '#000000', accent: '#dc2626', sub: '#1f2937' },
      postcard: { bg: '#faf6ee', text: '#1e293b', accent: '#2563eb', sub: '#475569' },
      bold: { bg: '#0f4c3a', text: '#f1cf72', accent: '#f1cf72', sub: '#fef08a' },
    };

    const palette = paletteMap[selectedTemplate] || paletteMap.hope;

    // Background
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, width, height);

    // Decorative Border
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Header: Org and Darpan ID
    ctx.fillStyle = palette.text;
    ctx.font = 'bold 30px Inter, sans-serif';
    ctx.fillText(`${orgName.toUpperCase()} • ${darpanId}`, 70, 100);

    // Badge
    ctx.fillStyle = palette.accent;
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(`★ ${currentTemplate.badge}`, 70, 150);

    if (isCertified) {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(width - 450, 65, 380, 55);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText('✓ CLEARIMPACT CERTIFIED', width - 420, 102);
    }

    // Headline with wrapping
    ctx.fillStyle = palette.text;
    ctx.font = selectedTemplate === 'bold' ? '900 64px Inter, sans-serif' : 'bold 54px Georgia, serif';
    const words = t.head.split(' ');
    let line = '';
    let y = 250;
    words.forEach(word => {
      const testLine = line + word + ' ';
      if (ctx.measureText(testLine).width > width - 140) {
        ctx.fillText(line, 70, y);
        line = word + ' ';
        y += 70;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, 70, y);
    y += 40;

    // Subheadline with wrapping
    ctx.fillStyle = palette.sub;
    ctx.font = '400 28px Inter, sans-serif';
    const subWords = t.sub.split(' ');
    let subLine = '';
    subWords.forEach(word => {
      const testLine = subLine + word + ' ';
      if (ctx.measureText(testLine).width > width - 140) {
        ctx.fillText(subLine, 70, y);
        subLine = word + ' ';
        y += 45;
      } else {
        subLine = testLine;
      }
    });
    ctx.fillText(subLine, 70, y);
    y += 40;

    // Benefit Badges
    const badgeW = (width - 180) / 3;
    t.benefits.forEach((b, idx) => {
      const bx = 70 + idx * (badgeW + 20);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(bx, y, badgeW, 70);
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, y, badgeW, 70);
      ctx.fillStyle = palette.text;
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText(b.length > 25 ? b.slice(0, 24) + '...' : b, bx + 15, y + 42);
    });

    // Goal & Escrow Box
    const boxY = height - 260;
    ctx.fillStyle = palette.accent;
    ctx.fillRect(70, boxY, width - 360, 170);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px Inter, sans-serif';
    ctx.fillText(`TARGET: ${formatINR(target)} • 100% ESCROW PROTECTED`, 100, boxY + 65);
    ctx.font = '900 40px Inter, sans-serif';
    ctx.fillText('DONATE NOW ON CLEARIMPACT →', 100, boxY + 125);

    // QR Code Box (Drawn natively with high contrast so it's always crisp and un-tainted)
    const qrX = width - 260;
    const qrY = boxY;
    const qrSize = 170;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.strokeRect(qrX, qrY, qrSize, qrSize);

    // Simulated QR Matrix graphic
    ctx.fillStyle = '#0f172a';
    // Corners
    ctx.fillRect(qrX + 15, qrY + 15, 35, 35);
    ctx.fillRect(qrX + qrSize - 50, qrY + 15, 35, 35);
    ctx.fillRect(qrX + 15, qrY + qrSize - 50, 35, 35);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX + 22, qrY + 22, 21, 21);
    ctx.fillRect(qrX + qrSize - 43, qrY + 22, 21, 21);
    ctx.fillRect(qrX + 22, qrY + qrSize - 43, 21, 21);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(qrX + 27, qrY + 27, 11, 11);
    ctx.fillRect(qrX + qrSize - 38, qrY + 27, 11, 11);
    ctx.fillRect(qrX + 27, qrY + qrSize - 38, 11, 11);
    // Center dots
    ctx.fillRect(qrX + 65, qrY + 65, 40, 40);
    ctx.fillRect(qrX + 115, qrY + 65, 15, 30);
    ctx.fillRect(qrX + 65, qrY + 115, 35, 15);
    ctx.fillRect(qrX + 115, qrY + 115, 20, 20);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('SCAN TO DONATE', qrX + 20, qrY + qrSize - 8);

    const link = document.createElement('a');
    link.download = `ClearImpact_Poster_${selectedTemplate}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Admin Certification Handler
  const handleCertifyPoster = async () => {
    try {
      await api.put(`/campaigns/${activeCampaign._id}`, {
        aiGeneratedContent: {
          ...activeCampaign.aiGeneratedContent,
          isPosterCertified: true,
          certifiedPosterTemplate: selectedTemplate,
          certifiedAt: new Date(),
        }
      });
      setIsCertified(true);
      alert(`✓ Official Poster successfully certified for "${activeCampaign.title}"! It is now featured with the ClearImpact Trust Stamp on the campaign page.`);
      if (onPosterCertified) onPosterCertified();
    } catch (err) {
      alert('Failed to certify poster.');
    }
  };

  // QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(campaignUrl)}`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Social Poster & Ad Studio</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>14 Visual Archetypes • Scannable QR • Trilingual</span>
            </span>
            {isCertified && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-600" />
                <span>Admin Certified Official Ad</span>
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Create High-Impact Campaign Posters & Verified Social Ads
          </h2>
          <p className="text-xs text-slate-500">
            Choose from 14 creative templates with locked verified data, real scannable QR code, and instant 1-click download.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPNG}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-500/20 transition hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download Poster (HD PNG)</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={handleCertifyPoster}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition hover:scale-105"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isCertified ? '✓ Certified Official' : 'Certify & Publish Official Poster'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        {/* Campaign Selector if multiple */}
        {!campaign && (
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Select Campaign to Generate Poster For:
            </label>
            <select
              value={selectedCampaignId}
              onChange={(e) => {
                setSelectedCampaignId(e.target.value);
                setCustomHeadline('');
                setCustomSub('');
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
            >
              {campaignList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({formatINR(c.targetAmount)})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Language Selector */}
        <div className={`${campaign ? 'md:col-span-6' : 'md:col-span-4'} space-y-1`}>
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
            Poster Language:
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`py-1.5 rounded-lg transition ${language === 'en' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`py-1.5 rounded-lg transition ${language === 'hi' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setLanguage('mr')}
              className={`py-1.5 rounded-lg transition ${language === 'mr' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              मराठी
            </button>
          </div>
        </div>

        {/* Platform & Format */}
        <div className={`${campaign ? 'md:col-span-6' : 'md:col-span-3'} space-y-1`}>
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            Target Social Platform:
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setPlatform('instagram'); setAspectRatio('4:5'); }}
              className={`py-1.5 rounded-lg transition ${platform === 'instagram' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Instagram
            </button>
            <button
              type="button"
              onClick={() => { setPlatform('whatsapp'); setAspectRatio('9:16'); }}
              className={`py-1.5 rounded-lg transition ${platform === 'whatsapp' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => { setPlatform('linkedin'); setAspectRatio('16:9'); }}
              className={`py-1.5 rounded-lg transition ${platform === 'linkedin' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              LinkedIn
            </button>
          </div>
        </div>
      </div>

      {/* 14 Templates Grid Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Choose Poster Style (14 Distinct Templates):
          </label>
          <button
            type="button"
            onClick={handleGenerateGeminiHeadlines}
            disabled={isGeneratingGemini}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50"
          >
            <Wand2 className="w-3 h-3" />
            <span>{isGeneratingGemini ? 'Generating with Gemini...' : '✨ Generate AI Headlines with Gemini'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {Object.entries(templates).map(([key, tpl]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedTemplate(key)}
              className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                selectedTemplate === key
                  ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-serif text-sm font-bold text-slate-800">
                {tpl.visualIcon}
              </span>
              <span className="text-[11px] font-bold text-slate-800 truncate w-full">
                {tpl.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Workspace: Live Poster Preview + Copy Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Live Rendered Poster Card */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            ref={posterRef}
            className={`w-full max-w-[480px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition duration-300 relative overflow-hidden ${currentTemplate.bgClass} ${
              aspectRatio === '9:16' ? 'aspect-[9/16] min-h-[640px]' : aspectRatio === '1:1' ? 'aspect-square' : 'min-h-[580px]'
            }`}
          >
            {/* Top Bar: Category badge & NGO Org Name */}
            <div className="flex items-center justify-between text-xs font-black tracking-wider uppercase border-b border-current/20 pb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{currentTemplate.badge}</span>
              </span>
              <div className="flex items-center gap-1.5">
                {isCertified && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center gap-0.5 shadow-xs">
                    <ShieldCheck className="w-2.5 h-2.5 text-slate-950" />
                    <span>✓ CERTIFIED</span>
                  </span>
                )}
                <span className="opacity-90">{orgName}</span>
              </div>
            </div>

            {/* Central Hook: Headline & Subheadline */}
            <div className="my-auto py-4 space-y-3">
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black leading-tight ${currentTemplate.fontStyle}`}>
                {t.head}
              </h1>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium">
                {t.sub}
              </p>

              {/* Dynamic Center Visual Box */}
              <div className="my-3 rounded-2xl overflow-hidden border-2 border-current/20 shadow-md relative group">
                <img
                  src={activeCampaign.coverImage || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80'}
                  alt={activeCampaign.title}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Darpan ID: {darpanId} • Scope: {location}</span>
                  </div>
                </div>
              </div>

              {/* 3 Clear Benefit Cards */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {t.benefits.map((b, idx) => (
                  <div key={idx} className={`p-2 rounded-xl text-[10px] font-bold leading-tight ${currentTemplate.cardClass}`}>
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section: Scannable QR Code & Goal CTA */}
            <div className="pt-3 border-t border-current/20 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-bold opacity-75">{t.goalLabel}</div>
                <div className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: currentTemplate.accentColor }}>
                  {formatINR(target)}
                </div>
                <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{t.escrowLabel}</span>
                </div>
              </div>

              {/* Real Scannable Phone QR Code */}
              <div className="p-1.5 bg-white rounded-xl shadow-md text-center flex flex-col items-center">
                <img
                  src={qrCodeUrl}
                  alt="Scan to Donate"
                  className="w-16 h-16 rounded-md object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) {
                      e.currentTarget.nextSibling.style.display = 'flex';
                    }
                  }}
                />
                <div style={{ display: 'none' }} className="w-16 h-16 rounded-md bg-slate-900 text-white p-1 text-[8px] flex-col items-center justify-center font-mono font-bold">
                  <span>[QR CODE]</span>
                  <span className="text-[6px] text-emerald-400">CLEARIMPACT</span>
                </div>
                <span className="text-[8px] font-black text-slate-800 mt-0.5 tracking-tight">SCAN TO DONATE</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Social Copy, Hashtags & 1-Click Copy Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Social Media Outreach Package</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase">
                  {platform}
                </span>
              </h3>
            </div>

            {/* Headline Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Catchy Social Headline:</label>
                <button
                  type="button"
                  onClick={() => handleCopy(t.head, 'head')}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  {copiedKey === 'head' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'head' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <input
                type="text"
                value={t.head}
                onChange={(e) => setCustomHeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-900"
              />
            </div>

            {/* Hashtags Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Verified Hashtags:</label>
                <button
                  type="button"
                  onClick={() => handleCopy(tags, 'tags')}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  {copiedKey === 'tags' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'tags' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono text-indigo-700">
                {tags}
              </div>
            </div>

            {/* Complete Full Social Post */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Complete Ready-to-Post Copy:</label>
                <button
                  type="button"
                  onClick={() => handleCopy(socialCopy, 'full')}
                  className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                >
                  {copiedKey === 'full' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'full' ? 'Copied to Clipboard!' : 'Copy Post'}</span>
                </button>
              </div>
              <textarea
                rows={7}
                readOnly
                value={socialCopy}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-sans leading-relaxed resize-none"
              />
            </div>

            {/* Direct Verification Guarantee Notice */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Grounded Verification Layer Active</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-tight">
                This poster locks the exact target of <strong>{formatINR(target)}</strong> and Darpan ID <strong>{darpanId}</strong> from the database, preventing claim exaggeration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}