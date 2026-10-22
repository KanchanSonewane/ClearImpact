const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 1,
  },
  releasedAmount: {
    type: Number,
    default: 0,
  },
  evidenceRequirements: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      'PENDING',
      'FUNDED',
      'EVIDENCE_SUBMITTED',
      'UNDER_REVIEW',
      'APPROVED',
      'RELEASED',
      'REJECTED'
    ],
    default: 'PENDING',
  },
  completionDate: {
    type: Date,
  },
  releasedAt: {
    type: Date,
  },
  adminNotes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CampaignMilestone', milestoneSchema);
