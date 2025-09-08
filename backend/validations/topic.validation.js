const { body, param, query } = require("express-validator");

const createTopicValidation = () => {
  return [
    body("title")
      .notEmpty()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters"),
    body("description")
      .notEmpty()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage("Description must be between 10 and 500 characters"),
    body("course")
      .notEmpty()
      .isMongoId()
      .withMessage("Valid course ID is required"),
    body("order")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Order must be a non-negative integer"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
  ];
};

const updateTopicValidation = () => {
  return [
    param("id")
      .isMongoId()
      .withMessage("Valid topic ID is required"),
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage("Description must be between 10 and 500 characters"),
    body("order")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Order must be a non-negative integer"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
  ];
};

const topicIdValidation = () => {
  return [
    param("id")
      .isMongoId()
      .withMessage("Valid topic ID is required"),
  ];
};

const courseIdValidation = () => {
  return [
    param("courseId")
      .isMongoId()
      .withMessage("Valid course ID is required"),
  ];
};

const getTopicsValidation = () => {
  return [
    param("courseId")
      .isMongoId()
      .withMessage("Valid course ID is required"),
    query("includeInactive")
      .optional()
      .isBoolean()
      .withMessage("includeInactive must be a boolean"),
  ];
};

const reorderTopicsValidation = () => {
  return [
    param("courseId")
      .isMongoId()
      .withMessage("Valid course ID is required"),
    body("topicIds")
      .isArray({ min: 1 })
      .withMessage("Topic IDs array is required")
      .custom((topicIds) => {
        if (!Array.isArray(topicIds)) {
          throw new Error("Topic IDs must be an array");
        }
        for (const id of topicIds) {
          if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Each topic ID must be a valid MongoDB ObjectId");
          }
        }
        return true;
      }),
  ];
};

module.exports = {
  createTopicValidation,
  updateTopicValidation,
  topicIdValidation,
  courseIdValidation,
  getTopicsValidation,
  reorderTopicsValidation,
};
