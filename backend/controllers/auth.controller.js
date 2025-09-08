const User = require("../models/user.model");
const { error, success } = require("../util/response.util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../util/email.util");
const {
  generateTokenPair,
  verifyRefreshToken,
  generateAccessToken,
} = require("../util/jwt.util");

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

    const data = {
      user: {id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isPremium: newUser.isPremium,
        premiumExpiryDate: newUser.premiumExpiryDate,
      }
    };
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
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
      // Already verified - return tokens
      const {
        accessToken,
        refreshToken,
        refreshTokenHash,
        refreshTokenExpiry,
      } = await generateTokenPair(user._id);

      // Update refresh token in database
      user.refreshTokenHash = refreshTokenHash;
      user.refreshTokenExpires = refreshTokenExpiry;
      await user.save();

      return success({
        res,
        message: "Email already verified",
        data: {
          token: accessToken,
          refreshToken: refreshToken,
          user: { id: user._id, name: user.name, email: user.email },
        },
      });
    }
    if (!user.verificationCode || !user.verificationCodeExpires) {
      return error({
        res,
        message: "No verification code found. Please resend.",
        statusCode: 400,
      });
    }
    if (new Date() > new Date(user.verificationCodeExpires)) {
      return error({
        res,
        message: "Verification code expired. Please resend.",
        statusCode: 400,
      });
    }
    if (String(code).trim() !== String(user.verificationCode)) {
      return error({
        res,
        message: "Invalid verification code",
        statusCode: 400,
      });
    }

    user.verified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    // Generate access and refresh tokens
    const { accessToken, refreshToken, refreshTokenHash, refreshTokenExpiry } =
      await generateTokenPair(user._id);

    // Store refresh token hash in database
    user.refreshTokenHash = refreshTokenHash;
    user.refreshTokenExpires = refreshTokenExpiry;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail({ to: user.email, name: user.name });

    return success({
      res,
      message: "Email verified successfully",
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        user: { id: user._id, name: user.name, email: user.email },
      },
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
      return error({
        res,
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    // Check if user is verified
    if (!user.verified) {
      return error({
        res,
        message: "Please verify your email before logging in",
        statusCode: 401,
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return error({
        res,
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken, refreshTokenHash, refreshTokenExpiry } =
      await generateTokenPair(user._id);

    // Store refresh token hash in database
    user.refreshTokenHash = refreshTokenHash;
    user.refreshTokenExpires = refreshTokenExpiry;
    user.updatedAt = new Date();
    await user.save();

    return success({
      res,
      message: "Login successful",
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isPremium: user.isPremium,
          premiumExpiryDate: user.premiumExpiryDate,
        },
      },
    });
  } catch (err) {
    return error({ res, message: err?.message || "Login failed" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return error({
        res,
        message: "Refresh token is required",
        statusCode: 400,
      });
    }

    // Find all users with active refresh tokens
    const users = await User.find({
      refreshTokenHash: { $exists: true, $ne: null },
      refreshTokenExpires: { $gt: new Date() },
    });

    // Find the user whose refresh token matches
    let matchedUser = null;
    for (const user of users) {
      const isValidRefreshToken = await verifyRefreshToken(
        refreshToken,
        user.refreshTokenHash
      );
      if (isValidRefreshToken) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return error({ res, message: "Invalid refresh token", statusCode: 401 });
    }

    // Check if refresh token has expired (double-check since we already filtered above)
    if (new Date() > matchedUser.refreshTokenExpires) {
      return error({
        res,
        message: "Refresh token has expired",
        statusCode: 401,
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(matchedUser._id);

    return success({
      res,
      message: "Token refreshed successfully",
      data: {
        accessToken,
      },
    });
  } catch (err) {
    return error({ res, message: err?.message || "Token refresh failed" });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user?.id; // From auth middleware

    // If we have a user ID from auth middleware, clear their refresh token
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.refreshTokenHash = null;
        user.refreshTokenExpires = null;
        await user.save();
      }
    } else if (refreshToken) {
      // If no auth middleware but we have a refresh token, find and clear it
      const user = await User.findOne({
        refreshTokenHash: { $exists: true },
      });

      if (user) {
        const isValidRefreshToken = await verifyRefreshToken(
          refreshToken,
          user.refreshTokenHash
        );
        if (isValidRefreshToken) {
          user.refreshTokenHash = null;
          user.refreshTokenExpires = null;
          await user.save();
        }
      }
    }

    return success({
      res,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return success({
      res,
      message: "Logged out successfully", // Always return success for logout
    });
  }
};

// Verify access token and return current user info
const verifyToken = async (req, res) => {
  try {
    // authenticate middleware attaches the user to req.user if token is valid
    const user = req.user;

    if (!user) {
      return error({ res, message: "Authentication failed", statusCode: 401 });
    }

    return success({
      res,
      message: "Token is valid",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isPremium: user.isPremium,
          premiumExpiryDate: user.premiumExpiryDate,
        },
      },
    });
  } catch (err) {
    return error({ res, message: err?.message || "Token verification failed" });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  refreshToken,
  logout,
  verifyToken,
};
