import { verifyToken, blacklistToken } from './tokenService.ts';

const logout = async (token: string): Promise<{ message: string }> => {
    verifyToken(token); // Ensure token is valid
    blacklistToken(token); // Add token to blacklist
    return { message: 'Successfully logged out user' };
};

export default logout;