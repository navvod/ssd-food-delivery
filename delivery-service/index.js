const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const driverRoutes = require("./src/routes/driverRoutes");
const deliveryoutes = require("./src/routes/deliveryOrderRoutes");


dotenv.config();
connectDB();


const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/driver", driverRoutes);
app.use("/api/delivery", deliveryoutes);


const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

