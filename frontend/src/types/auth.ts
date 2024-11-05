export interface User {
    username: string;
    userProfileId: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: ResponseError | null
}

export interface ResponseError {
    message: string;
    statusCode: number;
}