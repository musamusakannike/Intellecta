const { body, param, query } = require("express-validator");

const contentValidation = () => {
  return [
    body("contents")
      .optional()
      .isArray()
      .withMessage("Contents must be an array")
      .custom((contents) => {
        if (contents && Array.isArray(contents)) {
          for (const content of contents) {
            if (!content.type || !['text', 'image', 'code', 'latex', 'link', 'video', 'youtubeUrl'].includes(content.type)) {
              throw new Error("Each content must have a valid type: text, image, code, latex, link, video, youtubeUrl");
            }
            if (content.content === undefined || content.content === null) {
              throw new Error("Each content must have content field");
            }
            if (typeof content.order !== 'number' || content.order < 0) {
              throw new Error("Each content must have a valid order (non-negative number)");
            }
          }
        }
        return true;
      }),
  ];
};

const contentGroupValidation = () => {
  return [
    body("contentGroups")
      .optional()
      .isArray()
      .withMessage("Content groups must be an array")
      .custom((contentGroups) => {
        if (contentGroups && Array.isArray(contentGroups)) {
          for (const group of contentGroups) {
            if (!group.title || typeof group.title !== 'string' || group.title.trim().length === 0) {
              throw new Error("Each content group must have a valid title");
            }
            if (typeof group.order !== 'number' || group.order < 0) {
              throw new Error("Each content group must have a valid order (non-negative number)");
            }
            if (group.contents && Array.isArray(group.contents)) {
              for (const content of group.contents) {
                if (!content.type || !['text', 'image', 'code', 'latex', 'link', 'video', 'youtubeUrl'].includes(content.type)) {
                  throw new Error("Each content must have a valid type: text, image, code, latex, link, video, youtubeUrl");
                }
                if (content.content === undefined || content.content === null) {
                  throw new Error("Each content must have content field");
                }
                if (typeof content.order !== 'number' || content.order < 0) {
                  throw new Error("Each content must have a valid order (non-negative number)");
                }
              }
            }
          }
        }
        return true;
      }),
  ];
};

const quizValidation = () => {
  return [
    body("quiz")
      .optional()
      .isArray()
      .withMessage("Quiz must be an array")
      .custom((quiz) => {
        if (quiz && Array.isArray(quiz)) {
          for (const question of quiz) {
            if (!question.question || typeof question.question !== 'string') {
              throw new Error("Each quiz question must have a valid question text");
            }
            if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
              throw new Error("Each quiz question must have at least 2 options");
            }
            if (typeof question.correctAnswer !== 'number' || question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
              throw new Error("Each quiz question must have a valid correct answer index");
            }
          }
        }
        return true;
      }),
  ];
};

const createLessonValidation = () => {
  return [
    body("title")
      .notEmpty()
      .trim()
      .isLength({ min: 3, max: 150 })
      .withMessage("Title must be between 3 and 150 characters"),
    body("description")
      .notEmpty()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Description must be between 10 and 1000 characters"),
    body("topic")
      .notEmpty()
      .isMongoId()
      .withMessage("Valid topic ID is required"),
    body("order")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Order must be a non-negative integer"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
    ...contentGroupValidation(),
    ...quizValidation(),
  ];
};

const updateLessonValidation = () => {
  return [
    param("id")
      .isMongoId()
      .withMessage("Valid lesson ID is required"),
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3, max: 150 })
      .withMessage("Title must be between 3 and 150 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Description must be between 10 and 1000 characters"),
    body("order")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Order must be a non-negative integer"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
    ...contentGroupValidation(),
    ...quizValidation(),
  ];
};

const lessonIdValidation = () => {
  return [
    param("id")
      .isMongoId()
      .withMessage("Valid lesson ID is required"),
  ];
};

const topicIdValidation = () => {
  return [
    param("topicId")
      .isMongoId()
      .withMessage("Valid topic ID is required"),
  ];
};

const getLessonsValidation = () => {
  return [
    param("topicId")
      .isMongoId()
      .withMessage("Valid topic ID is required"),
    query("includeInactive")
      .optional()
      .isBoolean()
      .withMessage("includeInactive must be a boolean"),
  ];
};

const reorderLessonsValidation = () => {
  return [
    param("topicId")
      .isMongoId()
      .withMessage("Valid topic ID is required"),
    body("lessonIds")
      .isArray({ min: 1 })
      .withMessage("Lesson IDs array is required")
      .custom((lessonIds) => {
        if (!Array.isArray(lessonIds)) {
          throw new Error("Lesson IDs must be an array");
        }
        for (const id of lessonIds) {
          if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Each lesson ID must be a valid MongoDB ObjectId");
          }
        }
        return true;
      }),
  ];
};

const submitQuizValidation = () => {
  return [
    param("id")
      .isMongoId()
      .withMessage("Valid lesson ID is required"),
    body("answers")
      .isArray({ min: 1 })
      .withMessage("Answers array is required")
      .custom((answers) => {
        if (!Array.isArray(answers)) {
          throw new Error("Answers must be an array");
        }
        for (const answer of answers) {
          if (typeof answer !== 'number' || answer < 0) {
            throw new Error("Each answer must be a non-negative number");
          }
        }
        return true;
      }),
  ];
};

const markLessonProgressValidation = () => {
  return [
    param("id")
      .isMongoId()
      .withMessage("Valid lesson ID is required"),
    body("isCompleted")
      .notEmpty()
      .isBoolean()
      .withMessage("isCompleted must be a boolean"),
    body("timeSpent")
      .optional()
      .isInt({ min: 0 })
      .withMessage("timeSpent must be a non-negative integer (minutes)"),
  ];
};

module.exports = {
  createLessonValidation,
  updateLessonValidation,
  lessonIdValidation,
  topicIdValidation,
  getLessonsValidation,
  reorderLessonsValidation,
  submitQuizValidation,
  markLessonProgressValidation,
};
