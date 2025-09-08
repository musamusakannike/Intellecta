const User = require("../models/user.model");
const { error, success } = require("../util/response.util");
const bcrypt = require("bcryptjs");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary.config");

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }

    return success({
      res,
      message: "Profile retrieved successfully",
      data: { user }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve profile" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;
    
    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return error({ res, message: "Email is already in use", statusCode: 409 });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      updateData.email = email;
      updateData.verified = false; // Require re-verification if email changes
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    return success({
      res,
      message: "Profile updated successfully",
      data: { user: updatedUser }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to update profile" });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return error({ res, message: "Current password is incorrect", statusCode: 400 });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    return success({
      res,
      message: "Password changed successfully"
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to change password" });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return error({ res, message: "No image file provided", statusCode: 400 });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }

    // Delete old profile picture if exists
    if (user.profilePicture?.publicId) {
      try {
        await deleteFromCloudinary(user.profilePicture.publicId);
      } catch (deleteError) {
        console.warn("Failed to delete old profile picture:", deleteError);
      }
    }

    // Upload new image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, "profile-pictures");
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePicture: {
          url: result.secure_url,
          publicId: result.public_id
        }
      },
      { new: true }
    ).select("-password");

    return success({
      res,
      message: "Profile picture uploaded successfully",
      data: { 
        user: updatedUser,
        profilePicture: {
          url: result.secure_url,
          publicId: result.public_id
        }
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to upload profile picture" });
  }
};

// Delete profile picture
const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }

    if (!user.profilePicture?.publicId) {
      return error({ res, message: "No profile picture to delete", statusCode: 400 });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(user.profilePicture.publicId);
    
    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { profilePicture: 1 } },
      { new: true }
    ).select("-password");

    return success({
      res,
      message: "Profile picture deleted successfully",
      data: { user: updatedUser }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to delete profile picture" });
  }
};

// Update Expo push token
const updateExpoPushToken = async (req, res) => {
  try {
    const { expoPushToken } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { expoPushToken },
      { new: true }
    ).select("-password");

    return success({
      res,
      message: "Expo push token updated successfully",
      data: { user: updatedUser }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to update push token" });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }

    // Delete profile picture from Cloudinary if exists
    if (user.profilePicture?.publicId) {
      try {
        await deleteFromCloudinary(user.profilePicture.publicId);
      } catch (deleteError) {
        console.warn("Failed to delete profile picture:", deleteError);
      }
    }

    await User.findByIdAndDelete(userId);

    return success({
      res,
      message: "Account deleted successfully"
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to delete account" });
  }
};

// ADMIN FUNCTIONALITIES

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.verified !== undefined) filter.verified = req.query.verified === 'true';
    if (req.query.isPremium !== undefined) filter.isPremium = req.query.isPremium === 'true';

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return success({
      res,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve users" });
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select("-password");
    
    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }

    return success({
      res,
      message: "User retrieved successfully",
      data: { user }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve user" });
  }
};

// Update user (Admin only)
const adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, verified, isPremium, premiumExpiryDate } = req.body;

    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (verified !== undefined) updateData.verified = verified;
    if (isPremium !== undefined) updateData.isPremium = isPremium;
    if (premiumExpiryDate !== undefined) updateData.premiumExpiryDate = new Date(premiumExpiryDate);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return error({ res, message: "User not found", statusCode: 404 });
    }

    return success({
      res,
      message: "User updated successfully",
      data: { user: updatedUser }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to update user" });
  }
};

// Delete user (Admin only)
const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }

    // Delete profile picture from Cloudinary if exists
    if (user.profilePicture?.publicId) {
      try {
        await deleteFromCloudinary(user.profilePicture.publicId);
      } catch (deleteError) {
        console.warn("Failed to delete profile picture:", deleteError);
      }
    }

    await User.findByIdAndDelete(id);

    return success({
      res,
      message: "User deleted successfully"
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to delete user" });
  }
};

// Get dashboard stats (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ verified: true });
    const premiumUsers = await User.countDocuments({ isPremium: true });
    const adminUsers = await User.countDocuments({ role: "admin" });
    
    // Users registered in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    // Premium users expiring in next 30 days
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expiringPremium = await User.countDocuments({
      isPremium: true,
      premiumExpiryDate: { $lte: thirtyDaysFromNow }
    });

    return success({
      res,
      message: "Dashboard stats retrieved successfully",
      data: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        premiumUsers,
        adminUsers,
        recentUsers,
        expiringPremium,
        verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0,
        premiumRate: totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : 0
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve dashboard stats" });
  }
};

module.exports = {
  // User functions
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  deleteProfilePicture,
  updateExpoPushToken,
  deleteAccount,
  
  // Admin functions
  getAllUsers,
  getUserById,
  adminUpdateUser,
  adminDeleteUser,
  getDashboardStats,
};
