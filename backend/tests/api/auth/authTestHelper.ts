import { isUUID } from 'validator';
import {
  Account,
  AccountRole,
  SignupUserRequestBody,
  UserSession,
} from '../../../src/generated-api';

export const validateUserSession = (userSession: UserSession) => {
  expect(userSession).toHaveProperty('numSecondsRefreshTokenExpiresIn');
  expect(typeof userSession.numSecondsRefreshTokenExpiresIn).toBe('number');
  expect(userSession.numSecondsRefreshTokenExpiresIn).toBeGreaterThan(0);
  expect(userSession).toHaveProperty('isAuthenticated');
  expect(userSession.isAuthenticated).toBe(true);
};

export const validateReturnedAccount = (
  signupRequestData: SignupUserRequestBody,
  accountInResponse: Account
) => {
  const expectedAccount: Omit<Account, 'profileId' | 'userId' | 'accountRole'> =
    {
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
