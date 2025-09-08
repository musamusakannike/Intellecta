const { body } = require("express-validator");

const registerValidation = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("expoPushToken")
      .optional()
      .notEmpty()
      .isString()
      .withMessage("Expo Push Token is required"),
  ];
};

const loginValidation = () => {
  return [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const verifyEmailValidation = () => {
  return [
    body("email").notEmpty().isEmail().withMessage("Valid email is required"),
    body("code")
      .notEmpty()
      .isLength({ min: 6, max: 6 })
      .matches(/^\d{6}$/)
      .withMessage("A 6-digit numeric code is required"),
  ];
};

const resendCodeValidation = () => {
  return [
    body("email").notEmpty().isEmail().withMessage("Valid email is required"),
  ];
};

module.exports = {
  registerValidation,
  loginValidation,
  verifyEmailValidation,
  resendCodeValidation,
};
