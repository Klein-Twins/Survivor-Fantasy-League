import request from 'supertest';
import app from '../../../app';
import {
  validateErrorApiResponse,
  validateSuccessApiResponse,
} from './testHelper';
import { validateReturnedAccount, validateUserSession } from './authTestHelper';

const testCases = [
  {
    description: 'Typical Signup request',
    requestData: {
      email: 'test@example2.com',
      password: 'StrongPassword123!',
      userName: 'testuser2',
      firstName: 'Test',
      lastName: 'User',
    },
  },
  {
    description: 'Signup without first or last name provided',
    requestData: {
      email: 'test@example3.com',
      password: 'StrongPassword123!',
      userName: 'testuser3',
    },
  },
  {
    description: 'Signup without first name provided',
    requestData: {
      email: 'test@example4.com',
      password: 'StrongPassword123!',
      userName: 'testuser4',
      lastName: 'User',
    },
  },
  {
    description: 'Signup without last name provided',
    requestData: {
      email: 'test@example5.com',
      password: 'StrongPassword123!',
      userName: 'testuser5',
      firstName: 'Test',
    },
  },
];

const badRequestTestCases = [
  {
    description: 'Missing Email',
    requestData: {
      password: 'StrongPassword123!',
      userName: 'testuser2',
      firstName: 'Test',
      lastName: 'User',
    },
  },
  {
    description: 'Invalid Email',
    requestData: {
      email: 'testtttt@@maillll.com',
      password: 'StrongPassword123!',
      userName: 'testuser2',
      firstName: 'Test',
      lastName: 'User',
    },
  },

  {
    description: 'Missing Username',
    requestData: {
      email: 'test@example2.com',
      password: 'StrongPassword123!',
      firstName: 'Test',
      lastName: 'User',
    },
  },
  {
    description: 'Invalid Username',
    requestData: {
      email: 'test@example2.com',
      password: 'StrongPassword123!',
      userName: 'testuser2@@@',
      firstName: 'Test',
      lastName: 'User',
    },
  },
  {
    description: 'Invalid First Name',
    requestData: {
      email: 'test@example2.com',
      password: 'StrongPassword123!',
      userName: 'testuser2',
      firstName: 'Test-123',
      lastName: 'User',
    },
  },
  {
    description: 'Invalid Last Name',
    requestData: {
      email: 'test@example2.com',
      password: 'StrongPassword123!',
      userName: 'testuser2',
      firstName: 'Test',
      lastName: 'User@UrMom*',
    },
  },
  {
    description: 'Weak Password',
    requestData: {
      email: 'test@example2.com',
      password: 'StrongPassword123',
      userName: 'testuser2',
      firstName: 'Test',
      lastName: 'User',
    },
  },
];

const conflictTestCases = [
  {
    description: 'UserName Already Exists',
    requestData1: {
      email: 'test@email1.com',
      password: 'StrongPassword123!',
      userName: 'thisisauniqueusername',
      firstName: 'Test',
      lastName: 'User',
    },
    requestData2: {
      email: 'bobCarl@example2.com',
      password: 'StrongPassword123!',
      userName: 'thisisauniqueusername',
      firstName: 'Tesssssst',
      lastName: 'Userssss',
    },
  },
  {
    description: 'Email Already Exists',
    requestData1: {
      email: 'test@mail.com',
      password: 'StrongPassword123!',
      userName: 'BillyBob123',
      firstName: 'Billllly',
      lastName: 'Hickster',
    },
    requestData2: {
      email: 'test@mail.com',
      password: 'TrulyAbominableSnowmans1234!',
      userName: 'userName2',
      firstName: 'Jon',
      lastName: 'Adams',
    },
  },
];

describe('api/auth/signup', () => {
  describe.each(testCases)('$description', ({ requestData }) => {
    it('should successfully create an account', async () => {
      const { body: responseBody, status } = await request(app)
        .post('/api/auth/signup')
        .send(requestData);

      expect(status).toBe(200);
      expect(responseBody).toHaveProperty('responseData');

      validateSuccessApiResponse(responseBody);
      validateReturnedAccount(requestData, responseBody.responseData.account);
      validateUserSession(responseBody.responseData.userSession);
    });
  });

  describe.each(badRequestTestCases)('$description', ({ requestData }) => {
    it('Bad Requests', async () => {
      const { body: responseBody, status } = await request(app)
        .post('/api/auth/signup')
        .send(requestData);

      expect(status).toBe(400);
      validateErrorApiResponse(responseBody);
    });
  });

  describe.each(conflictTestCases)(
    '$description',
    ({ requestData1, requestData2 }) => {
      it('Conflict Requests', async () => {
        await request(app).post('/api/auth/signup').send(requestData1);
        const { body: responseBody, status } = await request(app)
          .post('/api/auth/signup')
          .send(requestData2);

        expect(status).toBe(409);
        validateErrorApiResponse(responseBody);
      });
    }
  );
});
