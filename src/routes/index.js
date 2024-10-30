const express = require('express');
const authRoutes = require('./auth');  // Separate file for auth routes
const router = express.Router();

router.use('/auth', authRoutes);  // Mount auth-related routes

module.exports = router;