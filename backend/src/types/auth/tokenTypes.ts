import { JwtPayload } from 'jsonwebtoken';
import { UserAttributes } from '../../models/account/User';
import { ProfileAttributes } from '../../models/account/Profile';
import { AccountRole } from '../../generated-api';

export interface UserJwtPayload extends JwtPayload {
  userId: UserAttributes['userId'];
  profileId: ProfileAttributes['profileId'];
  accountRole: AccountRole;
}

export type TokenType = 'access' | 'refresh';
