import { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from '../config/config';
import logger from '../config/logger';

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
  logger.error(err);

  // Determine if stack trace should be included in the response
  const showStack = NODE_ENV !== 'production' && err.statusCode === 500;

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500,
    stack: showStack ? err.stack : undefined,
  });
};

export default errorHandler;