import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { APP_HOST, APP_PORT, APP_PROTOCOL } from './config';
import YAML from 'yamljs';
import path from 'path';

const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/api-doc.yaml'));


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
    swaggerDefinition: swaggerDocument,
    apis: [
    ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options);

// Export the swagger UI and specification
export {
    swaggerUi,
    swaggerSpec,
};