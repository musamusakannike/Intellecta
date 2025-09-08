# Database Seeding Guide

## Overview
This seeding script creates comprehensive test data for the Intellecta learning platform, including:
- **12 diverse courses** across different categories
- **Multiple topics and lessons** with rich content
- **5 test user accounts** (1 admin + 4 regular users)
- **Realistic user progress** and enrollments
- **Course reviews and ratings**

## Quick Start

### 1. Run the Seeding Script
```bash
npm run seed
```

### 2. Test Accounts Created
After seeding, you can use these accounts for testing:

**Admin Account:**
- Email: `admin@intellecta.com`
- Password: `admin123`
- Role: Admin (can manage courses, topics, lessons)

**User Accounts:**
- Email: `john@example.com` | Password: `user123`
- Email: `jane@example.com` | Password: `user123`
- Email: `bob@example.com` | Password: `user123`
- Email: `alice@example.com` | Password: `user123`

## What Gets Created

### Courses (12 total)
1. **JavaScript Fundamentals** (Featured)
   - Categories: programming, javascript, web development
   - Rating: 4.8/5 (245 reviews)

2. **Python for Data Science** (Featured)
   - Categories: programming, python, data science, analytics
   - Rating: 4.6/5 (189 reviews)

3. **React.js Complete Guide** (Featured)
   - Categories: programming, javascript, react, web development, frontend
   - Rating: 4.7/5 (312 reviews)

4. **Node.js Backend Development**
   - Categories: programming, javascript, nodejs, backend, web development
   - Rating: 4.5/5 (156 reviews)

5. **Machine Learning with Python** (Featured)
   - Categories: programming, python, machine learning, ai, data science
   - Rating: 4.9/5 (278 reviews)

6. **CSS Grid and Flexbox Mastery**
   - Categories: web development, css, frontend, design
   - Rating: 4.4/5 (123 reviews)

7. **Database Design and SQL**
   - Categories: database, sql, backend, data management
   - Rating: 4.3/5 (94 reviews)

8. **Docker and DevOps Essentials**
   - Categories: devops, docker, deployment, containers
   - Rating: 4.2/5 (87 reviews)

9. **Mobile App Development with Flutter**
   - Categories: mobile development, flutter, dart, cross-platform
   - Rating: 4.1/5 (76 reviews)

10. **Cybersecurity Fundamentals**
    - Categories: cybersecurity, security, networking, ethical hacking
    - Rating: 4.0/5 (65 reviews)

11. **UI/UX Design Principles**
    - Categories: design, ui, ux, prototyping
    - Rating: 4.6/5 (134 reviews)

12. **Blockchain Development**
    - Categories: blockchain, solidity, web3, cryptocurrency
    - Rating: 3.9/5 (52 reviews)

### Content Structure
Each course includes:
- **2-4 Topics** per course
- **1-3 Lessons** per topic
- **Rich content** including text, code examples
- **Interactive quizzes** with explanations
- **Content groups** for organized learning

### User Data
- **Realistic enrollments**: Users are enrolled in 1-4 random courses
- **Progress tracking**: Varied completion rates (0-100%)
- **Time tracking**: Simulated learning time per lesson
- **Quiz scores**: Random scores for completed lessons
- **Course reviews**: Authentic-looking reviews with ratings

## Testing Different Features

### Search and Filtering
Test these search scenarios:
- **Text search**: "javascript", "python", "data science"
- **Category filtering**: "programming", "design", "devops"
- **Rating filters**: courses above 4.5 stars
- **Featured courses**: filter by featured status
- **Combined filters**: search + category + rating

### User Roles
- **Admin users**: Can create/edit courses, view analytics
- **Regular users**: Can enroll, track progress, submit quizzes

### Progress Tracking
- **Enrollment status**: enrolled, in_progress, completed
- **Lesson completion**: mark lessons complete, track time
- **Quiz functionality**: submit answers, get scores
- **Topic progress**: automatic calculation based on lessons

### Analytics (Admin Only)
- **Course analytics**: enrollment trends, completion rates
- **Topic analytics**: lesson-by-lesson progress
- **User analytics**: individual progress tracking

## API Testing Examples

### Get All Courses
```bash
curl http://localhost:5000/api/courses
```

### Search Courses
```bash
curl "http://localhost:5000/api/courses/search?search=javascript&category=programming&minRating=4"
```

### Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@intellecta.com",
    "password": "admin123"
  }'
```

### Get Course Topics (use courseId from courses response)
```bash
curl http://localhost:5000/api/topics/course/[COURSE_ID]
```

### Get Topic Lessons (use topicId from topics response)
```bash
curl http://localhost:5000/api/lessons/topic/[TOPIC_ID]
```

## Resetting Data

To clear and recreate all test data:
```bash
npm run seed
```

**Warning**: This will delete all existing data and create fresh test data.

## Categories for Testing

The seeded data includes these categories for filter testing:
- `programming` (7 courses)
- `web development` (4 courses)
- `javascript` (4 courses)
- `python` (2 courses)
- `data science` (2 courses)
- `frontend` (2 courses)
- `backend` (2 courses)
- `design` (2 courses)
- `devops` (1 course)
- `mobile development` (1 course)
- `cybersecurity` (1 course)
- `blockchain` (1 course)

## Course Ratings Distribution

- **4.5+ stars**: 7 courses (high quality)
- **4.0-4.4 stars**: 4 courses (good quality)
- **Below 4.0**: 1 course (lower rating for variety)

This distribution helps test rating-based filtering and sorting.

## Troubleshooting

### Connection Issues
Make sure your MongoDB is running and the connection string in `.env` is correct:
```
MONGO_URI=your_mongodb_connection_string
```

### Permission Errors
Ensure your user has write permissions to the database specified in your connection string.

### Memory Issues
If you encounter memory issues with large datasets, try reducing the number of enrollments or reviews in the script.

---

**Happy Testing!** 🚀
