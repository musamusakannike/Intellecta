const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "30d"; // 30 days

/**
 * Generate access token
 * @param {string} userId - User ID
 * @returns {string} Access token
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generate refresh token
 * @returns {string} Refresh token
 */
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Hash refresh token for storage
 * @param {string} refreshToken - Raw refresh token
 * @returns {Promise<string>} Hashed refresh token
 */
const hashRefreshToken = async (refreshToken) => {
  return await bcrypt.hash(refreshToken, 10);
};

/**
 * Verify refresh token against stored hash
 * @param {string} refreshToken - Raw refresh token
 * @param {string} hashedToken - Stored hashed token
 * @returns {Promise<boolean>} True if tokens match
 */
const verifyRefreshToken = async (refreshToken, hashedToken) => {
  return await bcrypt.compare(refreshToken, hashedToken);
};

/**
 * Verify access token
 * @param {string} token - Access token
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Get refresh token expiry date
 * @returns {Date} Expiry date
 */
const getRefreshTokenExpiry = () => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
};

/**
 * Generate both access and refresh tokens for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Object containing both tokens and expiry
 */
const generateTokenPair = async (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = await hashRefreshToken(refreshToken);
  const refreshTokenExpiry = getRefreshTokenExpiry();

  return {
    accessToken,
    refreshToken,
    refreshTokenHash,
    refreshTokenExpiry,
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
  getRefreshTokenExpiry,
  generateTokenPair,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
};
