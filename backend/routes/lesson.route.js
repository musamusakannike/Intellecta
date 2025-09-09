const express = require("express");
const {
  createLesson,
  getLessonsByTopic,
  getLessonById,
  updateLesson,
  deactivateLesson,
  deleteLesson,
  reorderLessons,
  submitQuiz,
  markLessonProgress,
  getLessonAnalytics,
} = require("../controllers/lesson.controller");

const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const handleValidationErrors = require("../validations/handler.validation");
const {
  createLessonValidation,
  updateLessonValidation,
  lessonIdValidation,
  topicIdValidation,
  getLessonsValidation,
  reorderLessonsValidation,
  submitQuizValidation,
  markLessonProgressValidation,
} = require("../validations/lesson.validation");

const router = express.Router();

// Apply authentication to routes below
router.use(authenticate);

// Get all lessons for a topic
router.get("/topic/:topicId", getLessonsValidation(), handleValidationErrors, getLessonsByTopic);

// Get lesson by ID with full content
router.get("/:id", lessonIdValidation(), handleValidationErrors, getLessonById);

// Submit quiz answers
router.post("/:id/quiz/submit", submitQuizValidation(), handleValidationErrors, submitQuiz);

// Mark lesson progress (completion, time spent)
router.patch("/:id/progress", markLessonProgressValidation(), handleValidationErrors, markLessonProgress);

// ADMIN ROUTES
// Apply admin authentication to routes below
router.use(requireAdmin);

// Create a new lesson
router.post("/", createLessonValidation(), handleValidationErrors, createLesson);

// Update lesson
router.put("/:id", updateLessonValidation(), handleValidationErrors, updateLesson);

// Deactivate lesson (soft delete)
router.patch("/:id/deactivate", lessonIdValidation(), handleValidationErrors, deactivateLesson);

// Delete lesson (hard delete - only if no user progress)
router.delete("/:id", lessonIdValidation(), handleValidationErrors, deleteLesson);

// Reorder lessons in a topic
router.patch("/topic/:topicId/reorder", reorderLessonsValidation(), handleValidationErrors, reorderLessons);

// Get lesson analytics
router.get("/:id/analytics", lessonIdValidation(), handleValidationErrors, getLessonAnalytics);

module.exports = router;
