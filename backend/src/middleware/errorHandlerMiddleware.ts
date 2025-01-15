import { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from '../config/config';
import logger from '../config/logger';
import { INTERNAL_SERVER_ERROR } from '../constants/auth/responseErrorConstants';
import CustomError from '../utils/errors/errors';

/**
 * Global error handling middleware for Express applications.
 * Logs the error and sends an appropriate JSON response to the client.
 *
 * @param err - The error object caught by middleware or routes.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  logger.error(`Sending response with error: ${err.statusCode || INTERNAL_SERVER_ERROR.statusCode}, ${err.message || INTERNAL_SERVER_ERROR.error}`);

  // Determine if stack trace should be included in the response
  const showStack = NODE_ENV !== 'production' && err.statusCode === 500;
  if (showStack) {
    logger.error(err.stack);
  }

  res.status(err.statusCode || INTERNAL_SERVER_ERROR.statusCode).json({
    statusCode: err.statusCode || INTERNAL_SERVER_ERROR.statusCode,
    error: err.name || "Internal Server Error",
    message: err.message || INTERNAL_SERVER_ERROR.error,
    stack: showStack ? err.stack : undefined,
  });
};

export default errorHandler;