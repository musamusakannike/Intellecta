const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Topic = require('../models/topic.model');
const Lesson = require('../models/lesson.model');
const Enrollment = require('../models/enrollment.model');
const Review = require('../models/review.model');

// Sample data
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@intellecta.com",
    password: "admin123",
    role: "admin",
    verified: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "user123",
    role: "user",
    verified: true,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "user123",
    role: "user",
    verified: true,
  },
  {
    name: "Bob Wilson",
    email: "bob@example.com",
    password: "user123",
    role: "user",
    verified: true,
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "user123",
    role: "user",
    verified: true,
  }
];

const sampleCourses = [
  {
    title: "JavaScript Fundamentals",
    description: "Master the basics of JavaScript programming language. Learn variables, functions, objects, and more in this comprehensive beginner course.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    categories: ["programming", "javascript", "web development"],
    isFeatured: true,
    isActive: true,
    ratingStats: {
      averageRating: 4.8,
      totalRatings: 245,
      ratingDistribution: { 1: 2, 2: 8, 3: 25, 4: 60, 5: 150 }
    }
  },
  {
    title: "Python for Data Science",
    description: "Learn Python programming with focus on data analysis, pandas, numpy, and matplotlib. Perfect for aspiring data scientists.",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
    categories: ["programming", "python", "data science", "analytics"],
    isFeatured: true,
    isActive: true,
    ratingStats: {
      averageRating: 4.6,
      totalRatings: 189,
      ratingDistribution: { 1: 3, 2: 12, 3: 28, 4: 56, 5: 90 }
    }
  },
  {
    title: "React.js Complete Guide",
    description: "Build modern web applications with React. Learn components, hooks, state management, and routing in this advanced course.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    categories: ["programming", "javascript", "react", "web development", "frontend"],
    isFeatured: true,
    isActive: true,
    ratingStats: {
      averageRating: 4.7,
      totalRatings: 312,
      ratingDistribution: { 1: 5, 2: 15, 3: 32, 4: 85, 5: 175 }
    }
  },
  {
    title: "Node.js Backend Development",
    description: "Create powerful backend applications with Node.js. Learn Express, databases, authentication, and API development.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    categories: ["programming", "javascript", "nodejs", "backend", "web development"],
    isFeatured: false,
    isActive: true,
    ratingStats: {
      averageRating: 4.5,
      totalRatings: 156,
      ratingDistribution: { 1: 4, 2: 8, 3: 22, 4: 52, 5: 70 }
    }
  },
  {
    title: "Machine Learning with Python",
    description: "Dive deep into machine learning algorithms using Python. Learn scikit-learn, TensorFlow, and build real ML projects.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    categories: ["programming", "python", "machine learning", "ai", "data science"],
    isFeatured: true,
    isActive: true,
    ratingStats: {
      averageRating: 4.9,
      totalRatings: 278,
      ratingDistribution: { 1: 1, 2: 4, 3: 18, 4: 55, 5: 200 }
    }
  },
  {
    title: "CSS Grid and Flexbox Mastery",
    description: "Master modern CSS layout techniques. Learn CSS Grid, Flexbox, and responsive design patterns.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    categories: ["web development", "css", "frontend", "design"],
    isFeatured: false,
    isActive: true,
    ratingStats: {
      averageRating: 4.4,
      totalRatings: 123,
      ratingDistribution: { 1: 2, 2: 6, 3: 18, 4: 42, 5: 55 }
    }
  },
  {
    title: "Database Design and SQL",
    description: "Learn database design principles and master SQL. Cover normalization, indexing, and query optimization.",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
    categories: ["database", "sql", "backend", "data management"],
    isFeatured: false,
    isActive: true,
    ratingStats: {
      averageRating: 4.3,
      totalRatings: 94,
      ratingDistribution: { 1: 2, 2: 5, 3: 15, 4: 32, 5: 40 }
    }
  },
  {
    title: "Docker and DevOps Essentials",
    description: "Learn containerization with Docker and essential DevOps practices. Master CI/CD pipelines and deployment strategies.",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800",
    categories: ["devops", "docker", "deployment", "containers"],
    isFeatured: false,
    isActive: true,
    ratingStats: {
      averageRating: 4.2,
      totalRatings: 87,
      ratingDistribution: { 1: 3, 2: 7, 3: 12, 4: 28, 5: 37 }
    }
  },
  {
    title: "Mobile App Development with Flutter",
    description: "Build cross-platform mobile apps with Flutter and Dart. Learn widgets, state management, and app deployment.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    categories: ["mobile development", "flutter", "dart", "cross-platform"],
    isFeatured: false,
    isActive: true,
    ratingStats: {
      averageRating: 4.1,
      totalRatings: 76,
      ratingDistribution: { 1: 2, 2: 8, 3: 14, 4: 26, 5: 26 }
    }
  },
  {
    title: "Cybersecurity Fundamentals",
    description: "Learn essential cybersecurity concepts, threat analysis, and security best practices for modern applications.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
    categories: ["cybersecurity", "security", "networking", "ethical hacking"],
    isFeatured: false,
    isActive: true,
    ratingStats: {
      averageRating: 4.0,
      totalRatings: 65,
      ratingDistribution: { 1: 3, 2: 6, 3: 12, 4: 20, 5: 24 }
    }
  },
  {
    title: "UI/UX Design Principles",
    description: "Master user interface and user experience design. Learn design thinking, prototyping, and user research methods.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    categories: ["design", "ui", "ux", "prototyping"],
    isFeatured: false,
    isActive: true,
    ratingStats: {
      averageRating: 4.6,
      totalRatings: 134,
      ratingDistribution: { 1: 2, 2: 6, 3: 16, 4: 38, 5: 72 }
    }
  },
  {
    title: "Blockchain Development",
    description: "Understand blockchain technology and build decentralized applications. Learn Solidity, smart contracts, and Web3.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    categories: ["blockchain", "solidity", "web3", "cryptocurrency"],
    isFeatured: false,
    isActive: true,
    ratingStats: {
      averageRating: 3.9,
      totalRatings: 52,
      ratingDistribution: { 1: 2, 2: 5, 3: 12, 4: 18, 5: 15 }
    }
  }
];

// Course topics and lessons data
const courseContent = {
  "JavaScript Fundamentals": {
    topics: [
      {
        title: "Getting Started",
        description: "Introduction to JavaScript and setting up your development environment",
        order: 0,
        lessons: [
          {
            title: "What is JavaScript?",
            description: "Learn about JavaScript, its history, and its role in web development",
            order: 0,
            contentGroups: [
              {
                title: "Introduction",
                description: "Basic overview of JavaScript",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "JavaScript is a high-level, interpreted programming language that is widely used for web development. It was created by Brendan Eich in 1995 and has since become one of the most popular programming languages in the world.",
                    order: 0
                  },
                  {
                    type: "text",
                    content: "JavaScript is primarily used for adding interactivity to web pages, but it can also be used for server-side development (Node.js), mobile app development, and even desktop applications.",
                    order: 1
                  }
                ]
              }
            ],
            quiz: [
              {
                question: "Who created JavaScript?",
                options: ["Brendan Eich", "Bill Gates", "Steve Jobs", "Tim Berners-Lee"],
                correctAnswer: 0,
                explanation: "JavaScript was created by Brendan Eich in 1995 while he was working at Netscape."
              }
            ]
          },
          {
            title: "Setting Up Development Environment",
            description: "Install and configure tools needed for JavaScript development",
            order: 1,
            contentGroups: [
              {
                title: "Required Tools",
                description: "Essential tools for JavaScript development",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "To start developing with JavaScript, you'll need a few essential tools: a code editor, a web browser, and Node.js for running JavaScript outside the browser.",
                    order: 0
                  },
                  {
                    type: "text",
                    content: "Popular code editors include Visual Studio Code, Atom, and Sublime Text. For browsers, Chrome and Firefox have excellent developer tools.",
                    order: 1
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Variables and Data Types",
        description: "Learn about JavaScript variables, data types, and how to work with them",
        order: 1,
        lessons: [
          {
            title: "Understanding Variables",
            description: "Learn how to declare and use variables in JavaScript",
            order: 0,
            contentGroups: [
              {
                title: "Variable Declaration",
                description: "Different ways to declare variables",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "In JavaScript, you can declare variables using var, let, or const keywords. Each has different scoping rules and behaviors.",
                    order: 0
                  },
                  {
                    type: "code",
                    content: "// Variable declarations\nvar name = 'John';\nlet age = 25;\nconst PI = 3.14159;",
                    order: 1
                  }
                ]
              }
            ],
            quiz: [
              {
                question: "Which keyword should you use for variables that won't change?",
                options: ["var", "let", "const", "static"],
                correctAnswer: 2,
                explanation: "The 'const' keyword is used for variables that won't be reassigned after declaration."
              }
            ]
          },
          {
            title: "Data Types in JavaScript",
            description: "Explore different data types available in JavaScript",
            order: 1,
            contentGroups: [
              {
                title: "Primitive Types",
                description: "Basic data types in JavaScript",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "JavaScript has several primitive data types: string, number, boolean, undefined, null, symbol, and bigint.",
                    order: 0
                  },
                  {
                    type: "code",
                    content: "// Data type examples\nlet text = 'Hello World'; // string\nlet count = 42; // number\nlet isActive = true; // boolean\nlet data = undefined; // undefined\nlet empty = null; // null",
                    order: 1
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Functions and Control Flow",
        description: "Master functions, conditionals, and loops in JavaScript",
        order: 2,
        lessons: [
          {
            title: "Creating Functions",
            description: "Learn different ways to create and use functions",
            order: 0,
            contentGroups: [
              {
                title: "Function Basics",
                description: "Introduction to functions",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "Functions are reusable blocks of code that perform specific tasks. They can accept parameters and return values.",
                    order: 0
                  },
                  {
                    type: "code",
                    content: "// Function declaration\nfunction greet(name) {\n  return 'Hello, ' + name + '!';\n}\n\n// Function expression\nconst add = function(a, b) {\n  return a + b;\n};\n\n// Arrow function\nconst multiply = (a, b) => a * b;",
                    order: 1
                  }
                ]
              }
            ],
            quiz: [
              {
                question: "What is the modern way to write a simple function in JavaScript?",
                options: ["function declaration", "function expression", "arrow function", "all of the above"],
                correctAnswer: 3,
                explanation: "All three methods are valid ways to create functions in JavaScript, each with their own use cases."
              }
            ]
          }
        ]
      }
    ]
  },
  "Python for Data Science": {
    topics: [
      {
        title: "Python Basics",
        description: "Learn Python fundamentals and syntax",
        order: 0,
        lessons: [
          {
            title: "Python Syntax and Variables",
            description: "Understanding Python's clean and readable syntax",
            order: 0,
            contentGroups: [
              {
                title: "Python Syntax",
                description: "Learn Python's syntax rules",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "Python is known for its clean, readable syntax. It uses indentation to define code blocks instead of curly braces.",
                    order: 0
                  },
                  {
                    type: "code",
                    content: "# Python variable assignment\nname = 'Alice'\nage = 30\nheight = 5.6\nis_student = True\n\n# Print variables\nprint(f'{name} is {age} years old')",
                    order: 1
                  }
                ]
              }
            ]
          },
          {
            title: "Control Structures",
            description: "Learn about loops and conditional statements in Python",
            order: 1,
            contentGroups: [
              {
                title: "Loops and Conditions",
                description: "Control flow in Python",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "Python provides several ways to control the flow of your program including if statements, for loops, and while loops.",
                    order: 0
                  },
                  {
                    type: "code",
                    content: "# If statement\nage = 18\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')\n\n# For loop\nfor i in range(5):\n    print(f'Number: {i}')",
                    order: 1
                  }
                ]
              }
            ],
            quiz: [
              {
                question: "Which operator is used for equality comparison in Python?",
                options: ["=", "==", "===", "eq"],
                correctAnswer: 1,
                explanation: "The == operator is used for equality comparison in Python."
              }
            ]
          }
        ]
      },
      {
        title: "Data Analysis with Pandas",
        description: "Master data manipulation and analysis using Pandas",
        order: 1,
        lessons: [
          {
            title: "Introduction to Pandas",
            description: "Learn the basics of Pandas library for data analysis",
            order: 0,
            contentGroups: [
              {
                title: "Pandas Basics",
                description: "Getting started with Pandas",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "Pandas is a powerful Python library for data manipulation and analysis. It provides data structures like DataFrame and Series.",
                    order: 0
                  },
                  {
                    type: "code",
                    content: "import pandas as pd\n\n# Create a DataFrame\ndata = {'Name': ['Alice', 'Bob', 'Charlie'],\n        'Age': [25, 30, 35],\n        'City': ['New York', 'London', 'Tokyo']}\n\ndf = pd.DataFrame(data)\nprint(df)",
                    order: 1
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Data Visualization",
        description: "Create stunning visualizations with Matplotlib and Seaborn",
        order: 2,
        lessons: [
          {
            title: "Matplotlib Basics",
            description: "Learn the fundamentals of plotting with Matplotlib",
            order: 0,
            contentGroups: [
              {
                title: "Creating Plots",
                description: "Basic plotting techniques",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "Matplotlib is the most popular plotting library in Python. It provides a MATLAB-like interface for creating static, animated, and interactive visualizations.",
                    order: 0
                  },
                  {
                    type: "code",
                    content: "import matplotlib.pyplot as plt\nimport numpy as np\n\n# Create sample data\nx = np.linspace(0, 10, 100)\ny = np.sin(x)\n\n# Create plot\nplt.figure(figsize=(10, 6))\nplt.plot(x, y)\nplt.title('Sine Wave')\nplt.xlabel('X values')\nplt.ylabel('Y values')\nplt.show()",
                    order: 1
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "React.js Complete Guide": {
    topics: [
      {
        title: "React Fundamentals",
        description: "Learn the core concepts of React",
        order: 0,
        lessons: [
          {
            title: "Components and JSX",
            description: "Understanding React components and JSX syntax",
            order: 0,
            contentGroups: [
              {
                title: "React Components",
                description: "Introduction to React components",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "React is built around components. A component is a reusable piece of UI that can have its own state and properties.",
                    order: 0
                  },
                  {
                    type: "code",
                    content: "import React from 'react';\n\n// Functional component\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\n// Usage\nfunction App() {\n  return (\n    <div>\n      <Welcome name='Alice' />\n      <Welcome name='Bob' />\n    </div>\n  );\n}",
                    order: 1
                  }
                ]
              }
            ],
            quiz: [
              {
                question: "What is JSX?",
                options: ["JavaScript XML", "Java Syntax Extension", "Just Simple XML", "JavaScript Extension"],
                correctAnswer: 0,
                explanation: "JSX stands for JavaScript XML and allows you to write HTML-like syntax in JavaScript."
              }
            ]
          }
        ]
      },
      {
        title: "State and Props",
        description: "Master state management and component communication",
        order: 1,
        lessons: [
          {
            title: "Understanding State",
            description: "Learn how to manage component state in React",
            order: 0,
            contentGroups: [
              {
                title: "useState Hook",
                description: "Managing state with hooks",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "The useState hook allows you to add state to functional components. It returns an array with the current state value and a function to update it.",
                    order: 0
                  },
                  {
                    type: "code",
                    content: "import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}",
                    order: 1
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "CSS Grid and Flexbox Mastery": {
    topics: [
      {
        title: "Flexbox Fundamentals",
        description: "Master one-dimensional layouts with Flexbox",
        order: 0,
        lessons: [
          {
            title: "Flex Container Properties",
            description: "Learn how to control flex containers",
            order: 0,
            contentGroups: [
              {
                title: "Display Flex",
                description: "Getting started with Flexbox",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "Flexbox is a one-dimensional layout system that can handle either rows or columns at a time. It's perfect for distributing space and aligning items.",
                    order: 0
                  },
                  {
                    type: "code",
                    content: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n\n.item {\n  flex: 1;\n  padding: 20px;\n  margin: 10px;\n  background: #f0f0f0;\n}",
                    order: 1
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "CSS Grid Layout",
        description: "Create complex two-dimensional layouts",
        order: 1,
        lessons: [
          {
            title: "Grid Container Setup",
            description: "Learn to create and configure grid containers",
            order: 0,
            contentGroups: [
              {
                title: "Grid Basics",
                description: "Understanding CSS Grid",
                order: 0,
                contents: [
                  {
                    type: "text",
                    content: "CSS Grid is a two-dimensional layout system that allows you to create complex layouts with rows and columns simultaneously.",
                    order: 0
                  },
                  {
                    type: "code",
                    content: ".grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: auto;\n  gap: 20px;\n  padding: 20px;\n}\n\n.grid-item {\n  background: #e0e0e0;\n  padding: 20px;\n  border-radius: 5px;\n}",
                    order: 1
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Clear existing data
async function clearDatabase() {
  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Course.deleteMany({});
  await Topic.deleteMany({});
  await Lesson.deleteMany({});
  await Enrollment.deleteMany({});
  await Review.deleteMany({});
  console.log('Database cleared');
}

// Create users
async function createUsers() {
  console.log('Creating users...');
  const users = [];
  
  for (const userData of sampleUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      ...userData,
      password: hashedPassword,
    });
    await user.save();
    users.push(user);
  }
  
  console.log(`Created ${users.length} users`);
  return users;
}

// Create courses
async function createCourses() {
  console.log('Creating courses...');
  const courses = [];
  
  for (const courseData of sampleCourses) {
    const course = new Course(courseData);
    await course.save();
    courses.push(course);
  }
  
  console.log(`Created ${courses.length} courses`);
  return courses;
}

// Create topics and lessons
async function createContent(courses) {
  console.log('Creating topics and lessons...');
  
  let topicCount = 0;
  let lessonCount = 0;
  
  for (const course of courses) {
    const contentData = courseContent[course.title];
    if (!contentData) continue;
    
    for (const topicData of contentData.topics) {
      const topic = new Topic({
        ...topicData,
        course: course._id,
      });
      await topic.save();
      topicCount++;
      
      for (const lessonData of topicData.lessons) {
        const lesson = new Lesson({
          ...lessonData,
          topic: topic._id,
        });
        await lesson.save();
        lessonCount++;
      }
    }
  }
  
  console.log(`Created ${topicCount} topics and ${lessonCount} lessons`);
}

// Create sample enrollments
async function createEnrollments(users, courses) {
  console.log('Creating sample enrollments...');
  
  const regularUsers = users.filter(user => user.role !== 'admin');
  const enrollments = [];
  
  // Create random enrollments
  for (const user of regularUsers) {
    const numEnrollments = Math.floor(Math.random() * 4) + 1; // 1-4 enrollments per user
    const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numEnrollments && i < shuffledCourses.length; i++) {
      const course = shuffledCourses[i];
      
      // Get topics for this course
      const topics = await Topic.find({ course: course._id, isActive: true }).sort({ order: 1 });
      const topicsProgress = [];
      
      for (const topic of topics) {
        const lessons = await Lesson.find({ topic: topic._id, isActive: true }).sort({ order: 1 });
        const lessonsProgress = [];
        
        for (const lesson of lessons) {
          const isCompleted = Math.random() > 0.4; // 60% chance of completion
          const timeSpent = isCompleted ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 15);
          const quizScore = isCompleted && lesson.quiz.length > 0 ? Math.floor(Math.random() * 31) + 70 : null;
          
          lessonsProgress.push({
            lesson: lesson._id,
            isCompleted,
            completedAt: isCompleted ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
            timeSpent,
            quizScore,
          });
        }
        
        const completedLessons = lessonsProgress.filter(lp => lp.isCompleted).length;
        const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;
        
        topicsProgress.push({
          topic: topic._id,
          isCompleted: progressPercentage === 100,
          completedAt: progressPercentage === 100 ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000) : null,
          lessonsProgress,
          progressPercentage,
        });
      }
      
      const overallProgress = topicsProgress.length > 0 
        ? Math.round(topicsProgress.reduce((sum, tp) => sum + tp.progressPercentage, 0) / topicsProgress.length)
        : 0;
      
      const enrollment = new Enrollment({
        user: user._id,
        course: course._id,
        enrolledAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        startedAt: overallProgress > 0 ? new Date(Date.now() - Math.random() * 50 * 24 * 60 * 60 * 1000) : null,
        completedAt: overallProgress === 100 ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : null,
        isCompleted: overallProgress === 100,
        progressPercentage: overallProgress,
        topicsProgress,
        status: overallProgress === 0 ? 'enrolled' : overallProgress === 100 ? 'completed' : 'in_progress',
      });
      
      await enrollment.save();
      enrollments.push(enrollment);
    }
  }
  
  console.log(`Created ${enrollments.length} enrollments`);
  return enrollments;
}

// Create sample reviews
async function createReviews(users, courses) {
  console.log('Creating sample reviews...');
  
  const regularUsers = users.filter(user => user.role !== 'admin');
  const reviews = [];
  
  const sampleReviewTitles = [
    "Excellent course!",
    "Very informative",
    "Great for beginners",
    "Well structured content",
    "Highly recommended",
    "Good but could be better",
    "Amazing instructor",
    "Perfect pace",
    "Comprehensive coverage",
    "Easy to follow"
  ];
  
  const sampleReviewContents = [
    "This course exceeded my expectations. The content is well-organized and the examples are practical.",
    "I learned a lot from this course. The instructor explains concepts clearly and provides good examples.",
    "Great course for beginners. I had no prior experience and was able to follow along easily.",
    "The course structure is logical and builds upon previous concepts nicely.",
    "I would definitely recommend this course to anyone wanting to learn this topic.",
    "Good content overall, but some sections could use more detailed explanations.",
    "The instructor is knowledgeable and presents the material in an engaging way.",
    "The pace is just right - not too fast, not too slow. Perfect for learning.",
    "Comprehensive coverage of the topic with practical examples and exercises.",
    "Easy to follow along and understand. Great for self-paced learning."
  ];
  
  // Create reviews for random course-user combinations
  for (const course of courses) {
    const numReviews = Math.floor(Math.random() * 8) + 3; // 3-10 reviews per course
    const shuffledUsers = [...regularUsers].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numReviews && i < shuffledUsers.length; i++) {
      const user = shuffledUsers[i];
      
      // Check if user is enrolled in this course
      const enrollment = await Enrollment.findOne({ user: user._id, course: course._id });
      if (!enrollment || enrollment.progressPercentage < 20) continue; // Only users with some progress can review
      
      const rating = Math.floor(Math.random() * 5) + 1; // 1-5 stars
      const titleIndex = Math.floor(Math.random() * sampleReviewTitles.length);
      const contentIndex = Math.floor(Math.random() * sampleReviewContents.length);
      
      const review = new Review({
        user: user._id,
        course: course._id,
        rating,
        title: sampleReviewTitles[titleIndex],
        content: sampleReviewContents[contentIndex],
        isVerified: Math.random() > 0.3, // 70% verified reviews
        isActive: true,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
      
      await review.save();
      reviews.push(review);
    }
  }
  
  console.log(`Created ${reviews.length} reviews`);
  return reviews;
}

// Update course rating stats based on reviews
async function updateCourseRatings() {
  console.log('Updating course rating statistics...');
  
  const courses = await Course.find({});
  
  for (const course of courses) {
    const reviews = await Review.find({ course: course._id, isActive: true });
    
    if (reviews.length > 0) {
      const totalRatings = reviews.length;
      const totalScore = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = Number((totalScore / totalRatings).toFixed(1));
      
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(review => {
        ratingDistribution[review.rating]++;
      });
      
      await Course.findByIdAndUpdate(course._id, {
        'ratingStats.averageRating': averageRating,
        'ratingStats.totalRatings': totalRatings,
        'ratingStats.ratingDistribution': ratingDistribution,
      });
    }
  }
  
  console.log('Course ratings updated');
}

// Main seeding function
async function seedDatabase() {
  try {
    await connectDB();
    await clearDatabase();
    
    const users = await createUsers();
    const courses = await createCourses();
    await createContent(courses);
    await createEnrollments(users, courses);
    await createReviews(users, courses);
    await updateCourseRatings();
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nTest accounts created:');
    console.log('Admin: admin@intellecta.com / admin123');
    console.log('User: john@example.com / user123');
    console.log('User: jane@example.com / user123');
    console.log('User: bob@example.com / user123');
    console.log('User: alice@example.com / user123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
