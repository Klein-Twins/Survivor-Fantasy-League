class CustomError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string) {
        super(404, message);
        this.name = "NotFoundError";
    }
}

export class ValidationError extends CustomError {
    constructor(message: string) {
        super(400, message);
        this.name = "ValidationError";
    }
}

export class InternalServerError extends CustomError {
    constructor(message: string) {
        super(500, message);
        this.name = "InternalServerError"
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: string) {
        super(401, message);
        this.name="UnauthorizedError"
    }
}

export class ForbiddenError extends CustomError {
    constructor(message: string) {
        super(403, message);
        this.name="ForbiddenError"
    }
}

export default CustomError;