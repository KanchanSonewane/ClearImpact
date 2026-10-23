const Campaign = require('../models/Campaign');
const CampaignMilestone = require('../models/CampaignMilestone');
const Evidence = require('../models/Evidence');
const NGO = require('../models/NGO');
const Donation = require('../models/Donation');
const mongoose = require('mongoose');

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 8;
const MAX_HISTORY_MESSAGE_LENGTH = 2000;

// Lightweight process-local rate limit: 12 requests/min per IP/user
const requestBuckets = new Map();
const RATE_WINDOW_MS = 60 * 1000;
const RATE_LIMIT = 12;

function rateLimitKey(req) {
  return req.user?._id?.toString() || req.ip || req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(req) {
  const now = Date.now();
  const key = rateLimitKey(req);
  const current = requestBuckets.get(key);
  if (!current || now - current.startedAt >= RATE_WINDOW_MS) {
    requestBuckets.set(key, { startedAt: now, count: 1 });
    if (requestBuckets.size > 5000) {
      for (const [bucketKey, bucket] of requestBuckets) {
        if (now - bucket.startedAt >= RATE_WINDOW_MS) requestBuckets.delete(bucketKey);
      }
    }
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((item) => item && ['user', 'assistant'].includes(item.role) &&
      typeof item.content === 'string' && item.content.trim())
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, MAX_HISTORY_MESSAGE_LENGTH),
    }));
}

function safeCampaign(campaign) {
  return {
    id: String(campaign._id),
    title: campaign.title,
    cause: campaign.causeCategory,
    location: campaign.location,
    status: campaign.status,
    targetAmountINR: campaign.targetAmount,
    raisedAmountINR: campaign.raisedAmount || 0,
    beneficiariesCount: campaign.beneficiariesCount,
    deadline: campaign.deadline,
    problem: campaign.problem,
    solution: campaign.solution,
    expectedImpact: campaign.expectedImpact,
    ngo: campaign.ngoId && typeof campaign.ngoId === 'object' ? {
      name: campaign.ngoId.orgName,
      verificationStatus: campaign.ngoId.verificationStatus,
      transparencyScore: campaign.ngoId.transparencyScore,
    } : undefined,
  };
}

async function getAuthorizedContext(req, message) {
  const context = { publicCampaigns: [], publicNGOs: [], publicMilestones: [], publicEvidence: [] };
  if (mongoose.connection.readyState !== 1) {
    return context;
  }
  const text = message.toLowerCase();
  const wantsCampaigns = /campaign|fundrais|donat|cause|education|health|environment|beneficiar|milestone|evidence|impact|track/.test(text);
  const wantsNGOs = /ngo|verif|trust|transparen|organization|organisation|registration/.test(text);

  if (wantsCampaigns || !wantsNGOs) {
    const campaigns = await Campaign.find({ status: { $in: ['ACTIVE', 'COMPLETED'] } })
      .populate('ngoId', 'orgName verificationStatus transparencyScore')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
    context.publicCampaigns = campaigns.map(safeCampaign);

    if (campaigns.length) {
      const campaignIds = campaigns.map((campaign) => campaign._id);
      const milestones = await CampaignMilestone.find({ campaignId: { $in: campaignIds } })
        .select('campaignId title description targetAmount releasedAmount order status evidenceRequirements completionDate')
        .sort({ order: 1 })
        .limit(24)
        .lean();
      context.publicMilestones = milestones.map((milestone) => ({
        campaignId: String(milestone.campaignId),
        title: milestone.title,
        description: milestone.description,
        targetAmountINR: milestone.targetAmount,
        releasedAmountINR: milestone.releasedAmount || 0,
        order: milestone.order,
        status: milestone.status,
        evidenceRequirements: milestone.evidenceRequirements,
        completionDate: milestone.completionDate,
      }));

      const evidence = await Evidence.find({ campaignId: { $in: campaignIds } })
        .select('campaignId milestoneId title adminStatus riskLevel beneficiariesReached createdAt')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
      context.publicEvidence = evidence.map((item) => ({
        campaignId: String(item.campaignId),
        milestoneId: String(item.milestoneId),
        title: item.title,
        reviewStatus: item.adminStatus,
        riskLevel: item.riskLevel,
        beneficiariesReached: item.beneficiariesReached,
        submittedAt: item.createdAt,
      }));
    }
  }

  if (wantsNGOs) {
    const ngos = await NGO.find({ verificationStatus: { $in: ['VERIFIED', 'UNDER_REVIEW'] } })
      .select('orgName description mission verificationStatus verificationType transparencyScore address.city address.state')
      .sort({ transparencyScore: -1 })
      .limit(8)
      .lean();
    context.publicNGOs = ngos.map((ngo) => ({
      name: ngo.orgName,
      description: ngo.description,
      mission: ngo.mission,
      verificationStatus: ngo.verificationStatus,
      verificationType: ngo.verificationType,
      transparencyScore: ngo.transparencyScore,
      location: [ngo.address?.city, ngo.address?.state].filter(Boolean).join(', '),
    }));
  }

  if (req.user?.role === 'DONOR') {
    const donations = await Donation.find({ donorId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('campaignId', 'title status location')
      .select('amount currency status createdAt campaignId isAnonymous taxReceiptNumber')
      .lean();
    context.currentDonorDonations = donations.map((donation) => ({
      amount: donation.amount,
      currency: donation.currency,
      status: donation.status,
      createdAt: donation.createdAt,
      campaign: donation.campaignId ? {
        title: donation.campaignId.title,
        status: donation.campaignId.status,
        location: donation.campaignId.location,
      } : null,
      receiptAvailable: Boolean(donation.taxReceiptNumber),
    }));
  }

  if (req.user?.role === 'NGO') {
    const ngo = await NGO.findOne({ userId: req.user._id })
      .select('orgName verificationStatus transparencyScore')
      .lean();
    if (ngo) {
      const campaigns = await Campaign.find({ ngoId: ngo._id })
        .select('title status targetAmount raisedAmount beneficiariesCount location')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
      const campaignIds = campaigns.map((campaign) => campaign._id);
      const milestones = campaignIds.length
        ? await CampaignMilestone.find({ campaignId: { $in: campaignIds } })
          .select('campaignId title status targetAmount releasedAmount order')
          .limit(30)
          .lean()
        : [];
      const evidence = campaignIds.length
        ? await Evidence.find({ campaignId: { $in: campaignIds } })
          .select('campaignId title adminStatus riskLevel beneficiariesReached createdAt')
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
        : [];
      context.currentNGOWorkspace = {
        organization: ngo,
        campaigns,
        milestones,
        evidence,
      };
    }
  }

  return context;
}

const SYSTEM_INSTRUCTION = `You are Impact Assistant, the friendly conversational AI guide for ClearImpact, an escrow-backed donation transparency platform in India.
Answer warmly, clearly, concisely, and helpfully.
Ground your answers strictly on the supplied ClearImpact database context.
Key concepts:
- Milestone Escrow: Donated funds are locked safely until the NGO submits verifiable photo/invoice evidence and human admins verify it.
- Explainable Risk Engine: Automated AI checks image tampering, timestamp sequence, and geo-location before admin review.
- Trilingual AI Social Poster Studio: 14 distinct poster archetypes with locked metrics, scannable QR code, and instant HD download in English, Hindi, and Marathi.
- 80G Tax Exemption: Indian donors receive instant digital 80G tax deductible receipts.
Never invent fake campaigns, donors, or bank details. Distinguish VERIFIED NGOs from UNDER_REVIEW.
Be polite, encouraging, and informative.`;

function generateLocalReply(message, context) {
  const text = message.toLowerCase();
  const campaigns = context.publicCampaigns || [];
  const ngos = context.publicNGOs || [];

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|namaste)\b/.test(text.trim())) {
    return 'Hello! I’m Impact Assistant, ClearImpact’s transparent platform guide. I can help you explore active campaigns, understand NGO verification, learn how milestone escrow works, or track your donations. What would you like to know?';
  }

  if (/campaign|fundrais|active cause|find.*cause/.test(text)) {
    if (!campaigns.length) {
      return 'I couldn’t find any active campaigns in the database currently. Please visit the Campaigns tab for the latest listings.';
    }
    const lines = campaigns.slice(0, 5).map((c, i) => {
      const amount = Number(c.raisedAmountINR || 0).toLocaleString('en-IN');
      const target = Number(c.targetAmountINR || 0).toLocaleString('en-IN');
      const ngo = c.ngo?.name ? ` • NGO: ${c.ngo.name}` : '';
      return `${i + 1}. **${c.title}**\n   Raised: ₹${amount} of ₹${target}${ngo}${c.location ? `\n   Location: ${c.location}` : ''}`;
    });
    return `Here are live campaigns currently on ClearImpact:\n\n${lines.join('\n\n')}\n\nYou can open any campaign to view verified milestones and donate with 100% escrow protection!`;
  }

  if (/ngo|verif|trust score|transparen|darpan/.test(text)) {
    if (/how|process|work|mean|what is/.test(text) || !ngos.length) {
      return 'On ClearImpact, NGOs undergo statutory compliance verification (NGO Darpan ID, 12A, and 80G tax status). Their profile displays an explainable Transparency Score (0-100) based on on-time milestone delivery and audit consistency.';
    }
    return `Verified NGO profiles on ClearImpact:\n\n${ngos.slice(0, 5).map((ngo, i) => `${i + 1}. **${ngo.name}**\n   Status: ${ngo.verificationStatus}\n   Transparency Score: ${ngo.transparencyScore || 90}/100${ngo.location ? `\n   Location: ${ngo.location}` : ''}`).join('\n\n')}`;
  }

  if (/milestone|evidence|proof|progress|impact report|escrow/.test(text)) {
    return 'ClearImpact utilizes **Milestone-Based Escrow**: Donated funds are locked into sequential tranches. NGOs must upload timestamped, geo-tagged photographic and receipt evidence upon completing each milestone. An automated explainable risk score checks for tampering before an administrator approves the fund release.';
  }

  if (/poster|archetype|social|qr|download|banner/.test(text)) {
    return 'ClearImpact features an **AI Social Poster & Ad Studio** with 14 visual archetypes (Hope, Minimal, Education, Chalkboard, Polaroid, Comic, Ticket, etc.) and full trilingual localization (English, Hindi, and Marathi). Each poster includes locked verifiable metrics and a live scannable QR code linking straight to the campaign donation page.';
  }

  if (/track.*donat|my donation|donation status|receipt|my contribution|payment/.test(text)) {
    if (context.currentDonorDonations?.length) {
      return `Found ${context.currentDonorDonations.length} donation(s) for your account:\n\n${context.currentDonorDonations.map((d, i) => `${i + 1}. **${d.campaign?.title || 'Campaign'}** — ₹${Number(d.amount || 0).toLocaleString('en-IN')} (Status: ${d.status})${d.receiptAvailable ? ' • 80G Receipt Available' : ''}`).join('\n')}\n\nVisit your Donor Dashboard to track the real-time milestone journey!`;
    }
    return 'To track your donations and download 80G receipts, please sign in with your Donor account and open the Donor Dashboard.';
  }

  if (/donat|how.*give|how.*contribut/.test(text)) {
    return 'To donate: Navigate to the Campaigns page, select a verified campaign, choose an amount, and complete payment via Razorpay. Your donation is automatically protected by milestone escrow and you will receive an instant 80G tax receipt.';
  }

  if (context.currentNGOWorkspace && /my campaign|our campaign|my milestone|my evidence|my organization/.test(text)) {
    const ws = context.currentNGOWorkspace;
    return `Your NGO **${ws.organization?.orgName || 'Workspace'}** has ${ws.campaigns?.length || 0} active campaign(s). You can upload milestone execution evidence directly in the NGO Dashboard.`;
  }

  return 'I can assist you with ClearImpact campaigns, milestone escrow protection, NGO verification, 80G receipts, and donation tracking. Try asking: "Find active campaigns", "How does NGO verification work?", or "How can I track my donation?".';
}

exports.sendMessage = async (req, res) => {
  if (isRateLimited(req)) {
    return res.status(429).json({ message: 'You have sent several messages recently. Please wait a minute and try again.' });
  }

  const { message, history } = req.body || {};
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Please enter a message.' });
  }
  if (message.trim().length > MAX_MESSAGE_LENGTH) {
    return res.status(413).json({ message: `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.` });
  }

  try {
    const context = await getAuthorizedContext(req, message.trim());
    let reply = null;
    let modelUsed = 'clearimpact-local-rules';

    // If Google Gemini is available, query Gemini 3.8 Flash with grounded context
    if (process.env.GEMINI_API_KEY) {
      try {
        const cleanedHistory = cleanHistory(history);
        const historyText = cleanedHistory.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
        const prompt = `${SYSTEM_INSTRUCTION}\n\nLive Platform Database Context:\n${JSON.stringify(context, null, 2)}\n\nConversation History:\n${historyText}\n\nUser Question:\n${message.trim()}\n\nHelpful, concise, empathetic answer:`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const aiResponse = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 600,
            }
          })
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const generatedText = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim()) {
            reply = generatedText.trim();
            modelUsed = 'gemini-3.8-flash';
          }
        }
      } catch (geminiError) {
        console.warn('[Impact Assistant] Gemini call fallback to local rule engine:', geminiError.message);
      }
    }

    if (!reply) {
      reply = generateLocalReply(message.trim(), context);
    }

    return res.json({
      success: true,
      reply,
      model: modelUsed,
      contextSources: [
        ...(context.publicCampaigns.length ? ['public campaigns'] : []),
        ...(context.publicNGOs.length ? ['public NGO profiles'] : []),
        ...(context.publicMilestones.length ? ['public milestone progress'] : []),
        ...(context.publicEvidence.length ? ['public evidence review status'] : []),
        ...(context.currentDonorDonations ? ['your donation records'] : []),
        ...(context.currentNGOWorkspace ? ['your organization workspace'] : []),
      ],
    });
  } catch (error) {
    console.error('[Impact Assistant] Response generation error:', error.message);
    return res.status(500).json({ message: 'Impact Assistant encountered a temporary problem. Please try again.' });
  }
};
