import { JwtPayload } from "jsonwebtoken";
import { UserAttributes } from "../../models/User";
import { ProfileAttributes } from "../../models/Profile";

export interface UserJwtPayload extends JwtPayload {
    userId: UserAttributes['userId'];
    profileId: ProfileAttributes['profileId'];
}

export type TokenType = 'access' | 'refresh';