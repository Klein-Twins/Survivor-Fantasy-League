const express = require('express');
require('dotenv').config();
const db = require('./src/config/db');
const routes = require('./src/routes');  // Import routes

const app = express();
app.use(express.json());

// Load routes
app.use('/api', routes);  // Mount all routes under '/api'

db.authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Error: ' + err));

module.exports = app;