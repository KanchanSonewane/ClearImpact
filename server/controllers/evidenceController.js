const Evidence = require('../models/Evidence');
const CampaignMilestone = require('../models/CampaignMilestone');
const Campaign = require('../models/Campaign');
const NGO = require('../models/NGO');
const { analyzeEvidenceRisk } = require('../services/riskAnalysisService');

exports.uploadEvidence = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) return res.status(403).json({ message: 'Only registered NGOs can submit evidence.' });

    if (ngo.verificationStatus !== 'VERIFIED') {
      return res.status(403).json({
        message: 'Organization verification required. Your statutory documents are currently pending administrator review. You cannot submit milestone evidence until verified.',
        verificationStatus: ngo.verificationStatus,
      });
    }

    const {
      campaignId,
      milestoneId,
      title,
      reportText,
      beneficiariesReached,
      locationVerified,
      forceDuplicate,
      forceTamper,
    } = req.body;

    if (!campaignId || !milestoneId || !title || !reportText) {
      return res.status(400).json({ message: 'Missing required evidence submission fields.' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const milestone = await CampaignMilestone.findById(milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    // Handle uploaded files or fallback URLs
    let afterPhotoUrl = '';
    let beforePhotoUrl = '';
    let photoBuffer = null;

    if (req.files) {
      if (req.files.afterPhoto && req.files.afterPhoto[0]) {
        afterPhotoUrl = `/uploads/${req.files.afterPhoto[0].filename}`;
        photoBuffer = req.files.afterPhoto[0].buffer;
      }
      if (req.files.beforePhoto && req.files.beforePhoto[0]) {
        beforePhotoUrl = `/uploads/${req.files.beforePhoto[0].filename}`;
      }
    }

    // If client supplied URL directly (e.g. from gallery or demo upload)
    if (!afterPhotoUrl && req.body.afterPhotoUrl) {
      afterPhotoUrl = req.body.afterPhotoUrl;
    }
    if (!beforePhotoUrl && req.body.beforePhotoUrl) {
      beforePhotoUrl = req.body.beforePhotoUrl;
    }

    if (!afterPhotoUrl) {
      afterPhotoUrl = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80';
    }

    // Run explainable risk analysis
    const riskAnalysis = await analyzeEvidenceRisk({
      filePath: req.files?.afterPhoto?.[0]?.path,
      buffer: photoBuffer,
      campaignCreatedAt: campaign.createdAt,
      forceDuplicate: forceDuplicate === 'true' || forceDuplicate === true,
      forceTamper: forceTamper === 'true' || forceTamper === true,
    });

    const evidence = new Evidence({
      campaignId: campaign._id,
      milestoneId: milestone._id,
      ngoId: ngo._id,
      title,
      reportText,
      beforePhotoUrl,
      afterPhotoUrl,
      beneficiariesReached: Number(beneficiariesReached || campaign.beneficiariesCount || 0),
      locationVerified: locationVerified || campaign.location,
      imageHash: riskAnalysis.imageHash,
      exifData: riskAnalysis.exifData,
      riskScore: riskAnalysis.riskScore,
      riskLevel: riskAnalysis.riskLevel,
      riskReasons: riskAnalysis.riskReasons,
      adminStatus: 'PENDING',
    });

    await evidence.save();

    // Update milestone status
    milestone.status = 'UNDER_REVIEW';
    await milestone.save();

    return res.status(201).json({
      message: 'Evidence submitted successfully and processed through explainable risk analysis.',
      evidence,
      riskSummary: riskAnalysis,
    });
  } catch (err) {
    console.error('Evidence upload error:', err);
    return res.status(500).json({ message: 'Failed to upload evidence', error: err.message });
  }
};

exports.getEvidenceById = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id)
      .populate('campaignId', 'title causeCategory location targetAmount')
      .populate('milestoneId', 'title order targetAmount status')
      .populate('ngoId', 'orgName darpanId verificationStatus logoUrl');

    if (!evidence) return res.status(404).json({ message: 'Evidence record not found' });
    return res.json(evidence);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch evidence', error: err.message });
  }
};

exports.getCampaignEvidence = async (req, res) => {
  try {
    const evidenceList = await Evidence.find({ campaignId: req.params.campaignId })
      .populate('milestoneId', 'title order status')
      .sort({ createdAt: -1 });
    return res.json(evidenceList);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch evidence list', error: err.message });
  }
};
