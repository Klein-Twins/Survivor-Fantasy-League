//Auth error constants


//Create Account
export const MISSING_EMAIL_ERROR = { message: 'Missing email', statusCode: 400 };
export const MISSING_PASSWORD_ERROR = { message: 'Missing password', statusCode: 400 };
export const MISSING_USERNAME_ERROR = { message: 'Missing username', statusCode: 400 };
export const INVALID_FIRST_NAME_ERROR = { message: 'Invalid first name: only letters and spaces allowed', statusCode: 400 };
export const INVALID_LAST_NAME_ERROR = { message: 'Invalid last name: only letters and spaces allowed', statusCode: 400 };
export const INVALID_EMAIL_ERROR = { message: 'Invalid email', statusCode: 400 };
export const INVALID_USERNAME_ERROR = { message: 'Invalid username: only letters and numbers allowed', statusCode: 400 };
export const WEAK_PASSWORD_ERROR = { message: 'Password is too weak', statusCode: 400 };
export const CREATE_ACCOUNT_FAILED_ERROR = { message: "Failed to create account", statusCode: 500 };


//Login Account
export const LOGIN_FAILED_ERROR = {message: "Failed to log into account", statusCode: 500};

//Tokens
export const INVALID_OR_EXPIRED_TOKEN_ERROR = { message: 'Invalid or expired token', statusCode: 403 };
export const INVALID_TOKEN_ERROR = { message: "Session token invalid", statusCode: 401 }
export const BLACKLISTED_TOKEN_ERROR = { message: 'Token Blacklisted', statusCode: 401 };


export const ACCOUNT_NOT_FOUND = { message: "Account not found", statusCode: 404 };
export const PLEASE_RESET_PASSWORD = { message: "Please reset your password", statusCode: 500 };
export const EMAIL_NOT_FOUND = { statusCode: 404, message: `Email not found` };
export const USERNAME_UNAVAILABLE = { message: 'Username already tied to account', statusCode: 400};
export const EMAIL_UNAVAILABLE = { message: 'Email already tied to account', statusCode: 400};

export const INCORRECT_PASSWORD = { message: "Incorrect password. Please try again.", statusCode: 401 };

//Season
export const SEASON_NOT_FOUND = { message: "Season was not found", statusCode: 404}

//Create League
export const INVALID_SEASON_ID = { message: "Please provide a valid seasonId.", statusCode: 400};
export const INVALID_NAME = { message: "Please provide a valid name.", statusCode: 400};
export const INVALID_PROFILE_ID = { message: "Please provide a valid profileId", statusCode: 400}

export const INTERNAL_SERVER_ERROR = {message: 'An internal server error occurred', statusCode: 500};
export const NOT_FOUND_ERROR = {message: 'The requested resource was not found', statusCode: 404};