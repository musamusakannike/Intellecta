# Topics & Lessons API Documentation

## Base URLs
- Topics: `http://localhost:5000/api/topics`
- Lessons: `http://localhost:5000/api/lessons`

## Authentication
- **Public routes**: No authentication required
- **User routes**: Include JWT token in Authorization header: `Authorization: Bearer <token>`
- **Admin routes**: Require JWT token with admin role

---

# Topic API Endpoints

## Public/Authenticated Endpoints

### GET /topics/course/:courseId
Get all topics for a course

**Parameters:**
- `courseId`: Course ID (MongoDB ObjectId)

**Query Parameters:**
- `includeInactive` (optional): Include inactive topics (boolean, admin only)

**Example:**
```
GET /api/topics/course/507f1f77bcf86cd799439011?includeInactive=false
```

### GET /topics/:id
Get topic by ID with lessons and user progress

**Parameters:**
- `id`: Topic ID (MongoDB ObjectId)

**Example:**
```
GET /api/topics/507f1f77bcf86cd799439012
```

## Admin Only Endpoints

### POST /topics
Create a new topic
*Requires: Admin role*

**Request Body:**
```json
{
  "title": "Introduction to Variables",
  "description": "Learn about variables and data types in programming",
  "course": "507f1f77bcf86cd799439011",
  "order": 0,
  "isActive": true
}
```

### PUT /topics/:id
Update a topic
*Requires: Admin role*

**Parameters:**
- `id`: Topic ID (MongoDB ObjectId)

**Request Body (all fields optional):**
```json
{
  "title": "Updated Topic Title",
  "description": "Updated description",
  "order": 1,
  "isActive": true
}
```

### PATCH /topics/:id/deactivate
Deactivate (soft delete) a topic and all its lessons
*Requires: Admin role*

### DELETE /topics/:id
Delete a topic (hard delete - only if no lessons or user progress)
*Requires: Admin role*

### PATCH /topics/course/:courseId/reorder
Reorder topics in a course
*Requires: Admin role*

**Request Body:**
```json
{
  "topicIds": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
}
```

### GET /topics/:id/analytics
Get detailed analytics for a topic
*Requires: Admin role*

---

# Lesson API Endpoints

## Public/Authenticated Endpoints

### GET /lessons/topic/:topicId
Get all lessons for a topic

**Parameters:**
- `topicId`: Topic ID (MongoDB ObjectId)

**Query Parameters:**
- `includeInactive` (optional): Include inactive lessons (boolean, admin only)

**Example:**
```
GET /api/lessons/topic/507f1f77bcf86cd799439012
```

### GET /lessons/:id
Get lesson by ID with full content and user progress

**Parameters:**
- `id`: Lesson ID (MongoDB ObjectId)

**Response Notes:**
- Quiz answers are hidden for non-admin users
- User progress included if authenticated and enrolled

**Example:**
```
GET /api/lessons/507f1f77bcf86cd799439015
```

## Authenticated User Endpoints

### POST /lessons/:id/quiz/submit
Submit quiz answers for a lesson
*Requires: Authentication and course enrollment*

**Parameters:**
- `id`: Lesson ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "answers": [0, 2, 1, 3] // Array of answer indices
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "score": 75,
    "correctAnswers": 3,
    "totalQuestions": 4,
    "passed": true,
    "results": [
      {
        "questionIndex": 0,
        "question": "What is a variable?",
        "userAnswer": 0,
        "correctAnswer": 0,
        "isCorrect": true,
        "explanation": "A variable is a storage location..."
      }
    ]
  }
}
```

### PATCH /lessons/:id/progress
Mark lesson progress (completion, time spent)
*Requires: Authentication and course enrollment*

**Parameters:**
- `id`: Lesson ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "isCompleted": true,
  "timeSpent": 25 // minutes spent on this session
}
```

## Admin Only Endpoints

### POST /lessons
Create a new lesson
*Requires: Admin role*

**Request Body:**
```json
{
  "title": "Understanding Variables",
  "description": "In this lesson, you'll learn about variables and how to use them",
  "topic": "507f1f77bcf86cd799439012",
  "order": 0,
  "isActive": true,
  "contentGroups": [
    {
      "title": "Introduction",
      "description": "Basic concepts",
      "order": 0,
      "contents": [
        {
          "type": "text",
          "content": "Variables are containers for storing data...",
          "order": 0
        },
        {
          "type": "code",
          "content": "let myVariable = 'Hello World';",
          "order": 1
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "What keyword is used to declare a variable in JavaScript?",
      "options": ["let", "var", "const", "All of the above"],
      "correctAnswer": 3,
      "explanation": "All three keywords can be used to declare variables in JavaScript"
    }
  ]
}
```

### PUT /lessons/:id
Update a lesson
*Requires: Admin role*

**Parameters:**
- `id`: Lesson ID (MongoDB ObjectId)

**Request Body (all fields optional):**
```json
{
  "title": "Updated Lesson Title",
  "description": "Updated description",
  "order": 1,
  "isActive": true,
  "contentGroups": [...],
  "quiz": [...]
}
```

### PATCH /lessons/:id/deactivate
Deactivate (soft delete) a lesson
*Requires: Admin role*

### DELETE /lessons/:id
Delete a lesson (hard delete - only if no user progress)
*Requires: Admin role*

### PATCH /lessons/topic/:topicId/reorder
Reorder lessons in a topic
*Requires: Admin role*

**Request Body:**
```json
{
  "lessonIds": ["507f1f77bcf86cd799439015", "507f1f77bcf86cd799439016"]
}
```

### GET /lessons/:id/analytics
Get detailed analytics for a lesson
*Requires: Admin role*

---

## Data Structures

### Topic Object
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Introduction to Variables",
  "description": "Learn about variables and data types",
  "course": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "JavaScript Fundamentals"
  },
  "order": 0,
  "isActive": true,
  "lessonCount": 5,
  "userProgress": {
    "topic": "507f1f77bcf86cd799439012",
    "isCompleted": false,
    "progressPercentage": 60,
    "lessonsProgress": [...]
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T14:45:00.000Z"
}
```

### Lesson Object
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "title": "Understanding Variables",
  "description": "Learn what variables are and how to use them",
  "topic": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Introduction to Variables",
    "course": "507f1f77bcf86cd799439011"
  },
  "order": 0,
  "isActive": true,
  "contentGroups": [
    {
      "title": "Introduction",
      "description": "Basic concepts",
      "order": 0,
      "contents": [
        {
          "type": "text",
          "content": "Variables are containers...",
          "order": 0
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "What is a variable?",
      "options": ["A container", "A function", "A method", "None"],
      // correctAnswer and explanation hidden for non-admin users
    }
  ],
  "hasQuiz": true,
  "quizQuestionCount": 3,
  "isEnrolled": true,
  "userProgress": {
    "lesson": "507f1f77bcf86cd799439015",
    "isCompleted": true,
    "completedAt": "2024-01-16T12:00:00.000Z",
    "timeSpent": 45,
    "quizScore": 85
  }
}
```

### Content Types
Supported content types in lessons:
- `text`: Plain text content
- `image`: Image URL or base64
- `code`: Code snippets with syntax highlighting
- `latex`: Mathematical formulas
- `link`: External links
- `video`: Video file URLs
- `youtubeUrl`: YouTube video URLs

### User Progress Object
```json
{
  "lesson": "507f1f77bcf86cd799439015",
  "isCompleted": true,
  "completedAt": "2024-01-16T12:00:00.000Z",
  "timeSpent": 45, // total minutes spent
  "quizScore": 85 // percentage score (0-100)
}
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
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

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (not enrolled or insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate order, etc.)
- `500` - Internal Server Error

## Features

### Progress Tracking
- Automatic progress calculation
- Time tracking per lesson
- Topic completion based on lesson completion
- Course-level progress aggregation

### Quiz System
- Multiple choice questions
- Automatic scoring
- Pass/fail thresholds (70%)
- Detailed feedback with explanations
- Progress integration

### Content Management
- Flexible content groups
- Multiple content types
- Rich text and multimedia support
- Ordered content delivery

### Analytics & Reporting
- Completion rates and trends
- Time analytics
- Quiz performance metrics
- User engagement insights

### Flexible Ordering
- Drag-and-drop reordering
- Bulk order updates
- Maintains referential integrity

### Access Control
- Role-based permissions
- Enrollment verification
- Content visibility rules
- Progressive access
