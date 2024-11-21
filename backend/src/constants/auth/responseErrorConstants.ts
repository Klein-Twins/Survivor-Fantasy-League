//Auth error constants


//Create Account
export const MISSING_EMAIL_ERROR = { error: 'Missing email', statusCode: 400 };
export const MISSING_PASSWORD_ERROR = { error: 'Missing password', statusCode: 400 };
export const MISSING_USERNAME_ERROR = { error: 'Missing username', statusCode: 400 };
export const INVALID_FIRST_NAME_ERROR = { error: 'Invalid first name: only letters and spaces allowed', statusCode: 400 };
export const INVALID_LAST_NAME_ERROR = { error: 'Invalid last name: only letters and spaces allowed', statusCode: 400 };
export const INVALID_EMAIL_ERROR = { error: 'Invalid email', statusCode: 400 };
export const INVALID_USERNAME_ERROR = { error: 'Invalid username: only letters and numbers allowed', statusCode: 400 };
export const WEAK_PASSWORD_ERROR = { error: 'Password is too weak', statusCode: 400 };
export const CREATE_ACCOUNT_FAILED_ERROR = { error: "Failed to create account", statusCode: 500 };


//Login Account
export const LOGIN_FAILED_ERROR = { error: "Failed to log into account", statusCode: 500 };

//Tokens
export const INVALID_OR_EXPIRED_TOKEN_ERROR = { error: 'Invalid or expired token', statusCode: 403 };
export const INVALID_TOKEN_ERROR = { error: "Session token invalid", statusCode: 401 }
export const BLACKLISTED_TOKEN_ERROR = { error: 'Token Blacklisted', statusCode: 401 };


export const ACCOUNT_NOT_FOUND_ERROR = { error: "Account not found", statusCode: 404 };
export const PLEASE_RESET_PASSWORD_ERROR = { error: "Please reset your password", statusCode: 500 };
export const EMAIL_NOT_FOUND_ERROR = { statusCode: 404, error: `Email not found` };
export const USERNAME_UNAVAILABLE_ERROR = { error: 'Username already tied to account', statusCode: 409 };
export const EMAIL_UNAVAILABLE_ERROR = { error: 'Email already tied to account', statusCode: 409 };

export const INCORRECT_PASSWORD_ERROR = { error: "Incorrect password. Please try again.", statusCode: 401 };

//Season
export const SEASON_NOT_FOUND_ERROR = { error: "Season was not found", statusCode: 404 }

//Create League
export const INVALID_SEASON_ID_ERROR = { error: "Please provide a valid seasonId.", statusCode: 400 };
export const INVALID_NAME_ERROR = { error: "Please provide a valid name.", statusCode: 400 };
export const INVALID_PROFILE_ID_ERROR = { error: "Please provide a valid profileId", statusCode: 400 }

export const INTERNAL_SERVER_ERROR = { error: 'An internal server error occurred', statusCode: 500 };
export const NOT_FOUND_ERROR = { error: 'The requested resource was not found', statusCode: 404 };
export const BAD_REQUEST_ERROR = { error: 'Invalid request.', statusCode: 400 }