// Define the status codes as an enum for better type safety
enum STATUS_CODES {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

// Define a type for the response message structure
interface ResponseMessage {
    statusCode: STATUS_CODES;
    message: string;
}

// Create a response message factory function
const createResponseMessage = (statusCode: STATUS_CODES, message: string): ResponseMessage => ({
    statusCode,
    message,
});

// Define the valid categories for response messages
type ResponseCategoryKeys = 'CHANGE_PASSWORD' | 'SIGNUP' | 'LOGIN' | 'GENERAL' | 'SURVIVORS';

// Define a type for response messages with a specific structure
type ResponseCategory = {
    [key: string]: ResponseMessage; // This allows multiple response messages per category
};

// Define the response messages object with type safety
const RESPONSE_MESSAGES: Record<ResponseCategoryKeys, ResponseCategory> = {
    CHANGE_PASSWORD: {
        OK: createResponseMessage(STATUS_CODES.OK, "OK - User password updated successfully"),
        UNAUTHORIZED: createResponseMessage(STATUS_CODES.UNAUTHORIZED, "Unauthorized - Old password invalid"),
        NOT_FOUND_EMAIL: createResponseMessage(STATUS_CODES.NOT_FOUND, "Not Found - Email is not tied to a registered user"),
        BAD_REQUEST_NO_EMAIL: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - No email provided"),
        BAD_REQUEST_NO_OLD_PASSWORD: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - No old password provided"),
        BAD_REQUEST_NO_NEW_PASSWORD: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - No new password provided"),
        BAD_REQUEST_WEAK_PASSWORD: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - New password is not strong enough"),
        BAD_REQUEST_INVALID_EMAIL: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - Email is invalid"),
        INTERNAL_SERVER_ERROR: createResponseMessage(STATUS_CODES.INTERNAL_SERVER_ERROR, "Internal Server Error - Failed to update password"),
    },
    SIGNUP: {
        CREATED: createResponseMessage(STATUS_CODES.CREATED, "Created - User created successfully"),
        BAD_REQUEST_NO_EMAIL: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - No email provided"),
        BAD_REQUEST_NO_USERNAME: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - No username provided"),
        BAD_REQUEST_NO_PASSWORD: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - No password provided"),
        BAD_REQUEST_UNAVAILABLE_USERNAME: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - Username is unavailable"),
        BAD_REQUEST_UNAVAILABLE_EMAIL: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - Email is unavailable"),
        BAD_REQUEST_WEAK_PASSWORD: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - User password is not strong enough"),
        BAD_REQUEST_INVALID_EMAIL: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - Email is invalid"),
        INTERNAL_SERVER_ERROR: createResponseMessage(STATUS_CODES.INTERNAL_SERVER_ERROR, "Internal Server Error - Failed to sign up and create user"),
    },
    LOGIN: {
        OK: createResponseMessage(STATUS_CODES.OK, "OK - User authenticated successfully"),
        UNAUTHORIZED: createResponseMessage(STATUS_CODES.UNAUTHORIZED, "Unauthorized - Password invalid"),
        NOT_FOUND_EMAIL: createResponseMessage(STATUS_CODES.NOT_FOUND, "Not Found - Email is not tied to a registered user"),
        BAD_REQUEST_NO_EMAIL: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - No email provided"),
        BAD_REQUEST_NO_PASSWORD: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - No password provided"),
        BAD_REQUEST_INVALID_EMAIL: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Bad Request - Email is invalid"),
        INTERNAL_SERVER_ERROR: createResponseMessage(STATUS_CODES.INTERNAL_SERVER_ERROR, "Internal Server Error - Failed to login user"),
    },
    GENERAL: {
        INTERNAL_SERVER_ERROR: createResponseMessage(STATUS_CODES.INTERNAL_SERVER_ERROR, "Internal Server Error"),
    },
    SURVIVORS: {
        OK: createResponseMessage(STATUS_CODES.OK, "Found survivors for provided season"),
        NOT_FOUND_SEASON: createResponseMessage(STATUS_CODES.NOT_FOUND, "Season does not exist"),
        BAD_REQUEST_INVALID_SEASON_ID: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Invalid season ID"),
        BAD_REQUEST_MISSING_SEASON_ID: createResponseMessage(STATUS_CODES.BAD_REQUEST, "Missing season ID"),
        INTERNAL_SERVER_ERROR: createResponseMessage(STATUS_CODES.INTERNAL_SERVER_ERROR, "Failed to fetch survivors by season"),
    }
};

// Export the constants
export {
    STATUS_CODES,
    RESPONSE_MESSAGES,
};