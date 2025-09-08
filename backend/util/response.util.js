/**
 * Utility functions for sending standardized API responses
 */

const success = ({ res, message = "Success", data = {}, statusCode = 200 }) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const error = ({
  res,
  message = "Something went wrong",
  statusCode = 500,
  errors = null,
}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

const notFound = ({ res, message = "Resource not found" }) => {
  return res.status(404).json({
    success: false,
    message,
  });
};

const unauthorized = ({ res, message = "Unauthorized" }) => {
  return res.status(401).json({
    success: false,
    message,
  });
};

const forbidden = ({ res, message = "Forbidden" }) => {
  return res.status(403).json({
    success: false,
    message,
  });
};

module.exports = {
  success,
  error,
  notFound,
  unauthorized,
  forbidden,
};
