import { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from '../config/config';

/**
 * Error handling middleware for Express applications.
 * 
 * This middleware catches errors thrown in the application, logs the error stack (for development environments),
 * and formats the error response. The error response includes the error message, status code, and optionally the stack trace.
 * The middleware is designed to provide consistent error responses for the client while handling different environments (e.g., production vs development).
 * 
 * @param {any} err - The error object, which is typically thrown in route handlers or other middleware. It should have `message` and `statusCode` properties, and optionally `stack` for detailed error information.
 * @param {Request} req - The Express request object, which contains information about the HTTP request.
 * @param {Response} res - The Express response object, used to send the error response back to the client.
 * @param {NextFunction} next - The next function, which is not called in this middleware because it terminates the request-response cycle.
 * 
 * @returns {void} - This middleware does not return a value; it ends the request-response cycle by sending an error response to the client.
 * 
 * @example
 * // Example usage in an Express app:
 * app.use(errorHandler);
 * 
 * @throws {500} If the error does not have a defined status code, the middleware defaults to a 500 Internal Server Error.
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  // Log the error stack to the console in development environments for debugging
  console.log(err.stack);

  // Send the error response back to the client
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error', // Error message to be sent in the response
    statusCode: err.statusCode || 500, // HTTP status code, defaults to 500 if not specified
    stack: NODE_ENV === 'production' ? null : err.stack, // Include stack trace only in non-production environments
  });
};

export default errorHandler;