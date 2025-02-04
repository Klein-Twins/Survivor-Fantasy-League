import { Request, Response, NextFunction } from 'express';
import { ApiResponseError } from '../generated-api';
import { CustomError } from '../utils/errors/errors';

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
  if (err instanceof CustomError) {
    const response: ApiResponseError = {
      success: false,
      message: err.message,
      statusCode: err.statusCode,
      error: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  const response: ApiResponseError = {
    success: false,
    message: 'Something went wrong',
    statusCode: 500,
    error: 'Internal server error',
  };
  res.status(500).json(response);
  return;
};

export default errorHandler;
