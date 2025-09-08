const express = require("express");
const {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  deleteProfilePicture,
  updateExpoPushToken,
  deleteAccount,
  getAllUsers,
  getUserById,
  adminUpdateUser,
  adminDeleteUser,
  getDashboardStats,
} = require("../controllers/user.controller");

const { authenticate, requireAdmin, requireOwnershipOrAdmin } = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary.config");
const handleValidationErrors = require("../validations/handler.validation");
const {
  updateProfileValidation,
  changePasswordValidation,
  updateExpoPushTokenValidation,
  userIdValidation,
  adminUpdateUserValidation,
} = require("../validations/user.validation");

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// USER ROUTES
// Get current user profile
router.get("/profile", getProfile);

// Update user profile
router.put("/profile", updateProfileValidation(), handleValidationErrors, updateProfile);

// Change password
router.put("/change-password", changePasswordValidation(), handleValidationErrors, changePassword);

// Upload profile picture
router.post("/profile-picture", upload.single("profilePicture"), uploadProfilePicture);

// Delete profile picture
router.delete("/profile-picture", deleteProfilePicture);

// Update Expo push token
router.put("/expo-token", updateExpoPushTokenValidation(), handleValidationErrors, updateExpoPushToken);

// Delete user account
router.delete("/account", deleteAccount);

// ADMIN ROUTES
// Get dashboard stats
router.get("/admin/dashboard", requireAdmin, getDashboardStats);

// Get all users with filtering and pagination
router.get("/admin/users", requireAdmin, getAllUsers);

// Get user by ID
router.get("/admin/users/:id", requireAdmin, userIdValidation(), handleValidationErrors, getUserById);

// Update user (admin only)
router.put("/admin/users/:id", requireAdmin, adminUpdateUserValidation(), handleValidationErrors, adminUpdateUser);

// Delete user (admin only)
router.delete("/admin/users/:id", requireAdmin, userIdValidation(), handleValidationErrors, adminDeleteUser);

module.exports = router;
