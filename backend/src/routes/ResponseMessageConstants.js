const AUTH_RESPONSE_MESSAGES = {
    USERNAME_TAKEN : "User name is already taken",
    WEAK_PASSWORD : "User password is not strong enough",
    EMAIL_IN_USE : "Email already in use",
    SIGNUP_SUCCESS : "User created successfully",
    SIGNUP_SERVER_ERROR : "Internal Server Error: Could not create user",
    EMAIL_NOT_FOUND : "Email is not tied to a registered user",
    INCORRECT_PASSWORD : "Unauthorized, invalid user credentials",
    LOGIN_SERVER_ERROR : "Failed to log in User, Internal Server Error",
    LOGIN_SUCCESS : "User authenticated successfully",
    EMAIL_NOT_VALID : "Email is invalid",
    NO_EMAIL_PROVIDED : "No email provided in request",
    NO_USER_NAME_PROVIDED : "No username provided in request",
    NO_PASSWORD_PROVIDED : "No password provided in request",
}

const CHANGE_PASSWORD_RESPONSE_MESSAGES = {
    SUCCESS: "Accepted - User password updated successfully",
    UNAUTHORIZED: "Unauthorized - Old password invalid",
    EMAIL_NOT_FOUND: "Not Found - Email is not tied to registered user",
    BAD_REQUEST: {
        MISSING_OLD_PASSWORD: "Bad Request - No old password provided",
        MISSING_NEW_PASSWORD: "Bad Request - No new password provided",
        MISSING_EMAIL: "Bad Request - No email provided",
        WEAK_PASSWORD: "Bad Request - New password is not strong enough"
    },
    INTERNAL_SERVER_ERROR: "Internal Server Error - Failed to update password"
}


module.exports = {
    AUTH_RESPONSE_MESSAGES,
    CHANGE_PASSWORD_RESPONSE_MESSAGES
};

