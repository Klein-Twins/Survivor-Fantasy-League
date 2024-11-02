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

module.exports = {
    AUTH_RESPONSE_MESSAGES
};

