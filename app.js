const express = require('express');
require('dotenv').config();
const { sequelize } = require('./src/config/dbConfig');
const routes = require('./src/routes');  // Import routes
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Load routes
app.use('/api', routes);  // Mount all routes under '/api'

module.exports = app;