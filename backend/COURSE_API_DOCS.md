# Course API Documentation

## Base URL
```
http://localhost:5000/api/courses
```

## Public Endpoints (No Authentication Required)

### GET /
Get all courses with filtering and pagination

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12, max: 100)
- `category` (optional): Filter by category
- `featured` (optional): Filter featured courses (true/false)
- `active` (optional): Filter active courses (true/false) - Admin only
- `sortBy` (optional): Sort by field (title, rating, createdAt, updatedAt)
- `sortOrder` (optional): Sort direction (asc, desc)

**Example:**
```
GET /api/courses?page=1&limit=12&category=programming&featured=true&sortBy=rating&sortOrder=desc
```

### GET /search
Advanced course search with text search and filtering

**Query Parameters:**
- `search` (optional): Text search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12, max: 50)
- `category` (optional): Filter by category
- `minRating` (optional): Minimum rating (0-5)
- `maxRating` (optional): Maximum rating (0-5)
- `featured` (optional): Filter featured courses (true/false)
- `active` (optional): Filter active courses (true/false) - Admin only
- `sortBy` (optional): Sort by (title, rating, popularity, newest, oldest, relevance)
- `sortOrder` (optional): Sort direction (asc, desc)

**Example:**
```
GET /api/courses/search?search=javascript&category=programming&minRating=4&sortBy=relevance
```

### GET /:id
Get course by ID with full details including topics, lessons, and statistics

**Parameters:**
- `id`: Course ID (MongoDB ObjectId)

**Example:**
```
GET /api/courses/507f1f77bcf86cd799439011
```

## Authenticated User Endpoints

### GET /enrollments/my
Get current user's enrolled courses
*Requires: Bearer Token*

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by enrollment status (enrolled, in_progress, completed, dropped)

**Example:**
```
GET /api/courses/enrollments/my?status=in_progress&page=1&limit=10
```

### POST /:courseId/enroll
Enroll in a course
*Requires: Bearer Token*

**Parameters:**
- `courseId`: Course ID (MongoDB ObjectId)

**Example:**
```
POST /api/courses/507f1f77bcf86cd799439011/enroll
```

## Admin Only Endpoints
*All admin endpoints require Bearer Token with admin role*

### POST /
Create a new course

**Request Body:**
```json
{
  "title": "JavaScript Fundamentals",
  "description": "Learn the basics of JavaScript programming",
  "image": "https://example.com/image.jpg",
  "categories": ["programming", "javascript", "web development"],
  "isFeatured": false,
  "isActive": true
}
```

### PUT /:id
Update a course

**Parameters:**
- `id`: Course ID (MongoDB ObjectId)

**Request Body (all fields optional):**
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "image": "https://example.com/new-image.jpg",
  "categories": ["updated", "categories"],
  "isFeatured": true,
  "isActive": true
}
```

### PATCH /:id/deactivate
Deactivate (soft delete) a course

**Parameters:**
- `id`: Course ID (MongoDB ObjectId)

### DELETE /:id
Delete a course (hard delete - only allowed if no enrollments exist)

**Parameters:**
- `id`: Course ID (MongoDB ObjectId)

### GET /:id/analytics
Get detailed analytics for a course

**Parameters:**
- `id`: Course ID (MongoDB ObjectId)

**Response includes:**
- Enrollment statistics
- Completion rates
- Average completion time
- Progress distribution
- Rating statistics

## Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Validation errors if any
}
```

### Course Object Structure
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "JavaScript Fundamentals",
  "description": "Learn the basics of JavaScript programming",
  "image": "https://example.com/image.jpg",
  "categories": ["programming", "javascript"],
  "isFeatured": false,
  "isActive": true,
  "ratingStats": {
    "averageRating": 4.5,
    "totalRatings": 150,
    "ratingDistribution": {
      "1": 2,
      "2": 5,
      "3": 18,
      "4": 45,
      "5": 80
    }
  },
  "enrollmentCount": 245,
  "topicCount": 8,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T14:45:00.000Z"
}
```

### Enrollment Object Structure
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439013",
  "course": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "JavaScript Fundamentals",
    "description": "Learn the basics of JavaScript programming",
    "image": "https://example.com/image.jpg"
  },
  "enrolledAt": "2024-01-15T10:30:00.000Z",
  "startedAt": "2024-01-15T11:00:00.000Z",
  "completedAt": null,
  "isCompleted": false,
  "progressPercentage": 45,
  "status": "in_progress",
  "totalTimeSpent": 180, // minutes
  "lastAccessedAt": "2024-01-20T14:45:00.000Z"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate course title, already enrolled, etc.)
- `500` - Internal Server Error

## Features

### Text Search
- Searches through course titles and descriptions
- Uses MongoDB text indexes for performance
- Supports relevance-based sorting

### Advanced Filtering
- Filter by categories, ratings, featured status
- Combine multiple filters
- Efficient database queries with indexes

### Enrollment System
- Track user progress through topics and lessons
- Progress percentages and completion status
- Time tracking and analytics

### Analytics Dashboard
- Enrollment trends and statistics
- Completion rates and average times
- Progress distribution analysis
- Rating analytics

### Course Management
- Full CRUD operations for admins
- Soft delete with deactivation
- Referential integrity with enrollment checks
