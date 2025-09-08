const express = require("express");
const { register, login, verifyEmail, resendVerificationCode, refreshToken, logout } = require("../controllers/auth.controller");
const handleValidationErrors = require("../validations/handler.validation");
const { registerValidation, loginValidation, verifyEmailValidation, resendCodeValidation } = require("../validations/auth.validation");

const router = express.Router();

router.post("/register", registerValidation(), handleValidationErrors, register);
router.post("/login", loginValidation(), handleValidationErrors, login);
router.post("/verify-email", verifyEmailValidation(), handleValidationErrors, verifyEmail);
router.post("/resend-code", resendCodeValidation(), handleValidationErrors, resendVerificationCode);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;