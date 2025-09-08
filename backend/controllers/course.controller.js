const Course = require("../models/course.model");
const Topic = require("../models/topic.model");
const Lesson = require("../models/lesson.model");
const Enrollment = require("../models/enrollment.model");
const Review = require("../models/review.model");
const { error, success } = require("../util/response.util");
const mongoose = require("mongoose");

// Create a new course (Admin only)
const createCourse = async (req, res) => {
  try {
    const { title, description, image, categories, isFeatured, isActive } = req.body;

    // Check if course with same title already exists
    const existingCourse = await Course.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });
    if (existingCourse) {
      return error({ res, message: "Course with this title already exists", statusCode: 409 });
    }

    const course = new Course({
      title,
      description,
      image,
      categories,
      isFeatured: isFeatured || false,
      isActive: isActive !== undefined ? isActive : true,
    });

    await course.save();

    return success({
      res,
      message: "Course created successfully",
      statusCode: 201,
      data: { course }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to create course" });
  }
};

// Get all courses with filtering and pagination
const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.category) {
      filter.categories = { $regex: new RegExp(req.query.category, 'i') };
    }
    
    if (req.query.featured !== undefined) {
      filter.isFeatured = req.query.featured === 'true';
    }
    
    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    } else {
      // By default, only show active courses for non-admin users
      if (req.user?.role !== 'admin') {
        filter.isActive = true;
      }
    }

    // Build sort object
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    let sort = {};

    switch (sortBy) {
      case 'title':
        sort = { title: sortOrder };
        break;
      case 'rating':
        sort = { 'ratingStats.averageRating': sortOrder, 'ratingStats.totalRatings': sortOrder };
        break;
      case 'createdAt':
        sort = { createdAt: sortOrder };
        break;
      case 'updatedAt':
        sort = { updatedAt: sortOrder };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const courses = await Course.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Get enrollment counts for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
        const topicCount = await Topic.countDocuments({ course: course._id, isActive: true });
        
        return {
          ...course.toObject(),
          enrollmentCount,
          topicCount,
        };
      })
    );

    return success({
      res,
      message: "Courses retrieved successfully",
      data: {
        courses: coursesWithStats,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        }
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve courses" });
  }
};

// Advanced course search
const searchCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build search filter
    const filter = {};
    
    // Only show active courses for non-admin users
    if (req.user?.role !== 'admin') {
      filter.isActive = true;
    }

    // Text search
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      filter.categories = { $regex: new RegExp(req.query.category, 'i') };
    }

    // Rating filter
    if (req.query.minRating || req.query.maxRating) {
      filter['ratingStats.averageRating'] = {};
      if (req.query.minRating) {
        filter['ratingStats.averageRating'].$gte = parseFloat(req.query.minRating);
      }
      if (req.query.maxRating) {
        filter['ratingStats.averageRating'].$lte = parseFloat(req.query.maxRating);
      }
    }

    // Featured filter
    if (req.query.featured !== undefined) {
      filter.isFeatured = req.query.featured === 'true';
    }

    // Active filter (admin only)
    if (req.query.active !== undefined && req.user?.role === 'admin') {
      filter.isActive = req.query.active === 'true';
    }

    // Build sort object
    let sort = {};
    const sortBy = req.query.sortBy || 'relevance';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    switch (sortBy) {
      case 'title':
        sort = { title: sortOrder };
        break;
      case 'rating':
        sort = { 'ratingStats.averageRating': sortOrder, 'ratingStats.totalRatings': sortOrder };
        break;
      case 'popularity':
        sort = { 'ratingStats.totalRatings': sortOrder };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'relevance':
      default:
        if (req.query.search) {
          sort = { score: { $meta: 'textScore' } };
        } else {
          sort = { 'ratingStats.averageRating': -1, 'ratingStats.totalRatings': -1 };
        }
        break;
    }

    let query = Course.find(filter);
    
    // Add text score for relevance sorting
    if (req.query.search && sortBy === 'relevance') {
      query = query.select({ score: { $meta: 'textScore' } });
    }

    const courses = await query
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Get enrollment counts and topic counts
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
        const topicCount = await Topic.countDocuments({ course: course._id, isActive: true });
        
        return {
          ...course.toObject(),
          enrollmentCount,
          topicCount,
        };
      })
    );

    // Get unique categories for faceting
    const allCategories = await Course.distinct('categories', { isActive: true });

    return success({
      res,
      message: "Course search completed successfully",
      data: {
        courses: coursesWithStats,
        pagination: {
          currentPage: page,
          totalPages,
          totalResults: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        facets: {
          categories: allCategories,
        }
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to search courses" });
  }
};

// Get course by ID with full details
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Find course and populate topics and lessons
    const course = await Course.findById(id);

    if (!course) {
      return error({ res, message: "Course not found", statusCode: 404 });
    }

    // Check if course is active (unless user is admin)
    if (!course.isActive && req.user?.role !== 'admin') {
      return error({ res, message: "Course not found", statusCode: 404 });
    }

    // Get topics with lessons
    const topics = await Topic.find({ course: id, isActive: true })
      .sort({ order: 1 });

    const topicsWithLessons = await Promise.all(
      topics.map(async (topic) => {
        const lessons = await Lesson.find({ topic: topic._id, isActive: true })
          .sort({ order: 1 })
          .select('title description order');
        
        return {
          ...topic.toObject(),
          lessons,
          lessonCount: lessons.length,
        };
      })
    );

    // Get enrollment info if user is logged in
    let enrollmentInfo = null;
    if (userId) {
      enrollmentInfo = await Enrollment.findOne({ user: userId, course: id });
    }

    // Get course statistics
    const enrollmentCount = await Enrollment.countDocuments({ course: id });
    const completedCount = await Enrollment.countDocuments({ course: id, isCompleted: true });
    
    // Get recent reviews
    const recentReviews = await Review.find({ course: id, isActive: true })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(5);

    const totalLessons = await Lesson.countDocuments({ 
      topic: { $in: topics.map(t => t._id) }, 
      isActive: true 
    });

    return success({
      res,
      message: "Course retrieved successfully",
      data: {
        course: {
          ...course.toObject(),
          topics: topicsWithLessons,
          topicCount: topics.length,
          totalLessons,
        },
        enrollment: enrollmentInfo,
        stats: {
          enrollmentCount,
          completedCount,
          completionRate: enrollmentCount > 0 ? Math.round((completedCount / enrollmentCount) * 100) : 0,
        },
        recentReviews,
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve course" });
  }
};

// Update course (Admin only)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if course exists
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return error({ res, message: "Course not found", statusCode: 404 });
    }

    // If title is being updated, check for duplicates
    if (updateData.title && updateData.title !== existingCourse.title) {
      const duplicateCourse = await Course.findOne({ 
        title: { $regex: new RegExp(`^${updateData.title}$`, 'i') },
        _id: { $ne: id }
      });
      if (duplicateCourse) {
        return error({ res, message: "Course with this title already exists", statusCode: 409 });
      }
    }

    updateData.updatedAt = new Date();

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return success({
      res,
      message: "Course updated successfully",
      data: { course: updatedCourse }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to update course" });
  }
};

// Deactivate course (Admin only)
const deactivateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!course) {
      return error({ res, message: "Course not found", statusCode: 404 });
    }

    return success({
      res,
      message: "Course deactivated successfully",
      data: { course }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to deactivate course" });
  }
};

// Delete course (Admin only)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const course = await Course.findById(id);
    if (!course) {
      return error({ res, message: "Course not found", statusCode: 404 });
    }

    // Check if course has enrollments
    const enrollmentCount = await Enrollment.countDocuments({ course: id });
    if (enrollmentCount > 0) {
      return error({ 
        res, 
        message: "Cannot delete course with existing enrollments. Consider deactivating instead.", 
        statusCode: 400 
      });
    }

    // Use transaction to delete course and related data
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete all lessons in topics of this course
      const topics = await Topic.find({ course: id }).session(session);
      const topicIds = topics.map(topic => topic._id);
      
      await Lesson.deleteMany({ topic: { $in: topicIds } }).session(session);
      
      // Delete all topics
      await Topic.deleteMany({ course: id }).session(session);
      
      // Delete all reviews
      await Review.deleteMany({ course: id }).session(session);
      
      // Delete the course
      await Course.findByIdAndDelete(id).session(session);

      await session.commitTransaction();

      return success({
        res,
        message: "Course and all related data deleted successfully"
      });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } catch (err) {
    return error({ res, message: err?.message || "Failed to delete course" });
  }
};

// Enroll user in course
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Check if course exists and is active
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return error({ res, message: "Course not found or not available", statusCode: 404 });
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      return error({ res, message: "You are already enrolled in this course", statusCode: 409 });
    }

    // Get course topics and lessons for enrollment setup
    const topics = await Topic.find({ course: courseId, isActive: true }).sort({ order: 1 });
    const topicsProgress = [];

    for (const topic of topics) {
      const lessons = await Lesson.find({ topic: topic._id, isActive: true }).sort({ order: 1 });
      const lessonsProgress = lessons.map(lesson => ({
        lesson: lesson._id,
        isCompleted: false,
        timeSpent: 0,
      }));

      topicsProgress.push({
        topic: topic._id,
        isCompleted: false,
        lessonsProgress,
        progressPercentage: 0,
      });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      user: userId,
      course: courseId,
      topicsProgress,
      progressPercentage: 0,
      status: 'enrolled',
    });

    await enrollment.save();

    // Populate the enrollment for response
    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('course', 'title description image')
      .populate('user', 'name email');

    return success({
      res,
      message: "Successfully enrolled in course",
      statusCode: 201,
      data: { enrollment: populatedEnrollment }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to enroll in course" });
  }
};

// Get user's enrolled courses
const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: userId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const enrollments = await Enrollment.find(filter)
      .populate('course', 'title description image categories ratingStats')
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Enrollment.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return success({
      res,
      message: "Enrollments retrieved successfully",
      data: {
        enrollments,
        pagination: {
          currentPage: page,
          totalPages,
          totalEnrollments: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        }
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve enrollments" });
  }
};

// Get course analytics (Admin only)
// Get all available course categories
const getCategories = async (req, res) => {
  try {
    const categories = await Course.distinct('categories', { isActive: true });
    
    return success({
      res,
      message: "Categories retrieved successfully",
      data: { categories: categories.sort() }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve categories" });
  }
};

const getCourseAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const course = await Course.findById(id);
    if (!course) {
      return error({ res, message: "Course not found", statusCode: 404 });
    }

    // Get enrollment statistics
    const totalEnrollments = await Enrollment.countDocuments({ course: id });
    const completedEnrollments = await Enrollment.countDocuments({ course: id, isCompleted: true });
    const activeEnrollments = await Enrollment.countDocuments({ course: id, status: 'in_progress' });

    // Get enrollment trends (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentEnrollments = await Enrollment.countDocuments({ 
      course: id, 
      enrolledAt: { $gte: thirtyDaysAgo } 
    });

    // Get average completion time
    const completedEnrollmentsWithTime = await Enrollment.find({ 
      course: id, 
      isCompleted: true,
      enrolledAt: { $exists: true },
      completedAt: { $exists: true }
    });

    let avgCompletionTime = 0;
    if (completedEnrollmentsWithTime.length > 0) {
      const totalTime = completedEnrollmentsWithTime.reduce((sum, enrollment) => {
        const timeDiff = enrollment.completedAt - enrollment.enrolledAt;
        return sum + timeDiff;
      }, 0);
      avgCompletionTime = Math.round(totalTime / completedEnrollmentsWithTime.length / (1000 * 60 * 60 * 24)); // in days
    }

    // Get average rating
    const ratingStats = course.ratingStats;

    // Get progress distribution
    const progressRanges = [
      { range: '0-25%', min: 0, max: 25 },
      { range: '26-50%', min: 26, max: 50 },
      { range: '51-75%', min: 51, max: 75 },
      { range: '76-99%', min: 76, max: 99 },
      { range: '100%', min: 100, max: 100 }
    ];

    const progressDistribution = await Promise.all(
      progressRanges.map(async (range) => ({
        range: range.range,
        count: await Enrollment.countDocuments({
          course: id,
          progressPercentage: { $gte: range.min, $lte: range.max }
        })
      }))
    );

    return success({
      res,
      message: "Course analytics retrieved successfully",
      data: {
        course: {
          id: course._id,
          title: course.title,
          isActive: course.isActive,
          createdAt: course.createdAt,
        },
        enrollmentStats: {
          total: totalEnrollments,
          completed: completedEnrollments,
          active: activeEnrollments,
          recent: recentEnrollments,
          completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
          avgCompletionTime: `${avgCompletionTime} days`,
        },
        ratingStats,
        progressDistribution,
      }
    });
  } catch (err) {
    return error({ res, message: err?.message || "Failed to retrieve course analytics" });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  searchCourses,
  getCourseById,
  updateCourse,
  deactivateCourse,
  deleteCourse,
  enrollInCourse,
  getMyEnrollments,
  getCategories,
  getCourseAnalytics,
};
