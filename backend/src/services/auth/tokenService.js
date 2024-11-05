require('dotenv').config();
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const blacklistedTokens = new Set(); // Use Set for quick lookups - eventually move to database...

const generateToken = (payload) => {
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

const blacklistToken = (token) => {
    blacklistedTokens.add(token);
};

const isTokenBlacklisted = (token) => {
    return blacklistedTokens.has(token);
};

module.exports = { generateToken, verifyToken, blacklistToken, isTokenBlacklisted };