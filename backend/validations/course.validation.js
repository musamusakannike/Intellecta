const { body, param, query } = require("express-validator");

const createCourseValidation = () => {
  return [
    body("title")
      .notEmpty()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description must not exceed 1000 characters"),
    body("image")
      .optional()
      .isURL()
      .withMessage("Image must be a valid URL"),
    body("categories")
      .isArray({ min: 1 })
      .withMessage("At least one category is required")
      .custom((categories) => {
        if (!Array.isArray(categories)) {
          throw new Error("Categories must be an array");
        }
        for (const category of categories) {
          if (typeof category !== "string" || category.trim().length === 0) {
            throw new Error("Each category must be a non-empty string");
          }
        }
        return true;
      }),
    body("isFeatured")
      .optional()
      .isBoolean()
      .withMessage("isFeatured must be a boolean"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
  ];
};

const updateCourseValidation = () => {
  return [
    param("id")
      .isMongoId()
      .withMessage("Valid course ID is required"),
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description must not exceed 1000 characters"),
    body("image")
      .optional()
      .isURL()
      .withMessage("Image must be a valid URL"),
    body("categories")
      .optional()
      .isArray({ min: 1 })
      .withMessage("At least one category is required")
      .custom((categories) => {
        if (categories && !Array.isArray(categories)) {
          throw new Error("Categories must be an array");
        }
        if (categories) {
          for (const category of categories) {
            if (typeof category !== "string" || category.trim().length === 0) {
              throw new Error("Each category must be a non-empty string");
            }
          }
        }
        return true;
      }),
    body("isFeatured")
      .optional()
      .isBoolean()
      .withMessage("isFeatured must be a boolean"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
  ];
};

const courseIdValidation = () => {
  return [
    param("id")
      .isMongoId()
      .withMessage("Valid course ID is required"),
  ];
};

const searchCoursesValidation = () => {
  return [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
    query("search")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Search query must be between 1 and 100 characters"),
    query("category")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Category must be a non-empty string"),
    query("minRating")
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage("Minimum rating must be between 0 and 5"),
    query("maxRating")
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage("Maximum rating must be between 0 and 5"),
    query("featured")
      .optional()
      .isBoolean()
      .withMessage("Featured must be a boolean"),
    query("active")
      .optional()
      .isBoolean()
      .withMessage("Active must be a boolean"),
    query("sortBy")
      .optional()
      .isIn(["title", "rating", "popularity", "newest", "oldest"])
      .withMessage("SortBy must be one of: title, rating, popularity, newest, oldest"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("SortOrder must be either 'asc' or 'desc'"),
  ];
};

const enrollCourseValidation = () => {
  return [
    param("courseId")
      .isMongoId()
      .withMessage("Valid course ID is required"),
  ];
};

const getCoursesValidation = () => {
  return [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("category")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Category must be a non-empty string"),
    query("featured")
      .optional()
      .isBoolean()
      .withMessage("Featured must be a boolean"),
    query("active")
      .optional()
      .isBoolean()
      .withMessage("Active must be a boolean"),
    query("sortBy")
      .optional()
      .isIn(["title", "rating", "popularity", "newest", "oldest", "relevance", "createdAt", "updatedAt"])
      .withMessage("SortBy must be one of: title, rating, popularity, newest, oldest, relevance, createdAt, updatedAt"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("SortOrder must be either 'asc' or 'desc'"),
  ];
};

module.exports = {
  createCourseValidation,
  updateCourseValidation,
  courseIdValidation,
  searchCoursesValidation,
  enrollCourseValidation,
  getCoursesValidation,
};
