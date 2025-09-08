const Topic = require("../models/topic.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Enrollment = require("../models/enrollment.model");
const { error, success } = require("../util/response.util");
const mongoose = require("mongoose");

// Create a new topic (Admin only)
const createTopic = async (req, res) => {
  try {
    const { title, description, course, order, isActive } = req.body;

    // Check if course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return error({ res, message: "Course not found", statusCode: 404 });
    }

    // Check if topic with same order already exists in this course
    const existingTopic = await Topic.findOne({ course, order });
    if (existingTopic) {
      return error({ res, message: "Topic with this order already exists in the course", statusCode: 409 });
    }

    const topic = new Topic({
      title,
      description,
      course,
      order,
      isActive: isActive !== undefined ? isActive : true,
    });

    await topic.save();

    // Populate course information
    const populatedTopic = await Topic.findById(topic._id).populate('course', 'title');

    return success({
      res,
      message: "Topic created successfully",
      statusCode: 201,
      data: { topic: populatedTopic }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to create topic" });
  }
};

// Get all topics for a course
const getTopicsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const includeInactive = req.query.includeInactive === 'true';

    // Check if course exists
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return error({ res, message: "Course not found", statusCode: 404 });
    }

    // Build filter
    const filter = { course: courseId };
    if (!includeInactive && req.user?.role !== 'admin') {
      filter.isActive = true;
    }

    const topics = await Topic.find(filter)
      .populate('course', 'title')
      .sort({ order: 1 });

    // Get lesson counts for each topic
    const topicsWithStats = await Promise.all(
      topics.map(async (topic) => {
        const lessonCount = await Lesson.countDocuments({ 
          topic: topic._id, 
          isActive: true 
        });
        
        return {
          ...topic.toObject(),
          lessonCount,
        };
      })
    );

    return success({
      res,
      message: "Topics retrieved successfully",
      data: { topics: topicsWithStats }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve topics" });
  }
};

// Get topic by ID with lessons
const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const topic = await Topic.findById(id).populate('course', 'title');

    if (!topic) {
      return error({ res, message: "Topic not found", statusCode: 404 });
    }

    // Check if topic is active (unless user is admin)
    if (!topic.isActive && req.user?.role !== 'admin') {
      return error({ res, message: "Topic not found", statusCode: 404 });
    }

    // Get lessons for this topic
    const lessonFilter = { topic: id };
    if (req.user?.role !== 'admin') {
      lessonFilter.isActive = true;
    }

    const lessons = await Lesson.find(lessonFilter)
      .sort({ order: 1 });

    // Get user progress if logged in
    let userProgress = null;
    if (userId) {
      const enrollment = await Enrollment.findOne({ 
        user: userId, 
        course: topic.course._id 
      });
      
      if (enrollment) {
        const topicProgress = enrollment.topicsProgress.find(
          tp => tp.topic.toString() === id
        );
        userProgress = topicProgress || null;
      }
    }

    const topicWithDetails = {
      ...topic.toObject(),
      lessons,
      lessonCount: lessons.length,
      userProgress,
    };

    return success({
      res,
      message: "Topic retrieved successfully",
      data: { topic: topicWithDetails }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve topic" });
  }
};

// Update topic (Admin only)
const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if topic exists
    const existingTopic = await Topic.findById(id);
    if (!existingTopic) {
      return error({ res, message: "Topic not found", statusCode: 404 });
    }

    // If order is being updated, check for conflicts
    if (updateData.order !== undefined && updateData.order !== existingTopic.order) {
      const conflictingTopic = await Topic.findOne({
        course: existingTopic.course,
        order: updateData.order,
        _id: { $ne: id }
      });
      if (conflictingTopic) {
        return error({ res, message: "Topic with this order already exists in the course", statusCode: 409 });
      }
    }

    updateData.updatedAt = new Date();

    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('course', 'title');

    return success({
      res,
      message: "Topic updated successfully",
      data: { topic: updatedTopic }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to update topic" });
  }
};

// Deactivate topic (Admin only)
const deactivateTopic = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    ).populate('course', 'title');

    if (!topic) {
      return error({ res, message: "Topic not found", statusCode: 404 });
    }

    // Also deactivate all lessons in this topic
    await Lesson.updateMany(
      { topic: id },
      { isActive: false, updatedAt: new Date() }
    );

    return success({
      res,
      message: "Topic deactivated successfully",
      data: { topic }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to deactivate topic" });
  }
};

// Delete topic (Admin only)
const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if topic exists
    const topic = await Topic.findById(id);
    if (!topic) {
      return error({ res, message: "Topic not found", statusCode: 404 });
    }

    // Check if topic has lessons
    const lessonCount = await Lesson.countDocuments({ topic: id });
    if (lessonCount > 0) {
      return error({ 
        res, 
        message: "Cannot delete topic with existing lessons. Consider deactivating instead.", 
        statusCode: 400 
      });
    }

    // Check if any users have progress on this topic
    const enrollmentsWithProgress = await Enrollment.countDocuments({
      "topicsProgress.topic": id
    });

    if (enrollmentsWithProgress > 0) {
      return error({ 
        res, 
        message: "Cannot delete topic with existing user progress. Consider deactivating instead.", 
        statusCode: 400 
      });
    }

    await Topic.findByIdAndDelete(id);

    return success({
      res,
      message: "Topic deleted successfully"
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to delete topic" });
  }
};

// Reorder topics in a course (Admin only)
const reorderTopics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { topicIds } = req.body;

    // Check if course exists
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return error({ res, message: "Course not found", statusCode: 404 });
    }

    // Verify all topic IDs belong to this course
    const topics = await Topic.find({ 
      _id: { $in: topicIds }, 
      course: courseId 
    });

    if (topics.length !== topicIds.length) {
      return error({ res, message: "Some topic IDs are invalid or don't belong to this course", statusCode: 400 });
    }

    // Update the order of each topic
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (let i = 0; i < topicIds.length; i++) {
        await Topic.findByIdAndUpdate(
          topicIds[i],
          { order: i, updatedAt: new Date() },
          { session }
        );
      }

      await session.commitTransaction();

      // Get updated topics
      const updatedTopics = await Topic.find({ course: courseId })
        .populate('course', 'title')
        .sort({ order: 1 });

      return success({
        res,
        message: "Topics reordered successfully",
        data: { topics: updatedTopics }
      });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } catch (err) {
    return error({ res, message: err?.message || "Failed to reorder topics" });
  }
};

// Get topic analytics (Admin only)
const getTopicAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if topic exists
    const topic = await Topic.findById(id).populate('course', 'title');
    if (!topic) {
      return error({ res, message: "Topic not found", statusCode: 404 });
    }

    // Get lesson count
    const totalLessons = await Lesson.countDocuments({ topic: id, isActive: true });

    // Get enrollments for the course
    const courseEnrollments = await Enrollment.find({ course: topic.course._id });
    const totalEnrolledUsers = courseEnrollments.length;

    // Calculate completion statistics
    let completedUsers = 0;
    let inProgressUsers = 0;
    let totalTimeSpent = 0;

    for (const enrollment of courseEnrollments) {
      const topicProgress = enrollment.topicsProgress.find(
        tp => tp.topic.toString() === id
      );
      
      if (topicProgress) {
        if (topicProgress.isCompleted) {
          completedUsers++;
        } else if (topicProgress.progressPercentage > 0) {
          inProgressUsers++;
        }
        
        // Sum up time spent on all lessons in this topic
        topicProgress.lessonsProgress.forEach(lesson => {
          totalTimeSpent += lesson.timeSpent || 0;
        });
      }
    }

    const averageTimeSpent = totalEnrolledUsers > 0 ? Math.round(totalTimeSpent / totalEnrolledUsers) : 0;
    const completionRate = totalEnrolledUsers > 0 ? Math.round((completedUsers / totalEnrolledUsers) * 100) : 0;

    // Get lesson completion rates
    const lessons = await Lesson.find({ topic: id, isActive: true }).sort({ order: 1 });
    const lessonAnalytics = [];

    for (const lesson of lessons) {
      let lessonCompletedCount = 0;
      
      for (const enrollment of courseEnrollments) {
        const topicProgress = enrollment.topicsProgress.find(
          tp => tp.topic.toString() === id
        );
        
        if (topicProgress) {
          const lessonProgress = topicProgress.lessonsProgress.find(
            lp => lp.lesson.toString() === lesson._id.toString()
          );
          
          if (lessonProgress && lessonProgress.isCompleted) {
            lessonCompletedCount++;
          }
        }
      }

      lessonAnalytics.push({
        lessonId: lesson._id,
        title: lesson.title,
        completedUsers: lessonCompletedCount,
        completionRate: totalEnrolledUsers > 0 ? Math.round((lessonCompletedCount / totalEnrolledUsers) * 100) : 0,
      });
    }

    return success({
      res,
      message: "Topic analytics retrieved successfully",
      data: {
        topic: {
          id: topic._id,
          title: topic.title,
          course: topic.course,
          order: topic.order,
        },
        stats: {
          totalLessons,
          totalEnrolledUsers,
          completedUsers,
          inProgressUsers,
          notStartedUsers: totalEnrolledUsers - completedUsers - inProgressUsers,
          completionRate,
          averageTimeSpent: `${averageTimeSpent} minutes`,
        },
        lessonAnalytics,
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve topic analytics" });
  }
};

module.exports = {
  createTopic,
  getTopicsByCourse,
  getTopicById,
  updateTopic,
  deactivateTopic,
  deleteTopic,
  reorderTopics,
  getTopicAnalytics,
};
