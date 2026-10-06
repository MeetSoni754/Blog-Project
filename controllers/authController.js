const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: "15m"
            }
        );

        const refreshToken = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: "7d"
            }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    signup,
    login
};