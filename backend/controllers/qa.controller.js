const Question = require("../models/question.model");
const Answer = require("../models/answer.model");

exports.createQuestion = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const author = req.user._id;

    const newQuestion = new Question({
      title,
      content,
      tags,
      author,
    });

    await newQuestion.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    console.log("Error in createQuestion controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (error) {
    console.log("Error in getQuestions controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate("author", "name profilePicture")
      .populate({
        path: "answers",
        populate: {
          path: "author",
          select: "name profilePicture",
        },
      });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    console.log("Error in getQuestionById controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: questionId } = req.params;
    const author = req.user._id;

    const newAnswer = new Answer({
      content,
      question: questionId,
      author,
    });

    await newAnswer.save();

    const question = await Question.findById(questionId);
    question.answers.push(newAnswer._id);
    await question.save();

    res.status(201).json(newAnswer);
  } catch (error) {
    console.log("Error in createAnswer controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.voteAnswer = async (req, res) => {
  try {
    const { id: answerId } = req.params;
    const { vote } = req.body; // vote can be "up" or "down"

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    if (vote === "up") {
      answer.votes += 1;
    } else if (vote === "down") {
      answer.votes -= 1;
    }

    await answer.save();

    res.status(200).json(answer);
  } catch (error) {
    console.log("Error in voteAnswer controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
