import request from 'supertest';
import app from '../../../app';
import { validateErrorApiResponse, validateSuccessApiResponse } from './testHelper';
import { validateReturnedAccount } from './authTestHelper';

const validCredentialTestCases = [
  {
    description: 'Typical Login request',
    requestData: {
      email: 'tony.stark@test.com',
      password: 'Asdf1234!',
    },
  },
];

const invalidCredentialTestCases = [
  {
    description: 'Login with incorrect password',
    requestData: {
      email: 'tony.stark@test.com',
      password: 'NottheRightPassword1234!',
    },
  },
  {
    description: 'Login with an email not tied to an account',
    requestData: {
      email: 'patrick.klen@test.com',
      password: 'Asdf1234!',
    },
  },
  {
    description: 'Login with an invalid email',
    requestData: {
      email: 'tony.stark@t@@@@@@------...est.com',
      password: 'Asdf1234!',
    },
  },
  {
    description: 'Login with an invalid password',
    requestData: {
      email: 'tony.stark@test.com',
      password: '---------Thisisnotavalidpassword1234!---------',
    },
  },
  {
    description: 'Login with a weak password',
    requestData: {
      email: 'tony.stark@test.com',
      password: 'weakpassword',
    },
  },
  {
    description: 'Login with an empty string email',
    requestData: {
      email: '',
      password: 'TestPassword1234!',
    },
  },
  {
    description: 'Login with an empty string password',
    requestData: {
      email: 'tony.stark@test.com',
      password: '',
    },
  },
  {
    description: 'Login with missing email',
    requestData: {
      password: 'TestPassword1234!',
    },
  },
  {
    description: 'Login with missing password',
    requestData: {
      email: 'tony.stark@test.com',
    },
  },
];

describe('api/auth/login', () => {
  describe.each(invalidCredentialTestCases)(
    '$description',
    ({ requestData }) => {
      it('should fail to login an account', async () => {
        const { body: responseBody, status } = await request(app)
          .post('/api/auth/signup')
          .send(requestData);

        expect(status).not.toBe(200);
        expect(responseBody).not.toHaveProperty('responseData');

        validateErrorApiResponse(responseBody);
      });
    }
  );

  describe.each(validCredentialTestCases)('$description', ({ requestData }) => {
    it('should successfully login an account', async () => {
      const { body: responseBody, status } = await request(app)
        .post('/api/auth/login')
        .send(requestData);

      expect(status).toBe(200);
      expect(responseBody).toHaveProperty('responseData');

      validateSuccessApiResponse(responseBody);
      validateReturnedAccount(requestData, responseBody.responseData.account);
      validateUserSession(responseBody.responseData.userSession);
    });
  }
});

/**
 * Cases:
 *
 * 1. Typical Login request
 * 2. Login with invalid email
 * 3. Login with invalid password
 * 4. Login with invalid email and password
 * 5. Login with empty email
 * 6. Login with empty password
 * 7. Login with empty email and password
 * 8. Login with missing email
 * 9. Login with missing password
 * 10. Login with missing email and password
 */
