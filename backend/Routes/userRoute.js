const express = require('express');
const protect = require('../middleware/authMiddleware');
const User = require('../Models/User'); // adjust path if needed
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // add this at top
const bcrypt = require('bcryptjs'); // add this at top


const router = express.Router();

router.get('/dashboard', protect, (req, res) => {
    res.json({
        message: "Welcome to your dashboard",
        user: req.user,
    });
});

// ✅ Step 2 — Update Name
router.put('/update-name', protect, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Name cannot be empty" });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name: name.trim() },
            { new: true }
        ).select('-password -otp -otpExpiry -pendingEmail');

        res.json({ message: "Name updated successfully", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Step 3 — Request Email Change (Send OTP)
router.post('/request-email-change', protect, async (req, res) => {
    try {
        const { newEmail } = req.body;

        if (!newEmail || newEmail.trim() === "") {
            return res.status(400).json({ message: "New email cannot be empty" });
        }

        // Check if email already taken
        const existing = await User.findOne({ email: newEmail });
        if (existing) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Save OTP + pending email to user
        await User.findByIdAndUpdate(req.user._id, {
            otp,
            otpExpiry,
            pendingEmail: newEmail.trim(),
        });

        // Send OTP email
        await sendEmail(
            newEmail,
            "Verify your new email",
            `<h2>Email Change Request</h2>
             <p>Your OTP is: <strong>${otp}</strong></p>
             <p>This OTP expires in 10 minutes.</p>`
        );

        res.json({ message: "OTP sent to your new email" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Step 4 — Verify OTP & Update Email
router.put('/verify-email-change', protect, async (req, res) => {
    try {
        const { otp } = req.body;

        const user = await User.findById(req.user._id);

        // Check OTP exists
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ message: "No OTP requested" });
        }

        // Check OTP expiry
        if (new Date() > user.otpExpiry) {
            await User.findByIdAndUpdate(req.user._id, {
                otp: null,
                otpExpiry: null,
                pendingEmail: null,
            });
            return res.status(400).json({ message: "OTP expired, please request again" });
        }

        // Check OTP match
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // All good — update email
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                email: user.pendingEmail,
                otp: null,
                otpExpiry: null,
                pendingEmail: null,
            },
            { new: true }
        ).select('-password -otp -otpExpiry -pendingEmail');

        res.json({ message: "Email updated successfully", user: updatedUser });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Step 5a — Request Password Change (Send OTP to current email)
router.post('/request-password-change', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Save OTP to user
        await User.findByIdAndUpdate(req.user._id, {
            otp,
            otpExpiry,
        });

        // Send OTP to current email
        await sendEmail(
            user.email,
            "Password Change Request",
            `<h2>Password Change Request</h2>
             <p>Your OTP is: <strong>${otp}</strong></p>
             <p>This OTP expires in 10 minutes.</p>
             <p>If you did not request this, ignore this email.</p>`
        );

        res.json({ message: "OTP sent to your registered email" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Step 5b — Verify OTP & Update Password
router.put('/verify-password-change', protect, async (req, res) => {
    try {
        const { otp, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findById(req.user._id);

        // Check OTP exists
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ message: "No OTP requested" });
        }

        // Check OTP expiry
        if (new Date() > user.otpExpiry) {
            await User.findByIdAndUpdate(req.user._id, {
                otp: null,
                otpExpiry: null,
            });
            return res.status(400).json({ message: "OTP expired, please request again" });
        }

        // Check OTP match
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password & clear OTP
        await User.findByIdAndUpdate(req.user._id, {
            password: hashedPassword,
            otp: null,
            otpExpiry: null,
        });

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;