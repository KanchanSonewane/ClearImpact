const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  causeCategory: {
    type: String,
    required: true,
    enum: ['Education', 'Healthcare', 'Environment', 'Rural Development', 'Women Empowerment', 'Disaster Relief', 'Hunger Relief'],
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 1000,
  },
  raisedAmount: {
    type: Number,
    default: 0,
  },
  beneficiariesCount: {
    type: Number,
    required: true,
    min: 1,
  },
  deadline: {
    type: Date,
    required: true,
  },
  problem: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  expectedImpact: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'COMPLETED', 'REJECTED'],
    default: 'PENDING_APPROVAL',
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
  },
  adminNotes: {
    type: String,
    default: '',
  },
  aiGeneratedContent: {
    shortDescription: String,
    story: String,
    donorAppeal: String,
    instagramCaption: String,
    linkedInPost: String,
    whatsAppMessage: String,
    emailAppeal: String,
    videoScript: String,
    callToAction: String,
    hasReviewWarning: { type: Boolean, default: false },
    unsupportedClaims: [String],
    reviewedByNGO: { type: Boolean, default: false },
  },
  transparencyScore: {
    type: Number,
    default: 88,
  },
  isDemo: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Campaign', campaignSchema);
