const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { error } = require("../util/response.util");

// Middleware to verify JWT token and authenticate user
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return error({ res, message: "Access denied. No token provided.", statusCode: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return error({ res, message: "Invalid token. User not found.", statusCode: 401 });
    }

    if (!user.verified) {
      return error({ res, message: "Please verify your email first.", statusCode: 401 });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return error({ res, message: "Invalid token.", statusCode: 401 });
    }
    if (err.name === "TokenExpiredError") {
      return error({ res, message: "Token expired.", statusCode: 401 });
    }
    return error({ res, message: "Authentication failed.", statusCode: 401 });
  }
};

// Middleware to verify admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return error({ res, message: "Access denied. Admin privileges required.", statusCode: 403 });
  }
  next();
};

// Middleware to verify user owns resource or is admin
const requireOwnershipOrAdmin = (userIdParam = "id") => {
  return (req, res, next) => {
    const resourceUserId = req.params[userIdParam];
    const currentUserId = req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    
    if (currentUserId !== resourceUserId && !isAdmin) {
      return error({ res, message: "Access denied. You can only access your own resources.", statusCode: 403 });
    }
    next();
  };
};

module.exports = {
  authenticate,
  requireAdmin,
  requireOwnershipOrAdmin,
};
