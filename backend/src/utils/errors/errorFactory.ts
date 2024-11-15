import { APIResponseError } from "../../types/api/apiResponseTypes";
import CustomError, { ValidationError, NotFoundError, InternalServerError, UnauthorizedError, ForbiddenError, ConflictError } from './errors';

const getErrorMessage = (defaultMessage: string, message?: string | boolean | object): string => {
    if (typeof message === "boolean") {
        return message.toString(); // Convert boolean to string ("true" or "false")
    }

    if (typeof message === "object") {
        try {
            return JSON.stringify(message); // Convert object to a string (JSON format)
        } catch (e) {
            return "[Object object]"; // Fallback in case JSON.stringify fails
        }
    }

    return message && message.toString().trim() !== "" ? message : defaultMessage;
}


const errorFactory = (error: APIResponseError): CustomError => {

    switch (error.statusCode) {
        case 400:
            return new ValidationError(getErrorMessage("Validation failed", error.error));
        case 404:
            return new NotFoundError(getErrorMessage("The requested resource was not found", error.error));
        case 500:
            return new InternalServerError(getErrorMessage("An internal server error occurred", error.error));
        case 401:
            return new UnauthorizedError(getErrorMessage("Unauthorized access", error.error));
        case 403:
            return new ForbiddenError(getErrorMessage("Access forbidden", error.error));
        case 409:
            return new ConflictError(getErrorMessage("Conflict", error.error))
        default:
            return new CustomError(error.statusCode ?? 500, getErrorMessage("An unknown error occurred", error.error));
    }
};

export default errorFactory