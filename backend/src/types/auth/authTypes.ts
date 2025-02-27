import { Account } from '../../generated-api';
import { ProfileAttributes } from '../../models/account/Profile';
import { UserAttributes } from '../../models/account/User';

/**
 * Request body for the login API.
 * Defines the input expected from the client when they log in.
 */
export interface LoginRequestFields {
  email: string;
  password: string;
}

/**
 * Request body for the signup API.
 * Defines the input expected from the client when they sign up.
 */
export interface SignupRequestFields {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export type AccountForResponses = Omit<Account, 'userId'>;

/**
 * Account for backend. DO NOT SEND THIS BACK IN THE RESPONSES AS WE WILL KEEP USERID HIDDEN FROM FRONT END
 */
export type AccountAndPassword = Account & {
  PASSWORD: string;
};

export interface UserIncludeProfile extends UserAttributes {
  profile: Omit<ProfileAttributes, 'profileId'>;
}
