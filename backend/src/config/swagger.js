require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Survivor Fantasy League API',
        version: '1.0.0',
        description: 'API Documentation for the Survivor Fantasy League application',
    },
    servers: [
        {
            url: `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`
        },
    ],
};

//Options for swagger-jsdoc
const options = {
    swaggerDefinition,
    apis: ['./src/routes/auth/*.js']
}

//Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec,
}