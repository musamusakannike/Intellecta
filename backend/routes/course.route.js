const express = require("express");
const {
  createCourse,
  getAllCourses,
  searchCourses,
  getCourseById,
  updateCourse,
  deactivateCourse,
  deleteCourse,
  enrollInCourse,
  getMyEnrollments,
  getCategories,
  getCourseAnalytics,
} = require("../controllers/course.controller");

const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const handleValidationErrors = require("../validations/handler.validation");
const {
  createCourseValidation,
  updateCourseValidation,
  courseIdValidation,
  searchCoursesValidation,
  enrollCourseValidation,
  getCoursesValidation,
} = require("../validations/course.validation");

const router = express.Router();

// PUBLIC ROUTES (no authentication required)
// Get all courses with basic filtering
router.get("/", getCoursesValidation(), handleValidationErrors, getAllCourses);

// Advanced course search
router.get("/search", searchCoursesValidation(), handleValidationErrors, searchCourses);

// Get all available categories
router.get("/categories", getCategories);

// AUTHENTICATED USER ROUTES
// Get user's enrolled courses (must be before authenticate middleware)
router.get("/enrollments/my", authenticate, getMyEnrollments);

// Apply authentication to routes below
router.use(authenticate);

// Enroll in a course
router.post("/:courseId/enroll", enrollCourseValidation(), handleValidationErrors, enrollInCourse);

// Get course by ID with full details (must be after specific routes)
router.get("/:id", courseIdValidation(), handleValidationErrors, getCourseById);

// ADMIN ROUTES
// Create a new course
router.post("/", requireAdmin, createCourseValidation(), handleValidationErrors, createCourse);

// Update course
router.put("/:id", requireAdmin, updateCourseValidation(), handleValidationErrors, updateCourse);

// Deactivate course (soft delete)
router.patch("/:id/deactivate", requireAdmin, courseIdValidation(), handleValidationErrors, deactivateCourse);

// Delete course (hard delete - only if no enrollments)
router.delete("/:id", requireAdmin, courseIdValidation(), handleValidationErrors, deleteCourse);

// Get course analytics
router.get("/:id/analytics", requireAdmin, courseIdValidation(), handleValidationErrors, getCourseAnalytics);

module.exports = router;
