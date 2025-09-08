const express = require("express");
const { register, verifyEmail, resendVerificationCode } = require("../controllers/auth.controller");
const handleValidationErrors = require("../validations/handler.validation");
const { registerValidation, verifyEmailValidation, resendCodeValidation } = require("../validations/auth.validation");

const router = express.Router();

router.post("/register", registerValidation(), handleValidationErrors, register);
router.post("/verify-email", verifyEmailValidation(), handleValidationErrors, verifyEmail);
router.post("/resend-code", resendCodeValidation(), handleValidationErrors, resendVerificationCode);

module.exports = router;