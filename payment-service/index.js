const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./src/config/db");
const paymentRoutes = require("./src/routes/paymentRoutes");
const cardRoutes = require('./src/routes/cardRoutes');


connectDB();


const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/payments", paymentRoutes);
app.use("/api/card", cardRoutes);



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

