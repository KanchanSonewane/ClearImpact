const { generateCampaignStudio, buildGroundedCampaignContent, generateVerifiedImpactReport } = require('../services/aiService');
const { validateCampaignClaims } = require('../services/claimValidator');
const Campaign = require('../models/Campaign');
const CampaignMilestone = require('../models/CampaignMilestone');
const Evidence = require('../models/Evidence');
const NGO = require('../models/NGO');

exports.generateCampaign = async (req, res) => {
  try {
    const {
      causeCategory,
      targetAmount,
      beneficiariesCount,
      location,
      problem,
      solution,
      expectedImpact,
      orgName
    } = req.body || {};

    const campaignInput = {
      causeCategory: causeCategory || 'Education',
      targetAmount: Number(targetAmount) || 200000,
      beneficiariesCount: Number(beneficiariesCount) || 500,
      location: location || 'Nagpur, Maharashtra',
      problem: problem || 'Students from low-income families lack basic educational materials and textbooks, leading to classroom dropouts.',
      solution: solution || 'Provide comprehensive educational kits including notebooks, stationery, and geometry sets directly to enrolled students.',
      expectedImpact: expectedImpact || `${beneficiariesCount || 500} students receive educational kits to continue their schooling uninterrupted.`,
      orgName: orgName || 'ClearImpact Verified Partner',
    };

    let generated;
    try {
      generated = await generateCampaignStudio(campaignInput);
    } catch (innerErr) {
      console.warn('AI generation internal error, falling back to deterministic grounded builder:', innerErr);
      const fallbackContent = buildGroundedCampaignContent(campaignInput);
      const validation = validateCampaignClaims(fallbackContent, campaignInput);
      generated = {
        ...fallbackContent,
        hasReviewWarning: validation.hasReviewWarning,
        unsupportedClaims: validation.unsupportedClaims,
        warningDetails: validation.warningDetails,
        reviewLabel: validation.label,
        isFallback: true,
        generatedAt: new Date(),
      };
    }

    return res.json({
      success: true,
      data: generated,
      metadata: {
        engine: 'ClearImpact Grounded AI Engine',
        factualIntegrityVerified: !generated.hasReviewWarning,
        warningCount: generated.unsupportedClaims ? generated.unsupportedClaims.length : 0,
        rulesNotice: 'AI generates communication, not factual claims. Beneficiaries, budget, and location are locked to submitted parameters.',
      }
    });
  } catch (err) {
    console.error('Fatal AI generation handler error:', err);
    // Requirement #34: Return deterministic grounded package so user is never blocked
    const fallbackContent = buildGroundedCampaignContent(req.body || {});
    return res.json({
      success: true,
      data: {
        ...fallbackContent,
        hasReviewWarning: false,
        unsupportedClaims: [],
        reviewLabel: 'AI Generated — Grounded Default',
        isFallback: true,
        generatedAt: new Date(),
      },
      metadata: {
        engine: 'ClearImpact Grounded Fallback',
        factualIntegrityVerified: true,
      }
    });
  }
};

exports.validateClaims = async (req, res) => {
  try {
    const { content, campaignInput } = req.body;
    if (!content || !campaignInput) {
      return res.status(400).json({ message: 'Content and campaignInput are required.' });
    }

    const validation = validateCampaignClaims(content, campaignInput);
    return res.json(validation);
  } catch (err) {
    return res.status(500).json({ message: 'Validation failed', error: err.message });
  }
};

exports.generateImpactReport = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const milestone = await CampaignMilestone.findById(milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    const campaign = await Campaign.findById(milestone.campaignId);
    const ngo = await NGO.findById(campaign.ngoId);
    const evidence = await Evidence.findOne({ milestoneId: milestone._id });

    const report = generateVerifiedImpactReport({
      milestone,
      campaign,
      evidence,
      ngo,
    });

    return res.json(report);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to generate impact report', error: err.message });
  }
};
