const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  console.log("Validating...")
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({
      success: false,
      errors: errors.array(),
      message: "Validation failed",
    });
  }

  next();
};

module.exports = handleValidationErrors;
