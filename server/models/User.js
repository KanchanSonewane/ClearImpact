const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['DONOR', 'NGO', 'ADMIN'],
    default: 'DONOR',
  },
  avatar: {
    type: String,
    default: '',
  },
  preferences: {
    causes: [{ type: String }],
    preferredLocations: [{ type: String }],
    minBudget: { type: Number, default: 500 },
    maxBudget: { type: Number, default: 10000 },
    impactPreference: { type: String, default: 'High transparency and verified milestone evidence' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
