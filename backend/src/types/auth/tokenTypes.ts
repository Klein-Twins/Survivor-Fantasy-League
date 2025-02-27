import { JwtPayload } from 'jsonwebtoken';
import { UserAttributes } from '../../models/account/User';
import { ProfileAttributes } from '../../models/account/Profile';

export interface UserJwtPayload extends JwtPayload {
  userId: UserAttributes['userId'];
  profileId: ProfileAttributes['profileId'];
}

export type TokenType = 'access' | 'refresh';
