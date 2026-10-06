const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");
const adminM = require("./middleware/adminM");
const bookingRoutes = require("./routes/bookingRoutes");


dotenv.config();

const app = express();

connectDB();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Service Booking API is running"
    });
});

app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});