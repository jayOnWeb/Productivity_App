const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    // --- OTP fields (temporary, for verification) ---
    otp: {
        type: String,
        default: null,
    },
    otpExpiry: {
        type: Date,
        default: null,
    },
    pendingEmail: {
        type: String,
        default: null,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;