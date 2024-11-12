export interface User {
    username: string;
    userProfileId: string;
}

export interface AuthState {
    account: Account | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: ResponseError | null
}

export interface ResponseError {
    message: string;
    statusCode: number;
}

export type Account = {
    userName: string;
    email: string;
    profileId: string;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null
}