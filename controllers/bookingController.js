const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
    try {
        const { serviceName, date, time } = req.body;

        if (!serviceName || !date || !time) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const booking = await Booking.create({
            user: req.user.id,
            serviceName,
            date,
            time,
            status: "pending"
        });

        res.status(201).json({
            message: "Booking created successfully",
            booking
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createBooking
};