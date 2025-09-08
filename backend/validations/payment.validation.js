const { body, query, param } = require("express-validator");

// Validation for initiating premium payment
const initiatePremiumPaymentValidation = () => [
  body("duration")
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage("Duration must be between 1 and 24 months"),
];

// Validation for payment verification
const verifyPaymentValidation = () => [
  query("tx_ref")
    .notEmpty()
    .withMessage("Transaction reference is required")
    .isString()
    .withMessage("Transaction reference must be a string"),
  query("transaction_id")
    .optional()
    .isString()
    .withMessage("Transaction ID must be a string"),
];

// Validation for transaction ID parameter
const transactionIdValidation = () => [
  param("transactionId")
    .notEmpty()
    .withMessage("Transaction ID is required")
    .isString()
    .withMessage("Transaction ID must be a string")
    .matches(/^INTELLECTA_PREMIUM_/)
    .withMessage("Invalid transaction ID format"),
];

// Validation for pagination parameters
const paginationValidation = () => [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

module.exports = {
  initiatePremiumPaymentValidation,
  verifyPaymentValidation,
  transactionIdValidation,
  paginationValidation,
};
