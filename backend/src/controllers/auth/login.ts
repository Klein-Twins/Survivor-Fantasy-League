import dotenv from 'dotenv';
import { Request, RequestHandler, Response, NextFunction } from 'express';
import { loginService } from '../../services/auth/login';
import { validateRequiredRequestFields } from './utils/validateRequest';
import errorHandler from '../../middleware/errorHandler';
import { RESPONSE_MESSAGES } from '../../routes/ResponseMessageConstants';

// Load environment variables from .env file
dotenv.config();

// Define the login function
const login : RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const requiredFields = ['email', 'password'];

  // Validate required fields
  if (!validateRequiredRequestFields(req, res, requiredFields, RESPONSE_MESSAGES.LOGIN)) {
    return;
  }

  const { password } = req.body;
  const email = req.body.email.toLowerCase();

  try {
    const { statusCode, message, user, token } = await loginService(email, password);
    res.set('Authorization', `Bearer ${token}`);
    res.status(statusCode).json({ message, user });
    return;
  } catch (error) {
    errorHandler(error, req, res, next);
    return
  }
};

// Export the login function
export default login;