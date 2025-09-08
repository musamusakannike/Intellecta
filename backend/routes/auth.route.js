const express = require("express");
const { register } = require("../controllers/auth.controller");
const handleValidationErrors = require("../validations/handler.validation");
const { registerValidation } = require("../validations/auth.validation");

const router = express.Router();

router.post("/register", registerValidation, handleValidationErrors, register);

module.exports = router;