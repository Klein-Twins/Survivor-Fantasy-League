import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './src/routes/index.ts';
import { swaggerUi, swaggerSpec } from './src/config/swagger.ts';
import path from 'path';

const corsOptions: cors.CorsOptions = {
    origin: '*', // Replace with frontend URL in production
    exposedHeaders: ['Authorization'],
};

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Load routes
app.use('/api', routes);  // Mount all routes under '/api'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/images/survivors', express.static(path.join(__dirname, 'src/assets/images/survivors')));

export default app;