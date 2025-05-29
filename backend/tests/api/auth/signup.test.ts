import request from 'supertest';
import app from '../../../app';
import {
  validateErrorApiResponse,
  validateSuccessApiResponse,
} from './testHelper';
import { models } from '../../../src/config/db';
import {
  USER_TO_PASSWORDS,
  USER_TO_PROFILE,
  USER_TO_USERSESSIONS,
  UserAttributes,
} from '../../../src/models/account/User';
import { PasswordAttributes } from '../../../src/models/account/Password';
import { ProfileAttributes } from '../../../src/models/account/Profile';
import {
  USERSESSION_TO_TOKENS,
  UserSessionAttributes,
} from '../../../src/models/userSession/userSessions';
import { TokenAttributes } from '../../../src/models/account/Tokens';
import { AccountRole } from '../../../src/generated-api';

const testCases = [
  {
    description: 'Successful Signup 1',
    requestData: {
      email: 'test@example2.com',
      password: 'StrongPassword123!',
      userName: 'testuser2',
      firstName: 'Test',
      lastName: 'User',
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
      email: 'test@example22.com',
      password: 'StrongPassword123',
      userName: 'testuser222',
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

const conflictTestCases = [
  {
    description: 'UserName Already Exists',
    requestData1: {
      email: 'test@email1.com',
      password: 'StrongPassword123!',
      userName: 'thisisauniqueuser',
      firstName: 'Test',
      lastName: 'User',
    },
    requestData2: {
      email: 'bobCarl@example2.com',
      password: 'StrongPassword123!',
      userName: 'thisisauniqueuser',
      firstName: 'Tesssssst',
      lastName: 'Userssss',
    },
  },
  {
    description: 'Email Already Exists',
    requestData1: {
      email: 'test123354566@mail.com',
      password: 'StrongPassword123!',
      userName: 'BillyBob123',
      firstName: 'Billllly',
      lastName: 'Hickster',
    },
    requestData2: {
      email: 'test123354566@mail.com',
      password: 'TrulyAbominableSnowmans1234!',
      userName: 'userName2',
      firstName: 'Jon',
      lastName: 'Adams',
    },
  },
];

describe('api/auth/signup', () => {
  describe('Successful Signup', () => {
    describe.each(testCases)('$description', ({ requestData }) => {
      it('should successfully create an account', async () => {
        const { body: responseBody, status } = await request(app)
          .post('/api/auth/signup')
          .send(requestData);

        expect(status).toBe(201);
        expect(responseBody).toHaveProperty('responseData');
        validateSuccessApiResponse(responseBody);

        const account = responseBody.responseData.account;
        //Check account object
        expect(account).toBeDefined();
        expect(account.email).toBe(requestData.email);
        expect(account.userName).toBe(requestData.userName);
        expect(account.firstName).toBe(requestData.firstName);
        expect(account.lastName).toBe(requestData.lastName);
        expect(account).toHaveProperty('userId');
        expect(account).toHaveProperty('profileId');
        //Check userSession object
        expect(responseBody.responseData.userSession).toBeDefined();
        expect(responseBody.responseData.userSession.isAuthenticated).toBe(
          true
        );

        //Check account is saved in the database
        const accountFromDb = (await models.User.findOne({
          include: [
            {
              model: models.Profile,
              as: USER_TO_PROFILE,
              required: true,
            },
            {
              model: models.Password,
              as: USER_TO_PASSWORDS,
              required: true,
              where: {
                active: true,
              },
            },
            {
              model: models.UserSessions,
              as: USER_TO_USERSESSIONS,
              required: true,
              include: [
                {
                  model: models.Tokens,
                  as: USERSESSION_TO_TOKENS,
                  required: true,
                  where: {
                    isActive: true,
                  },
                },
              ],
            },
          ],
          where: {
            email: requestData.email.toLowerCase(),
            userName: requestData.userName.toLowerCase(),
          },
        })) as unknown as UserAttributes & {
          [USER_TO_PASSWORDS]: PasswordAttributes[];
          [USER_TO_PROFILE]: ProfileAttributes;
          [USER_TO_USERSESSIONS]: (UserSessionAttributes & {
            [USERSESSION_TO_TOKENS]: TokenAttributes[];
          })[];
        };

        //Check User db validity
        const userDb = accountFromDb as UserAttributes;
        expect(userDb.userId).toBe(account.userId);
        expect(userDb.email).toBe(account.email.toLowerCase());
        expect(userDb.userName).toBe(account.userName.toLowerCase());
        expect(userDb.profileId).toBe(account.profileId);
        expect(userDb.userRole).toBeDefined();
        expect(userDb.userRole).toBe(AccountRole.User); // Default role for new users

        //Check profile db validity
        const profileDb = accountFromDb[USER_TO_PROFILE];
        expect(profileDb.profileId).toBe(account.profileId);
        expect(profileDb.firstName).toBe(account.firstName);
        expect(profileDb.lastName).toBe(account.lastName);

        //Check userSession db validity
        const userSessionsDb = accountFromDb[USER_TO_USERSESSIONS];
        expect(userSessionsDb).toBeDefined();
        expect(userSessionsDb.length).toBe(1);
        const userSessionDb = userSessionsDb[0];
        expect(userSessionDb.accountId).toBe(userDb.userId);
        expect(userSessionDb.id).toBeDefined();
        expect(new Date(userSessionDb.startTime).getTime()).toBeLessThan(
          Date.now()
        );
        expect(userSessionDb.endTime).toBeNull();
        expect(
          new Date(userSessionDb.expectedEndTime).getTime()
        ).toBeGreaterThan(Date.now());

        //Check tokens db validity
        const tokensDb = userSessionDb[USERSESSION_TO_TOKENS];
        expect(tokensDb).toBeDefined();
        expect(tokensDb.length).toBe(2);

        //Expect one token.tokenType to be TokenType.access and the other must be TokenType.refresh
        const accessToken = tokensDb.find(
          (token) => token.tokenType === 'access'
        );
        const refreshToken = tokensDb.find(
          (token) => token.tokenType === 'refresh'
        );
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();

        for (const tokenDb of tokensDb) {
          //Expect tokenDb.token to be a valid JWT token
          expect(tokenDb.token).toMatch(
            /^[A-Za-z0-9-_.]+.[A-Za-z0-9-_.]+.[A-Za-z0-9-_.]+$/
          );
          expect(tokenDb.userSessionId).toBe(userSessionDb.id);
          expect(tokenDb.seq).toBeGreaterThanOrEqual(1);
          expect(new Date(tokenDb.issuedAt).getTime()).toBeLessThan(Date.now());
          expect(
            new Date(tokenDb.tokenExpiresTime).getTime()
          ).toBeGreaterThanOrEqual(Date.now());
          expect(tokenDb.isActive).toBe(true);
          expect(tokenDb.tokenEndTime).toBeNull();
        }
      });
    });
  });

  describe('Bad Requests', () => {
    describe.each(badRequestTestCases)('$description', ({ requestData }) => {
      it('should return Bad Request for invalid input', async () => {
        const { body: responseBody, status } = await request(app)
          .post('/api/auth/signup')
          .send(requestData);

        expect(status).toBe(400);
        validateErrorApiResponse(responseBody);
      });
    });
  });

  describe('Conflict Requests', () => {
    describe.each(conflictTestCases)(
      '$description',
      ({ requestData1, requestData2 }) => {
        it('should return Conflict for existing username or email', async () => {
          const { body: successResponseBody, status: successStatus } =
            await request(app).post('/api/auth/signup').send(requestData1);
          const { body: responseBody, status } = await request(app)
            .post('/api/auth/signup')
            .send(requestData2);

          expect(status).toBe(409);
          validateErrorApiResponse(responseBody);
          expect(responseBody).not.toHaveProperty('account');
        });
      }
    );
  });
});
