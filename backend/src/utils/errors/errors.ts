const getErrorMessage = (defaultError: string, error?: string | boolean | object | null): string => {
    if (typeof error === "boolean") {
        return error.toString(); // Convert boolean to string ("true" or "false")
    }

    if (typeof error === "object") {
        try {
            return JSON.stringify(error); // Convert object to a string (JSON format)
        } catch (e) {
            return "[Object object]"; // Fallback in case JSON.stringify fails
        }
    }

    return error && error !== null && error.toString().trim() !== "" ? error : defaultError;
}


class CustomError extends Error {
    statusCode: number;

    constructor(statusCode: number, error: any | null | undefined = undefined) {
        super(getErrorMessage("An unknown error occurred", error));
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends CustomError {
    constructor(error: any | null | undefined = undefined) {
        super(404, getErrorMessage("The requested resource was not found", error));
        this.name = "Not Found";
    }
}

export class ValidationError extends CustomError {
    constructor(error: any | null | undefined = undefined) {
        super(400, getErrorMessage("Bad Request", error));
        this.name = "Bad Request";
    }
}

export class ConflictError extends CustomError {
    constructor(error: any | null | undefined = undefined) {
        super(409, getErrorMessage("Conflict", error));
        this.name = "Conflict";
    }
}

export class InternalServerError extends CustomError {
    constructor(error: any | null | undefined = undefined) {
        super(500, getErrorMessage("An internal server error occurred", error));
        this.name = "Internal Server sError"
    }
}

export class UnauthorizedError extends CustomError {
    constructor(error: any | null | undefined = undefined) {
        super(401, getErrorMessage("Unauthorized access", error));
        this.name = "Unauthorized"
    }
}

export class ForbiddenError extends CustomError {
    constructor(error: string | null | undefined = undefined) {
        super(403, getErrorMessage("Access forbidden", error));
        this.name = "Forbidden"
    }
}

export default CustomError;