const mongoose = require("mongoose");

const challengeSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DailyChallenge",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  pointsEarned: {
    type: Number,
    default: 0,
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0,
  },
  attempts: {
    type: Number,
    default: 1,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  testResults: [{
    testCase: Number,
    passed: Boolean,
    actualOutput: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
  }],
});

// Compound index to ensure one submission per user per challenge per day
challengeSubmissionSchema.index({ user: 1, challenge: 1 }, { unique: true });
challengeSubmissionSchema.index({ submittedAt: -1 });
challengeSubmissionSchema.index({ pointsEarned: -1 });

module.exports = mongoose.model("ChallengeSubmission", challengeSubmissionSchema);
