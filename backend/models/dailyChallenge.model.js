const mongoose = require("mongoose");

const dailyChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  codeTemplate: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
  }],
  hints: [String],
  solution: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  activeDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficiently getting daily challenges
dailyChallengeSchema.index({ activeDate: 1, isActive: 1 });
dailyChallengeSchema.index({ difficulty: 1, category: 1 });

module.exports = mongoose.model("DailyChallenge", dailyChallengeSchema);
