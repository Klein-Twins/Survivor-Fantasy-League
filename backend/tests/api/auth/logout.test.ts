import request from 'supertest';
import app from '../../../app';
import { validateSuccessApiResponse } from './testHelper';
import { sign } from 'crypto';
import { models } from '../../../src/config/db';
import {
  USERSESSION_TO_TOKENS,
  UserSessionAttributes,
} from '../../../src/models/userSession/userSessions';
import { Account } from '../../../src/generated-api';
import {
  TOKEN_TO_USERSESSION,
  TokenAttributes,
} from '../../../src/models/account/Tokens';

/**
 * Logout test cases:
 * 1. Happy path: User logs out successfully
 *    - Conditions:
 *     - Ensure that the user is logged in with valid access and refresh tokens.
 *    - Ensure that access and refresh tokens are provided in the database.
 *    - Ensure that the user session is handled in the database.
 */

const accountForSignup = {
  email: 'testing1696969@mail.com',
  password: 'StrongPassword123!',
  userName: 'testing1696969',
  firstName: 'Test',
  lastName: 'User',
};

describe('POST /api/auth/logout', () => {
  const testSigninData = {
    email: 'testing1696969@mail.com',
    password: 'StrongPassword123!',
  };

  const testSignupData = {
    email: testSigninData.email,
    password: testSigninData.password,
    userName: 'testing1696969',
    firstName: 'Test',
    lastName: 'User',
  };

  let signedInAccount: {
    account: Account;
    accessToken: string;
    refreshToken: string;
  };

  beforeAll(async () => {
    let accountFromSignup = (
      await request(app)
        .post('/api/auth/signup')
        .send(testSignupData)
        .expect(201)
    ).body.responseData.account as Account;

    expect(accountFromSignup).toBeDefined();
    expect(accountFromSignup.email.toLowerCase()).toBe(
      testSignupData.email.toLowerCase()
    );
  });

  beforeEach(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send(testSigninData)
      .expect(200);

    const account = loginResponse.body.responseData.account as Account;
    const cookiesHeader = loginResponse.headers['set-cookie'];
    const cookies = Array.isArray(cookiesHeader)
      ? cookiesHeader
      : [cookiesHeader];
    const accessToken = getCookieValue(cookies, 'accessToken');
    const refreshToken = getCookieValue(cookies, 'refreshToken');

    expect(account).toBeDefined();
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();

    signedInAccount = {
      account,
      accessToken,
      refreshToken,
    };
  });

  it('Happy path: 1. Access and refresh tokens are valid jwt tokens, belong to the same user.', async () => {
    expect(signedInAccount.accessToken).toBeDefined();
    expect(signedInAccount.refreshToken).toBeDefined();
    // expect accessToken to be a valid JWT
    expect(signedInAccount.accessToken.split('.').length).toBe(3);
    // expect refreshToken to be a valid JWT
    expect(signedInAccount.refreshToken.split('.').length).toBe(3);

    const userSessionData = (await models.UserSessions.findAll({
      where: {
        accountId: signedInAccount.account.userId,
      },
      include: [
        {
          model: models.Tokens,
          as: USERSESSION_TO_TOKENS,
          where: {
            isActive: true,
          },
          required: true,
        },
      ],
    })) as unknown as (UserSessionAttributes & {
      tokens: TokenAttributes[];
    })[];

    expect(userSessionData).toBeDefined();
    expect(userSessionData.length).toBe(1);
    expect(userSessionData[0].tokens).toBeDefined();
    expect(userSessionData[0].tokens.length).toBe(2);

    const accessToken = userSessionData[0].tokens.find(
      (token) => token.tokenType === 'access'
    );
    const refreshToken = userSessionData[0].tokens.find(
      (token) => token.tokenType === 'refresh'
    );

    const response = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', [
        `accessToken=${signedInAccount.accessToken}`,
        `refreshToken=${signedInAccount.refreshToken}`,
      ]);

    const activeTokens = await models.Tokens.findAll({
      include: [
        {
          model: models.UserSessions,
          as: TOKEN_TO_USERSESSION,
          where: {
            accountId: signedInAccount.account.userId,
          },
          required: true,
        },
      ],
      where: {
        isActive: true,
      },
    });

    expect(activeTokens).toBeDefined();
    expect(activeTokens.length).toBe(0);

    validateSuccessApiResponse(
      response.body,
      200,
      'Your torch has been extinguished for now...'
    );
  });
});

function getCookieValue(cookies: string[], name: string): string {
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));
  return cookie ? cookie.split(';')[0].split('=')[1] : '';
}
