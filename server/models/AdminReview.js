const mongoose = require('mongoose');

const adminReviewSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  entityType: {
    type: String,
    enum: ['NGO', 'CAMPAIGN', 'EVIDENCE', 'MILESTONE'],
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  decision: {
    type: String,
    enum: ['APPROVED', 'REJECTED', 'REQUESTED_CHANGES'],
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  riskScoreObserved: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AdminReview', adminReviewSchema);
