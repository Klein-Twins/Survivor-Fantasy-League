import validator from 'validator';
import { BadRequestError } from '../../utils/errors/errors';
import {
  LoginUserRequestBody,
  SignupUserRequestBody,
} from '../../generated-api';

const authControllerHelper = {
  validateSignupRequest,
  validateLoginRequest,
  validateLogoutRequest,
};

function validateLoginRequest(
  email: string,
  password: string
): LoginUserRequestBody {
  if (!email) {
    throw new BadRequestError('Email is required');
  }

  if (!password) {
    throw new BadRequestError('Password is required');
  }

  if (!validator.isEmail(email)) {
    throw new BadRequestError('Email is not valid');
  }

  return {
    email,
    password,
  };
}

function validateSignupRequest(
  email: string,
  password: string,
  userName: string,
  firstName: string,
  lastName: string
): SignupUserRequestBody {
  if (!email) {
    throw new BadRequestError('Email is required');
  }

  if (!password) {
    throw new BadRequestError('Password is required');
  }

  if (!userName) {
    throw new BadRequestError('Username is required');
  }

  if (!firstName) {
    throw new BadRequestError('First name is required');
  }

  if (!lastName) {
    throw new BadRequestError('Last name is required');
  }

  if (!validator.isEmail(email)) {
    throw new BadRequestError('Email is not valid');
  }

  if (!validator.isAlphanumeric(userName)) {
    throw new BadRequestError('Username is not valid');
  }

  if (!validator.isLength(userName, { min: 7, max: 20 })) {
    throw new BadRequestError('Username must be between 7 and 20 characters');
  }

  if (!validator.isAlpha(firstName)) {
    throw new BadRequestError('First name is not valid');
  }
  if (!validator.isLength(firstName, { min: 3, max: 20 })) {
    throw new BadRequestError('First name must be between 3 and 20 characters');
  }

  if (!validator.isAlpha(lastName)) {
    throw new BadRequestError('Last name is not valid');
  }
  if (!validator.isLength(lastName, { min: 3, max: 20 })) {
    throw new BadRequestError('Last name must be between 3 and 20 characters');
  }

  return {
    email,
    password,
    userName,
    firstName,
    lastName,
  };
}

function validateLogoutRequest(
  accessToken: string,
  refreshToken: string
): {
  accessToken: string;
  refreshToken: string;
} {
  if (!accessToken) {
    throw new BadRequestError('Access token is required');
  }

  if (!validator.isJWT(accessToken)) {
    throw new BadRequestError('Access token is not valid');
  }

  if (!refreshToken) {
    throw new BadRequestError('Refresh token is required');
  }

  if (!validator.isJWT(refreshToken)) {
    throw new BadRequestError('Refresh token is not valid');
  }

  return {
    accessToken,
    refreshToken,
  };
}

export default authControllerHelper;
