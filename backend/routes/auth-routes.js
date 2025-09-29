import express from "express";
import {verifyToken} from "../middleware/verifyToken.js"
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
  checkAuth
} from "../controller/auth-controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);

router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/check-auth", verifyToken, checkAuth);

export default router;
