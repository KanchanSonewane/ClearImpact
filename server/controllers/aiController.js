const { generateCampaignStudio, generateVerifiedImpactReport, generateVideoStoryboard } = require('../services/aiService');
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
    } = req.body;

    if (!problem || !solution || !targetAmount || !beneficiariesCount) {
      return res.status(400).json({ message: 'Missing required campaign parameters for AI generation.' });
    }

    const generated = await generateCampaignStudio({
      causeCategory: causeCategory || 'Education',
      targetAmount: Number(targetAmount),
      beneficiariesCount: Number(beneficiariesCount),
      location: location || 'Nagpur, Maharashtra',
      problem,
      solution,
      expectedImpact: expectedImpact || `${beneficiariesCount} individuals supported`,
      orgName: orgName || 'ClearImpact Verified Partner',
    });

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
    console.error('AI generation error:', err);
    // Requirement #34: Graceful fallback
    return res.status(500).json({
      message: 'AI generation is temporarily unavailable.',
      fallbackAvailable: true,
      error: err.message
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

exports.generateVideoStoryboard = async (req, res) => {
  try {
    const { campaignId, template, tone } = req.body;
    let campaignInput = req.body.campaignInput;

    if (campaignId && !campaignInput) {
      const campaign = await Campaign.findById(campaignId).populate('ngoId');
      if (campaign) {
        campaignInput = {
          title: campaign.title,
          causeCategory: campaign.causeCategory,
          targetAmount: campaign.targetAmount,
          beneficiariesCount: campaign.beneficiariesCount,
          location: campaign.location,
          problem: campaign.problem,
          solution: campaign.solution,
          expectedImpact: campaign.expectedImpact,
          orgName: campaign.ngoId?.orgName || 'Verified NGO',
        };
      }
    }

    if (!campaignInput) {
      return res.status(400).json({ message: 'Missing campaign information for video storyboard.' });
    }

    const storyboard = await generateVideoStoryboard(campaignInput, { template, tone });
    return res.json({
      success: true,
      storyboard,
    });
  } catch (err) {
    console.error('Storyboard generation error:', err);
    return res.status(500).json({ message: 'Failed to generate video storyboard', error: err.message });
  }
};
