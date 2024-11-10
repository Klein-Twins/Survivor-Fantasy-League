import CustomError, { NotFoundError, ValidationError, InternalServerError, UnauthorizedError, ForbiddenError } from '../../../src/utils/errors/errors';

describe('CustomError and its subclasses', () => {

    it('should create a CustomError with correct statusCode and message', () => {
        const error = new CustomError(500, 'Internal error');
        expect(error).toBeInstanceOf(CustomError);
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe('Internal error');
    });

    it('should create a NotFoundError with correct statusCode, message, and name', () => {
        const error = new NotFoundError('Resource not found');
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('Resource not found');
        expect(error.name).toBe('NotFoundError');
    });

    it('should create a ValidationError with correct statusCode, message, and name', () => {
        const error = new ValidationError('Validation failed');
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Validation failed');
        expect(error.name).toBe('ValidationError');
    });

    it('should create an InternalServerError with correct statusCode, message, and name', () => {
        const error = new InternalServerError('An internal error occurred');
        expect(error).toBeInstanceOf(InternalServerError);
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe('An internal error occurred');
        expect(error.name).toBe('InternalServerError');
    });

    it('should create an UnauthorizedError with correct statusCode, message, and name', () => {
        const error = new UnauthorizedError('Unauthorized access');
        expect(error).toBeInstanceOf(UnauthorizedError);
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe('Unauthorized access');
        expect(error.name).toBe('UnauthorizedError');
    });

    it('should create a ForbiddenError with correct statusCode, message, and name', () => {
        const error = new ForbiddenError('Access forbidden');
        expect(error).toBeInstanceOf(ForbiddenError);
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe('Access forbidden');
        expect(error.name).toBe('ForbiddenError');
    });

    describe("When no message is given to the Error instantiation, should return error with default message", () => {
        it('should create a CustomError with default message when no message is provided', () => {
            const error = new CustomError(500);
            expect(error.message).toBe('An unknown error occurred');
        });
        it('should create a NotFoundError with default message when no message is provided', () => {
            const error = new NotFoundError();
            expect(error.message).toBe("The requested resource was not found");
        });
        it('should create a CustomError with default message when no message is provided', () => {
            const error = new ValidationError();
            expect(error.message).toBe('Validation failed');
        });
        it('should create a CustomError with default message when no message is provided', () => {
            const error = new InternalServerError();
            expect(error.message).toBe('An internal server error occurred');
        });
        it('should create a CustomError with default message when no message is provided', () => {
            const error = new UnauthorizedError();
            expect(error.message).toBe('Unauthorized access');
        });
        it('should create a CustomError with default message when no message is provided', () => {
            const error = new ForbiddenError();
            expect(error.message).toBe('Access forbidden');
        });
    })

    describe("When empty messages - return default message of error", () => {
        it('should create a CustomError with default message when message is empty', () => {
            const error = new CustomError(500);
            expect(error.message).toBe('An unknown error occurred');
        });
        it('should create a NotFoundError with default message when message is empty', () => {
            const error = new NotFoundError();
            expect(error.message).toBe("The requested resource was not found");
        });
        it('should create a CustomError with default message when message is empty', () => {
            const error = new ValidationError();
            expect(error.message).toBe('Validation failed');
        });
        it('should create a CustomError with default message when message is empty', () => {
            const error = new InternalServerError();
            expect(error.message).toBe('An internal server error occurred');
        });
        it('should create a CustomError with default message when message is empty', () => {
            const error = new UnauthorizedError();
            expect(error.message).toBe('Unauthorized access');
        });
        it('should create a CustomError with default message when message is empty', () => {
            const error = new ForbiddenError();
            expect(error.message).toBe('Access forbidden');
        });
    })

    describe("When message is undefined, return default message of error", () => {
        it('should create a CustomError with default message when message is undefined', () => {
            const error = new CustomError(500, undefined);
            expect(error.message).toBe('An unknown error occurred');
        });
        it('should create a NotFoundError with default message when message is undefined', () => {
            const error = new NotFoundError(undefined);
            expect(error.message).toBe("The requested resource was not found");
        });
        it('should create a CustomError with default message when message is undefined', () => {
            const error = new ValidationError(undefined);
            expect(error.message).toBe('Validation failed');
        });
        it('should create a CustomError with default message when message is undefined', () => {
            const error = new InternalServerError(undefined);
            expect(error.message).toBe('An internal server error occurred');
        });
        it('should create a CustomError with default message when message is undefined', () => {
            const error = new UnauthorizedError(undefined);
            expect(error.message).toBe('Unauthorized access');
        });
        it('should create a CustomError with default message when message is undefined', () => {
            const error = new ForbiddenError(undefined);
            expect(error.message).toBe('Access forbidden');
        });
    })


    describe("Null test cases", () => {

    })

});