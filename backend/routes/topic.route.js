const express = require("express");
const {
  createTopic,
  getTopicsByCourse,
  getTopicById,
  updateTopic,
  deactivateTopic,
  deleteTopic,
  reorderTopics,
  getTopicAnalytics,
} = require("../controllers/topic.controller");

const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const handleValidationErrors = require("../validations/handler.validation");
const {
  createTopicValidation,
  updateTopicValidation,
  topicIdValidation,
  courseIdValidation,
  getTopicsValidation,
  reorderTopicsValidation,
} = require("../validations/topic.validation");

const router = express.Router();

// PUBLIC/AUTHENTICATED ROUTES

// Get all topics for a course
router.get("/course/:courseId", getTopicsValidation(), handleValidationErrors, getTopicsByCourse);

// Get topic by ID with lessons
router.get("/:id", topicIdValidation(), handleValidationErrors, getTopicById);

// ADMIN ROUTES
// Apply admin authentication to routes below
router.use(authenticate, requireAdmin);

// Create a new topic
router.post("/", createTopicValidation(), handleValidationErrors, createTopic);

// Update topic
router.put("/:id", updateTopicValidation(), handleValidationErrors, updateTopic);

// Deactivate topic (soft delete)
router.patch("/:id/deactivate", topicIdValidation(), handleValidationErrors, deactivateTopic);

// Delete topic (hard delete - only if no lessons or user progress)
router.delete("/:id", topicIdValidation(), handleValidationErrors, deleteTopic);

// Reorder topics in a course
router.patch("/course/:courseId/reorder", reorderTopicsValidation(), handleValidationErrors, reorderTopics);

// Get topic analytics
router.get("/:id/analytics", topicIdValidation(), handleValidationErrors, getTopicAnalytics);

module.exports = router;
