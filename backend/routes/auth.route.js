const express = require("express");
const { register, login, verifyEmail, resendVerificationCode, refreshToken, logout, verifyToken } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");
const handleValidationErrors = require("../validations/handler.validation");
const { registerValidation, loginValidation, verifyEmailValidation, resendCodeValidation } = require("../validations/auth.validation");

const router = express.Router();

router.post("/register", registerValidation(), handleValidationErrors, register);
router.post("/login", loginValidation(), handleValidationErrors, login);
router.post("/verify-email", verifyEmailValidation(), handleValidationErrors, verifyEmail);
router.post("/resend-code", resendCodeValidation(), handleValidationErrors, resendVerificationCode);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// Verify current access token
router.get("/verify", authenticate, verifyToken);

module.exports = router;
