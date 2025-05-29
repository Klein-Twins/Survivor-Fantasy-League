import request from 'supertest';
import app from '../../../app';
import { validateSuccessApiResponse } from './testHelper';
import { models } from '../../../src/config/db';
import {
  USER_TO_PASSWORDS,
  USER_TO_PROFILE,
  USER_TO_USERSESSIONS,
  UserAttributes,
} from '../../../src/models/account/User';
import {
  USERSESSION_TO_TOKENS,
  UserSessionAttributes,
} from '../../../src/models/userSession/userSessions';
import { PasswordAttributes } from '../../../src/models/account/Password';
import { ProfileAttributes } from '../../../src/models/account/Profile';
import { TokenAttributes } from '../../../src/models/account/Tokens';
import { Account } from '../../../src/domain/account/Account';
import { AccountRole } from '../../../src/generated-api';

const accountForSignup = {
  email: 'testing1234@mail.com',
  password: 'StrongPassword123!',
  userName: 'testing1234',
  firstName: 'Test',
  lastName: 'User',
};

const successfulLoginTestCases = [
  {
    description: 'Successful Login 1',
    requestData: {
      email: 'testing1234@mail.com',
      password: 'StrongPassword123!',
    },
  },
];

const unauthorizedLoginTestCases = [
  {
    description: 'Invalid Email',
    requestData: {
      email: '',
      password: 'StrongPassword123!',
    },
  },
  {
    description: 'Invalid Password',
    requestData: {
      email: 'testing1234@mail.com',
      password: 'WrongPassword123!',
    },
  },
];

describe('POST /api/auth/login', () => {
  let createdAccount: Account;
  beforeAll(async () => {
    // Create an account to use for login tests
    let createdAccountResponse = await request(app)
      .post('/api/auth/signup')
      .send(accountForSignup)
      .expect(201);
    validateSuccessApiResponse(createdAccountResponse.body);
    createdAccount = createdAccountResponse.body.responseData.account;
  });

  successfulLoginTestCases.forEach((testCase) => {
    it(testCase.description, async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(testCase.requestData)
        .expect(200);

      validateSuccessApiResponse(response.body);
      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.responseData).toHaveProperty('account');
      expect(response.body.responseData).toHaveProperty('userSession');
      //Confirm that the createdAccountResponse.body.responseData.account === response.body.responseData.account
      expect(response.body.responseData.account).toEqual(createdAccount);
      const account = response.body.responseData.account;

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
          email: testCase.requestData.email.toLowerCase(),
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
      expect(new Date(userSessionDb.expectedEndTime).getTime()).toBeGreaterThan(
        Date.now()
      );

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

  unauthorizedLoginTestCases.forEach((testCase) => {
    it(testCase.description, async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(testCase.requestData)
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty(
        'message',
        'Your torch has not been lit. Please check your credentials and try again, castaway.'
      );
      expect(response.body).toHaveProperty('success', false);
    });
  });
});
