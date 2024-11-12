import express from 'express';
import tokenController from '../../controllers/auth/tokenController';
const router = express.Router();

router.get('/check-auth', tokenController.checkIsAuthenticated);

export default router;