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

// Get extended profile data
const getProfileData = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }

    // Mock profile data for now - in production, this would come from various collections
    const profileData = {
      stats: {
        xp: 2450,
        completedCourses: 3,
        streakDays: 7,
        totalLessons: 45,
        studyTime: 180, // 3 hours
        rank: 12,
      },
      level: {
        current: 3,
        name: 'Code Explorer',
        xpRequired: 3000,
        xpCurrent: 2450,
        progress: 82, // (2450/3000) * 100
        color: '#06B6D4', // Cyan for level 3
      },
      achievements: [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first lesson',
          icon: 'footsteps',
          category: 'learning',
          isUnlocked: true,
          unlockedAt: '2024-01-15T10:30:00Z',
          rarity: 'common',
        },
        {
          id: '2',
          title: 'Week Warrior',
          description: 'Maintain a 7-day streak',
          icon: 'flame',
          category: 'streak',
          isUnlocked: true,
          unlockedAt: '2024-01-22T09:15:00Z',
          rarity: 'rare',
        },
        {
          id: '3',
          title: 'Course Crusher',
          description: 'Complete 5 courses',
          icon: 'trophy',
          category: 'completion',
          isUnlocked: false,
          progress: 60, // 3/5 courses
          requirement: '2 more courses to unlock',
          rarity: 'epic',
        },
      ],
      certificates: [
        {
          id: '1',
          courseId: 'course-1',
          courseName: 'Introduction to React Native',
          instructorName: 'Sarah Johnson',
          completedAt: '2024-01-20T14:30:00Z',
          certificateUrl: 'https://example.com/certificates/1',
          grade: 'A+',
          skills: ['React Native', 'JavaScript', 'Mobile Development'],
          thumbnail: 'https://example.com/course-thumbnails/react-native.jpg',
        },
        {
          id: '2',
          courseId: 'course-2',
          courseName: 'JavaScript Fundamentals',
          instructorName: 'Mike Davis',
          completedAt: '2024-01-10T16:45:00Z',
          certificateUrl: 'https://example.com/certificates/2',
          grade: 'A',
          skills: ['JavaScript', 'ES6+', 'DOM Manipulation'],
          thumbnail: 'https://example.com/course-thumbnails/javascript.jpg',
        },
      ],
    };

    return success({
      res,
      message: "Profile data retrieved successfully",
      data: profileData
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve profile data" });
  }
};

// Check if user has premium access
const checkPremiumAccess = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('isPremium premiumExpiryDate');
    
    if (!user) {
      return error({ res, message: "User not found", statusCode: 404 });
    }

    const now = new Date();
    const isExpired = user.premiumExpiryDate && user.premiumExpiryDate < now;
    
    // If premium is expired, update user status
    if (isExpired && user.isPremium) {
      user.isPremium = false;
      await user.save();
    }

    const hasAccess = user.isPremium && !isExpired;
    
    return success({
      res,
      message: hasAccess ? "Premium access confirmed" : "Premium access required",
      data: {
        hasAccess,
        isPremium: user.isPremium,
        premiumExpiryDate: user.premiumExpiryDate,
        isExpired,
        daysUntilExpiry: user.premiumExpiryDate ? Math.ceil((user.premiumExpiryDate - now) / (1000 * 60 * 60 * 24)) : null
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to check premium access" });
  }
};

// Get premium features
const getPremiumFeatures = async (req, res) => {
  try {
    const premiumFeatures = {
      features: [
        {
          name: "Unlimited Course Access",
          description: "Access to all premium courses and content",
          icon: "🎓"
        },
        {
          name: "Ad-Free Experience",
          description: "Enjoy learning without any advertisements",
          icon: "🚫"
        },
        {
          name: "Offline Downloads",
          description: "Download courses for offline learning",
          icon: "💾"
        },
        {
          name: "Priority Support",
          description: "Get priority customer support and assistance",
          icon: "⚡"
        },
        {
          name: "Advanced Analytics",
          description: "Detailed progress tracking and learning insights",
          icon: "📊"
        },
        {
          name: "Early Access",
          description: "Get early access to new courses and features",
          icon: "🎯"
        }
      ],
      pricing: {
        amount: 3000,
        currency: "NGN",
        duration: "12 months",
        savings: "Save 40% compared to monthly billing"
      }
    };

    return success({
      res,
      message: "Premium features retrieved successfully",
      data: premiumFeatures
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve premium features" });
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
  checkPremiumAccess,
  getPremiumFeatures,
  getProfileData,
  
  // Admin functions
  getAllUsers,
  getUserById,
  adminUpdateUser,
  adminDeleteUser,
  getDashboardStats,
};
