const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const driverRoutes = require("./src/routes/driverRoutes");
const deliveryoutes = require("./src/routes/deliveryOrderRoutes");
const helmet = require("helmet"); // Added helmet for security headers


dotenv.config();
connectDB();


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

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/driver", driverRoutes);
app.use("/api/delivery", deliveryoutes);


const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

