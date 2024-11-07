import { Request, Response, NextFunction } from 'express';

import dotenv from 'dotenv';
dotenv.config();

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.log(err.stack);

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });

};

export default errorHandler;