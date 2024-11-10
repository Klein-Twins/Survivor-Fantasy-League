import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { APP_HOST, APP_PORT, APP_PROTOCOL } from './config';

// Define the swagger definition with proper TypeScript types
const swaggerDefinition: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
    }[];
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
    };
} = {
    openapi: '3.0.0',
    info: {
        title: 'Survivor Fantasy League API',
        version: '1.0.0',
        description: 'API Documentation for the Survivor Fantasy League application',
    },
    servers: [
        {
            url: `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}`
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

// Options for swagger-jsdoc
const options: {
    swaggerDefinition: typeof swaggerDefinition;
    apis: string[];
} = {
    swaggerDefinition,
    apis: [
        './src/routes/auth/*.ts', 
        './src/routes/survivors/*.ts',
        './src/routes/leagues/*.ts'
    ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options);

// Export the swagger UI and specification
export {
    swaggerUi,
    swaggerSpec,
};