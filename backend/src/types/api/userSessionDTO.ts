import { Account, AccountDTO } from "../auth/Account";
import { UserSession, UserSessionDTO } from "../auth/UserSession";
import { ApiResponse } from "./commonDTO";

export interface SignupResponseData {
    account: AccountDTO
    userSession: UserSessionDTO
}

export interface SignupResponse extends ApiResponse {
    responseData?: SignupResponseData;
}

function getAccountDTO(account: Account): AccountDTO {
    const accountDTO: AccountDTO = {
        email: account.email,
        profileId: account.profileId,
        profileImageUrl: account.profileImageUrl || "Default profile image url here...",
        firstName: account.firstName,
        lastName: account.lastName,
        userName: account.userName
    }
    return accountDTO;
}

function getUserSessionDTO(userSession: UserSession): UserSessionDTO {
    const userSessionDTO: UserSessionDTO = {
        numSecondsRefreshTokenExpiresIn: userSession.numSecondsRefreshTokenExpiresIn,
        isAuthenticated: userSession.isAuthenticated
    }
    return userSessionDTO;
}

export const userSessionDTX = {
    getUserSessionDTO,
    getAccountDTO
}

