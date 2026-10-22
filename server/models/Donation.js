const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 10,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  paymentGateway: {
    type: String,
    default: 'RAZORPAY_SANDBOX',
  },
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'SUCCESS',
  },
  donorName: {
    type: String,
    default: 'Generous Supporter',
  },
  donorEmail: {
    type: String,
    default: '',
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  taxReceiptNumber: {
    type: String,
    default: () => '80G-' + Math.floor(100000 + Math.random() * 900000),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Donation', donationSchema);
