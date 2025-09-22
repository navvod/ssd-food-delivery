const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./src/config/db");
const notificationRoutes = require("./src/routes/notificationRoutes");


connectDB();


const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/notifications", notificationRoutes);



const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

