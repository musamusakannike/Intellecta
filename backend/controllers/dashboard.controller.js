const User = require("../models/user.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Enrollment = require("../models/enrollment.model");
const DailyChallenge = require("../models/dailyChallenge.model");
const ChallengeSubmission = require("../models/challengeSubmission.model");
const Leaderboard = require("../models/leaderboard.model");
const { error, success } = require("../util/response.util");

// Get dashboard overview data
const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;

    // Get user's current enrollment with progress
    const currentEnrollment = await Enrollment.findOne({
      user: userId,
      status: { $in: ["enrolled", "in_progress"] }
    })
      .populate("course", "title description image")
      .populate("topicsProgress.topic", "title")
      .sort({ lastAccessedAt: -1 });

    // Get today's daily challenge
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyChallenge = await DailyChallenge.findOne({
      activeDate: {
        $gte: today,
        $lt: tomorrow
      },
      isActive: true
    });

    // Check if user has attempted today's challenge
    let challengeStatus = null;
    if (dailyChallenge) {
      const submission = await ChallengeSubmission.findOne({
        user: userId,
        challenge: dailyChallenge._id
      });
      challengeStatus = {
        attempted: !!submission,
        completed: submission?.isCorrect || false,
        pointsEarned: submission?.pointsEarned || 0
      };
    }

    // Get leaderboard position
    const userLeaderboard = await Leaderboard.findOne({ user: userId })
      .populate("user", "name profilePicture");
    
    // Get top 5 leaderboard entries for leaderboard card
    const topLeaderboard = await Leaderboard.find()
      .populate("user", "name profilePicture")
      .sort({ totalPoints: -1 })
      .limit(5);

    // Get community picks (featured courses)
    const communityPicks = await Course.find({
      isFeatured: true,
      isActive: true
    })
      .sort({ "ratingStats.averageRating": -1 })
      .limit(4)
      .select("title description image ratingStats categories");

    // Calculate progress for current course if enrolled
    let currentProgress = null;
    if (currentEnrollment) {
      currentProgress = {
        courseTitle: currentEnrollment.course.title,
        courseImage: currentEnrollment.course.image,
        progressPercentage: currentEnrollment.progressPercentage,
        currentTopic: currentEnrollment.topicsProgress.find(tp => 
          tp.progressPercentage < 100 && tp.progressPercentage > 0
        )?.topic?.title || currentEnrollment.topicsProgress[0]?.topic?.title,
        totalTopics: currentEnrollment.topicsProgress.length,
        completedTopics: currentEnrollment.topicsProgress.filter(tp => 
          tp.isCompleted
        ).length,
        lastAccessedAt: currentEnrollment.lastAccessedAt
      };
    }

    return success({
      res,
      message: "Dashboard data retrieved successfully",
      data: {
        user: {
          name: user.name,
          profilePicture: user.profilePicture,
          isPremium: user.isPremium
        },
        currentProgress,
        dailyChallenge: dailyChallenge ? {
          _id: dailyChallenge._id,
          title: dailyChallenge.title,
          description: dailyChallenge.description,
          difficulty: dailyChallenge.difficulty,
          category: dailyChallenge.category,
          points: dailyChallenge.points,
          status: challengeStatus
        } : null,
        leaderboard: {
          userRank: userLeaderboard?.rank || 0,
          userPoints: userLeaderboard?.totalPoints || 0,
          userLevel: userLeaderboard?.level || 1,
          streakDays: userLeaderboard?.streakDays || 0,
          topUsers: topLeaderboard.map((entry, index) => ({
            rank: index + 1,
            name: entry.user.name,
            profilePicture: entry.user.profilePicture,
            points: entry.totalPoints,
            level: entry.level
          }))
        },
        communityPicks: communityPicks.map(course => ({
          _id: course._id,
          title: course.title,
          description: course.description,
          image: course.image,
          rating: course.ratingStats.averageRating,
          totalRatings: course.ratingStats.totalRatings,
          categories: course.categories
        }))
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve dashboard data" });
  }
};

// Get user's recent activity
const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    // Get recent enrollments and progress updates
    const recentEnrollments = await Enrollment.find({ user: userId })
      .populate("course", "title image")
      .sort({ lastAccessedAt: -1 })
      .limit(limit);

    // Get recent challenge submissions
    const recentSubmissions = await ChallengeSubmission.find({ user: userId })
      .populate("challenge", "title difficulty points")
      .sort({ submittedAt: -1 })
      .limit(limit);

    // Combine and sort activities
    const activities = [];

    recentEnrollments.forEach(enrollment => {
      activities.push({
        type: "course",
        action: enrollment.status === "completed" ? "completed" : "accessed",
        title: enrollment.course.title,
        image: enrollment.course.image,
        progress: enrollment.progressPercentage,
        timestamp: enrollment.lastAccessedAt,
        points: enrollment.status === "completed" ? 100 : 0
      });
    });

    recentSubmissions.forEach(submission => {
      activities.push({
        type: "challenge",
        action: submission.isCorrect ? "completed" : "attempted",
        title: submission.challenge.title,
        difficulty: submission.challenge.difficulty,
        timestamp: submission.submittedAt,
        points: submission.pointsEarned
      });
    });

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return success({
      res,
      message: "Recent activity retrieved successfully",
      data: { activities: activities.slice(0, limit) }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve recent activity" });
  }
};

// Get user's progress statistics
const getProgressStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all user enrollments
    const enrollments = await Enrollment.find({ user: userId });
    
    // Get user's leaderboard entry
    const leaderboardEntry = await Leaderboard.findOne({ user: userId });

    // Get challenge submissions
    const challengeSubmissions = await ChallengeSubmission.find({ user: userId });

    // Calculate stats
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.status === "completed").length;
    const inProgressCourses = enrollments.filter(e => e.status === "in_progress").length;
    const totalTimeSpent = enrollments.reduce((sum, e) => sum + e.totalTimeSpent, 0);
    
    const totalChallenges = challengeSubmissions.length;
    const completedChallenges = challengeSubmissions.filter(s => s.isCorrect).length;
    
    const averageProgress = totalCourses > 0 ? 
      enrollments.reduce((sum, e) => sum + e.progressPercentage, 0) / totalCourses : 0;

    return success({
      res,
      message: "Progress statistics retrieved successfully",
      data: {
        courses: {
          total: totalCourses,
          completed: completedCourses,
          inProgress: inProgressCourses,
          averageProgress: Math.round(averageProgress)
        },
        challenges: {
          total: totalChallenges,
          completed: completedChallenges,
          completionRate: totalChallenges > 0 ? 
            Math.round((completedChallenges / totalChallenges) * 100) : 0
        },
        timeSpent: {
          total: totalTimeSpent, // in minutes
          totalHours: Math.round(totalTimeSpent / 60),
          averagePerCourse: totalCourses > 0 ? 
            Math.round(totalTimeSpent / totalCourses) : 0
        },
        points: {
          total: leaderboardEntry?.totalPoints || 0,
          challengePoints: leaderboardEntry?.challengePoints || 0,
          coursePoints: leaderboardEntry?.coursePoints || 0,
          level: leaderboardEntry?.level || 1,
          experiencePoints: leaderboardEntry?.experiencePoints || 0
        },
        streak: {
          current: leaderboardEntry?.streakDays || 0,
          longest: leaderboardEntry?.longestStreak || 0
        }
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve progress statistics" });
  }
};

// Get daily challenge details
const getDailyChallengeDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { challengeId } = req.params;

    const challenge = await DailyChallenge.findById(challengeId);
    if (!challenge) {
      return error({ res, message: "Challenge not found", statusCode: 404 });
    }

    // Check if user has already submitted
    const submission = await ChallengeSubmission.findOne({
      user: userId,
      challenge: challengeId
    });

    return success({
      res,
      message: "Challenge details retrieved successfully",
      data: {
        challenge: {
          _id: challenge._id,
          title: challenge.title,
          description: challenge.description,
          difficulty: challenge.difficulty,
          category: challenge.category,
          points: challenge.points,
          codeTemplate: challenge.codeTemplate,
          hints: challenge.hints,
          testCases: challenge.testCases.map(tc => ({
            input: tc.input,
            // Don't expose expected output until submission
            expectedOutput: submission?.isCorrect ? tc.expectedOutput : undefined
          }))
        },
        submission: submission ? {
          code: submission.code,
          isCorrect: submission.isCorrect,
          pointsEarned: submission.pointsEarned,
          attempts: submission.attempts,
          timeSpent: submission.timeSpent,
          completedAt: submission.completedAt,
          testResults: submission.testResults
        } : null
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve challenge details" });
  }
};

module.exports = {
  getDashboardOverview,
  getRecentActivity,
  getProgressStats,
  getDailyChallengeDetails,
};
