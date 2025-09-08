import apiService from "./api";

// Course types
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
  enrollmentCount?: number;
  topicCount?: number;
  createdAt: string;
  updatedAt: string;
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
  isEnrolled?: boolean;
  userProgress?: {
    progressPercentage: number;
    completedTopics: number;
    totalTimeSpent: number;
    lastAccessedAt: string;
  };
}

export interface EnrollmentResponse {
  enrollment: {
    _id: string;
    user: string;
    course: string;
    enrolledAt: string;
    status: "enrolled" | "in_progress" | "completed" | "dropped";
    progressPercentage: number;
  };
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
