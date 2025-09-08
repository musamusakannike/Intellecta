const { body, param } = require("express-validator");

const updateProfileValidation = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
  ];
};

const changePasswordValidation = () => {
  return [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("New password must be at least 8 characters with uppercase, lowercase, and number"),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("Password confirmation does not match");
        }
        return true;
      }),
  ];
};

const updateExpoPushTokenValidation = () => {
  return [
    body("expoPushToken")
      .notEmpty()
      .isString()
      .withMessage("Valid Expo push token is required"),
  ];
};

const userIdValidation = () => {
  return [
    param("id")
      .isMongoId()
      .withMessage("Valid user ID is required"),
  ];
};

const adminUpdateUserValidation = () => {
  return [
    param("id")
      .isMongoId()
      .withMessage("Valid user ID is required"),
    body("role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Role must be either 'user' or 'admin'"),
    body("verified")
      .optional()
      .isBoolean()
      .withMessage("Verified must be a boolean"),
    body("isPremium")
      .optional()
      .isBoolean()
      .withMessage("isPremium must be a boolean"),
    body("premiumExpiryDate")
      .optional()
      .isISO8601()
      .withMessage("Premium expiry date must be a valid date"),
  ];
};

const getUsersValidation = () => {
  return [
    param("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    param("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
  ];
};

module.exports = {
  updateProfileValidation,
  changePasswordValidation,
  updateExpoPushTokenValidation,
  userIdValidation,
  adminUpdateUserValidation,
  getUsersValidation,
};
