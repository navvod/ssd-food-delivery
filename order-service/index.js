const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const orderRoutes = require('./src/routes/orderRoutes');
const helmet = require("helmet"); // Added helmet for security headers

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


//frontend
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));




app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));