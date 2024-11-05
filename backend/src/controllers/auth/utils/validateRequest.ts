import { Request, Response } from 'express';

// Function to validate required fields in the request body
const validateRequiredRequestFields = (
    req: Request,
    res: Response,
    requiredFields: string[],
    errorMessages: { [key: string]: { statusCode?: number; message?: string } }
): boolean => {
    for (const field of requiredFields) {
        if (!req.body[field] || req.body[field].length === 0) {
            res
                .status(errorMessages[`BAD_REQUEST_NO_${field.toUpperCase()}`]?.statusCode || 400)
                .json({ message: errorMessages[`BAD_REQUEST_NO_${field.toUpperCase()}`]?.message || "Bad Request" });
            return false;
        }
    }
    return true;
};

// Function to validate email format
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// Exporting the functions
export { validateRequiredRequestFields, validateEmail };