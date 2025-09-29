import User from "../model/user.js";
import bcrypt from "bcryptjs";

import crypto from "crypto";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendwelcomeEmail,
  verificationEmail,
} from "../resend/email.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Fill in all fields" });
    }

    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const verificationTokenExpiredAt = new Date(Date.now() + 720 * 60 * 1000); // 12 hours from now

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiredAt,
    });
    await user.save();

    const token = generateJWTToken(user._id);

    res.cookie("token", token, {
      httpOnly: true, // prevents client-side JS from reading the cookie
      secure: process.env.NODE_ENV === "production", // ensures the cookie is only sent over HTTPS
      sameSite: "strict", // helps prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    await verificationEmail(verificationToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiredAt: { $gt: new Date() }, // Check if token is not expired
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiredAt = undefined;
    await user.save();
    await sendwelcomeEmail(user.email, user.name);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const verified = user.isVerified;
    if (!verified) {
      return res
        .status(400)
        .json({ success: false, message: "Please verify your email to login" });
    }
    const token = generateJWTToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Generate a new password reset token using crypto
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpireAt = resetPasswordExpireAt;
    await user.save();
    // Here, you would typically send the resetPasswordToken to the user's email address.
    await sendPasswordResetEmail(
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // ✅ Check for empty password
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "New password is required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpireAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // ✅ Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;

    await user.save();

    // ✅ Send confirmation email (pass email if needed)
    await sendResetSuccessEmail(user.name);

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// checkAuth.js
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
