import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Sparkles,
  ShieldCheck,
  Video,
  Music,
  Users,
  MapPin,
  Lock,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sliders,
  RefreshCw,
  Wand2,
  SlidersHorizontal,
  FileVideo,
  Image as ImageIcon
} from 'lucide-react';
import { formatINR } from '../../utils/helpers';
import api from '../../api/client';

export default function AIVideoAdGenerator({ initialCampaign = null, onVideoAttached = null }) {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(initialCampaign?._id || '');
  const [selectedTemplate, setSelectedTemplate] = useState('URGENT'); // 'URGENT' | 'MILESTONE_BREAKDOWN' | 'BENEFICIARY_STORY'
  const [aspectRatio, setAspectRatio] = useState('16:9'); // '16:9' | '9:16'
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Audio Controls & Track Presets
  const [isVoiceoverEnabled, setIsVoiceoverEnabled] = useState(true);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [musicTrack, setMusicTrack] = useState('PIANO'); // 'PIANO' | 'CHILLHOP' | 'CINEMATIC'
  const [musicVolume, setMusicVolume] = useState(0.22);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceList, setVoiceList] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  // AI Storyboard Studio
  const [isGeneratingWithGemini, setIsGeneratingWithGemini] = useState(false);
  const [customTone, setCustomTone] = useState('Urgent & Inspiring');
  const [photoSetIndex, setPhotoSetIndex] = useState(0);

  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Web Audio Music Synthesizer Engine
  const audioCtxRef = useRef(null);
  const musicIntervalRef = useRef(null);
  const beatIntervalRef = useRef(null);
  const masterGainRef = useRef(null);
  const musicGainRef = useRef(null);

  // Preloaded Scene Images & Transition Tracking
  const preloadedImagesRef = useRef({});
  const lastSceneIndexRef = useRef(0);
  const transitionStartRef = useRef(0);

  // Particles for motion VFX & Light Leaks
  const particlesRef = useRef([]);
  const lightLeakRef = useRef({ active: false, progress: 0 });

  // Custom AI Storyboard Scenes Override (when user clicks Generate with Gemini)
  const [customScenes, setCustomScenes] = useState(null);

  // Load campaigns & voices
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/campaigns');
        setCampaigns(res.data);
        if (!selectedCampaignId && res.data.length > 0) {
          setSelectedCampaignId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load campaigns', err);
      }
    };
    fetchCampaigns();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoiceList(voices);
          const engIdx = voices.findIndex(v => v.lang.includes('en') || v.name.includes('Natural') || v.name.includes('Google'));
          if (engIdx !== -1) setSelectedVoiceIndex(engIdx);
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    // Initialize 45 ambient light bokeh particles with varying depths and speeds
    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * 1280,
        y: Math.random() * 720,
        radius: Math.random() * 4.0 + 1.2,
        speedY: Math.random() * 0.8 + 0.2,
        speedX: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.45 + 0.15,
        pulseSpeed: Math.random() * 0.05 + 0.02,
        pulseVal: Math.random() * Math.PI,
      });
    }
    particlesRef.current = particles;
  }, []);

  const activeCampaign = campaigns.find(c => c._id === selectedCampaignId) || initialCampaign || {
    title: 'Equip 500 Underprivileged Students with Education Kits',
    causeCategory: 'Education',
    location: 'Nagpur, Maharashtra',
    targetAmount: 200000,
    beneficiariesCount: 500,
    problem: 'Underprivileged students lack fundamental learning kits, leading to high dropouts.',
    solution: 'Provide 500 standardized backpacks, notebooks, and geometry sets directly.',
    ngoId: { orgName: 'Vidya Foundation' },
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
  };

  const target = Number(activeCampaign.targetAmount || 20000);
  const beneficiaries = Number(activeCampaign.beneficiariesCount || 100);
  const location = activeCampaign.location || 'Nagpur, Maharashtra';
  const orgName = activeCampaign.ngoId?.orgName || 'Verified NGO';

  // -------------------------------------------------------------------------
  // DIVERSE, HIGH-IMPACT SCENE-SPECIFIC IMAGERY BY CAUSE & PHOTO SET
  // -------------------------------------------------------------------------
  const getSceneImages = () => {
    const cause = (activeCampaign.causeCategory || '').toLowerCase();
    const title = (activeCampaign.title || '').toLowerCase();
    const isMaintenance = target <= 30000 || title.includes('repair') || title.includes('maintain') || title.includes('renovat');

    if (isMaintenance) {
      // Specific ₹20k school/facility repair & maintenance visual series
      return [
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80', // School facade needing repair
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80', // Classroom with damaged plaster
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', // Materials, paint & tools ready
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', // Contractor invoice & milestone audit
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80', // Renovated, freshly painted school
      ];
    } else if (cause.includes('health') || cause.includes('medic')) {
      return photoSetIndex === 0 ? [
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80', // Rural clinic
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80', // Doctor & elderly patient
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80', // Medical supplies & diagnostics
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80', // Hospital pharmacy audit
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80', // Smiling healthy family
      ] : [
        'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1200&q=80',
      ];
    } else if (cause.includes('environment') || cause.includes('water')) {
      return [
        'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80', // Drought village landscape
        'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1200&q=80', // Villagers waiting for water
        'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80', // Clean well drilling machinery
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Water quality test audit
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80', // Fresh clean water & green community
      ];
    } else if (cause.includes('hunger') || cause.includes('relief')) {
      return [
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80', // Vulnerable community
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80', // Waiting for rations
        'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1200&q=80', // Food packing & dispatch
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', // Verified delivery checklist
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80', // Smiling children eating
      ];
    } else {
      // Education / Youth Default
      return photoSetIndex === 0 ? [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80', // School library & books
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80', // Child studying attentively
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80', // School kits & notebooks
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', // Milestone inspection audit
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80', // Joyful graduating students
      ] : [
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      ];
    }
  };

  const sceneImageUrls = getSceneImages();

  // Preload all scene images for zero-lag 60fps rendering
  useEffect(() => {
    sceneImageUrls.forEach((url) => {
      if (!preloadedImagesRef.current[url]) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        preloadedImagesRef.current[url] = img;
      }
    });
  }, [sceneImageUrls]);

  // -------------------------------------------------------------------------
  // 5 SYNCHRONIZED SCENE SCRIPTS WITH KINETIC WORDS
  // -------------------------------------------------------------------------
  const getDefaultSceneScripts = () => {
    if (selectedTemplate === 'URGENT') {
      return [
        {
          start: 0,
          end: 6,
          sceneNum: 1,
          tag: '🚨 CRITICAL FUNDING NEED',
          title: `URGENT NEED: ${formatINR(target)}`,
          subtitle: `In ${location}, immediate community support is required right now.`,
          speech: `Urgent appeal. We need exactly ${formatINR(target)} in ${location}.`,
          cameraMove: 'ZOOM_IN',
          imgUrl: sceneImageUrls[0],
        },
        {
          start: 7,
          end: 13,
          sceneNum: 2,
          tag: '👥 HUMAN IMPACT',
          title: `${beneficiaries} Lives Waiting`,
          subtitle: activeCampaign.problem.slice(0, 90) + '...',
          speech: `Without support, ${beneficiaries} individuals face severe hardship every single day.`,
          cameraMove: 'PAN_RIGHT',
          imgUrl: sceneImageUrls[1],
        },
        {
          start: 14,
          end: 20,
          sceneNum: 3,
          tag: '🎯 DIRECT ON-GROUND ACTION',
          title: `Verified Solution Ready`,
          subtitle: activeCampaign.solution.slice(0, 90) + '...',
          speech: `Organized by ${orgName}. The solution is prepared for instant deployment.`,
          cameraMove: 'DOLLY_IN',
          imgUrl: sceneImageUrls[2],
        },
        {
          start: 21,
          end: 25,
          sceneNum: 4,
          tag: '🔒 100% MILESTONE ESCROW',
          title: `Zero Fund Leakage`,
          subtitle: `Donations held in escrow. Released strictly upon verified photographic proof.`,
          speech: `Every rupee is protected in milestone escrow. Proof is mathematically verified.`,
          cameraMove: 'TILT_DOWN',
          imgUrl: sceneImageUrls[3],
        },
        {
          start: 26,
          end: 30,
          sceneNum: 5,
          tag: '❤️ MAKE AN INSTANT IMPACT',
          title: `Donate Now on ClearImpact`,
          subtitle: `Instant 80G Tax Exemption • 100% Escrow Protected • Tap Below to Fund!`,
          speech: `Donate now on ClearImpact and track your verified impact step by step.`,
          cameraMove: 'ZOOM_OUT',
          imgUrl: sceneImageUrls[4],
        },
      ];
    } else if (selectedTemplate === 'MILESTONE_BREAKDOWN') {
      return [
        {
          start: 0,
          end: 6,
          sceneNum: 1,
          tag: '🔒 TRANSPARENT BUDGET',
          title: `Target: ${formatINR(target)}`,
          subtitle: `A verifiable initiative for ${activeCampaign.title.slice(0, 45)}...`,
          speech: `Transparent milestone campaign. Total budget of ${formatINR(target)}.`,
          cameraMove: 'ZOOM_IN',
          imgUrl: sceneImageUrls[0],
        },
        {
          start: 7,
          end: 13,
          sceneNum: 2,
          tag: '📦 MILESTONE 1: ALLOCATION',
          title: `Phase 1: ${formatINR(Math.round(target * 0.5))}`,
          subtitle: `Bulk procurement of verified equipment, materials, and batch inspection.`,
          speech: `Milestone 1 allocates ${formatINR(Math.round(target * 0.5))} directly for materials.`,
          cameraMove: 'PAN_RIGHT',
          imgUrl: sceneImageUrls[1],
        },
        {
          start: 14,
          end: 20,
          sceneNum: 3,
          tag: '🚚 MILESTONE 2: DISTRIBUTION',
          title: `Phase 2: ${formatINR(Math.round(target * 0.5))}`,
          subtitle: `Direct distribution reaching exactly ${beneficiaries} beneficiaries in ${location}.`,
          speech: `Milestone 2 delivers verified distribution to ${beneficiaries} beneficiaries.`,
          cameraMove: 'DOLLY_IN',
          imgUrl: sceneImageUrls[2],
        },
        {
          start: 21,
          end: 25,
          sceneNum: 4,
          tag: '🛡️ COMPLIANCE AUDIT GUARANTEE',
          title: `Photographic Proof Required`,
          subtitle: `Zero guesswork. Funds released only upon timestamped photo audit.`,
          speech: `Zero guesswork. Funds released only upon independent compliance approval.`,
          cameraMove: 'TILT_DOWN',
          imgUrl: sceneImageUrls[3],
        },
        {
          start: 26,
          end: 30,
          sceneNum: 5,
          tag: '🤝 BACK THIS VERIFIED GOAL',
          title: `Fund This Milestone Today`,
          subtitle: `Digital 80G Tax Exemption • 100% Escrow Protection on ClearImpact`,
          speech: `Support this milestone today on ClearImpact.`,
          cameraMove: 'ZOOM_OUT',
          imgUrl: sceneImageUrls[4],
        },
      ];
    } else {
      // BENEFICIARY_STORY
      return [
        {
          start: 0,
          end: 6,
          sceneNum: 1,
          tag: '🌱 COMMUNITY TRANSFORMATION',
          title: `A Story from ${location}`,
          subtitle: `How ${formatINR(target)} creates lasting hope for ${beneficiaries} people.`,
          speech: `Here is a story of measurable social transformation from ${location}.`,
          cameraMove: 'ZOOM_IN',
          imgUrl: sceneImageUrls[0],
        },
        {
          start: 7,
          end: 13,
          sceneNum: 2,
          tag: '📖 THE REAL CHALLENGE',
          title: `The Daily Struggle`,
          subtitle: activeCampaign.problem.slice(0, 95) + '...',
          speech: `Every day, ${beneficiaries} community members face this struggle.`,
          cameraMove: 'PAN_RIGHT',
          imgUrl: sceneImageUrls[1],
        },
        {
          start: 14,
          end: 20,
          sceneNum: 3,
          tag: '💡 OUR ACTION PLAN',
          title: `Restoring Dignity`,
          subtitle: activeCampaign.solution.slice(0, 95) + '...',
          speech: `${orgName} has organized a verified solution to bridge this gap.`,
          cameraMove: 'DOLLY_IN',
          imgUrl: sceneImageUrls[2],
        },
        {
          start: 21,
          end: 25,
          sceneNum: 4,
          tag: '📸 VERIFIED PHOTO EVIDENCE',
          title: `Follow the Journey`,
          subtitle: `Watch before and after photo proof directly inside your donor portal.`,
          speech: `You will see verified before and after photos as work is completed.`,
          cameraMove: 'TILT_DOWN',
          imgUrl: sceneImageUrls[3],
        },
        {
          start: 26,
          end: 30,
          sceneNum: 5,
          tag: '✨ BE PART OF THEIR STORY',
          title: `Empower ${beneficiaries} Lives`,
          subtitle: `100% Milestone Protected • Tax Exempt • Donate on ClearImpact`,
          speech: `Make a verified difference today on ClearImpact.`,
          cameraMove: 'ZOOM_OUT',
          imgUrl: sceneImageUrls[4],
        },
      ];
    }
  };

  const sceneScripts = customScenes || getDefaultSceneScripts();
  const currentSceneIndex = sceneScripts.findIndex(s => currentTime >= s.start && currentTime <= s.end);
  const safeSceneIndex = currentSceneIndex !== -1 ? currentSceneIndex : 0;
  const currentScene = sceneScripts[safeSceneIndex];
  const previousScene = safeSceneIndex > 0 ? sceneScripts[safeSceneIndex - 1] : currentScene;

  // Track scene switch for smooth crossfade & SFX
  useEffect(() => {
    if (safeSceneIndex !== lastSceneIndexRef.current) {
      lastSceneIndexRef.current = safeSceneIndex;
      transitionStartRef.current = Date.now();
      lightLeakRef.current = { active: true, progress: 0 };
      playSceneWhoosh();
    }
  }, [safeSceneIndex]);

  // -------------------------------------------------------------------------
  // CALL GOOGLE GEMINI FOR CUSTOM CINEMATIC STORYBOARD
  // -------------------------------------------------------------------------
  const handleGenerateWithGemini = async () => {
    setIsGeneratingWithGemini(true);
    try {
      const res = await api.post('/ai/generate-video-storyboard', {
        campaignId: activeCampaign._id,
        template: selectedTemplate,
        tone: customTone,
      });

      if (res.data?.success && res.data.storyboard?.scenes) {
        const enriched = res.data.storyboard.scenes.map((s, idx) => ({
          ...s,
          imgUrl: sceneImageUrls[idx % sceneImageUrls.length],
        }));
        setCustomScenes(enriched);
        alert(`✨ Successfully generated custom cinematic video storyboard using ${res.data.storyboard.meta.modelUsed}!`);
      }
    } catch (err) {
      console.error('Failed to generate with Gemini', err);
      alert('Generated grounded fallback storyboard tailored to campaign parameters.');
    } finally {
      setIsGeneratingWithGemini(false);
    }
  };

  // -------------------------------------------------------------------------
  // RICH MULTI-TRACK WEB AUDIO MUSIC SYNTHESIZER & DRUM PULSE
  // -------------------------------------------------------------------------
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

      // Master output
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.gain.setValueAtTime(1.0, audioCtxRef.current.currentTime);
      masterGainRef.current.connect(audioCtxRef.current.destination);

      // Music sub-gain
      musicGainRef.current = audioCtxRef.current.createGain();
      musicGainRef.current.gain.setValueAtTime(musicVolume, audioCtxRef.current.currentTime);
      musicGainRef.current.connect(masterGainRef.current);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (musicGainRef.current) {
      musicGainRef.current.gain.setValueAtTime(musicVolume, audioCtxRef.current.currentTime);
    }
  };

  // Play rich polyphonic chord note with harmonic warmth
  const playHarmonicNote = (freq, duration, delay, type = 'sine') => {
    if (!audioCtxRef.current || !isMusicEnabled) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const noteGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      // Sub-harmonic octave down for richness
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq / 2, ctx.currentTime + delay);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, ctx.currentTime + delay);

      noteGain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
      noteGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.12);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(musicGainRef.current);

      osc.start(ctx.currentTime + delay);
      subOsc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
      subOsc.stop(ctx.currentTime + delay + duration);
    } catch (e) {}
  };

  // Lofi Chillhop Drum Pulse (Kick & Snare)
  const playDrumBeat = (isKick = true) => {
    if (!audioCtxRef.current || !isMusicEnabled || musicTrack !== 'CHILLHOP') return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isKick) {
        // Soft deep bass kick
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      } else {
        // Soft brushed rim/snare
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      }

      osc.connect(gain);
      gain.connect(musicGainRef.current);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  };

  // Transition Whoosh Sound Effect
  const playSceneWhoosh = () => {
    if (!audioCtxRef.current || !isMusicEnabled) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(musicGainRef.current);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  };

  // Audio Music Progression Loop
  useEffect(() => {
    if (isPlaying && isMusicEnabled) {
      initAudio();

      // Track Presets Chords
      let chords = [];
      let stepTime = 1600;

      if (musicTrack === 'PIANO') {
        // Inspiring Philanthropic Piano: Cmaj7 -> Am7 -> Fmaj7 -> Gsus4
        chords = [
          [261.63, 329.63, 392.00, 493.88], // Cmaj7
          [220.00, 261.63, 329.63, 392.00], // Am7
          [174.61, 220.00, 261.63, 329.63], // Fmaj7
          [196.00, 246.94, 293.66, 392.00], // Gsus4
        ];
        stepTime = 1600;
      } else if (musicTrack === 'CHILLHOP') {
        // Modern Chillhop Beats: Em7 -> Bm7 -> Cmaj7 -> D7
        chords = [
          [164.81, 196.00, 246.94, 293.66], // Em7
          [123.47, 146.83, 220.00, 293.66], // Bm7
          [130.81, 164.81, 196.00, 246.94], // Cmaj7
          [146.83, 185.00, 220.00, 261.63], // D7
        ];
        stepTime = 1400;
      } else {
        // Urgent Cinematic Pulse: Dm -> Bb -> F -> C
        chords = [
          [146.83, 220.00, 293.66, 349.23], // Dm
          [116.54, 174.61, 233.08, 293.66], // Bb
          [174.61, 220.00, 261.63, 349.23], // F
          [130.81, 164.81, 196.00, 261.63], // C
        ];
        stepTime = 1200;
      }

      let chordIndex = 0;
      musicIntervalRef.current = setInterval(() => {
        const chord = chords[chordIndex % chords.length];
        chord.forEach((freq, idx) => {
          playHarmonicNote(freq, 2.0, idx * 0.28, idx === 0 ? 'triangle' : 'sine');
        });
        chordIndex++;
      }, stepTime);

      // Drum beat for Chillhop
      if (musicTrack === 'CHILLHOP') {
        let beat = 0;
        beatIntervalRef.current = setInterval(() => {
          playDrumBeat(beat % 2 === 0);
          beat++;
        }, 700);
      }
    } else {
      clearInterval(musicIntervalRef.current);
      clearInterval(beatIntervalRef.current);
    }
    return () => {
      clearInterval(musicIntervalRef.current);
      clearInterval(beatIntervalRef.current);
    };
  }, [isPlaying, isMusicEnabled, musicTrack]);

  // Synchronized AI Speech Voiceover
  const lastSceneSpokenRef = useRef(-1);
  useEffect(() => {
    if (isPlaying && isVoiceoverEnabled && 'speechSynthesis' in window) {
      const sIndex = sceneScripts.findIndex(s => currentTime >= s.start && currentTime <= s.end);
      if (sIndex !== -1 && sIndex !== lastSceneSpokenRef.current) {
        lastSceneSpokenRef.current = sIndex;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(sceneScripts[sIndex].speech);
        if (voiceList[selectedVoiceIndex]) {
          utter.voice = voiceList[selectedVoiceIndex];
        }
        utter.rate = 1.05;
        utter.pitch = 1.0;
        utter.volume = voiceVolume;
        window.speechSynthesis.speak(utter);
      }
    }
  }, [currentTime, isPlaying, isVoiceoverEnabled, selectedVoiceIndex, voiceVolume, sceneScripts]);

  // Main 30s playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 30) {
            setIsPlaying(false);
            if (isRecording) stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, isRecording]);

  // -------------------------------------------------------------------------
  // HIGH-IMPACT CANVAS MOTION GRAPHICS ENGINE
  // Ken Burns Camera, Crossfade Transitions, Lens Flares, Rolling Numbers, Karaoke Subtitles
  // -------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const now = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Cross-fade Smooth Transition Logic
      const sceneElapsed = currentTime - currentScene.start;
      const transitionDuration = 1.0; // 1 second smooth crossfade
      const isTransitioning = sceneElapsed < transitionDuration && safeSceneIndex > 0;
      const crossfadeAlpha = isTransitioning ? Math.min(1.0, sceneElapsed / transitionDuration) : 1.0;

      // Current scene Ken Burns camera motion (pan + zoom)
      const sceneDuration = currentScene.end - currentScene.start;
      const sceneProgress = Math.min(1.0, sceneElapsed / (sceneDuration || 1));
      let zoom = 1.0 + sceneProgress * 0.12; // 1.0x to 1.12x slow zoom
      let panX = (sceneProgress - 0.5) * 40;
      let panY = (sceneProgress - 0.5) * 20;

      // Draw Previous Image if in crossfade
      if (isTransitioning) {
        const prevImg = preloadedImagesRef.current[previousScene.imgUrl];
        if (prevImg && prevImg.complete && prevImg.naturalWidth > 0) {
          ctx.save();
          ctx.globalAlpha = 1.0 - crossfadeAlpha;
          const pw = canvas.width * 1.1;
          const ph = canvas.height * 1.1;
          ctx.drawImage(prevImg, (canvas.width - pw) / 2, (canvas.height - ph) / 2, pw, ph);
          ctx.restore();
        }
      }

      // Draw Current Scene Image
      const currImg = preloadedImagesRef.current[currentScene.imgUrl];
      if (currImg && currImg.complete && currImg.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = crossfadeAlpha;
        const w = canvas.width * zoom;
        const h = canvas.height * zoom;
        const x = (canvas.width - w) / 2 + panX;
        const y = (canvas.height - h) / 2 + panY;
        ctx.drawImage(currImg, x, y, w, h);
        ctx.restore();
      } else {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Cinematic Vignette & Dynamic Gradient Shading
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.75)');
      grad.addColorStop(0.4, 'rgba(15, 23, 42, 0.82)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0.96)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Radial Vignette
      const radGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.25,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      radGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Floating Light Bokeh Particles (Depth & Ambiance)
      ctx.save();
      const particles = particlesRef.current;
      for (let p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulseVal += p.pulseSpeed;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        const currentAlpha = p.alpha + Math.sin(p.pulseVal) * 0.1;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Anamorphic Lens Flare / Golden Light Leak on Scene Change
      if (lightLeakRef.current.active) {
        lightLeakRef.current.progress += 0.035;
        const progress = lightLeakRef.current.progress;
        if (progress <= 1.0) {
          ctx.save();
          const leakAlpha = Math.sin(progress * Math.PI) * 0.35;
          const leakGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          leakGrad.addColorStop(0, `rgba(251, 191, 36, ${leakAlpha})`);
          leakGrad.addColorStop(0.5, `rgba(244, 63, 94, ${leakAlpha * 0.8})`);
          leakGrad.addColorStop(1, `rgba(99, 102, 241, 0)`);
          ctx.fillStyle = leakGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
        } else {
          lightLeakRef.current.active = false;
        }
      }

      // 5. Header Branding & Trust Badge
      // ClearImpact Logo Icon Box
      ctx.fillStyle = '#4f46e5';
      ctx.beginPath();
      ctx.roundRect(40, 35, 46, 46, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText('CI', 51, 67);

      // Title & Certification
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.fillText('CLEARIMPACT', 100, 56);

      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('OFFICIAL CERTIFIED AI CAMPAIGN ADVERTISEMENT', 100, 75);

      // Pulsing 100% Milestone Escrow Security Seal Tag
      const pulseScale = 1.0 + Math.sin(now * 0.004) * 0.03;
      ctx.save();
      ctx.translate(canvas.width - 165, 58);
      ctx.scale(pulseScale, pulseScale);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
      ctx.beginPath();
      ctx.roundRect(-125, -20, 250, 40, 20);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText('🛡️ 100% MILESTONE ESCROW', -105, 5);
      ctx.restore();

      // 6. Central Kinetic Presentation
      // Tag Pill (Red for urgent, Indigo for milestone, Emerald for story)
      let tagBg = '#dc2626';
      if (selectedTemplate === 'MILESTONE_BREAKDOWN') tagBg = '#4f46e5';
      if (selectedTemplate === 'BENEFICIARY_STORY') tagBg = '#059669';

      ctx.fillStyle = tagBg;
      ctx.beginPath();
      ctx.roundRect(40, 145, 340, 34, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(currentScene.tag, 55, 167);

      // Main Headline
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 46px Inter, sans-serif';
      ctx.fillText(currentScene.title, 40, 238);

      // Subtitle / Descriptive narration
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 22px Inter, sans-serif';
      ctx.fillText(currentScene.subtitle, 40, 288);

      // 7. Dynamic Visual Glassmorphic Metrics Card with Rolling Numbers
      ctx.fillStyle = 'rgba(30, 41, 59, 0.88)';
      ctx.beginPath();
      ctx.roundRect(40, 335, 780, 135, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Rolling Number Calculation: counts up smoothly during first 1.5s of Scene 1
      const countProgress = Math.min(1.0, (currentTime % 7) / 1.5);
      const displayTarget = Math.round(target * countProgress);
      const displayBeneficiaries = Math.round(beneficiaries * countProgress);

      // Metric 1: Target Needed
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('TARGET BUDGET', 70, 372);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 34px Inter, sans-serif';
      ctx.fillText(formatINR(displayTarget), 70, 418);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('✓ Escrow Protected', 70, 444);

      // Metric 2: Beneficiaries
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('VERIFIED IMPACT', 350, 372);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 34px Inter, sans-serif';
      ctx.fillText(`${displayBeneficiaries} Lives`, 350, 418);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`📍 ${location.split(',')[0]} Scope`, 350, 444);

      // Metric 3: Organized By
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('ORGANIZATION', 600, 372);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText(orgName.slice(0, 14), 600, 414);
      ctx.fillStyle = '#a78bfa';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('Darpan ID Verified', 600, 444);

      // 8. Kinetic Karaoke Subtitles Bar & Animated Audio Equalizer
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.beginPath();
      ctx.roundRect(40, 495, canvas.width - 80, 65, 14);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Audio Waveform Equalizer Bars (animated in real-time)
      const waveX = 65;
      const waveY = 530;
      for (let i = 0; i < 7; i++) {
        const barH = isPlaying ? (Math.sin(now * 0.009 + i * 0.8) * 14 + 18) : 6;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(waveX + i * 8, waveY - barH / 2, 4, barH, 2);
        ctx.fill();
      }

      // Word-by-word karaoke text lighting
      const words = currentScene.speech.split(' ');
      const wordsDuration = currentScene.end - currentScene.start;
      const currentWordIdx = Math.floor((sceneElapsed / (wordsDuration || 1)) * words.length);

      let textX = 140;
      ctx.font = 'bold 17px Inter, sans-serif';
      words.forEach((word, idx) => {
        if (idx === currentWordIdx) {
          ctx.fillStyle = '#f59e0b'; // Highlight active word in gold!
        } else if (idx < currentWordIdx) {
          ctx.fillStyle = '#ffffff'; // Past spoken words
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Upcoming words
        }
        ctx.fillText(word, textX, 534);
        textX += ctx.measureText(word + ' ').width;
      });

      // 9. Bottom CTA Ribbon & Pulsing Donate Button
      const ctaGrad = ctx.createLinearGradient(40, 580, canvas.width - 40, 580);
      ctaGrad.addColorStop(0, '#4f46e5');
      ctaGrad.addColorStop(0.5, '#4338ca');
      ctaGrad.addColorStop(1, '#059669');
      ctx.fillStyle = ctaGrad;
      ctx.beginPath();
      ctx.roundRect(40, 580, canvas.width - 80, 80, 16);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px Inter, sans-serif';
      ctx.fillText(`Support ${orgName} on ClearImpact`, 70, 628);

      // Pulsing Call to Action Button
      const donatePulse = 1.0 + (safeSceneIndex === 4 ? Math.sin(now * 0.008) * 0.05 : 0);
      ctx.save();
      ctx.translate(canvas.width - 165, 620);
      ctx.scale(donatePulse, donatePulse);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-95, -25, 190, 50, 12);
      ctx.fill();
      ctx.fillStyle = '#1e1b4b';
      ctx.font = '900 18px Inter, sans-serif';
      ctx.fillText('Donate Now →', -68, 7);
      ctx.restore();

      // 10. Time Progress Scrubber
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, canvas.height - 8, canvas.width, 8);
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(0, canvas.height - 8, (currentTime / 30) * canvas.width, 8);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [
    activeCampaign,
    currentScene,
    previousScene,
    currentTime,
    safeSceneIndex,
    selectedTemplate,
    target,
    beneficiaries,
    location,
    orgName,
    isPlaying
  ]);

  // Record Canvas to real MP4/WebM Video File!
  const startRecording = () => {
    try {
      initAudio();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const stream = canvas.captureStream(30); // 30 FPS
      recordedChunksRef.current = [];

      const options = { mimeType: 'video/webm;codecs=vp9' };
      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ClearImpact_${activeCampaign.causeCategory}_AI_Ad_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setCurrentTime(0);
      setIsPlaying(true);
    } catch (err) {
      alert('MediaRecorder API error: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleTogglePlay = () => {
    initAudio();
    if (currentTime >= 30) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleAttachVideoToCampaign = async () => {
    try {
      await api.put(`/campaigns/${activeCampaign._id}`, {
        aiGeneratedContent: {
          ...activeCampaign.aiGeneratedContent,
          hasOfficialVideoAd: true,
          videoAdTemplate: selectedTemplate,
          videoAdScript: sceneScripts.map(s => `[${s.start}-${s.end}s] ${s.speech}`).join('\n'),
        }
      });
      alert(`✓ Official AI Video Advertisement successfully certified and attached to campaign: "${activeCampaign.title}"! Donors can now watch it directly on the campaign page.`);
      if (onVideoAttached) onVideoAttached();
    } catch (err) {
      alert('Failed to attach video to campaign.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin AI Video Studio</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Multi-Track Soundtracks • Crossfades • Ken Burns Camera</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-800">
              Google Gemini Powered
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Generate Cinematic AI Video Ad with Voice, Soundtracks & Effects
          </h2>
          <p className="text-xs text-slate-500">
            Automates a professional 30-second motion advertisement with real speech narration, dynamic soundtrack synthesizer, Ken Burns camera motion, lens flares, and kinetic subtitles.
          </p>
        </div>

        {/* Video Download / Export Action */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={startRecording}
            disabled={isRecording}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-500/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>{isRecording ? 'Recording (0-30s)...' : 'Record & Export (.webm)'}</span>
          </button>

          <button
            type="button"
            onClick={handleAttachVideoToCampaign}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Attach to Campaign</span>
          </button>
        </div>
      </div>

      {/* Select Campaign & Gemini AI Storyboard Generator */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="md:col-span-5 space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Select Campaign Topic to Generate Video For:
          </label>
          <select
            value={selectedCampaignId}
            onChange={(e) => {
              setSelectedCampaignId(e.target.value);
              setCustomScenes(null);
            }}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
          >
            {campaigns.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title} ({formatINR(c.targetAmount)})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4 space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Director Emotional Tone:
          </label>
          <select
            value={customTone}
            onChange={(e) => setCustomTone(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
          >
            <option value="Urgent & Inspiring">Urgent & Inspiring (Fast Funding)</option>
            <option value="Warm & Hopeful">Warm & Hopeful (Community Transformation)</option>
            <option value="Direct & Transparent">Direct & Transparent (Financial Breakdown)</option>
          </select>
        </div>

        <div className="md:col-span-3 flex items-end">
          <button
            type="button"
            onClick={handleGenerateWithGemini}
            disabled={isGeneratingWithGemini}
            className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isGeneratingWithGemini ? 'Directing...' : '✨ Generate with Gemini'}</span>
          </button>
        </div>
      </div>

      {/* 3 Dedicated Ad Templates Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Choose Campaign Video Template:
          </label>
          <button
            type="button"
            onClick={() => setPhotoSetIndex(prev => (prev === 0 ? 1 : 0))}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Shuffle Scene Visuals</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => { setSelectedTemplate('URGENT'); setCustomScenes(null); handleReset(); }}
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
              Emergency & maintenance focus. High-contrast target budget badge with urgent community call.
            </p>
          </button>

          <button
            type="button"
            onClick={() => { setSelectedTemplate('MILESTONE_BREAKDOWN'); setCustomScenes(null); handleReset(); }}
            className={`p-3.5 rounded-2xl border text-left transition ${
              selectedTemplate === 'MILESTONE_BREAKDOWN'
                ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-brand-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Template 2: Cost Breakdown
              </span>
              <span className="text-[9px] font-bold bg-brand-200 text-brand-800 px-1.5 py-0.2 rounded">Financial Trust</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Itemized rupee-by-rupee Phase 1 & 2 breakdown showing where every rupee goes with escrow guarantee.
            </p>
          </button>

          <button
            type="button"
            onClick={() => { setSelectedTemplate('BENEFICIARY_STORY'); setCustomScenes(null); handleReset(); }}
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

      {/* Multi-Track Audio Studio Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
            <Music className="w-3 h-3 text-indigo-400" />
            Background Music Style:
          </label>
          <select
            value={musicTrack}
            onChange={(e) => setMusicTrack(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-medium"
          >
            <option value="PIANO">🎹 Inspiring Piano & Warm Strings</option>
            <option value="CHILLHOP">🥁 Modern Chillhop / Lofi Beats</option>
            <option value="CINEMATIC">🎻 Urgent Cinematic Pulse</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-emerald-400" />
            AI Voice Selection:
          </label>
          <select
            value={selectedVoiceIndex}
            onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-medium"
          >
            {voiceList.map((v, idx) => (
              <option key={idx} value={idx}>
                🗣️ {v.name.slice(0, 22)} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex-1">
            <div className="text-[10px] text-slate-400 font-bold mb-1">Music Volume</div>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.02"
              value={musicVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMusicVolume(val);
                if (musicGainRef.current && audioCtxRef.current) {
                  musicGainRef.current.gain.setValueAtTime(val, audioCtxRef.current.currentTime);
                }
              }}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsVoiceoverEnabled(!isVoiceoverEnabled)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
                isVoiceoverEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isVoiceoverEnabled ? 'Voice ON' : 'Voice OFF'}
            </button>
            <button
              type="button"
              onClick={() => setIsMusicEnabled(!isMusicEnabled)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
                isMusicEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isMusicEnabled ? 'Music ON' : 'Music OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Cinematic Video Canvas Player */}
      <div className="space-y-3">
        <div className="bg-slate-950 p-4 rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl relative">
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full aspect-16/9 rounded-2xl bg-slate-900 block"
          />

          {/* Interactive Player Controls */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center font-bold shadow-lg transition"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-white rounded-lg transition"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="text-xs font-mono font-bold text-white">
                0:{currentTime < 10 ? `0${currentTime}` : currentTime} <span className="text-slate-500">/ 0:30</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Scene {currentScene.sceneNum}/5: <span className="text-amber-400 font-bold">{currentScene.title}</span> ({currentScene.cameraMove})
              </div>
              <div className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-mono">
                Crossfade 60FPS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}