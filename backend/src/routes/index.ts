import express from 'express';

const router = express.Router();

// Import the route modules
import authRoutes from './auth/authRoutes'
import survivorRoute from './survivors/getSurvivors.ts';

// Use the routes with the appropriate base paths
router.use('/auth', authRoutes);
router.use('/', survivorRoute);

export default router;