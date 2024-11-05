const { verifyToken, isTokenBlacklisted } = require('../services/auth/tokenService.js');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || isTokenBlacklisted(token)) {
        return res.status(403).send('Forbidden: Invalid or missing token');
    }

    try {
        const user = verifyToken(token);
        req.user = user; // Attach user info to request
        next();
    } catch (error) {
        return res.status(403).send('Forbidden: Invalid token');
    }
};

module.exports = { authenticateToken };