/**
 * Standardized API response envelope.
 *
 * Every successful response from this API follows the shape:
 *   { success: true, statusCode, message, data }
 *
 * Usage:
 *   res.status(200).json(new ApiResponse(200, data, "Fetched successfully"));
 */
class ApiResponse {
  constructor(statusCode, data = null, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
