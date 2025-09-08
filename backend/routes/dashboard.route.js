const express = require("express");
const router = express.Router();
const {
  getDashboardOverview,
  getRecentActivity,
  getProgressStats,
  getDailyChallengeDetails,
} = require("../controllers/dashboard.controller");
const { authenticate } = require("../middleware/auth.middleware");

// All dashboard routes require authentication
router.use(authenticate);

// @route   GET /api/dashboard
// @desc    Get dashboard overview data
// @access  Private
router.get("/", getDashboardOverview);

// @route   GET /api/dashboard/activity
// @desc    Get user's recent activity
// @access  Private
router.get("/activity", getRecentActivity);

// @route   GET /api/dashboard/stats
// @desc    Get user's progress statistics
// @access  Private
router.get("/stats", getProgressStats);

// @route   GET /api/dashboard/challenge/:challengeId
// @desc    Get daily challenge details
// @access  Private
router.get("/challenge/:challengeId", getDailyChallengeDetails);

module.exports = router;
