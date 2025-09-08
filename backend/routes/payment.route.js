const express = require("express");
const {
  initiatePremiumPayment,
  verifyPayment,
  handleWebhook,
  getPaymentHistory,
  getPremiumStatus,
  cancelPayment,
} = require("../controllers/payment.controller");

const { authenticate } = require("../middleware/auth.middleware");
const handleValidationErrors = require("../validations/handler.validation");
const {
  initiatePremiumPaymentValidation,
  verifyPaymentValidation,
  transactionIdValidation,
  paginationValidation,
} = require("../validations/payment.validation");

const router = express.Router();

// Public routes (no authentication required)
// Flutterwave webhook - must be public
router.post("/webhook", handleWebhook);

// Payment verification - can be called from frontend after redirect
router.get("/verify", verifyPaymentValidation(), handleValidationErrors, verifyPayment);

// Protected routes (authentication required)
router.use(authenticate);

// Initialize premium payment
router.post(
  "/premium/initiate",
  initiatePremiumPaymentValidation(),
  handleValidationErrors,
  initiatePremiumPayment
);

// Get premium status
router.get("/premium/status", getPremiumStatus);

// Get payment history with pagination
router.get(
  "/history",
  paginationValidation(),
  handleValidationErrors,
  getPaymentHistory
);

// Cancel pending payment
router.put(
  "/cancel/:transactionId",
  transactionIdValidation(),
  handleValidationErrors,
  cancelPayment
);

module.exports = router;
