import { Profile, ProfileDTO } from "../profile/profileTypes";

export interface Account extends Profile {
    email: string
    userId: string
}

export interface AccountDTO extends ProfileDTO {
    email: string
}