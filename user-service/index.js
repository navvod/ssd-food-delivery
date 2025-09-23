const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const helmet = require("helmet"); // Added helmet for security headers


dotenv.config();
connectDB();


const app = express();

// Apply Helmet middleware to set secure HTTP headers
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

app.use(express.json());
// Configure CORS with specific options for security
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Restrict to specific client origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Allow cookies if needed
  })
);

// Routes
app.use("/api/auth", authRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

