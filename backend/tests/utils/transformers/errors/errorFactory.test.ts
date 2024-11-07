import errorFactory from '../../../../src/utils/errors/errorFactory';
import CustomError, { ValidationError, NotFoundError, InternalServerError, UnauthorizedError, ForbiddenError } from '../../../../src/utils/errors/errors';
import { APIResponseError } from '../../../../src/types/api/apiResponseTypes';

describe('errorFactory', () => {

    describe('Validation Errors', () => {
        it('should return ValidationError for status code 400 and original message', () => {
            const error: APIResponseError = { statusCode: 400, message: 'Email is invalid' };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.statusCode).toBe(400);
            expect(result.message).toBe('Email is invalid');
        });
        it('should return ValidationError for status code 400 with default message when original message is undefined', () => {
            const error: APIResponseError = { statusCode: 400, message: undefined };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.statusCode).toBe(400);
            expect(result.message).toBe('Validation failed');
        });
        it('should return ValidationError for status code 400 with default message when original message is not in object', () => {
            const error: APIResponseError = { statusCode: 400 };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.statusCode).toBe(400);
            expect(result.message).toBe('Validation failed');
        });
        it('should return ValidationError for status code 400 with default message when original message is empty', () => {
            const error: APIResponseError = { statusCode: 400, message: '' };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.statusCode).toBe(400);
            expect(result.message).toBe('Validation failed');
        });
    })

    describe('Not Found Errors', () => {
        it('should return NotFoundError for status code 404 and original message', () => {
            const error: APIResponseError = { statusCode: 404, message: 'No survivors found' };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(NotFoundError);
            expect(result.statusCode).toBe(404);
            expect(result.message).toBe("No survivors found");
        });
        it('should return NotFoundError for status code 404 with default message when original message is undefined', () => {
            const error: APIResponseError = { statusCode: 404, message: undefined };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(NotFoundError);
            expect(result.statusCode).toBe(404);
            expect(result.message).toBe("The requested resource was not found");
        });
        it('should return NotFoundError for status code 404 with default message when original message is not in object', () => {
            const error: APIResponseError = { statusCode: 404 };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(NotFoundError);
            expect(result.statusCode).toBe(404);
            expect(result.message).toBe("The requested resource was not found");
        });
        it('should return NotFoundError for status code 404 with default message when original message is empty', () => {
            const error: APIResponseError = { statusCode: 404, message: '' };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(NotFoundError);
            expect(result.statusCode).toBe(404);
            expect(result.message).toBe('The requested resource was not found');
        });
    })

    describe('Internal Service Errors', () => {
        it('should return InternalServerError for status code 500 and original message', () => {
            const error: APIResponseError = { statusCode: 500, message: 'Who the hell knows what happened in the server...' };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(InternalServerError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe('Who the hell knows what happened in the server...');
        });
        it('should return InternalServerError for status code 500 with default message when original message is undefined', () => {
            const error: APIResponseError = { statusCode: 500, message: undefined };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(InternalServerError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe("An internal server error occurred");
        });
        it('should return InternalServerError for status code 500 with default message when original message is not in object', () => {
            const error: APIResponseError = { statusCode: 500 };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(InternalServerError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe("An internal server error occurred");
        });
        it('should return InternalServerError for status code 500 with default message when original message is empty', () => {
            const error: APIResponseError = { statusCode: 500, message: '' };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(InternalServerError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe('An internal server error occurred');
        });
    })

    describe('Unauthorized Errors', () => {
        it('should return UnauthorizedError for status code 401 and original message', () => {
            const error: APIResponseError = { statusCode: 401, message: 'Nope, I do not provide consent.' };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(UnauthorizedError);
            expect(result.statusCode).toBe(401);
            expect(result.message).toBe('Nope, I do not provide consent.');
        });
        it('should return UnauthorizedError for status code 401 with default message when original message is undefined', () => {
            const error: APIResponseError = { statusCode: 401, message: undefined };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(UnauthorizedError);
            expect(result.statusCode).toBe(401);
            expect(result.message).toBe('Unauthorized access');
        });
        it('should return UnauthorizedError for status code 401 with default message when original message is not in object', () => {
            const error: APIResponseError = { statusCode: 401 };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(UnauthorizedError);
            expect(result.statusCode).toBe(401);
            expect(result.message).toBe('Unauthorized access');
        });
        it('should return UnauthorizedError for status code 401 with default message when original message is empty', () => {
            const error: APIResponseError = { statusCode: 401, message: '' };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(UnauthorizedError);
            expect(result.statusCode).toBe(401);
            expect(result.message).toBe('Unauthorized access');
        });
    })

    describe('Forbidden Errors', () => {
        it('should return ForbiddenError for status code 403 and original message', () => {
            const error: APIResponseError = { statusCode: 403, message: 'Get off my lawn, ya bitch!!' };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(ForbiddenError);
            expect(result.statusCode).toBe(403);
            expect(result.message).toBe('Get off my lawn, ya bitch!!');
        });
        it('should return ForbiddenError for status code 403 with default message when original message is undefined', () => {
            const error: APIResponseError = { statusCode: 403, message: undefined };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(ForbiddenError);
            expect(result.statusCode).toBe(403);
            expect(result.message).toBe('Access forbidden');
        });
        it('should return ForbiddenError for status code 403 with default message when original message is not in object', () => {
            const error: APIResponseError = { statusCode: 403 };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(ForbiddenError);
            expect(result.statusCode).toBe(403);
            expect(result.message).toBe('Access forbidden');
        });
        it('should return ForbiddenError for status code 403 with default message when original message is empty', () => {
            const error: APIResponseError = { statusCode: 403, message: '' };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(ForbiddenError);
            expect(result.statusCode).toBe(403);
            expect(result.message).toBe('Access forbidden');
        });
    })

    describe('Custom Errors with unrecognized status code defined', () => {
        it('should return CustomError for an unrecognized statusCode and original message', () => {
            const error: APIResponseError = { statusCode: 418, message: "I'm a teapot" };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(418);
            expect(result.message).toBe("I'm a teapot");
        });
        it('should return CustomError for status code 403 with default message when original message is undefined', () => {
            const error: APIResponseError = { statusCode: 443, message: undefined };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(443);
            expect(result.message).toBe("An unknown error occurred");
        });
        it('should return CustomError for status code 403 with default message when original message is not in object', () => {
            const error: APIResponseError = { statusCode: 457 };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(457);
            expect(result.message).toBe("An unknown error occurred");
        });
        it('should return CustomError for status code 403 with default message when original message is empty', () => {
            const error: APIResponseError = { statusCode: 507, message: '' };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(507);
            expect(result.message).toBe("An unknown error occurred");
        });
    })

    describe('Custom Errors with code undefined', () => {
        it('should return CustomError with status code = 500 and original message if status code is undefined', () => {
            const error: APIResponseError = { statusCode: undefined, message: "I'm a teapot" };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe("I'm a teapot");
        });
        it('should return CustomError with status code = 500 and default message if status code is undefined and message is missing', () => {
            const error: APIResponseError = { statusCode: undefined};
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe("An unknown error occurred");
        });
        it('should return CustomError with status code = 500 and default message if status code is undefined and message is empty', () => {
            const error: APIResponseError = { statusCode: undefined, message: ''};
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe("An unknown error occurred");
        });
        it('should return CustomError with status code = 500 and default message if status code is undefined and message is undefined', () => {
            const error: APIResponseError = { statusCode: undefined, message: undefined};
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe("An unknown error occurred");
        });

        it('should return CustomError with status code = 500 and original message if status code is missing', () => {
            const error: APIResponseError = { statusCode: undefined, message: "I'm a teapot" };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe("I'm a teapot");
        });
        it('should return CustomError with status code = 500 and default message if status code is missing and message is missing', () => {
            const error: APIResponseError = { };
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe("An unknown error occurred");
        });
        it('should return CustomError with status code = 500 and default message if status code is missing and message is empty', () => {
            const error: APIResponseError = { message: ''};
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe("An unknown error occurred");
        });
        it('should return CustomError with status code = 500 and default message if status code is missing and message is undefined', () => {
            const error: APIResponseError = { message: undefined};
            const result = errorFactory(error);
            
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe("An unknown error occurred");
        });
    })

    describe('Edge Cases...', () => {
        it('should return the correct error message even with special characters', () => {
            const error: APIResponseError = { statusCode: 400, message: 'Validation error: Missing field & incorrect format' };
            const result = errorFactory(error);
    
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.message).toBe('Validation error: Missing field & incorrect format');
        });
        it('should handle boolean message values gracefully', () => {
            const error: APIResponseError = { statusCode: 400, message: true as any };
            const result = errorFactory(error);
        
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.statusCode).toBe(400);
            expect(result.message).toBe('true');
        });
        
        it('should handle boolean message values gracefully (false)', () => {
            const error: APIResponseError = { statusCode: 400, message: false as any };
            const result = errorFactory(error);
        
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.statusCode).toBe(400);
            expect(result.message).toBe('false');
        });

        it('should handle large error messages without issues', () => {
            const longMessage = 'a'.repeat(1000);  // 1000 characters
            const error: APIResponseError = { statusCode: 400, message: longMessage };
            const result = errorFactory(error);
        
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.statusCode).toBe(400);
            expect(result.message).toBe(longMessage);
        });

        it('should handle invalid message types gracefully (e.g., number)', () => {
            const error: APIResponseError = { statusCode: 404, message: 123 as any };
            const result = errorFactory(error);
        
            expect(result).toBeInstanceOf(NotFoundError);
            expect(result.statusCode).toBe(404);
            expect(result.message).toBe('123');
        });
        
        it('should handle invalid message types gracefully (e.g., object)', () => {
            const error: APIResponseError = { statusCode: 404, message: { error: 'Object' } as any };
            const result = errorFactory(error);
        
            expect(result).toBeInstanceOf(NotFoundError);
            expect(result.statusCode).toBe(404);
            expect(result.message).toBe('{"error":"Object"}');
        });
        it('should return CustomError with default values for an empty error object', () => {
            const error: APIResponseError = {} as any;
            const result = errorFactory(error);
        
            expect(result).toBeInstanceOf(CustomError);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe("An unknown error occurred");
        });
    });
});