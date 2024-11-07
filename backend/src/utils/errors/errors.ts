const getErrorMessage = (defaultMessage: string, message?: string | boolean | object | null): string => {
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

    return message && message !== null && message.toString().trim() !== "" ? message : defaultMessage;
}


class CustomError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: any | null | undefined = undefined) {
        super(getErrorMessage("An unknown error occurred", message));
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends CustomError {
    constructor(message: any | null | undefined = undefined) {
        super(404, getErrorMessage("The requested resource was not found", message));
        this.name = "NotFoundError";
    }
}

export class ValidationError extends CustomError {
    constructor(message: any | null | undefined = undefined) {
        super(400, message ?? "Validation failed");
        this.name = "ValidationError";
    }
}

export class InternalServerError extends CustomError {
    constructor(message: any | null | undefined = undefined) {
        super(500, getErrorMessage("An internal server error occurred", message));
        this.name = "InternalServerError"
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: any | null | undefined = undefined) {
        super(401, getErrorMessage("Unauthorized access", message));
        this.name="UnauthorizedError"
    }
}

export class ForbiddenError extends CustomError {
    constructor(message: string | null | undefined = undefined) {
        super(403, getErrorMessage("Access forbidden", message));
        this.name="ForbiddenError"
    }
}

export default CustomError;