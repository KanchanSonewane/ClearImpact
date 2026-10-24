const NGO = require('../models/NGO');
const Campaign = require('../models/Campaign');
const CampaignMilestone = require('../models/CampaignMilestone');
const Evidence = require('../models/Evidence');
const Donation = require('../models/Donation');
const User = require('../models/User');
const AdminReview = require('../models/AdminReview');
const Notification = require('../models/Notification');
const { generateVerifiedImpactReport } = require('../services/aiService');

exports.getAdminOverview = async (req, res) => {
  try {
    const ngosPending = await NGO.countDocuments({ verificationStatus: { $in: ['PENDING', 'UNDER_REVIEW'] } });
    const campaignsPending = await Campaign.countDocuments({ status: 'PENDING_APPROVAL' });
    const evidencePending = await Evidence.countDocuments({ adminStatus: 'PENDING' });
    const flaggedEvidence = await Evidence.countDocuments({ riskScore: { $gte: 40 } });

    // Funds awaiting milestone release
    const milestonesUnderReview = await CampaignMilestone.find({
      status: { $in: ['EVIDENCE_SUBMITTED', 'UNDER_REVIEW'] }
    });
    const fundsAwaitingRelease = milestonesUnderReview.reduce((acc, m) => acc + (m.targetAmount || 0), 0);

    const totalDonations = await Donation.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    const totalRaised = totalDonations[0]?.total || 0;
    const donationCount = totalDonations[0]?.count || 0;

    const totalNGOs = await NGO.countDocuments();
    const verifiedNGOs = await NGO.countDocuments({ verificationStatus: 'VERIFIED' });
    const totalUsers = await User.countDocuments();

    const recentReviews = await AdminReview.find()
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    return res.json({
      metrics: {
        ngosPending,
        campaignsPending,
        evidencePending,
        flaggedEvidence,
        fundsAwaitingRelease,
        totalRaised,
        donationCount,
        totalNGOs,
        verifiedNGOs,
        totalUsers,
      },
      recentReviews,
    });
  } catch (err) {
    console.error('Admin overview error:', err);
    return res.status(500).json({ message: 'Failed to fetch admin overview', error: err.message });
  }
};

exports.getPendingNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({ verificationStatus: { $in: ['PENDING', 'UNDER_REVIEW', 'REJECTED'] } })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const enriched = ngos.map((ngo) => {
      const ngoObj = ngo.toObject();
      let riskScore = 10;
      const riskFlags = [];
      const passedChecks = [];

      // 1. PAN Regex Check
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (panRegex.test(ngo.pan)) {
        passedChecks.push('PAN format structurally valid (10-char alphanumeric)');
      } else {
        riskScore += 25;
        riskFlags.push('Non-standard or unformatted PAN structure');
      }

      // 2. Darpan ID Check
      if (ngo.darpanId && ngo.darpanId.includes('/')) {
        passedChecks.push(`Darpan Registry state code matched (${ngo.darpanId.split('/')[0] || 'MH'})`);
      } else {
        riskScore += 20;
        riskFlags.push('NGO Darpan ID missing or unformatted');
      }

      // 3. 12A & 80G Statutory Status
      if (ngo.status12A === 'YES' && ngo.status80G === 'YES') {
        passedChecks.push('12A & 80G tax exemption active');
      } else {
        riskScore += 15;
        riskFlags.push('12A/80G tax status pending or in renewal');
      }

      // 4. Verification Documents Check
      const docCount = ngo.documents?.length || 0;
      if (docCount >= 3) {
        passedChecks.push(`Full statutory documentation package uploaded (${docCount} documents attached)`);
      } else if (docCount > 0) {
        passedChecks.push(`Partial documentation uploaded (${docCount} documents attached)`);
        riskScore += 15;
        riskFlags.push('Incomplete document bundle (at least 3 documents recommended)');
      } else {
        riskScore += 35;
        riskFlags.push('Zero verification documents attached');
      }

      const finalRiskScore = Math.min(Math.max(riskScore, 5), 95);
      const complianceScore = 100 - finalRiskScore;

      ngoObj.calculatedRiskScore = finalRiskScore;
      ngoObj.complianceScore = complianceScore;
      ngoObj.passedChecks = passedChecks;
      ngoObj.riskFlags = riskFlags;

      return ngoObj;
    });

    return res.json(enriched);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch pending NGOs', error: err.message });
  }
};

exports.verifyNGO = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body; // 'APPROVED' or 'REJECTED'

    const ngo = await NGO.findById(id);
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });

    ngo.verificationStatus = decision === 'APPROVED' ? 'VERIFIED' : 'REJECTED';
    ngo.verificationNotes = notes || 'Reviewed by ClearImpact Compliance Officer.';
    if (decision === 'APPROVED') {
      ngo.verifiedAt = new Date();
      ngo.transparencyScore = Math.max(ngo.transparencyScore, 90);
    }
    await ngo.save();

    await AdminReview.create({
      adminId: req.user._id,
      entityType: 'NGO',
      entityId: ngo._id,
      decision,
      notes: notes || `NGO ${ngo.orgName} status updated to ${ngo.verificationStatus}`,
    });

    await Notification.create({
      userId: ngo.userId,
      title: decision === 'APPROVED' ? 'NGO Profile Verified!' : 'Verification Update',
      message: decision === 'APPROVED'
        ? `Congratulations! ${ngo.orgName} has been granted the Verified NGO badge on ClearImpact.`
        : `Your verification request was reviewed: ${notes || 'Action required.'}`,
      type: decision === 'APPROVED' ? 'SUCCESS' : 'WARNING',
      link: '/ngo/dashboard',
    });

    return res.json({ message: `NGO ${ngo.verificationStatus.toLowerCase()} successfully`, ngo });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to review NGO', error: err.message });
  }
};

exports.getPendingCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'PENDING_APPROVAL' })
      .populate('ngoId', 'orgName darpanId verificationStatus logoUrl')
      .sort({ createdAt: -1 });
    return res.json(campaigns);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch pending campaigns', error: err.message });
  }
};

exports.reviewCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body; // 'APPROVED' or 'REJECTED'

    const campaign = await Campaign.findById(id).populate('ngoId');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    campaign.status = decision === 'APPROVED' ? 'ACTIVE' : 'REJECTED';
    campaign.adminNotes = notes || 'Verified for realistic milestone requirements.';
    await campaign.save();

    await AdminReview.create({
      adminId: req.user._id,
      entityType: 'CAMPAIGN',
      entityId: campaign._id,
      decision,
      notes: notes || `Campaign ${campaign.title} status updated to ${campaign.status}`,
    });

    if (campaign.ngoId && campaign.ngoId.userId) {
      await Notification.create({
        userId: campaign.ngoId.userId,
        title: decision === 'APPROVED' ? 'Campaign Approved & Live!' : 'Campaign Review Update',
        message: decision === 'APPROVED'
          ? `Your campaign "${campaign.title}" is now active and accepting milestone-protected donations.`
          : `Campaign review notes: ${notes || 'Revisions required.'}`,
        type: decision === 'APPROVED' ? 'SUCCESS' : 'WARNING',
        link: `/campaign/${campaign._id}`,
      });
    }

    return res.json({ message: `Campaign marked as ${campaign.status}`, campaign });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to review campaign', error: err.message });
  }
};

exports.getPendingEvidence = async (req, res) => {
  try {
    const evidenceList = await Evidence.find({ adminStatus: { $in: ['PENDING', 'MORE_INFO_REQUESTED'] } })
      .populate('campaignId', 'title location targetAmount raisedAmount')
      .populate('milestoneId', 'title order targetAmount status')
      .populate('ngoId', 'orgName darpanId logoUrl')
      .sort({ riskScore: -1, createdAt: -1 });

    return res.json(evidenceList);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch evidence list', error: err.message });
  }
};

exports.reviewEvidence = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body; // 'APPROVED', 'REJECTED', 'MORE_INFO_REQUESTED'

    const evidence = await Evidence.findById(id)
      .populate('campaignId')
      .populate('milestoneId')
      .populate('ngoId');

    if (!evidence) return res.status(404).json({ message: 'Evidence not found' });

    evidence.adminStatus = decision;
    evidence.adminNotes = notes || '';
    evidence.reviewedBy = req.user._id;
    evidence.reviewedAt = new Date();

    const milestone = await CampaignMilestone.findById(evidence.milestoneId._id);
    const campaign = await Campaign.findById(evidence.campaignId._id);
    const ngo = await NGO.findById(evidence.ngoId._id);

    if (decision === 'APPROVED') {
      milestone.status = 'RELEASED';
      milestone.releasedAmount = milestone.targetAmount;
      milestone.releasedAt = new Date();
      milestone.completionDate = new Date();
      await milestone.save();

      // Generate verified AI Impact Report grounded ONLY in verified DB records
      const impactReport = generateVerifiedImpactReport({
        milestone,
        campaign,
        evidence,
        ngo,
      });
      evidence.aiImpactSummary = impactReport;

      // Notify Donors who backed this campaign
      const donations = await Donation.find({ campaignId: campaign._id, status: 'SUCCESS' });
      for (const don of donations) {
        await Notification.create({
          userId: don.donorId,
          title: `Milestone Verified: ${milestone.title}`,
          message: `Evidence has been verified for "${campaign.title}". Funds of ₹${milestone.targetAmount.toLocaleString('en-IN')} released with proof of impact.`,
          type: 'SUCCESS',
          link: `/donor/impact/${don._id}`,
        });
      }
    } else if (decision === 'REJECTED') {
      milestone.status = 'REJECTED';
      await milestone.save();
    } else if (decision === 'MORE_INFO_REQUESTED') {
      milestone.status = 'UNDER_REVIEW';
      await milestone.save();
    }

    await evidence.save();

    await AdminReview.create({
      adminId: req.user._id,
      entityType: 'EVIDENCE',
      entityId: evidence._id,
      decision,
      notes: notes || `Evidence for ${milestone.title} reviewed. Status: ${decision}`,
      riskScoreObserved: evidence.riskScore,
    });

    return res.json({
      message: `Evidence ${decision.toLowerCase()} successfully. Milestone funds status updated.`,
      evidence,
      milestone,
    });
  } catch (err) {
    console.error('Evidence review error:', err);
    return res.status(500).json({ message: 'Failed to review evidence', error: err.message });
  }
};
