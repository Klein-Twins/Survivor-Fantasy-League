const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/index.js');
const { swaggerUi, swaggerSpec } = require('./src/config/swagger.js');
const path = require('path');

const corsOptions = {
    origin: '*', //Replace with front end  URL in production
    exposedHeaders: ['Authorization'],
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// Load routes
app.use('/api', routes);  // Mount all routes under '/api'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/images/survivors', express.static(path.join(__dirname, 'src/assets/images/survivors')));

module.exports = app;