import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES } from "../routes/ResponseMessageConstants";

export interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  console.log(err);
  const error = err as CustomError;
  const statusCode = error.statusCode || RESPONSE_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR.statusCode;
  const message = error.message || RESPONSE_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR.message;

  res.status(statusCode).json({ message });
};

export default errorHandler;