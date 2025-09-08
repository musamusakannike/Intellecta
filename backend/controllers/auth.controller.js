const User = require("../models/user.model");
const { error, success } = require("../util/response.util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail, sendWelcomeEmail } = require("../util/email.util");

const VERIFICATION_EXP_MINUTES = 15;

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

const register = async (req, res) => {
  try {
    const { name, email, password, expoPushToken } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return error({ res, message: "User already exists", statusCode: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateCode();
    const expires = new Date(Date.now() + VERIFICATION_EXP_MINUTES * 60 * 1000);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      expoPushToken,
      verificationCode: code,
      verificationCodeExpires: expires,
      verified: false,
    });
    await newUser.save();

    // Send verification email (non-blocking but awaited to surface SMTP errors)
    await sendVerificationEmail({ to: email, name, code });

    const data = { email };
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      // Dev convenience: return code if SMTP isn't configured
      data.devVerificationCode = code;
    }

    success({
      res,
      message: "Registration successful. Verification code sent to email.",
      statusCode: 201,
      data,
    });
  } catch (err) {
    return error({ res, message: err?.message || "Registration failed" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }
    if (user.verified) {
      // Already verified - return token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
      return success({
        res,
        message: "Email already verified",
        data: {
          token,
          user: { id: user._id, name: user.name, email: user.email },
        },
      });
    }
    if (!user.verificationCode || !user.verificationCodeExpires) {
      return error({ res, message: "No verification code found. Please resend.", statusCode: 400 });
    }
    if (new Date() > new Date(user.verificationCodeExpires)) {
      return error({ res, message: "Verification code expired. Please resend.", statusCode: 400 });
    }
    if (String(code).trim() !== String(user.verificationCode)) {
      return error({ res, message: "Invalid verification code", statusCode: 400 });
    }

    user.verified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail({ to: user.email, name: user.name });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    return success({
      res,
      message: "Email verified successfully",
      data: { token, user: { id: user._id, name: user.name, email: user.email } },
    });
  } catch (err) {
    return error({ res, message: err?.message || "Verification failed" });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }
    if (user.verified) {
      return success({ res, message: "Email already verified" });
    }
    const code = generateCode();
    const expires = new Date(Date.now() + VERIFICATION_EXP_MINUTES * 60 * 1000);
    user.verificationCode = code;
    user.verificationCodeExpires = expires;
    await user.save();

    await sendVerificationEmail({ to: user.email, name: user.name, code });

    return success({ res, message: "Verification code resent" });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to resend code" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return error({ res, message: "Invalid email or password", statusCode: 401 });
    }
    
    // Check if user is verified
    if (!user.verified) {
      return error({ res, message: "Please verify your email before logging in", statusCode: 401 });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return error({ res, message: "Invalid email or password", statusCode: 401 });
    }
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    
    // Update last login (optional)
    user.updatedAt = new Date();
    await user.save();
    
    return success({
      res,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isPremium: user.isPremium,
          premiumExpiryDate: user.premiumExpiryDate
        }
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Login failed" });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
};
