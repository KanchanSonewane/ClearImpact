const NGO = require('../models/NGO');
const Campaign = require('../models/Campaign');
const CampaignMilestone = require('../models/CampaignMilestone');
const Evidence = require('../models/Evidence');

exports.getAllNGOs = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status) {
      filter.verificationStatus = status;
    } else {
      // By default show verified and under review NGOs
      filter.verificationStatus = { $in: ['VERIFIED', 'UNDER_REVIEW'] };
    }

    if (search) {
      filter.orgName = { $regex: search, $options: 'i' };
    }

    const ngos = await NGO.find(filter).sort({ transparencyScore: -1 });
    return res.json(ngos);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch NGOs', error: err.message });
  }
};

exports.getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });

    const campaigns = await Campaign.find({ ngoId: ngo._id });
    return res.json({ ngo, campaigns });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch NGO details', error: err.message });
  }
};

exports.getMyNGO = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) return res.status(404).json({ message: 'No NGO profile associated with this account.' });
    return res.json(ngo);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch NGO profile', error: err.message });
  }
};

exports.updateMyNGO = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) return res.status(404).json({ message: 'NGO profile not found.' });

    const allowedFields = ['orgName', 'address', 'contact', 'description', 'mission', 'logoUrl', 'status12A', 'status80G'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        ngo[field] = req.body[field];
      }
    });

    await ngo.save();
    return res.json({ message: 'NGO profile updated successfully', ngo });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update NGO', error: err.message });
  }
};

exports.getNGODashboardStats = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });

    const campaigns = await Campaign.find({ ngoId: ngo._id });
    const campaignIds = campaigns.map(c => c._id);

    const totalRaised = campaigns.reduce((acc, c) => acc + (c.raisedAmount || 0), 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
    const completedCampaigns = campaigns.filter(c => c.status === 'COMPLETED').length;
    const totalBeneficiaries = campaigns.reduce((acc, c) => acc + (c.beneficiariesCount || 0), 0);

    const milestones = await CampaignMilestone.find({ campaignId: { $in: campaignIds } });
    const pendingMilestones = milestones.filter(m => m.status === 'PENDING' || m.status === 'FUNDED').length;

    const evidenceList = await Evidence.find({ campaignId: { $in: campaignIds } });
    const evidencePendingReview = evidenceList.filter(e => e.adminStatus === 'PENDING').length;

    return res.json({
      totalRaised,
      activeCampaigns,
      completedCampaigns,
      totalBeneficiaries,
      pendingMilestones,
      evidencePendingReview,
      campaignsCount: campaigns.length,
      transparencyScore: ngo.transparencyScore,
      verificationStatus: ngo.verificationStatus,
      documents: ngo.documents || [],
      orgName: ngo.orgName,
      darpanId: ngo.darpanId,
      pan: ngo.pan,
      status12A: ngo.status12A,
      status80G: ngo.status80G,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load stats', error: err.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { title, fileUrl } = req.body;
    if (!title || !fileUrl) {
      return res.status(400).json({ message: 'Title and document URL are required.' });
    }

    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) return res.status(404).json({ message: 'NGO record not found.' });

    if (!ngo.documents) ngo.documents = [];
    ngo.documents.push({
      title,
      fileUrl,
      uploadedAt: new Date(),
    });

    // If was rejected or pending, place under review
    if (ngo.verificationStatus === 'REJECTED') {
      ngo.verificationStatus = 'UNDER_REVIEW';
    }
    await ngo.save();

    return res.json({
      message: 'Document uploaded successfully and queued for compliance verification.',
      documents: ngo.documents,
      ngo,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to upload document', error: err.message });
  }
};
