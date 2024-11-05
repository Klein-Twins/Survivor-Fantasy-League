import dotenv from 'dotenv';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import signupService from '../../services/auth/signup';
import { validateRequiredRequestFields } from './utils/validateRequest';
import errorHandler from '../../middleware/errorHandler';
import { RESPONSE_MESSAGES } from '../../routes/ResponseMessageConstants';

dotenv.config();

const signup: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requiredFields = ["email", "username", "password"];
    if (!validateRequiredRequestFields(req, res, requiredFields, RESPONSE_MESSAGES.SIGNUP)) {
        return;
    }

    const { username, password, firstName, lastName } = req.body;
    const email = req.body.email.toLowerCase();

    try {
        const { statusCode, message, user, token } = await signupService({ username, email, password, firstName, lastName });
        res.set('Authorization', `Bearer ${token}`);
        res.status(statusCode).json({ message, user });
    } catch (error) {
        errorHandler(error as Error, req, res, next); // Pass next to errorHandler
    }
};

export default signup;