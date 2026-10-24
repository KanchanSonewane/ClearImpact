const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const CampaignMilestone = require('../models/CampaignMilestone');
const Evidence = require('../models/Evidence');
const Notification = require('../models/Notification');
const razorpayService = require('../services/razorpayService');

exports.createDonationOrder = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;
    if (!campaignId || !amount || Number(amount) < 10) {
      return res.status(400).json({ message: 'Valid campaign and donation amount (min ₹10) are required.' });
    }

    const campaign = await Campaign.findById(campaignId).populate('ngoId');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.ngoId && campaign.ngoId.verificationStatus !== 'VERIFIED') {
      return res.status(403).json({
        message: 'Donations locked. This campaign belongs to an organization whose statutory documents are currently pending administrator verification. To protect donor funds in escrow, pledges cannot be placed until the NGO is verified.'
      });
    }

    const order = await razorpayService.createOrder({
      amount: Number(amount),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${campaignId.toString().slice(-4)}`,
      notes: {
        campaignId: campaign._id.toString(),
        campaignTitle: campaign.title,
      }
    });

    return res.json({
      order,
      razorpayKeyId: razorpayService.getPublicKey(),
      campaign: {
        id: campaign._id,
        title: campaign.title,
        targetAmount: campaign.targetAmount,
        raisedAmount: campaign.raisedAmount,
      }
    });
  } catch (err) {
    console.error('Create donation order error:', err);
    return res.status(500).json({ message: 'Failed to initiate payment', error: err.message });
  }
};

exports.verifyDonation = async (req, res) => {
  try {
    const { orderId, paymentId, signature, campaignId, amount, isAnonymous } = req.body;

    if (!orderId || !paymentId || !campaignId || !amount) {
      return res.status(400).json({ message: 'Missing payment verification parameters.' });
    }

    const isValid = razorpayService.verifyPaymentSignature({ orderId, paymentId, signature });
    if (!isValid) {
      return res.status(400).json({ message: 'Payment verification failed: invalid signature.' });
    }

    const campaign = await Campaign.findById(campaignId).populate('ngoId');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    if (campaign.ngoId && campaign.ngoId.verificationStatus !== 'VERIFIED') {
      return res.status(403).json({
        message: 'Donations locked for unverified NGO organization.'
      });
    }

    // Record donation
    const donation = new Donation({
      donorId: req.user._id,
      campaignId: campaign._id,
      amount: Number(amount),
      currency: 'INR',
      paymentGateway: 'RAZORPAY_SANDBOX',
      orderId,
      paymentId,
      status: 'SUCCESS',
      donorName: isAnonymous ? 'Generous Anonymous Donor' : req.user.name,
      donorEmail: isAnonymous ? '' : req.user.email,
      isAnonymous: Boolean(isAnonymous),
    });

    await donation.save();

    // Increment campaign raised amount
    campaign.raisedAmount = (campaign.raisedAmount || 0) + Number(amount);
    if (campaign.raisedAmount >= campaign.targetAmount && campaign.status === 'ACTIVE') {
      // Completed funding
    }
    await campaign.save();

    // Check milestones funding lifecycle
    const milestones = await CampaignMilestone.find({ campaignId: campaign._id }).sort({ order: 1 });
    let cumulative = 0;
    for (const m of milestones) {
      cumulative += m.targetAmount;
      if (campaign.raisedAmount >= cumulative && m.status === 'PENDING') {
        m.status = 'FUNDED';
        await m.save();
      }
    }

    // Create Notification
    await Notification.create({
      userId: req.user._id,
      title: 'Donation Confirmed — Impact Tracking Activated',
      message: `Thank you for contributing ₹${Number(amount).toLocaleString('en-IN')} to "${campaign.title}". Track milestone progress and verified evidence in your dashboard.`,
      type: 'SUCCESS',
      link: `/donor/impact/${donation._id}`,
    });

    return res.status(201).json({
      success: true,
      message: 'Donation successful! Milestone impact escrow activated.',
      donation,
      campaign: {
        id: campaign._id,
        title: campaign.title,
        raisedAmount: campaign.raisedAmount,
        targetAmount: campaign.targetAmount,
      }
    });
  } catch (err) {
    console.error('Verify donation error:', err);
    return res.status(500).json({ message: 'Failed to verify donation', error: err.message });
  }
};

exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id, status: 'SUCCESS' })
      .populate({
        path: 'campaignId',
        select: 'title coverImage causeCategory location targetAmount raisedAmount ngoId',
        populate: {
          path: 'ngoId',
          select: 'orgName verificationStatus logoUrl transparencyScore',
        }
      })
      .sort({ createdAt: -1 });

    return res.json(donations);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch donations', error: err.message });
  }
};

exports.getDonationImpactTimeline = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate({
        path: 'campaignId',
        populate: {
          path: 'ngoId',
        }
      });

    if (!donation) {
      return res.status(404).json({ message: 'Donation record not found' });
    }

    const campaign = donation.campaignId;
    const milestones = await CampaignMilestone.find({ campaignId: campaign._id }).sort({ order: 1 });
    const milestoneIds = milestones.map(m => m._id);
    const evidenceList = await Evidence.find({ milestoneId: { $in: milestoneIds } });

    // Construct the end-to-end visual journey
    const journey = milestones.map(m => {
      const evidence = evidenceList.find(e => e.milestoneId.toString() === m._id.toString());
      return {
        milestoneId: m._id,
        order: m.order,
        title: m.title,
        description: m.description,
        targetAmount: m.targetAmount,
        releasedAmount: m.releasedAmount,
        status: m.status,
        evidence: evidence ? {
          id: evidence._id,
          title: evidence.title,
          reportText: evidence.reportText,
          beforePhotoUrl: evidence.beforePhotoUrl,
          afterPhotoUrl: evidence.afterPhotoUrl,
          riskScore: evidence.riskScore,
          riskLevel: evidence.riskLevel,
          adminStatus: evidence.adminStatus,
          verifiedAt: evidence.reviewedAt,
          aiImpactSummary: evidence.aiImpactSummary,
        } : null,
      };
    });

    return res.json({
      donation,
      campaign,
      journey,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load impact timeline', error: err.message });
  }
};
