import { AuthLogoutResponseData } from '../../types/auth.ts';
import errorFactory from '../../utils/errorFactory.ts';
import tokenService from './tokenService.ts';

const logoutService = {
    logout: (token : string) : AuthLogoutResponseData => {
        if(!tokenService.verifyToken(token)) throw errorFactory({message: "Session token invalid", statusCode: 401});
        tokenService.blacklistToken(token);
        return {message: 'Successfully logged out user', statusCode: 200};
    }
}

export default logoutService;