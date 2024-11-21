import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.ts';
import { swaggerUi, swaggerSpec } from './src/config/swagger.ts';
import path from 'path';
import errorHandler from './src/middleware/errorHandlerMiddleware.ts';
import requestLogger from './src/middleware/requestLoggerMiddleware.ts';
import cookieParser from 'cookie-parser';
import http from 'http';
import { setupSocket } from './socket.ts';
import { Server, Socket } from 'socket.io';
import logger from './src/config/logger.ts';

const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost:5173', // Replace with frontend URL in production
    credentials: true
};

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
// app.use(requestLogger);

// Load routes
app.use('/api', routes);  // Mount all routes under '/api'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec); // Send the Swagger JSON specification
});
app.use('/images/survivors', express.static(path.join(__dirname, 'src/assets/images/survivors')));

app.use(errorHandler);

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
  }
});

export const userSockets: Map<string, string> = new Map();

io.on('connection', (socket) => {
  const profileId = socket.handshake.query.profileId;
  console.log('The following profileId connected to socket: ' + profileId);

  userSockets.set(profileId as string, socket.id)
  
  socket.on('disconnect', () => {
    console.log('The following profileId disconnected to socket: ' + profileId);
    userSockets.delete(profileId as string)
  });
})

export default server;