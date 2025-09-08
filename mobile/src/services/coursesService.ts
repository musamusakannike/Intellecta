import apiService from "./api";

// Course types (aligned with backend API)
export interface Course {
  _id: string;
  title: string;
  description: string;
  image?: string;
  categories: string[];
  isFeatured: boolean;
  isActive: boolean;
  ratingStats: {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  // Present on list/search responses
  enrollmentCount?: number;
  topicCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Enrollment types (aligned with backend Enrollment model)
export interface EnrollmentLessonProgress {
  lesson: string; // lesson id
  isCompleted: boolean;
  completedAt?: string | null;
  quizScore?: number | null;
  timeSpent: number; // minutes
}

export interface EnrollmentTopicProgress {
  topic: string; // topic id
  isCompleted: boolean;
  completedAt?: string | null;
  lessonsProgress: EnrollmentLessonProgress[];
  progressPercentage: number;
}

export interface Enrollment {
  _id: string;
  user: string | { _id: string; name?: string; email?: string };
  course: string | { _id: string; title: string; description?: string; image?: string };
  enrolledAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  isCompleted: boolean;
  progressPercentage: number;
  topicsProgress?: EnrollmentTopicProgress[];
  totalTimeSpent: number; // minutes
  lastAccessedAt: string;
  status: "enrolled" | "in_progress" | "completed" | "dropped";
}

export interface CourseFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  minRating?: number;
  maxRating?: number;
  sortBy?:
    | "title"
    | "rating"
    | "popularity"
    | "newest"
    | "oldest"
    | "relevance";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CoursesResponse {
  courses: Course[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCourses: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CourseDetails extends Course {
  topics?: {
    _id: string;
    title: string;
    description: string;
    order: number;
    isActive: boolean;
    lessonCount?: number;
  }[];
  topicCount?: number;
  totalLessons?: number;
  // Present when the authenticated user is enrolled in this course
  enrollment?: Enrollment | null;
  // Stats present on detail response
  stats?: {
    enrollmentCount: number;
    completedCount: number;
    completionRate: number; // percentage
  };
  // Optional recent reviews not currently used in mobile UI
  recentReviews?: Array<{
    _id: string;
    user: { _id: string; name: string; profilePicture?: string };
    rating?: number;
    comment?: string;
    createdAt: string;
  }>;
}

export interface EnrollmentResponse {
  enrollment: Enrollment;
}

class CoursesService {
  // Get all courses with filtering and pagination
  async getCourses(filters: CourseFilters = {}): Promise<CoursesResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.featured !== undefined)
      params.append("featured", filters.featured.toString());
    if (filters.minRating)
      params.append("minRating", filters.minRating.toString());
    if (filters.maxRating)
      params.append("maxRating", filters.maxRating.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const endpoint = filters.search
      ? `/courses/search?${params.toString()}`
      : `/courses?${params.toString()}`;

    const response = await apiService.get<CoursesResponse>(endpoint);
    console.log("Courses response:", JSON.stringify(response.data, null, 2));
    return response.data;
  }

  // Get course details by ID
  async getCourseById(courseId: string): Promise<CourseDetails> {
    const response = await apiService.get<CourseDetails>(
      `/courses/${courseId}`
    );
    return response.data;
  }

  // Enroll in a course
  async enrollInCourse(courseId: string): Promise<EnrollmentResponse> {
    const response = await apiService.post<EnrollmentResponse>(
      `/courses/${courseId}/enroll`
    );
    return response.data;
  }

  // Get user's enrolled courses
  async getEnrolledCourses(): Promise<Course[]> {
    const response = await apiService.get<{ courses: Course[] }>(
      "/courses/enrolled"
    );
    return response.data.courses;
  }

  // Get course categories
  async getCategories(): Promise<string[]> {
    const response = await apiService.get<{ categories: string[] }>(
      "/courses/categories"
    );
    return response.data.categories;
  }

  // Get featured courses
  async getFeaturedCourses(): Promise<Course[]> {
    const response = await this.getCourses({ featured: true, limit: 10 });
    return response.courses;
  }

  // Search courses with text
  async searchCourses(
    searchTerm: string,
    filters: Omit<CourseFilters, "search"> = {}
  ): Promise<CoursesResponse> {
    return this.getCourses({ ...filters, search: searchTerm });
  }

  // Get popular courses (by enrollment count)
  async getPopularCourses(limit: number = 10): Promise<Course[]> {
    const response = await this.getCourses({
      sortBy: "popularity",
      sortOrder: "desc",
      limit,
    });
    return response.courses;
  }

  // Get courses by category
  async getCoursesByCategory(
    category: string,
    filters: Omit<CourseFilters, "category"> = {}
  ): Promise<CoursesResponse> {
    return this.getCourses({ ...filters, category });
  }
}

const coursesService = new CoursesService();
export default coursesService;
