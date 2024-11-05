const login = require('./auth/login.js');
const signup = require('./auth/signup.js');
const changePassword = require('./auth/changePassword.js');
const logout = require('./auth/logout.js');

const authController = {
    login,
    signup,
    changePassword,
    logout,
}

module.exports = authController;