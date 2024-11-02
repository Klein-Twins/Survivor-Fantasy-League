const express = require('express');
const authRoutes = require('./auth/auth.js');  // Separate file for auth routes
const changePasswordRoutes = require('./auth/changePassword.js');
const router = express.Router();

router.use('/auth', authRoutes);  // Mount auth-related routes
router.use('/auth', changePasswordRoutes);

module.exports = router;