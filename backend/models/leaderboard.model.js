const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  challengePoints: {
    type: Number,
    default: 0,
  },
  coursePoints: {
    type: Number,
    default: 0,
  },
  streakDays: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  lastActivityDate: {
    type: Date,
    default: Date.now,
  },
  completedCourses: {
    type: Number,
    default: 0,
  },
  completedChallenges: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
  badges: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  achievements: [{
    title: String,
    description: String,
    type: {
      type: String,
      enum: ["course", "challenge", "streak", "special"],
    },
    points: Number,
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  level: {
    type: Number,
    default: 1,
  },
  experiencePoints: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for leaderboard queries
leaderboardSchema.index({ totalPoints: -1 });
leaderboardSchema.index({ rank: 1 });
leaderboardSchema.index({ level: -1, experiencePoints: -1 });
leaderboardSchema.index({ lastActivityDate: -1 });

// Method to calculate level based on experience points
leaderboardSchema.methods.calculateLevel = function() {
  // Level formula: level = floor(sqrt(experiencePoints / 100)) + 1
  this.level = Math.floor(Math.sqrt(this.experiencePoints / 100)) + 1;
};

// Method to update streak
leaderboardSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActivity = new Date(this.lastActivityDate);
  const diffTime = Math.abs(today - lastActivity);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Continue streak
    this.streakDays += 1;
    if (this.streakDays > this.longestStreak) {
      this.longestStreak = this.streakDays;
    }
  } else if (diffDays > 1) {
    // Streak broken
    this.streakDays = 1;
  }
  // If diffDays === 0, it's the same day, don't change streak

  this.lastActivityDate = today;
};

// Pre-save middleware to calculate level
leaderboardSchema.pre('save', function(next) {
  this.calculateLevel();
  this.totalPoints = this.challengePoints + this.coursePoints;
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
