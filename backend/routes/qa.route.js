const express = require("express");
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  createAnswer,
  voteAnswer,
} = require("../controllers/qa.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/questions", authMiddleware, createQuestion);
router.get("/questions", getQuestions);
router.get("/questions/:id", getQuestionById);
router.post("/questions/:id/answers", authMiddleware, createAnswer);
router.post("/answers/:id/vote", authMiddleware, voteAnswer);

module.exports = router;
