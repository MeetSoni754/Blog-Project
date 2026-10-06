const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createBooking
} = require("../controllers/bookingController");

router.post(
    "/bookings",
    authMiddleware,
    createBooking
);

module.exports = router;