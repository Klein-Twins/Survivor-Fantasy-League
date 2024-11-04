const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}
const RESPONSE_MESSAGES = {
    CHANGE_PASSWORD: {
        OK: {statusCode: STATUS_CODES.OK, message: "OK - User password updated successfully"},
        UNAUTHORIZED: {statusCode: STATUS_CODES.UNAUTHORIZED, message: "Unauthorized - Old password invalid"},
        NOT_FOUND_EMAIL: {statusCode: STATUS_CODES.NOT_FOUND, message: "Not Found - Email is not tied to a registered user"},
        BAD_REQUEST_NO_EMAIL: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - No email provided"},
        BAD_REQUEST_NO_OLD_PASSWORD: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - No old password provided"},
        BAD_REQUEST_NO_NEW_PASSWORD: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - No new password provided"},
        BAD_REQUEST_WEAK_PASSWORD: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - New password is not strong enough"},
        BAD_REQUEST_INVALID_EMAIL: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - Email is invalid"},
        INTERNAL_SERVER_ERROR: {statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, message: "Internal Server Error - Failed to update password"},
    },
    SIGNUP: {
        CREATED: {statusCode: STATUS_CODES.CREATED, message: "Created - User created successfully"},
        BAD_REQUEST_NO_EMAIL: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - No email provided"},
        BAD_REQUEST_NO_USERNAME: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - No username provided"},
        BAD_REQUEST_NO_PASSWORD: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - No password provided"},
        BAD_REQUEST_UNAVAILABLE_USERNAME: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - Username is unavailable"},
        BAD_REQUEST_UNAVAILABLE_EMAIL: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - Email is unavailable"},
        BAD_REQUEST_WEAK_PASSWORD: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - User password is not strong enough"},
        BAD_REQUEST_INVALID_EMAIL: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - Email is invalid"},
        INTERNAL_SERVER_ERROR: {statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, message: "Internal Server Error - Failed to sign up and create user"},
    },
    LOGIN: {
        OK: {statusCode: STATUS_CODES.OK, message: "OK - User authenticated successfully"},
        UNAUTHORIZED: {statusCode: STATUS_CODES.UNAUTHORIZED, message: "Unauthorized - password invalid"},
        NOT_FOUND_EMAIL: {statusCode: STATUS_CODES.NOT_FOUND, message: "Not Found - Email is not tied to a registered user"},
        BAD_REQUEST_NO_EMAIL: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - No email provided"},
        BAD_REQUEST_NO_PASSWORD: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - No password provided"},
        BAD_REQUEST_INVALID_EMAIL: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Bad Request - Email is invalid"},
        INTERNAL_SERVER_ERROR: {statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, message: "Internal Server Error - Failed to login user"}, 
    },
    GENERAL: {
        INTERNAL_SERVER_ERROR: {statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, message: "Internal Server Error"},
    },

    SURVIVORS: {
        GETSURVIVORS : {
            OK: {statusCode: STATUS_CODES.OK, message: "Found survivors for provided season "},
            NOT_FOUND_SEASON: {statusCode: STATUS_CODES.NOT_FOUND, message: "Season does not exist"},
            BAD_REQUEST_INVALID_SEASON_ID: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Invalid season ID"},
            BAD_REQUEST_MISSING_SEASON_ID: {statusCode: STATUS_CODES.BAD_REQUEST, message: "Missing season ID"},
            INTERNAL_SERVER_ERROR: {statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, message: "Failed to fetch survivors by season"},
        }
    }
};

module.exports = {
    STATUS_CODES,
    RESPONSE_MESSAGES
}