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

module.exports = {
  registerValidation,
  loginValidation,
};
