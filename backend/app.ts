import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { swaggerSpec, swaggerUi } from './src/config/swagger.ts';
import errorHandler from './src/middleware/errorHandlerMiddleware.ts';
import routes from './src/routes/index.ts';

const allowedOrigins = ['http://134.199.141.129', 'http://localhost:5173'];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
// app.use(requestLogger);

// Load routes
app.use('/api', routes); // Mount all routes under '/api'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec); // Send the Swagger JSON specification
});
app.use(
  '/images/survivors',
  express.static(path.join(__dirname, 'src/assets/images/survivors'))
);

app.use(errorHandler);

// Add a route to handle the root URL
app.get('/', (req, res) => {
  res.send('Backend is running');
});

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

export const userSockets: Map<string, string> = new Map();

io.on('connection', (socket) => {
  const profileId = socket.handshake.query.profileId;
  console.log('The following profileId connected to socket: ' + profileId);

  userSockets.set(profileId as string, socket.id);

  socket.on('disconnect', () => {
    console.log('The following profileId disconnected to socket: ' + profileId);
    userSockets.delete(profileId as string);
  });
});

export default server;
