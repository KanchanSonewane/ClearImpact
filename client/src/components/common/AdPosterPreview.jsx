import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Download,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ShieldCheck,
  Target,
  Users,
  MapPin,
  Lock,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { formatINR } from '../../utils/helpers';

export default function AdPosterPreview({ campaign }) {
  // 3 Distinct Templates: 'URGENT' | 'MILESTONE_BREAKDOWN' | 'BENEFICIARY_STORY'
  const [selectedTemplate, setSelectedTemplate] = useState('URGENT');

  // Ad Modes: 'STATIC_POSTER' | 'ANIMATED_REEL'
  const [adMode, setAdMode] = useState('STATIC_POSTER');

  // Aspect Ratio: '9:16' (Story/Reel) | '1:1' (Square) | '16:9' (Landscape)
  const [aspectRatio, setAspectRatio] = useState('9:16');

  // Motion Reel Playback State (0 to 30 seconds)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioContextRef = useRef(null);

  // Extract campaign data
  const title = campaign?.title || 'Urgent Funding Needed for Critical School Maintenance';
  const location = campaign?.location || 'Nagpur, Maharashtra';
  const target = Number(campaign?.targetAmount || 20000);
  const beneficiaries = Number(campaign?.beneficiariesCount || 150);
  const orgName = campaign?.ngoId?.orgName || campaign?.orgName || 'Vidya Foundation';
  const problem = campaign?.problem || 'Essential facilities require immediate repair to prevent interruptions for students.';
  const solution = campaign?.solution || 'Procure and install necessary maintenance parts and verified filters.';
  const coverImage = campaign?.coverImage || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80';

  // 30-Second Motion Reel Timer
  useEffect(() => {
    let interval = null;
    if (isPlaying && adMode === 'ANIMATED_REEL') {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 30) {
            setIsPlaying(false);
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, adMode]);

  // Web Audio Synthesized Soundtrack for Motion Reel
  const playAmbientTone = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      // Audio autoplay policy
    }
  };

  const handleTogglePlay = () => {
    if (currentTime >= 30) {
      setCurrentTime(0);
    }
    if (!isPlaying && isAudioEnabled) {
      playAmbientTone();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handlePrintExport = () => {
    window.print();
  };

  // Determine current active scene for 30s Motion Reel (0-6s, 7-13s, 14-20s, 21-25s, 26-30s)
  let activeScene = 1;
  if (currentTime > 25) activeScene = 5;
  else if (currentTime > 20) activeScene = 4;
  else if (currentTime > 13) activeScene = 3;
  else if (currentTime > 6) activeScene = 2;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Automated Dynamic Fundraising Ad</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Platform-Certified (Locked Facts)</span>
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900">
            Fundraising Campaign Advertisement Studio
          </h3>
          <p className="text-xs text-slate-500">
            Automatically customized to this specific topic, budget ({formatINR(target)}), and location.
          </p>
        </div>

        {/* Export Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintExport}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export / Download Ad</span>
          </button>
        </div>
      </div>

      {/* Template Selector Bar (3 Dedicated Templates) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          1. Choose Fundraising Template
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setSelectedTemplate('URGENT')}
            className={`p-3.5 rounded-2xl border text-left transition ${
              selectedTemplate === 'URGENT'
                ? 'border-red-500 bg-red-50/70 ring-2 ring-red-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-red-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Template 1: Urgent Need
              </span>
              <span className="text-[9px] font-bold bg-red-200 text-red-800 px-1.5 py-0.2 rounded">Fast Funding</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Emergency & maintenance focus. High-contrast target budget pill with immediate community action.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTemplate('MILESTONE_BREAKDOWN')}
            className={`p-3.5 rounded-2xl border text-left transition ${
              selectedTemplate === 'MILESTONE_BREAKDOWN'
                ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-brand-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Template 2: Milestone Breakdown
              </span>
              <span className="text-[9px] font-bold bg-brand-200 text-brand-800 px-1.5 py-0.2 rounded">Financial Trust</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Itemized rupee-by-rupee breakdown showing where every rupee goes with milestone escrow guarantee.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTemplate('BENEFICIARY_STORY')}
            className={`p-3.5 rounded-2xl border text-left transition ${
              selectedTemplate === 'BENEFICIARY_STORY'
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Template 3: Beneficiary Story
              </span>
              <span className="text-[9px] font-bold bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded">Human Impact</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Human-centric photo spotlight with personal transformation outcome and direct giving appeal.
            </p>
          </button>
        </div>
      </div>

      {/* Mode & Format Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
        {/* Ad Mode Switcher */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Display Mode:</span>
          <div className="p-0.5 bg-slate-200 rounded-xl flex">
            <button
              type="button"
              onClick={() => { setAdMode('STATIC_POSTER'); setIsPlaying(false); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                adMode === 'STATIC_POSTER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Static Social Poster
            </button>
            <button
              type="button"
              onClick={() => { setAdMode('ANIMATED_REEL'); setCurrentTime(0); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                adMode === 'ANIMATED_REEL' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-3 h-3" />
              <span>30-Sec Motion Reel</span>
            </button>
          </div>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Format:</span>
          <div className="p-0.5 bg-slate-200 rounded-xl flex text-[11px]">
            <button
              type="button"
              onClick={() => setAspectRatio('9:16')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                aspectRatio === '9:16' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              9:16 (Story/Reel)
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio('1:1')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                aspectRatio === '1:1' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              1:1 (Post)
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio('16:9')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                aspectRatio === '16:9' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              16:9 (Landscape)
            </button>
          </div>
        </div>
      </div>

      {/* 30-Sec Motion Reel Playback Controller (Visible only in Reel Mode) */}
      {adMode === 'ANIMATED_REEL' && (
        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-9 h-9 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center font-bold shadow-md transition"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-white rounded-lg transition"
                title="Restart Reel"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="text-xs font-mono font-bold">
                0:{currentTime < 10 ? `0${currentTime}` : currentTime} <span className="text-slate-500">/ 0:30</span>
              </div>
            </div>

            {/* Scene Indicators */}
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold">
              {[
                { s: 1, label: 'Problem Hook' },
                { s: 2, label: 'Beneficiaries' },
                { s: 3, label: 'Solution' },
                { s: 4, label: 'Escrow Proof' },
                { s: 5, label: 'Donate CTA' },
              ].map((item) => (
                <span
                  key={item.s}
                  className={`px-2 py-0.5 rounded-md transition ${
                    activeScene === item.s ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              ))}
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-1.5 rounded-lg transition ${
                isAudioEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle audio tone narration"
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Progress Timeline Scrubber */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-500 h-full transition-all duration-300"
              style={{ width: `${(currentTime / 30) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* AD CONTAINER PREVIEW */}
      <div className="flex justify-center py-4 bg-slate-100 rounded-3xl overflow-hidden p-4">
        <div
          className={`relative overflow-hidden shadow-2xl bg-slate-950 text-white flex flex-col justify-between border-4 border-slate-900 transition-all duration-300 ${
            aspectRatio === '9:16'
              ? 'w-full max-w-sm aspect-9/16 rounded-3xl'
              : aspectRatio === '1:1'
              ? 'w-full max-w-md aspect-square rounded-3xl'
              : 'w-full max-w-2xl aspect-16/9 rounded-3xl'
          }`}
        >
          {/* Background Image with animated zoom in Reel mode */}
          <div className="absolute inset-0 z-0">
            <img
              src={coverImage}
              alt="Campaign"
              className={`w-full h-full object-cover opacity-35 transition-transform duration-1000 ${
                isPlaying ? 'scale-110' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />
          </div>

          {/* Top Header / Platform Security Seal */}
          <div className="relative z-10 p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center font-black text-white text-xs">
                CI
              </div>
              <div>
                <span className="text-[11px] font-black tracking-wider text-white">CLEARIMPACT</span>
                <span className="block text-[8px] text-indigo-300 font-semibold uppercase">Platform-Verified Ad</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>100% Escrow Escrow</span>
            </div>
          </div>

          {/* DYNAMIC CONTENT BASED ON SELECTED TEMPLATE & MOTION SCENE */}
          <div className="relative z-10 px-5 space-y-3.5 my-auto">
            {/* Location Tag */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-medium text-slate-300">
              <MapPin className="w-3 h-3 text-brand-400" />
              <span>{location}</span>
            </div>

            {/* TEMPLATE 1: URGENT NEED */}
            {selectedTemplate === 'URGENT' && (
              <div className="space-y-3 animate-fade-in">
                <div className="inline-block px-3 py-1 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg">
                  🚨 URGENT FUNDRAISING CALL
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                  {title}
                </h2>

                <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-2xl backdrop-blur-md">
                  <div className="text-[10px] uppercase font-bold text-red-300">Exact Target Needed</div>
                  <div className="text-2xl font-black text-white mt-0.5">
                    {formatINR(target)}
                  </div>
                  <div className="text-[11px] text-red-200 mt-1">
                    Direct Impact: <strong>{beneficiaries}</strong> individuals in {location}
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {problem}
                </p>
              </div>
            )}

            {/* TEMPLATE 2: MILESTONE BREAKDOWN */}
            {selectedTemplate === 'MILESTONE_BREAKDOWN' && (
              <div className="space-y-3 animate-fade-in">
                <div className="inline-block px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-wider">
                  🔒 MILESTONE-PROTECTED FUNDRAISING
                </div>

                <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {title}
                </h2>

                {/* Rupee-by-rupee itemized breakdown */}
                <div className="bg-slate-900/90 border border-indigo-500/30 p-3 rounded-2xl backdrop-blur-md space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-indigo-300 border-b border-slate-800 pb-1">
                    <span>Target Budget: {formatINR(target)}</span>
                    <span className="text-[10px] text-emerald-400">Escrow Locked</span>
                  </div>
                  <div className="text-[11px] space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span>• Milestone 1: Physical Materials</span>
                      <span className="font-mono text-white font-bold">{formatINR(Math.round(target * 0.5))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Milestone 2: On-Ground Implementation</span>
                      <span className="font-mono text-white font-bold">{formatINR(Math.round(target * 0.5))}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    Funds released ONLY after photographic & invoice audit.
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 3: BENEFICIARY STORY */}
            {selectedTemplate === 'BENEFICIARY_STORY' && (
              <div className="space-y-3 animate-fade-in">
                <div className="inline-block px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider">
                  🌱 COMMUNITY TRANSFORMATION
                </div>

                <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                  What {formatINR(target)} Means for {beneficiaries} Beneficiaries
                </h2>

                <div className="p-3 bg-emerald-950/70 border border-emerald-500/30 rounded-2xl backdrop-blur-md">
                  <p className="text-xs text-emerald-100 italic leading-relaxed">
                    "{solution}"
                  </p>
                  <div className="text-[10px] text-emerald-300 mt-2 font-bold flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>Serving {beneficiaries} verified community members</span>
                  </div>
                </div>
              </div>
            )}

            {/* Reel Active Scene Subtitle Bar (If in motion mode) */}
            {adMode === 'ANIMATED_REEL' && (
              <div className="p-2 bg-slate-900/90 rounded-xl border border-white/20 text-center text-xs font-bold text-amber-300 animate-pulse">
                {activeScene === 1 && `🚨 Scene 1: The Urgent Need in ${location}`}
                {activeScene === 2 && `👥 Scene 2: Reaching ${beneficiaries} Direct Beneficiaries`}
                {activeScene === 3 && `🎯 Scene 3: Dedicated Budget: ${formatINR(target)}`}
                {activeScene === 4 && `🔒 Scene 4: 100% Locked in ClearImpact Escrow`}
                {activeScene === 5 && `❤️ Scene 5: Donate Now & Get 80G Tax Exemption`}
              </div>
            )}
          </div>

          {/* Bottom CTA Bar */}
          <div className="relative z-10 p-5 pt-2">
            <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl p-3 flex items-center justify-between shadow-xl">
              <div>
                <span className="block text-[9px] uppercase font-bold text-indigo-200">
                  Organized by {orgName}
                </span>
                <span className="text-xs font-black text-white">
                  Donate on ClearImpact
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white text-brand-900 text-[11px] font-black shadow-xs flex items-center gap-1">
                <span>Donate Now</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Cryptographic Certification Stamp */}
            <div className="text-center text-[9px] text-slate-400 mt-2 flex items-center justify-center gap-1 font-mono">
              <Lock className="w-2.5 h-2.5 text-emerald-400" />
              <span>CI-CERTIFIED-CAMPAIGN • 80G TAX EXEMPT • VERIFIED ESCROW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
