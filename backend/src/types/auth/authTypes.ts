import { ProfileAttributes } from "../../models/Profile";
import { UserAttributes } from "../../models/User";

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

/**
 * Defines the Account type which is sent back for login and signup responses
 */
export type Account = Omit<UserAttributes, "USER_PROFILE_ID"> & ProfileAttributes
export type AccountAndPassword = Account & {
    PASSWORD: string
}