import express from 'express';
import authController from '../../controllers/auth/authController';
const router = express.Router();

router.get('/check-auth', authController.checkAuth);

export default router;