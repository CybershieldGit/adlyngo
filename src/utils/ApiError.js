/**
 * Custom operational error class.
 * Extends native Error with HTTP status codes and operational flag.
 *
 * Usage:
 *   throw new ApiError(404, "Resource not found");
 *   throw new ApiError(400, "Validation failed", errors);
 */
class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    // Distinguish operational errors from programming bugs
    this.isOperational = true;

    // Capture stack trace, excluding constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
