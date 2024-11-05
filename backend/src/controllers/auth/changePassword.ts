import { NextFunction, Request, RequestHandler, Response } from 'express';
import { changePasswordService } from '../../services/auth/changePassword';
import { validateRequiredRequestFields } from './utils/validateRequest';
import errorHandler from '../../middleware/errorHandler';
import { RESPONSE_MESSAGES } from '../../routes/ResponseMessageConstants';

// Define the changePassword function
const changePassword : RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requiredFields = ['email', 'oldPassword', 'newPassword'];

    // Validate required fields
    if (!validateRequiredRequestFields(req, res, requiredFields, RESPONSE_MESSAGES.CHANGE_PASSWORD)) {
        return;
    }

    const { oldPassword, newPassword } = req.body;
    const email = req.body.email.toLowerCase();

    try {
        const { statusCode, message } = await changePasswordService(email, oldPassword, newPassword);
        res.status(statusCode).json({ message });
        return;
    } catch (error) {
        errorHandler(error, req, res, next);
        return;
    }
};

// Export the changePassword function
export default changePassword;