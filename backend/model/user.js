import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean, // <-- corrected here
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpireAt:  Date,
    verificationToken: String,
    verificationTokenExpiredAt: Date,
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);
