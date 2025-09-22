const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to protect routes (verify JWT and attach user to request)
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info (e.g., id, role) to request
    next();
  } catch (error) {
    // Handle specific token errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please log in again' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware for role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated and has a valid role
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied: This route is restricted to ${roles.join(', ')}`,
      });
    }
    next();
  };
};

// Export both middleware functions
module.exports = { protect, authorize };