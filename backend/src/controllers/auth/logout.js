const logoutService = require('../../services/auth/logout.js');

const logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    try {
        const result = await logoutService(token);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};

module.exports = logout;