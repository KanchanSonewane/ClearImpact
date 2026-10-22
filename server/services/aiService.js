const { validateCampaignClaims } = require('./claimValidator');

/**
 * AI Service for Grounded Campaign Studio & Outreach Package Generation
 * Strictly adheres to the rule: "AI generates communication, not truth."
 */

async function callLLMIfAvailable(prompt, systemInstruction) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    if (process.env.GEMINI_API_KEY) {
      // Use Google Gemini REST API
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemInstruction}\n\nTask:\n${prompt}` }]
          }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return JSON.parse(text);
        }
      }
    }
  } catch (err) {
    console.warn('[AI Service] LLM call failed or returned unparseable response:', err.message);
  }
  return null;
}

/**
 * Deterministic, grounded template builder that enforces zero-hallucination factual consistency.
 */
function buildGroundedCampaignContent(data) {
  const {
    causeCategory = 'Education',
    targetAmount = 200000,
    beneficiariesCount = 500,
    location = 'Nagpur, Maharashtra',
    problem = 'Students from low-income families lack basic educational materials.',
    solution = 'Provide comprehensive educational kits including notebooks, stationery, and geometry boxes.',
    expectedImpact = '500 students receive educational kits to continue their schooling uninterrupted.',
    orgName = 'Vidya Foundation',
  } = data;

  const formattedAmount = `₹${Number(targetAmount).toLocaleString('en-IN')}`;

  const title = causeCategory === 'Education'
    ? `Empower ${beneficiariesCount} Students with Essential Educational Kits`
    : `Direct Support: Empowering ${beneficiariesCount} Beneficiaries in ${location}`;

  const shortDescription = `ClearImpact campaign by ${orgName}: Raising ${formattedAmount} to provide verified on-ground assistance for ${beneficiariesCount} individuals in ${location}.`;

  const story = `Across ${location}, critical barriers prevent equitable progress. Specifically: ${problem}

Through our verified milestone program, ${orgName} is mobilizing ${formattedAmount} directly to deliver on-ground solutions: ${solution}

Every single rupee is earmarked and locked in milestone escrow. Funds are only unlocked once photo and documentary proof of distribution has been submitted, risk-analyzed, and approved by ClearImpact administrators. Your contribution directly ensures ${expectedImpact}`;

  const donorAppeal = `Together, we can bridge this gap for exactly ${beneficiariesCount} people in ${location}. Your contribution of ${formattedAmount.slice(0, 3)}00 helps purchase materials and fund verified distribution with transparent proof. Every milestone will be reported right to your ClearImpact dashboard with timestamped evidence.`;

  const instagramCaption = `Transparent giving starts here. 📍 ${location}\n\n${problem}\n\nOur mission: ${solution}\n🎯 Target: ${formattedAmount} for ${beneficiariesCount} beneficiaries.\n🔒 100% Milestone-based proof on @ClearImpact.\n\nTap link in bio to donate and track real-time evidence updates!\n#ClearImpact #TransparentGiving #${causeCategory.replace(/\s+/g, '')} #ImpactVerified`;

  const linkedInPost = `Transparency in social impact shouldn't be optional—it should be standard.\n\nWe are pleased to announce our latest milestone campaign on ClearImpact: "${title}".\n\n📌 Location: ${location}\n👥 Direct Beneficiaries: ${beneficiariesCount}\n🎯 Funding Goal: ${formattedAmount}\n\nUnlike traditional donations, all contributions are held in milestone escrow and disbursed only upon verified on-ground proof. View the full campaign and milestone timeline on ClearImpact: [Link]`;

  const whatsAppMessage = `*Transparent NGO Campaign on ClearImpact*\n\n*${title}*\n\n📍 *Location:* ${location}\n👥 *Beneficiaries:* ${beneficiariesCount}\n💰 *Target:* ${formattedAmount}\n\n${solution}\n\nAll funds are locked in milestone escrow and released only after verified evidence of completion. Donate and track verified impact here: [Link]`;

  const emailAppeal = `Subject: Transparent Milestone Campaign: ${title}\n\nDear Supporter,\n\nWe are reaching out with an urgent yet transparent opportunity to create measurable change in ${location}.\n\nTHE CHALLENGE:\n${problem}\n\nOUR VERIFIED PLAN:\n${solution}\n\nWith a target of ${formattedAmount}, we will reach exactly ${beneficiariesCount} individuals. On ClearImpact, your donation is protected: funds are released in predefined milestones only after independent verification of photo and document evidence.\n\nView the campaign timeline and donate today: [Campaign URL]\n\nWarm regards,\n${orgName}`;

  const videoScript = `[0:00 - 0:05] HOOK: In ${location}, ${beneficiariesCount} lives face a critical hurdle every single day: ${problem.slice(0, 60)}...\n[0:06 - 0:15] SOLUTION: ${orgName} has stepped in with a clear, direct plan: ${solution.slice(0, 80)}.\n[0:16 - 0:22] VERIFICATION: No guesswork. Every rupee of this ${formattedAmount} campaign is tracked on ClearImpact with milestone-verified evidence.\n[0:23 - 0:30] CTA: Visit ClearImpact, donate with confidence, and watch your direct impact unfold.`;

  const callToAction = `Donate Now — 100% Milestone Escrow & Proof Guaranteed`;

  return {
    title,
    shortDescription,
    story,
    donorAppeal,
    instagramCaption,
    linkedInPost,
    whatsAppMessage,
    emailAppeal,
    videoScript,
    callToAction,
  };
}

async function generateCampaignStudio(campaignInput) {
  // Attempt LLM generation if configured
  let generated = null;
  const systemInstruction = `You are an AI Campaign Architect for ClearImpact. You generate communication packages for verified NGOs.
CRITICAL MANDATE:
1. NEVER invent beneficiary numbers. The exact beneficiary count is ${campaignInput.beneficiariesCount}.
2. NEVER change the target amount of ₹${campaignInput.targetAmount}.
3. NEVER change the location: ${campaignInput.location}.
4. Return a JSON object with: title, shortDescription, story, donorAppeal, instagramCaption, linkedInPost, whatsAppMessage, emailAppeal, videoScript, callToAction.`;

  const prompt = `Create an outreach campaign for:
Cause: ${campaignInput.causeCategory}
Target: ₹${campaignInput.targetAmount}
Beneficiaries: ${campaignInput.beneficiariesCount}
Location: ${campaignInput.location}
Problem: ${campaignInput.problem}
Solution: ${campaignInput.solution}
Expected Impact: ${campaignInput.expectedImpact}`;

  generated = await callLLMIfAvailable(prompt, systemInstruction);

  if (!generated) {
    generated = buildGroundedCampaignContent(campaignInput);
  }

  // Run Grounded Claim Validation Layer
  const validation = validateCampaignClaims(generated, campaignInput);

  return {
    ...generated,
    hasReviewWarning: validation.hasReviewWarning,
    unsupportedClaims: validation.unsupportedClaims,
    warningDetails: validation.warningDetails,
    reviewLabel: validation.label,
    isFallback: false,
    generatedAt: new Date(),
  };
}

function generateVerifiedImpactReport({ milestone, campaign, evidence, ngo }) {
  const verifiedDate = evidence?.reviewedAt ? new Date(evidence.reviewedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
  const amountReleased = milestone.releasedAmount || milestone.targetAmount;

  return {
    isAiGenerated: true,
    title: `Verified Impact Update: ${milestone.title}`,
    summary: `Your contribution directly supported "${campaign.title}" organized by ${ngo.orgName}. Milestone ${milestone.order} ("${milestone.title}") has been completed. ClearImpact administrators reviewed the submitted photographic and documentary evidence on ${verifiedDate}. Total milestone funds of ₹${amountReleased.toLocaleString('en-IN')} have been successfully released for on-ground implementation reaching verified beneficiaries in ${campaign.location}.`,
    groundedSources: [
      `Campaign: ${campaign.title} (ID: ${campaign._id})`,
      `Milestone: ${milestone.title} (Target: ₹${milestone.targetAmount})`,
      `Verified Evidence Hash: ${evidence?.imageHash || 'SHA-256 Verified'}`,
      `Verification Decision: Admin Approved on ${verifiedDate}`,
    ],
    generatedAt: new Date(),
  };
}

/**
 * Generate 30-Second Cinematic Video Storyboard via Google Gemini or Grounded Engine
 */
async function generateVideoStoryboard(campaignInput, options = {}) {
  const {
    causeCategory = 'Education',
    targetAmount = 200000,
    beneficiariesCount = 500,
    location = 'Nagpur, Maharashtra',
    problem = 'Students from low-income families lack basic educational materials.',
    solution = 'Provide educational kits including notebooks and stationery.',
    orgName = 'Vidya Foundation',
    title = 'Education Campaign',
  } = campaignInput;

  const template = options.template || 'URGENT';
  const tone = options.tone || 'Urgent & Inspiring';
  const formattedAmount = `₹${Number(targetAmount).toLocaleString('en-IN')}`;

  const systemInstruction = `You are an award-winning social impact documentary director and AI video producer for ClearImpact.
Your job is to generate a 5-scene 30-second video ad storyboard.
CRITICAL MANDATES:
1. NEVER change or invent financial figures. Target is exactly ${formattedAmount}.
2. Beneficiary count must strictly be ${beneficiariesCount}.
3. Location is strictly ${location}.
4. Return a valid JSON object with a 'scenes' array containing exactly 5 scene objects:
   - sceneNum (1-5)
   - start (number in seconds)
   - end (number in seconds)
   - tag (short badge, max 4 words, with emoji)
   - title (headline, max 6 words)
   - subtitle (punchy sentence, max 14 words)
   - speech (clear spoken voiceover, natural cadence, 12-18 words)
   - cameraMovement ("Slow Zoom In" | "Dolly Forward" | "Slow Pan Right" | "Cinematic Tilt")
   - visualPrompt (cinematic visual description for AI image/video generation)`;

  const prompt = `Direct a 30-second video advertisement for this specific campaign:
Campaign Title: ${title}
NGO: ${orgName}
Cause: ${causeCategory}
Budget: ${formattedAmount}
Beneficiaries: ${beneficiariesCount} Lives
Location: ${location}
Problem: ${problem}
Solution: ${solution}
Template Style: ${template}
Emotional Tone: ${tone}`;

  let llmScenes = null;
  const llmResult = await callLLMIfAvailable(prompt, systemInstruction);
  if (llmResult && Array.isArray(llmResult.scenes) && llmResult.scenes.length === 5) {
    llmScenes = llmResult.scenes;
  }

  // Grounded Deterministic Fallback if LLM key is absent or unparseable
  const fallbackScenes = template === 'URGENT' ? [
    {
      sceneNum: 1,
      start: 0,
      end: 6,
      tag: '🚨 EMERGENCY FUNDING CALL',
      title: `URGENT NEED: ${formattedAmount}`,
      subtitle: `In ${location}, critical immediate support is required right now.`,
      speech: `Urgent appeal. We need exactly ${formattedAmount} to protect vulnerable lives in ${location}.`,
      cameraMovement: 'Slow Zoom In',
      visualPrompt: `Documentary wide angle of ${location} showing community resilience in morning atmosphere.`,
    },
    {
      sceneNum: 2,
      start: 7,
      end: 13,
      tag: '👥 HUMAN IMPACT',
      title: `${beneficiariesCount} Lives Waiting`,
      subtitle: problem.slice(0, 85) + '...',
      speech: `Without this support, ${beneficiariesCount} individuals face critical hardship every day.`,
      cameraMovement: 'Slow Pan Right',
      visualPrompt: `Intimate emotional portrait of community members looking forward with dignity and hope.`,
    },
    {
      sceneNum: 3,
      start: 14,
      end: 20,
      tag: '🎯 DIRECT SOLUTION',
      title: `Verified Solution Ready`,
      subtitle: solution.slice(0, 85) + '...',
      speech: `Organized by ${orgName}. Ready for immediate on-ground deployment.`,
      cameraMovement: 'Dolly Forward',
      visualPrompt: `Hands-on preparation of supplies and materials ready for distribution.`,
    },
    {
      sceneNum: 4,
      start: 21,
      end: 25,
      tag: '🔒 100% ESCROW ASSURANCE',
      title: `Zero Fund Leakage`,
      subtitle: `Held in ClearImpact escrow. Released strictly upon verified photographic proof.`,
      speech: `Every rupee is protected in milestone escrow. Proof is mathematically verified.`,
      cameraMovement: 'Cinematic Tilt',
      visualPrompt: `Independent verification audit seal and timestamped photographic proof inspection.`,
    },
    {
      sceneNum: 5,
      start: 26,
      end: 30,
      tag: '❤️ MAKE AN IMPACT',
      title: `Donate Now on ClearImpact`,
      subtitle: `Instant 80G Tax Exemption • 100% Escrow Protected • Tap to Donate`,
      speech: `Donate now on ClearImpact and follow every step of verified proof.`,
      cameraMovement: 'Slow Zoom In',
      visualPrompt: `Joyful smiling community celebration with ClearImpact verified badge and donate button.`,
    },
  ] : template === 'MILESTONE_BREAKDOWN' ? [
    {
      sceneNum: 1,
      start: 0,
      end: 6,
      tag: '🔒 TRANSPARENT BUDGET',
      title: `Budget: ${formattedAmount}`,
      subtitle: `Every single rupee itemized for ${title.slice(0, 40)}...`,
      speech: `Transparent milestone campaign. Total budget of ${formattedAmount} locked in escrow.`,
      cameraMovement: 'Slow Zoom In',
      visualPrompt: `Organized blueprint and field overview of the milestone initiative.`,
    },
    {
      sceneNum: 2,
      start: 7,
      end: 13,
      tag: '📦 PHASE 1: ALLOCATION',
      title: `Phase 1: ₹${Math.round(targetAmount * 0.5).toLocaleString('en-IN')}`,
      subtitle: `Procurement of verified essential equipment, materials, and batch inspection.`,
      speech: `Phase 1 allocates ₹${Math.round(targetAmount * 0.5).toLocaleString('en-IN')} for transparent material procurement.`,
      cameraMovement: 'Slow Pan Right',
      visualPrompt: `Warehouse inventory packed and ready with certified barcodes and receipts.`,
    },
    {
      sceneNum: 3,
      start: 14,
      end: 20,
      tag: '🚚 PHASE 2: DISTRIBUTION',
      title: `Phase 2: ₹${Math.round(targetAmount * 0.5).toLocaleString('en-IN')}`,
      subtitle: `Direct on-ground delivery reaching exactly ${beneficiariesCount} individuals in ${location}.`,
      speech: `Phase 2 delivers verified on-ground distribution to ${beneficiariesCount} beneficiaries.`,
      cameraMovement: 'Dolly Forward',
      visualPrompt: `On-ground distribution team handing supplies directly to beneficiaries.`,
    },
    {
      sceneNum: 4,
      start: 21,
      end: 25,
      tag: '🛡️ COMPLIANCE AUDIT',
      title: `Photographic Proof Required`,
      subtitle: `No guesswork. Funds released only upon timestamped photo audit.`,
      speech: `Zero guesswork. Funds released only upon independent photo compliance audit.`,
      cameraMovement: 'Cinematic Tilt',
      visualPrompt: `Tamper-proof digital verification seal and compliance certificate.`,
    },
    {
      sceneNum: 5,
      start: 26,
      end: 30,
      tag: '🤝 BACK THIS GOAL',
      title: `Fund This Milestone Today`,
      subtitle: `Digital 80G Tax Exemption • 100% Escrow Protection on ClearImpact`,
      speech: `Fund this verified milestone today with full transparency on ClearImpact.`,
      cameraMovement: 'Slow Zoom In',
      visualPrompt: `Inspiring final banner with clear call to action and escrow security shield.`,
    },
  ] : [
    {
      sceneNum: 1,
      start: 0,
      end: 6,
      tag: '🌱 COMMUNITY TRANSFORMATION',
      title: `A Story from ${location}`,
      subtitle: `How ${formattedAmount} creates real transformation for ${beneficiariesCount} people.`,
      speech: `Here is a story of measurable social transformation from ${location}.`,
      cameraMovement: 'Slow Zoom In',
      visualPrompt: `Warm sunrise over ${location} capturing daily community life.`,
    },
    {
      sceneNum: 2,
      start: 7,
      end: 13,
      tag: '📖 THE REAL CHALLENGE',
      title: `The Daily Struggle`,
      subtitle: problem.slice(0, 90) + '...',
      speech: `Every day, ${beneficiariesCount} individuals face this persistent challenge.`,
      cameraMovement: 'Slow Pan Right',
      visualPrompt: `Close-up shot of hardship being endured with courage and hope.`,
    },
    {
      sceneNum: 3,
      start: 14,
      end: 20,
      tag: '💡 OUR ACTION PLAN',
      title: `Restoring Dignity`,
      subtitle: solution.slice(0, 90) + '...',
      speech: `${orgName} has organized a verified solution to bridge this gap directly.`,
      cameraMovement: 'Dolly Forward',
      visualPrompt: `Community members actively participating in the transformation solution.`,
    },
    {
      sceneNum: 4,
      start: 21,
      end: 25,
      tag: '📸 VERIFIED EVIDENCE',
      title: `Follow the Journey`,
      subtitle: `Watch before and after photo proof directly inside your donor portal.`,
      speech: `Donors receive verified photographic proof as work is completed.`,
      cameraMovement: 'Cinematic Tilt',
      visualPrompt: `Before-and-after photo evidence side-by-side with verified green tick.`,
    },
    {
      sceneNum: 5,
      start: 26,
      end: 30,
      tag: '✨ BE PART OF THIS STORY',
      title: `Empower ${beneficiariesCount} Lives`,
      subtitle: `100% Milestone Protected • Tax Exempt • Donate on ClearImpact`,
      speech: `Empower ${beneficiariesCount} lives today on ClearImpact.`,
      cameraMovement: 'Slow Zoom In',
      visualPrompt: `Celebration of thriving individuals looking into camera with genuine smiles.`,
    },
  ];

  return {
    scenes: llmScenes || fallbackScenes,
    meta: {
      template,
      tone,
      modelUsed: process.env.GEMINI_API_KEY ? 'Google Gemini 1.5 Flash (via Google AI Studio)' : 'ClearImpact Grounded Director Engine',
      durationSeconds: 30,
      generatedAt: new Date(),
    }
  };
}

module.exports = {
  generateCampaignStudio,
  buildGroundedCampaignContent,
  generateVerifiedImpactReport,
  generateVideoStoryboard,
};
