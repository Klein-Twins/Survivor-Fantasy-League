const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const generateToken = (payload) => {

    //Should be generated at login and signup.
    //It should use the user object (user = {userId, userProfileId} and date)
    return jwt.sign(
        {
            ...payload,
            iat: Math.floor(Date.now() / 1000),
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Token is invalid or expired');
    }
};

module.exports = { generateToken, verifyToken };