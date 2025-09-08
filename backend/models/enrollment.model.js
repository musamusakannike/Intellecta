const mongoose = require("mongoose");

const lessonProgressSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  quizScore: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0,
  },
});

const topicProgressSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  lessonsProgress: [lessonProgressSchema],
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  topicsProgress: [topicProgressSchema],
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0,
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
  certificateIssued: {
    type: Boolean,
    default: false,
  },
  certificateIssuedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["enrolled", "in_progress", "completed", "dropped"],
    default: "enrolled",
  },
}, {
  timestamps: true,
});

// Compound index to ensure one enrollment per user per course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Index for efficient queries
enrollmentSchema.index({ user: 1, status: 1 });
enrollmentSchema.index({ course: 1, status: 1 });
enrollmentSchema.index({ enrolledAt: -1 });

// Method to calculate overall progress
enrollmentSchema.methods.calculateProgress = function() {
  if (!this.topicsProgress || this.topicsProgress.length === 0) {
    return 0;
  }
  
  const totalProgress = this.topicsProgress.reduce((sum, topic) => {
    return sum + topic.progressPercentage;
  }, 0);
  
  return Math.round(totalProgress / this.topicsProgress.length);
};

// Method to update enrollment status based on progress
enrollmentSchema.methods.updateStatus = function() {
  if (this.progressPercentage === 0) {
    this.status = "enrolled";
  } else if (this.progressPercentage === 100) {
    this.status = "completed";
    this.isCompleted = true;
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  } else {
    this.status = "in_progress";
    if (!this.startedAt) {
      this.startedAt = new Date();
    }
  }
};

// Pre-save middleware to update progress and status
enrollmentSchema.pre('save', function(next) {
  if (this.topicsProgress && this.topicsProgress.length > 0) {
    this.progressPercentage = this.calculateProgress();
    this.updateStatus();
    
    // Update total time spent
    this.totalTimeSpent = this.topicsProgress.reduce((total, topic) => {
      return total + topic.lessonsProgress.reduce((sum, lesson) => {
        return sum + (lesson.timeSpent || 0);
      }, 0);
    }, 0);
  }
  
  this.lastAccessedAt = new Date();
  next();
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
