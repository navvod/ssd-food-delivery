const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const dotenv = require('dotenv');
const helmet = require("helmet"); // Added helmet for security headers

// Load environment variables
dotenv.config();

const app = express();


app.use(
  helmet({
    // Configure Content Security Policy (CSP)
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Only allow resources from the same origin
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow scripts from same origin and inline scripts (adjust as needed)
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow styles from same origin and inline styles
        imgSrc: ["'self'", "data:"], // Allow images from same origin and data URIs
        connectSrc: ["'self'", "http://localhost:5000"], // Allow connections to same origin and local API
        fontSrc: ["'self'"], // Allow fonts from same origin
        objectSrc: ["'none'"], // Block object tags
        mediaSrc: ["'self'"], // Allow media from same origin
        frameSrc: ["'none'"], // Block iframes unless needed
        upgradeInsecureRequests: [], // Enforce HTTPS
      },
    },
    // Enable other Helmet protections
    crossOriginEmbedderPolicy: true, // Restrict cross-origin embedding
    crossOriginOpenerPolicy: true, // Restrict cross-origin window access
    crossOriginResourcePolicy: true, // Restrict cross-origin resource sharing
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Control referrer information
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true, // Apply to subdomains
      preload: true, // Enable HSTS preload
    },
    xssFilter: true, // Enable XSS filter
    noSniff: true, // Prevent MIME-type sniffing
    hidePoweredBy: true, // Remove X-Powered-By header
  })
);


// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/gateway.log' }),
  ],
});

// Configure CORS with specific options for security
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Restrict to specific client origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Allow cookies if needed
  })
);
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    headers: req.headers,
  });
  next();
});

// Authentication middleware (except for public routes)
const verifyToken = (req, res, next) => {
  const publicRoutes = ['/api/auth/login', '/api/auth/register'];
  if (publicRoutes.includes(req.path)) {
    return next(); // Skip authentication for login/register
  }
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    logger.warn('No token provided', { path: req.path });
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Invalid token', { error: error.message, path: req.path });
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.use(verifyToken);

// Route to User Service
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || 'http://localhost:5000',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      logger.info('Routing to User Service', { path: req.path });
    },
    onError: (err, req, res) => {
      logger.error('User Service error', { error: err.message, path: req.path });
      res.status(503).json({ message: 'User Service unavailable' });
    },
  })
);

// Placeholder for future Restaurant Service
app.use(
  '/api/restaurants',
  createProxyMiddleware({
    target: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      logger.info('Routing to Restaurant Service', { path: req.path });
    },
    onError: (err, req, res) => {
      logger.error('Restaurant Service error', { error: err.message, path: req.path });
      res.status(503).json({ message: 'Restaurant Service unavailable' });
    },
  })
);

// Placeholder for future Order Service
app.use(
  '/api/orders',
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      logger.info('Routing to Order Service', { path: req.path });
    },
    onError: (err, req, res) => {
      logger.error('Order Service error', { error: err.message, path: req.path });
      res.status(503).json({ message: 'Order Service unavailable' });
    },
  })
);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Gateway error', { error: err.message, path: req.path });
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`API Gateway running on http://localhost:${PORT}`);
});