import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.ts';
import { swaggerUi, swaggerSpec } from './src/config/swagger.ts';
import path from 'path';
import errorHandler from './src/middleware/errorHandlerMiddleware.ts';
import requestLogger from './src/middleware/requestLoggerMiddleware.ts';
import morgan from 'morgan';
import logger from './src/config/logger.ts';
import { Response, Request, NextFunction } from 'express';

const corsOptions: cors.CorsOptions = {
    origin: '*', // Replace with frontend URL in production
    exposedHeaders: ['Authorization'],
};

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);




// Load routes
app.use('/api', routes);  // Mount all routes under '/api'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec); // Send the Swagger JSON specification
});
app.use('/images/survivors', express.static(path.join(__dirname, 'src/assets/images/survivors')));

app.use(errorHandler);

export default app;