import logger from '../../config/logger';
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
    { condition: !signupData.email, error: 'Missing email' },
    { condition: !signupData.password, error: 'Missing password' },
    { condition: !signupData.username, error: 'Missing username' },
    { condition: signupData.firstName && !isValidName(signupData.firstName), error: 'Invalid First Name' },
    { condition: signupData.lastName && !isValidName(signupData.lastName), error: 'Invalid Last Name' },
    { condition: !isValidEmail(signupData.email), error: 'Invalid email' },
    { condition: !isValidUsername(signupData.username), error: 'Invalid username' },
    { condition: !passwordHelper.isPasswordStrong(signupData.password), error: 'Password is too weak' },
  ];

  for (const { condition, error } of checks) {
    if (condition) {
      logger.debug(`Validation failed: ${error}`);
      throw new BadRequestError(error);
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
