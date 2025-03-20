import request from 'supertest';
import app from '../../../app';
import {
  Account,
  AccountRole,
  ApiResponse,
  SignupUserRequestBody,
  UserSession,
} from '../../../src/generated-api';
import { isUUID } from 'validator';

describe('api/auth/signup', () => {
  const validateSuccessApiResponse = (responseBody: ApiResponse) => {
    expect(responseBody).toHaveProperty('statusCode');

    expect(responseBody).not.toHaveProperty('error');

    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(true);
  };

  const validateUserSession = (userSession: UserSession) => {
    expect(userSession).toHaveProperty('numSecondsRefreshTokenExpiresIn');
    expect(typeof userSession.numSecondsRefreshTokenExpiresIn).toBe('number');
    expect(userSession.numSecondsRefreshTokenExpiresIn).toBeGreaterThan(0);
    expect(userSession).toHaveProperty('isAuthenticated');
    expect(userSession.isAuthenticated).toBe(true);
  };

  const validateReturnedAccount = (
    signupRequestData: SignupUserRequestBody,
    accountInResponse: Account
  ) => {
    const expectedAccount: Omit<
      Account,
      'profileId' | 'userId' | 'accountRole'
    > = {
      email: signupRequestData.email.trim(),
      firstName: signupRequestData.firstName?.trim() || null,
      lastName: signupRequestData.lastName?.trim() || null,
      userName: signupRequestData.userName.trim(),
    };

    // Validate that all keys in expectedAccountData match the corresponding values in account
    for (const key of Object.keys(expectedAccount) as (keyof Omit<
      Account,
      'profileId' | 'userId' | 'accountRole'
    >)[]) {
      expect(accountInResponse[key]).toBe(expectedAccount[key]);
    }

    // Validate that profileId exists and is a valid UUID
    expect(accountInResponse).toHaveProperty('profileId');
    expect(isUUID(accountInResponse.profileId)).toBe(true);

    // Validate that userId exists and is a valid UUID
    expect(accountInResponse).toHaveProperty('userId');
    expect(isUUID(accountInResponse.userId)).toBe(true);

    expect(accountInResponse).toHaveProperty('accountRole');
    expect([AccountRole.User, AccountRole.Admin]).toContain(
      accountInResponse.accountRole
    );
  };

  describe('Successful expected signup requests', () => {
    it('Typical Signup request', async () => {
      const testRequestData: SignupUserRequestBody = {
        email: 'test@example2.com',
        password: 'StrongPassword123!',
        userName: 'testuser2',
        firstName: 'Test',
        lastName: 'User',
      };

      const { body: responseBody, status } = await request(app)
        .post('/api/auth/signup')
        .send(testRequestData);
      expect(status).toBe(200);
      expect(responseBody).toHaveProperty('responseData');

      validateSuccessApiResponse(responseBody);
      validateReturnedAccount(
        testRequestData,
        responseBody.responseData.account
      );
      validateUserSession(responseBody.responseData.userSession);
    });
    it('Should successfully create account without first or last name provided', async () => {
      const testRequestData: SignupUserRequestBody = {
        email: 'test@example2.com',
        password: 'StrongPassword123!',
        userName: 'testuser2',
      };

      const { body: responseBody, status } = await request(app)
        .post('/api/auth/signup')
        .send(testRequestData);
      expect(status).toBe(200);
      expect(responseBody).toHaveProperty('responseData');

      validateSuccessApiResponse(responseBody);
      validateReturnedAccount(
        testRequestData,
        responseBody.responseData.account
      );
      validateUserSession(responseBody.responseData.userSession);
    });
    it('Should successfully create account without first name provided', async () => {
      const testRequestData: SignupUserRequestBody = {
        email: 'test@example2.com',
        password: 'StrongPassword123!',
        userName: 'testuser2',
      };

      const { body: responseBody, status } = await request(app)
        .post('/api/auth/signup')
        .send(testRequestData);
      expect(status).toBe(200);
      expect(responseBody).toHaveProperty('responseData');

      validateSuccessApiResponse(responseBody);
      validateReturnedAccount(
        testRequestData,
        responseBody.responseData.account
      );
      validateUserSession(responseBody.responseData.userSession);
    });
    it('Should successfully create account without last name provided', async () => {
      const testRequestData: SignupUserRequestBody = {
        email: 'test@example2.com',
        password: 'StrongPassword123!',
        userName: 'testuser2',
      };

      const { body: responseBody, status } = await request(app)
        .post('/api/auth/signup')
        .send(testRequestData);
      expect(status).toBe(200);
      expect(responseBody).toHaveProperty('responseData');

      validateSuccessApiResponse(responseBody);
      validateReturnedAccount(
        testRequestData,
        responseBody.responseData.account
      );
      validateUserSession(responseBody.responseData.userSession);
    });
  });
});
