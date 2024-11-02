const LOGIN_RESPONSE_MESSAGES = {
    OK: "OK - User authenticated successfully",
    UNAUTHORIZED: "Unauthorized - password invalid",
    NOT_FOUND: "Not Found - Email is not tied to a registered user",
    BAD_REQUEST: {
        NO_EMAIL: "Bad Request - No email provided",
        NO_PASSWORD: "Bad Request - No password provided",
        INVALID_EMAIL: "Bad Request - Email is invalid",
    },
    INTERNAL_SERVER_ERROR: "Internal Server Error - Failed to login user",
}

const SIGNUP_RESPONSE_MESSAGES = {
    CREATED: "Created - User created successfully",
    BAD_REQUEST: {
        NO_EMAIL: "Bad Request - No email provided",
        NO_USERNAME: "Bad Request - No username provided",
        NO_PASSWORD: "Bad Request - No password provided",
        UNAVAILABLE_USERNAME: "Bad Request - Username is unavailable",
        UNAVAILABLE_EMAIL: "Bad Request - Email is unavailable",
        WEAK_PASSWORD: "Bad Request - User password is not strong enough",
        INVALID_EMAIL: "Bad Request - Email is invalid",
    },
    INTERNAL_SERVER_ERROR: "Internal Server Error - Failed to sign up and create user",
}

const CHANGE_PASSWORD_RESPONSE_MESSAGES = {
    OK: "OK - User password updated successfully",
    UNAUTHORIZED: "Unauthorized - Old password invalid",
    NOT_FOUND: "Not Found - Email is not tied to a registered user",
    BAD_REQUEST: {
        NO_EMAIL: "Bad Request - No email provided",
        NO_OLD_PASSWORD: "Bad Request - No old password provided",
        NO_NEW_PASSWORD: "Bad Request - No new password provided",
        WEAK_PASSWORD: "Bad Request - New password is not strong enough",
        INVALID_EMAIL: "Bad Request - Email is invalid",
    },
    INTERNAL_SERVER_ERROR: "Internal Server Error - Failed to update password",
}

module.exports = {
    LOGIN_RESPONSE_MESSAGES,
    SIGNUP_RESPONSE_MESSAGES,
    CHANGE_PASSWORD_RESPONSE_MESSAGES
};

