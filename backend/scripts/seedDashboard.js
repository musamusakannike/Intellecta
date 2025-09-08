const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Topic = require('../models/topic.model');
const Lesson = require('../models/lesson.model');
const Enrollment = require('../models/enrollment.model');
const DailyChallenge = require('../models/dailyChallenge.model');
const ChallengeSubmission = require('../models/challengeSubmission.model');
const Leaderboard = require('../models/leaderboard.model');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/intellecta');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Sample daily challenges
const sampleChallenges = [
  {
    title: "Array Sum Challenge",
    description: "Write a function that takes an array of numbers and returns the sum of all positive numbers.",
    difficulty: "easy",
    category: "Arrays",
    points: 50,
    codeTemplate: `function sumPositiveNumbers(numbers) {
  // Your code here
  return 0;
}`,
    expectedOutput: 15,
    testCases: [
      { input: [1, 2, 3, -4, 5], expectedOutput: 11 },
      { input: [-1, -2, -3], expectedOutput: 0 },
      { input: [1, 2, 3, 4], expectedOutput: 10 }
    ],
    hints: [
      "Use a loop to iterate through the array",
      "Check if each number is positive before adding",
      "Initialize a sum variable to 0"
    ],
    solution: `function sumPositiveNumbers(numbers) {
  return numbers.filter(num => num > 0).reduce((sum, num) => sum + num, 0);
}`,
    isActive: true,
    activeDate: new Date()
  },
  {
    title: "String Reversal",
    description: "Create a function that reverses a string without using the built-in reverse method.",
    difficulty: "easy",
    category: "Strings",
    points: 40,
    codeTemplate: `function reverseString(str) {
  // Your code here
  return "";
}`,
    expectedOutput: "olleh",
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "world", expectedOutput: "dlrow" },
      { input: "a", expectedOutput: "a" }
    ],
    hints: [
      "Think about accessing characters from the end",
      "Use a loop to build the reversed string",
      "Consider using string concatenation"
    ],
    solution: `function reverseString(str) {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}`,
    isActive: false,
    activeDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
  },
  {
    title: "Find Maximum Number",
    description: "Write a function that finds the largest number in an array without using Math.max.",
    difficulty: "medium",
    category: "Arrays",
    points: 75,
    codeTemplate: `function findMaximum(numbers) {
  // Your code here
  return 0;
}`,
    expectedOutput: 9,
    testCases: [
      { input: [1, 5, 3, 9, 2], expectedOutput: 9 },
      { input: [-1, -5, -2], expectedOutput: -1 },
      { input: [42], expectedOutput: 42 }
    ],
    hints: [
      "Start with the first element as maximum",
      "Compare each element with current maximum",
      "Update maximum when you find a larger number"
    ],
    solution: `function findMaximum(numbers) {
  if (numbers.length === 0) return undefined;
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}`,
    isActive: false,
    activeDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
  }
];

// Enhanced user data with more realistic names
const enhancedUsers = [
  {
    name: "Musa Musakannike",
    email: "musa@intellecta.com",
    password: "admin123",
    role: "user",
    verified: true,
    isPremium: true,
    premiumExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
  },
  {
    name: "Sarah Chen",
    email: "sarah@example.com",
    password: "user123",
    role: "user",
    verified: true,
  },
  {
    name: "Marcus Johnson",
    email: "marcus@example.com",
    password: "user123",
    role: "user",
    verified: true,
  },
  {
    name: "Emily Rodriguez",
    email: "emily@example.com",
    password: "user123",
    role: "user",
    verified: true,
    isPremium: true,
    premiumExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    name: "Alex Kim",
    email: "alex@example.com",
    password: "user123",
    role: "user",
    verified: true,
  }
];

const seedDashboard = async () => {
  try {
    await connectDB();

    console.log('Clearing existing dashboard data...');
    await DailyChallenge.deleteMany();
    await ChallengeSubmission.deleteMany();
    await Leaderboard.deleteMany();

    // Create enhanced users if they don't exist
    console.log('Creating users...');
    const users = [];
    for (const userData of enhancedUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        user = await User.create({
          ...userData,
          password: hashedPassword
        });
      }
      users.push(user);
    }

    console.log('Creating daily challenges...');
    const challenges = await DailyChallenge.insertMany(sampleChallenges);

    console.log('Creating challenge submissions...');
    // Create some sample submissions
    const submissions = [];
    const todayChallenge = challenges.find(c => 
      c.activeDate.toDateString() === new Date().toDateString()
    );

    if (todayChallenge) {
      // Some users completed today's challenge
      for (let i = 0; i < Math.min(3, users.length); i++) {
        const submission = {
          user: users[i]._id,
          challenge: todayChallenge._id,
          code: todayChallenge.solution,
          isCorrect: Math.random() > 0.3, // 70% success rate
          pointsEarned: Math.random() > 0.3 ? todayChallenge.points : 0,
          timeSpent: Math.floor(Math.random() * 600) + 300, // 5-15 minutes
          attempts: Math.floor(Math.random() * 3) + 1,
          completedAt: Math.random() > 0.3 ? new Date() : null,
          submittedAt: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000), // Within last 2 hours
          testResults: [
            { testCase: 1, passed: true, actualOutput: 11, expectedOutput: 11 },
            { testCase: 2, passed: true, actualOutput: 0, expectedOutput: 0 },
            { testCase: 3, passed: Math.random() > 0.2, actualOutput: 10, expectedOutput: 10 }
          ]
        };
        submissions.push(submission);
      }
    }

    await ChallengeSubmission.insertMany(submissions);

    console.log('Creating leaderboard entries...');
    // Create leaderboard entries for all users
    const leaderboardEntries = users.map((user, index) => {
      const challengePoints = Math.floor(Math.random() * 500) + 100;
      const coursePoints = Math.floor(Math.random() * 1000) + 200;
      const totalPoints = challengePoints + coursePoints;
      
      return {
        user: user._id,
        totalPoints,
        challengePoints,
        coursePoints,
        streakDays: Math.floor(Math.random() * 30) + 1,
        longestStreak: Math.floor(Math.random() * 45) + 10,
        lastActivityDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last week
        completedCourses: Math.floor(Math.random() * 5) + 1,
        completedChallenges: Math.floor(Math.random() * 20) + 5,
        rank: 0, // Will be calculated
        badges: [
          {
            name: "First Steps",
            description: "Completed your first lesson",
            icon: "🎯",
            earnedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          },
          {
            name: "Challenge Seeker",
            description: "Completed 5 daily challenges",
            icon: "⚡",
            earnedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000)
          }
        ],
        achievements: [
          {
            title: "Course Completion",
            description: "Finished JavaScript Fundamentals",
            type: "course",
            points: 100,
            earnedAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000)
          }
        ],
        experiencePoints: totalPoints
      };
    });

    // Sort by total points and assign ranks
    leaderboardEntries.sort((a, b) => b.totalPoints - a.totalPoints);
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    await Leaderboard.insertMany(leaderboardEntries);

    // Create some sample enrollments with progress
    console.log('Creating sample enrollments...');
    const courses = await Course.find().limit(3);
    if (courses.length > 0 && users.length > 0) {
      const sampleEnrollment = {
        user: users[0]._id,
        course: courses[0]._id,
        enrolledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        startedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        progressPercentage: 45,
        totalTimeSpent: 300, // 5 hours
        lastAccessedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: "in_progress"
      };

      // Check if enrollment already exists
      const existingEnrollment = await Enrollment.findOne({
        user: users[0]._id,
        course: courses[0]._id
      });

      if (!existingEnrollment) {
        await Enrollment.create(sampleEnrollment);
      }
    }

    console.log('✅ Dashboard seed data created successfully!');
    console.log(`Created ${challenges.length} daily challenges`);
    console.log(`Created ${submissions.length} challenge submissions`);
    console.log(`Created ${leaderboardEntries.length} leaderboard entries`);
    
  } catch (error) {
    console.error('❌ Error seeding dashboard data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedDashboard();
