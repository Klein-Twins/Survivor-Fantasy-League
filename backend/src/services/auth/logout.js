const { verifyToken, blacklistToken } = require('./tokenService');

const logout = async (token) => {
    verifyToken(token); // Ensure token is valid
    blacklistToken(token); // Add token to blacklist
    return { message: 'Successfully logged out user' };
};

module.exports = logout;