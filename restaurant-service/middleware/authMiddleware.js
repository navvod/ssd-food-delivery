const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication required: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    if (!decoded.id) {
      return res.status(400).json({ error: 'Invalid token: Missing user ID' });
    }

    req.user = decoded; // Attach user info (e.g., id) to request
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please log in again' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Optional: Add authorize middleware if needed for role-based access
const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ error: `Access denied: ${role} role required` });
  }
  next();
};

module.exports = { protect, authorize };