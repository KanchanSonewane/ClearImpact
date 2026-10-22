const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CampaignMilestone',
    required: true,
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  reportText: {
    type: String,
    required: true,
  },
  beforePhotoUrl: {
    type: String,
    default: '',
  },
  afterPhotoUrl: {
    type: String,
    required: true,
  },
  supportingDocs: [{
    title: String,
    fileUrl: String,
  }],
  beneficiariesReached: {
    type: Number,
    default: 0,
  },
  locationVerified: {
    type: String,
    default: '',
  },
  imageHash: {
    type: String,
    default: '',
  },
  exifData: {
    hasExif: { type: Boolean, default: false },
    dateTimeOriginal: Date,
    make: String,
    model: String,
    software: String,
    gpsLatitude: Number,
    gpsLongitude: Number,
    raw: mongoose.Schema.Types.Mixed,
  },
  riskScore: {
    type: Number,
    default: 10,
    min: 0,
    max: 100,
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'FLAGGED'],
    default: 'LOW',
  },
  riskReasons: [{
    code: String,
    title: String,
    description: String,
    weight: Number,
    passed: Boolean,
  }],
  adminStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'MORE_INFO_REQUESTED'],
    default: 'PENDING',
  },
  adminNotes: {
    type: String,
    default: '',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
  aiImpactSummary: {
    text: String,
    generatedAt: Date,
    isAiGenerated: { type: Boolean, default: true },
    groundedSources: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Evidence', evidenceSchema);
