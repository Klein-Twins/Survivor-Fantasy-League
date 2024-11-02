const { STATUS_CODES, RESPONSE_MESSAGES } = require("../routes/ResponseMessageConstants.js");

/**
 * Central error handling middleware.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const errorHandler = (err, req, res) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || RESPONSE_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR.statusCode;
  const message = err.message || RESPONSE_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR.message;

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;