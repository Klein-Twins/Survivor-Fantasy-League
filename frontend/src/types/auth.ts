import { ApiError } from "../../generated-api";

export interface User {
    username: string;
    userProfileId: string;
}

export interface AuthState {
    account: Account | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: ApiError | null;
    sessionEndTime: number | null;
}


export type Account = {
    userName: string;
    email: string;
    profileId: string;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null
}