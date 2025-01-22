export interface UserSession {
    numSecondsRefreshTokenExpiresIn: number
    isAuthenticated: boolean
}

export interface UserSessionDTO extends UserSession {

}