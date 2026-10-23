const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('./auth');

const optionalAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid authorization header.' });
  }

  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid session.' });
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expired. Please sign in again.' });
  }
};

module.exports = optionalAuthenticate;
