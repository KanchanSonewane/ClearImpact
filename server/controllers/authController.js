const jwt = require('jsonwebtoken');
const User = require('../models/User');
const NGO = require('../models/NGO');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, ngoData } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (role === 'ADMIN') {
      return res.status(403).json({ message: 'Administrative accounts cannot be self-registered.' });
    }

    const assignedRole = role === 'NGO' ? 'NGO' : 'DONOR';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const user = new User({
      name,
      email,
      password,
      role: assignedRole,
      preferences: assignedRole === 'DONOR' ? {
        causes: ['Education', 'Healthcare'],
        preferredLocations: ['Maharashtra'],
        minBudget: 500,
        maxBudget: 5000,
      } : undefined,
    });

    await user.save();

    let createdNGO = null;
    if (assignedRole === 'NGO') {
      createdNGO = new NGO({
        userId: user._id,
        orgName: ngoData?.orgName || name,
        darpanId: ngoData?.darpanId || `MH/2026/${Math.floor(100000 + Math.random() * 900000)}`,
        registrationId: ngoData?.registrationId || `REG-${Date.now()}`,
        pan: ngoData?.pan || 'AAATV1234D',
        status12A: ngoData?.status12A || 'YES',
        status80G: ngoData?.status80G || 'YES',
        address: ngoData?.address || { city: 'Nagpur', state: 'Maharashtra' },
        contact: {
          email: user.email,
          phone: ngoData?.phone || '+91 98765 43210',
          website: ngoData?.website || 'https://vidyafoundation.org',
        },
        description: ngoData?.description || 'Grassroots NGO committed to community empowerment and education.',
        mission: ngoData?.mission || 'Ensuring transparent, measurable impact for underprivileged communities.',
        verificationStatus: 'PENDING',
        documents: (ngoData?.documents && Array.isArray(ngoData.documents) && ngoData.documents.length > 0)
          ? ngoData.documents
          : [
              {
                title: 'NGO Darpan Official Registration Certificate',
                fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
                uploadedAt: new Date()
              },
              {
                title: 'Income Tax 12A / 80G Statutory Exemption Order',
                fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
                uploadedAt: new Date()
              },
              {
                title: 'Organization Entity PAN Card Proof',
                fileUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=800&q=80',
                uploadedAt: new Date()
              }
            ],
      });
      await createdNGO.save();
    }

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences,
      },
      ngo: createdNGO,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    let ngo = null;
    if (user.role === 'NGO') {
      ngo = await NGO.findOne({ userId: user._id });
    }

    const token = generateToken(user._id, user.role);

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences,
      },
      ngo,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    let ngo = null;
    if (req.user.role === 'NGO') {
      ngo = await NGO.findOne({ userId: req.user._id });
    }

    return res.json({
      user: req.user,
      ngo,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve profile.', error: err.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { causes, preferredLocations, minBudget, maxBudget, impactPreference } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.preferences = {
      causes: causes || user.preferences.causes,
      preferredLocations: preferredLocations || user.preferences.preferredLocations,
      minBudget: minBudget !== undefined ? minBudget : user.preferences.minBudget,
      maxBudget: maxBudget !== undefined ? maxBudget : user.preferences.maxBudget,
      impactPreference: impactPreference || user.preferences.impactPreference,
    };

    await user.save();
    return res.json({ message: 'Preferences updated successfully.', preferences: user.preferences });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update preferences.', error: err.message });
  }
};
