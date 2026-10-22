const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orgName: {
    type: String,
    required: true,
    trim: true,
  },
  darpanId: {
    type: String,
    required: true,
    trim: true,
  },
  registrationId: {
    type: String,
    required: true,
    trim: true,
  },
  pan: {
    type: String,
    required: true,
    trim: true,
  },
  status12A: {
    type: String,
    enum: ['YES', 'NO', 'APPLIED'],
    default: 'YES',
  },
  status80G: {
    type: String,
    enum: ['YES', 'NO', 'APPLIED'],
    default: 'YES',
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  contact: {
    phone: String,
    email: String,
    website: String,
    social: String,
  },
  description: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
    default: '',
  },
  documents: [{
    title: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'],
    default: 'PENDING',
  },
  verificationType: {
    type: String,
    default: 'Manual verification in prototype (Future: Official NGO Darpan API integration)',
  },
  verificationNotes: {
    type: String,
    default: '',
  },
  verifiedAt: {
    type: Date,
  },
  transparencyScore: {
    type: Number,
    default: 85,
    min: 0,
    max: 100,
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

module.exports = mongoose.model('NGO', ngoSchema);
