const Lesson = require("../models/lesson.model");
const Topic = require("../models/topic.model");
const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");
const { error, success } = require("../util/response.util");
const mongoose = require("mongoose");

// Create a new lesson (Admin only)
const createLesson = async (req, res) => {
  try {
    const { title, description, topic, contentGroups, quiz, order, isActive } = req.body;

    // Check if topic exists
    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      return error({ res, message: "Topic not found", statusCode: 404 });
    }

    // Check if lesson with same order already exists in this topic
    const existingLesson = await Lesson.findOne({ topic, order });
    if (existingLesson) {
      return error({ res, message: "Lesson with this order already exists in the topic", statusCode: 409 });
    }

    const lesson = new Lesson({
      title,
      description,
      topic,
      contentGroups: contentGroups || [],
      quiz: quiz || [],
      order,
      isActive: isActive !== undefined ? isActive : true,
    });

    await lesson.save();

    // Populate topic and course information
    const populatedLesson = await Lesson.findById(lesson._id)
      .populate({
        path: 'topic',
        select: 'title course',
        populate: {
          path: 'course',
          select: 'title'
        }
      });

    return success({
      res,
      message: "Lesson created successfully",
      statusCode: 201,
      data: { lesson: populatedLesson }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to create lesson" });
  }
};

// Get all lessons for a topic
const getLessonsByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const includeInactive = req.query.includeInactive === 'true';

    // Check if topic exists
    const topicExists = await Topic.findById(topicId);
    if (!topicExists) {
      return error({ res, message: "Topic not found", statusCode: 404 });
    }

    // Build filter
    const filter = { topic: topicId };
    if (!includeInactive && req.user?.role !== 'admin') {
      filter.isActive = true;
    }

    const lessons = await Lesson.find(filter)
      .populate({
        path: 'topic',
        select: 'title course',
        populate: {
          path: 'course',
          select: 'title'
        }
      })
      .sort({ order: 1 });

    // Get user progress if logged in
    let userProgress = {};
    if (req.user?._id) {
      const enrollment = await Enrollment.findOne({ 
        user: req.user._id, 
        course: topicExists.course 
      });
      
      if (enrollment) {
        const topicProgress = enrollment.topicsProgress.find(
          tp => tp.topic.toString() === topicId
        );
        
        if (topicProgress) {
          topicProgress.lessonsProgress.forEach(lp => {
            userProgress[lp.lesson.toString()] = lp;
          });
        }
      }
    }

    const lessonsWithProgress = lessons.map(lesson => ({
      ...lesson.toObject(),
      userProgress: userProgress[lesson._id.toString()] || null,
    }));

    return success({
      res,
      message: "Lessons retrieved successfully",
      data: { lessons: lessonsWithProgress }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve lessons" });
  }
};

// Get lesson by ID with full content
const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const lesson = await Lesson.findById(id)
      .populate({
        path: 'topic',
        select: 'title course',
        populate: {
          path: 'course',
          select: 'title'
        }
      });

    if (!lesson) {
      return error({ res, message: "Lesson not found", statusCode: 404 });
    }

    // Check if lesson is active (unless user is admin)
    if (!lesson.isActive && req.user?.role !== 'admin') {
      return error({ res, message: "Lesson not found", statusCode: 404 });
    }

    // Get user progress if logged in and enrolled
    let userProgress = null;
    let isEnrolled = false;
    
    if (userId) {
      const enrollment = await Enrollment.findOne({ 
        user: userId, 
        course: lesson.topic.course 
      });
      
      if (enrollment) {
        isEnrolled = true;
        const topicProgress = enrollment.topicsProgress.find(
          tp => tp.topic.toString() === lesson.topic._id.toString()
        );
        
        if (topicProgress) {
          const lessonProgress = topicProgress.lessonsProgress.find(
            lp => lp.lesson.toString() === id
          );
          userProgress = lessonProgress || null;
        }
      }
    }

    // Hide quiz answers for non-admin users
    let lessonData = lesson.toObject();
    if (req.user?.role !== 'admin' && lessonData.quiz) {
      lessonData.quiz = lessonData.quiz.map(q => ({
        question: q.question,
        options: q.options,
        // Don't include correctAnswer and explanation for regular users
      }));
    }

    const lessonWithDetails = {
      ...lessonData,
      userProgress,
      isEnrolled,
      hasQuiz: lesson.quiz && lesson.quiz.length > 0,
      quizQuestionCount: lesson.quiz ? lesson.quiz.length : 0,
    };

    return success({
      res,
      message: "Lesson retrieved successfully",
      data: { lesson: lessonWithDetails }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve lesson" });
  }
};

// Update lesson (Admin only)
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if lesson exists
    const existingLesson = await Lesson.findById(id);
    if (!existingLesson) {
      return error({ res, message: "Lesson not found", statusCode: 404 });
    }

    // If order is being updated, check for conflicts
    if (updateData.order !== undefined && updateData.order !== existingLesson.order) {
      const conflictingLesson = await Lesson.findOne({
        topic: existingLesson.topic,
        order: updateData.order,
        _id: { $ne: id }
      });
      if (conflictingLesson) {
        return error({ res, message: "Lesson with this order already exists in the topic", statusCode: 409 });
      }
    }

    updateData.updatedAt = new Date();

    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'topic',
      select: 'title course',
      populate: {
        path: 'course',
        select: 'title'
      }
    });

    return success({
      res,
      message: "Lesson updated successfully",
      data: { lesson: updatedLesson }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to update lesson" });
  }
};

// Deactivate lesson (Admin only)
const deactivateLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    ).populate({
      path: 'topic',
      select: 'title course',
      populate: {
        path: 'course',
        select: 'title'
      }
    });

    if (!lesson) {
      return error({ res, message: "Lesson not found", statusCode: 404 });
    }

    return success({
      res,
      message: "Lesson deactivated successfully",
      data: { lesson }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to deactivate lesson" });
  }
};

// Delete lesson (Admin only)
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if lesson exists
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return error({ res, message: "Lesson not found", statusCode: 404 });
    }

    // Check if any users have progress on this lesson
    const enrollmentsWithProgress = await Enrollment.countDocuments({
      "topicsProgress.lessonsProgress.lesson": id
    });

    if (enrollmentsWithProgress > 0) {
      return error({ 
        res, 
        message: "Cannot delete lesson with existing user progress. Consider deactivating instead.", 
        statusCode: 400 
      });
    }

    await Lesson.findByIdAndDelete(id);

    return success({
      res,
      message: "Lesson deleted successfully"
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to delete lesson" });
  }
};

// Reorder lessons in a topic (Admin only)
const reorderLessons = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { lessonIds } = req.body;

    // Check if topic exists
    const topicExists = await Topic.findById(topicId);
    if (!topicExists) {
      return error({ res, message: "Topic not found", statusCode: 404 });
    }

    // Verify all lesson IDs belong to this topic
    const lessons = await Lesson.find({ 
      _id: { $in: lessonIds }, 
      topic: topicId 
    });

    if (lessons.length !== lessonIds.length) {
      return error({ res, message: "Some lesson IDs are invalid or don't belong to this topic", statusCode: 400 });
    }

    // Update the order of each lesson
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (let i = 0; i < lessonIds.length; i++) {
        await Lesson.findByIdAndUpdate(
          lessonIds[i],
          { order: i, updatedAt: new Date() },
          { session }
        );
      }

      await session.commitTransaction();

      // Get updated lessons
      const updatedLessons = await Lesson.find({ topic: topicId })
        .populate({
          path: 'topic',
          select: 'title course',
          populate: {
            path: 'course',
            select: 'title'
          }
        })
        .sort({ order: 1 });

      return success({
        res,
        message: "Lessons reordered successfully",
        data: { lessons: updatedLessons }
      });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } catch (err) {
    return error({ res, message: err?.message || "Failed to reorder lessons" });
  }
};

// Submit quiz answers (Authenticated users)
const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user._id;

    // Get lesson with quiz
    const lesson = await Lesson.findById(id).populate('topic', 'course');
    if (!lesson) {
      return error({ res, message: "Lesson not found", statusCode: 404 });
    }

    if (!lesson.quiz || lesson.quiz.length === 0) {
      return error({ res, message: "This lesson does not have a quiz", statusCode: 400 });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({ 
      user: userId, 
      course: lesson.topic.course 
    });

    if (!enrollment) {
      return error({ res, message: "You are not enrolled in this course", statusCode: 403 });
    }

    // Validate answers length
    if (answers.length !== lesson.quiz.length) {
      return error({ res, message: "Number of answers must match number of questions", statusCode: 400 });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = [];

    lesson.quiz.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      results.push({
        questionIndex: index,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      });
    });

    const score = Math.round((correctAnswers / lesson.quiz.length) * 100);

    // Update user progress
    const topicProgress = enrollment.topicsProgress.find(
      tp => tp.topic.toString() === lesson.topic._id.toString()
    );

    if (topicProgress) {
      const lessonProgress = topicProgress.lessonsProgress.find(
        lp => lp.lesson.toString() === id
      );

      if (lessonProgress) {
        lessonProgress.quizScore = score;
        // Mark as completed if score is 70% or higher
        if (score >= 70 && !lessonProgress.isCompleted) {
          lessonProgress.isCompleted = true;
          lessonProgress.completedAt = new Date();
        }
      }
    }

    await enrollment.save();

    return success({
      res,
      message: "Quiz submitted successfully",
      data: {
        score,
        correctAnswers,
        totalQuestions: lesson.quiz.length,
        passed: score >= 70,
        results,
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to submit quiz" });
  }
};

// Mark lesson progress (Authenticated users)
const markLessonProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { isCompleted, timeSpent } = req.body;
    const userId = req.user._id;

    // Get lesson
    const lesson = await Lesson.findById(id).populate('topic', 'course');
    if (!lesson) {
      return error({ res, message: "Lesson not found", statusCode: 404 });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({ 
      user: userId, 
      course: lesson.topic.course 
    });

    if (!enrollment) {
      return error({ res, message: "You are not enrolled in this course", statusCode: 403 });
    }

    // Find topic progress
    const topicProgress = enrollment.topicsProgress.find(
      tp => tp.topic.toString() === lesson.topic._id.toString()
    );

    if (!topicProgress) {
      return error({ res, message: "Topic progress not found", statusCode: 404 });
    }

    // Find or create lesson progress
    let lessonProgress = topicProgress.lessonsProgress.find(
      lp => lp.lesson.toString() === id
    );

    if (!lessonProgress) {
      // Create new lesson progress
      lessonProgress = {
        lesson: id,
        isCompleted: false,
        timeSpent: 0,
      };
      topicProgress.lessonsProgress.push(lessonProgress);
    }

    // Update progress
    lessonProgress.isCompleted = isCompleted;
    if (isCompleted && !lessonProgress.completedAt) {
      lessonProgress.completedAt = new Date();
    }
    
    if (timeSpent !== undefined) {
      lessonProgress.timeSpent = (lessonProgress.timeSpent || 0) + timeSpent;
    }

    // Recalculate topic progress
    const completedLessons = topicProgress.lessonsProgress.filter(lp => lp.isCompleted).length;
    const totalLessons = topicProgress.lessonsProgress.length;
    topicProgress.progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    if (topicProgress.progressPercentage === 100 && !topicProgress.isCompleted) {
      topicProgress.isCompleted = true;
      topicProgress.completedAt = new Date();
    }

    await enrollment.save();

    return success({
      res,
      message: "Lesson progress updated successfully",
      data: {
        lessonProgress: {
          lesson: id,
          isCompleted: lessonProgress.isCompleted,
          completedAt: lessonProgress.completedAt,
          timeSpent: lessonProgress.timeSpent,
          quizScore: lessonProgress.quizScore,
        },
        topicProgress: {
          topic: topicProgress.topic,
          progressPercentage: topicProgress.progressPercentage,
          isCompleted: topicProgress.isCompleted,
        }
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to update lesson progress" });
  }
};

// Get lesson analytics (Admin only)
const getLessonAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if lesson exists
    const lesson = await Lesson.findById(id)
      .populate({
        path: 'topic',
        select: 'title course',
        populate: {
          path: 'course',
          select: 'title'
        }
      });
      
    if (!lesson) {
      return error({ res, message: "Lesson not found", statusCode: 404 });
    }

    // Get enrollments for the course
    const courseEnrollments = await Enrollment.find({ course: lesson.topic.course });
    const totalEnrolledUsers = courseEnrollments.length;

    // Calculate completion statistics
    let completedUsers = 0;
    let totalTimeSpent = 0;
    let quizAttempts = 0;
    let totalQuizScore = 0;

    for (const enrollment of courseEnrollments) {
      const topicProgress = enrollment.topicsProgress.find(
        tp => tp.topic.toString() === lesson.topic._id.toString()
      );
      
      if (topicProgress) {
        const lessonProgress = topicProgress.lessonsProgress.find(
          lp => lp.lesson.toString() === id
        );
        
        if (lessonProgress) {
          if (lessonProgress.isCompleted) {
            completedUsers++;
          }
          
          totalTimeSpent += lessonProgress.timeSpent || 0;
          
          if (lessonProgress.quizScore !== null && lessonProgress.quizScore !== undefined) {
            quizAttempts++;
            totalQuizScore += lessonProgress.quizScore;
          }
        }
      }
    }

    const completionRate = totalEnrolledUsers > 0 ? Math.round((completedUsers / totalEnrolledUsers) * 100) : 0;
    const averageTimeSpent = totalEnrolledUsers > 0 ? Math.round(totalTimeSpent / totalEnrolledUsers) : 0;
    const averageQuizScore = quizAttempts > 0 ? Math.round(totalQuizScore / quizAttempts) : 0;
    const quizPassRate = quizAttempts > 0 ? Math.round((quizAttempts / totalEnrolledUsers) * 100) : 0;

    return success({
      res,
      message: "Lesson analytics retrieved successfully",
      data: {
        lesson: {
          id: lesson._id,
          title: lesson.title,
          topic: lesson.topic,
          order: lesson.order,
          hasQuiz: lesson.quiz && lesson.quiz.length > 0,
          quizQuestionCount: lesson.quiz ? lesson.quiz.length : 0,
        },
        stats: {
          totalEnrolledUsers,
          completedUsers,
          completionRate,
          averageTimeSpent: `${averageTimeSpent} minutes`,
          quizAttempts,
          averageQuizScore: lesson.quiz && lesson.quiz.length > 0 ? `${averageQuizScore}%` : 'N/A',
          quizPassRate: lesson.quiz && lesson.quiz.length > 0 ? `${quizPassRate}%` : 'N/A',
        }
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve lesson analytics" });
  }
};

module.exports = {
  createLesson,
  getLessonsByTopic,
  getLessonById,
  updateLesson,
  deactivateLesson,
  deleteLesson,
  reorderLessons,
  submitQuiz,
  markLessonProgress,
  getLessonAnalytics,
};
