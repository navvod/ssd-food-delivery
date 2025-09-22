const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
//const authRoutes = require("./src/routes/authRoutes");
const restaurantRoutes = require('./routes/restaurantRoutes');


dotenv.config();
connectDB();


const app = express();

app.use(express.json());
app.use(cors());

// Routes
//app.use("/api/auth", authRoutes);
app.use('/api/restaurants', restaurantRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

