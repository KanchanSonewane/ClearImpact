const Campaign = require('../models/Campaign');
const CampaignMilestone = require('../models/CampaignMilestone');
const NGO = require('../models/NGO');
const Evidence = require('../models/Evidence');
const Donation = require('../models/Donation');

exports.getAllCampaigns = async (req, res) => {
  try {
    const { cause, location, search, status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      // By default show active campaigns to public
      filter.status = { $in: ['ACTIVE', 'COMPLETED'] };
    }

    if (cause && cause !== 'All') {
      filter.causeCategory = cause;
    }

    if (location && location !== 'All') {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { problem: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const campaigns = await Campaign.find(filter)
      .populate('ngoId', 'orgName darpanId verificationStatus logoUrl transparencyScore')
      .sort({ createdAt: -1 });

    return res.json(campaigns);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch campaigns', error: err.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('ngoId', 'orgName darpanId verificationStatus status12A status80G address contact logoUrl mission description transparencyScore');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const milestones = await CampaignMilestone.find({ campaignId: campaign._id }).sort({ order: 1 });
    const milestoneIds = milestones.map(m => m._id);

    const evidenceList = await Evidence.find({ milestoneId: { $in: milestoneIds } });
    const donations = await Donation.find({ campaignId: campaign._id, status: 'SUCCESS' })
      .select('amount donorName createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({
      campaign,
      milestones,
      evidence: evidenceList,
      recentDonations: donations,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch campaign details', error: err.message });
  }
};

exports.createCampaign = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(403).json({ message: 'Only registered NGOs can create funding campaigns.' });
    }

    if (ngo.verificationStatus !== 'VERIFIED') {
      return res.status(403).json({
        message: 'Organization verification required. Your statutory documents are currently pending administrator review. You cannot request donations or define milestones until your NGO profile is approved and verified by an administrator.',
        verificationStatus: ngo.verificationStatus,
      });
    }

    const {
      title,
      causeCategory,
      location,
      targetAmount,
      beneficiariesCount,
      deadline,
      problem,
      solution,
      expectedImpact,
      coverImage,
      milestones = [],
      aiGeneratedContent,
    } = req.body;

    if (!title || !causeCategory || !targetAmount || !beneficiariesCount || !problem || !solution || !expectedImpact) {
      return res.status(400).json({ message: 'Please provide all required campaign fields.' });
    }

    const campaign = new Campaign({
      ngoId: ngo._id,
      title,
      causeCategory,
      location: location || 'Nagpur, Maharashtra',
      targetAmount: Number(targetAmount),
      beneficiariesCount: Number(beneficiariesCount),
      deadline: deadline || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      problem,
      solution,
      expectedImpact,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
      status: 'PENDING_APPROVAL',
      aiGeneratedContent: aiGeneratedContent || undefined,
      transparencyScore: ngo.transparencyScore || 85,
    });

    await campaign.save();

    // Create default milestones if none provided
    const milestoneData = milestones.length > 0 ? milestones : [
      {
        order: 1,
        title: 'Procurement & Material Preparation',
        description: 'Direct procurement of required goods and setup.',
        targetAmount: Math.round(Number(targetAmount) * 0.4),
        evidenceRequirements: 'Vendor GST invoices, physical inventory batch photos with timestamp.',
      },
      {
        order: 2,
        title: 'On-Ground Distribution & Implementation',
        description: 'Executing verified distribution to registered beneficiaries.',
        targetAmount: Math.round(Number(targetAmount) * 0.4),
        evidenceRequirements: 'Before and after activity photos, beneficiary receipt register with sign-offs.',
      },
      {
        order: 3,
        title: 'Post-Impact Reporting & Final Audit',
        description: 'Final impact audit, survey, and donor summary.',
        targetAmount: Math.round(Number(targetAmount) * 0.2),
        evidenceRequirements: 'Comprehensive audited milestone report and beneficiary feedback videos/photos.',
      }
    ];

    const createdMilestones = [];
    for (let i = 0; i < milestoneData.length; i++) {
      const m = milestoneData[i];
      const milestone = new CampaignMilestone({
        campaignId: campaign._id,
        order: m.order || (i + 1),
        title: m.title,
        description: m.description || '',
        targetAmount: m.targetAmount,
        evidenceRequirements: m.evidenceRequirements,
        status: i === 0 ? 'PENDING' : 'PENDING',
      });
      await milestone.save();
      createdMilestones.push(milestone);
    }

    return res.status(201).json({
      message: 'Campaign submitted successfully for admin review.',
      campaign,
      milestones: createdMilestones,
    });
  } catch (err) {
    console.error('Create campaign error:', err);
    return res.status(500).json({ message: 'Failed to create campaign', error: err.message });
  }
};

exports.getMyCampaigns = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });

    const campaigns = await Campaign.find({ ngoId: ngo._id }).sort({ createdAt: -1 });
    const campaignIds = campaigns.map(c => c._id);
    const milestones = await CampaignMilestone.find({ campaignId: { $in: campaignIds } });

    return res.json({ campaigns, milestones });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch campaigns', error: err.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    let campaign;
    if (req.user.role === 'ADMIN') {
      campaign = await Campaign.findById(req.params.id);
    } else {
      const ngo = await NGO.findOne({ userId: req.user._id });
      if (!ngo) return res.status(403).json({ message: 'Unauthorized' });
      campaign = await Campaign.findOne({ _id: req.params.id, ngoId: ngo._id });
    }
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const updateable = ['title', 'problem', 'solution', 'expectedImpact', 'aiGeneratedContent', 'coverImage'];
    updateable.forEach(key => {
      if (req.body[key] !== undefined) {
        campaign[key] = req.body[key];
      }
    });

    await campaign.save();
    return res.json({ message: 'Campaign updated successfully', campaign });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update campaign', error: err.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    await CampaignMilestone.deleteMany({ campaignId: campaign._id });
    await Evidence.deleteMany({ campaignId: campaign._id });
    await Campaign.findByIdAndDelete(campaign._id);

    return res.json({ message: 'Campaign removed successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete campaign', error: err.message });
  }
};

exports.reportCampaign = async (req, res) => {
  try {
    const { reason, details, evidenceLink } = req.body;
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    if (!campaign.reports) campaign.reports = [];
    campaign.reports.push({
      reason,
      details,
      evidenceLink,
      reportedAt: new Date(),
      status: 'PENDING_REVIEW'
    });
    await campaign.save();

    return res.json({ success: true, message: 'Report registered for compliance review' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to submit report', error: err.message });
  }
};


