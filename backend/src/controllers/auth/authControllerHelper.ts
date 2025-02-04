import logger from '../../config/logger';
import {
  INVALID_EMAIL_ERROR,
  INVALID_FIRST_NAME_ERROR,
  INVALID_LAST_NAME_ERROR,
  INVALID_USERNAME_ERROR,
  MISSING_EMAIL_ERROR,
  MISSING_PASSWORD_ERROR,
  MISSING_USERNAME_ERROR,
  WEAK_PASSWORD_ERROR,
} from '../../constants/auth/responseErrorConstants';
import { LoginUserRequestBody, SignupUserRequestBody } from '../../generated-api';
import { isValidEmail, isValidName, isValidUsername } from '../../servicesAndHelpers/auth/authHelper';
import passwordHelper from '../../servicesAndHelpers/password/passwordHelper';
import { BadRequestError } from '../../utils/errors/errors';

const authControllerHelper = {
  formatSignupRequestData,
  validateSignupRequestData,
  validateLoginRequestData,
  formatLoginRequestData,
};

export default authControllerHelper;

//Helper function to format signupData
function formatSignupRequestData(signupData: SignupUserRequestBody): SignupUserRequestBody {
  return {
    ...signupData,
    email: signupData.email.toLowerCase(),
  };
}

function validateSignupRequestData(signupData: SignupUserRequestBody): void {
  const checks = [
    { condition: !signupData.email, error: MISSING_EMAIL_ERROR },
    { condition: !signupData.password, error: MISSING_PASSWORD_ERROR },
    { condition: !signupData.username, error: MISSING_USERNAME_ERROR },
    { condition: signupData.firstName && !isValidName(signupData.firstName), error: INVALID_FIRST_NAME_ERROR },
    { condition: signupData.lastName && !isValidName(signupData.lastName), error: INVALID_LAST_NAME_ERROR },
    { condition: !isValidEmail(signupData.email), error: INVALID_EMAIL_ERROR },
    { condition: !isValidUsername(signupData.username), error: INVALID_USERNAME_ERROR },
    { condition: !passwordHelper.isPasswordStrong(signupData.password), error: WEAK_PASSWORD_ERROR },
  ];

  for (const { condition, error } of checks) {
    if (condition) {
      logger.debug(`Validation failed: ${error}`);
      throw new BadRequestError(error.error);
    }
  }
}

function validateLoginRequestData(loginRequestData: LoginUserRequestBody): void {
  if (!loginRequestData.email || loginRequestData.email.length === 0) {
    throw new BadRequestError('Email is required');
  }
  if (!isValidEmail(loginRequestData.email)) {
    throw new BadRequestError('Invalid email');
  }
  if (!loginRequestData.password || loginRequestData.password.length === 0) {
    throw new BadRequestError('Password is required');
  }
}

function formatLoginRequestData(loginRequestData: LoginUserRequestBody): LoginUserRequestBody {
  return {
    ...loginRequestData,
    email: loginRequestData.email.toLowerCase(),
  };
}
