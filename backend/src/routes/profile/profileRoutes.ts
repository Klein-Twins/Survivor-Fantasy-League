import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware.ts';
import profileController from '../../controllers/profile/profileController.ts';

const router = express.Router();

router.get('/get-profiles-by-search', tokenMiddleware.authenticateToken, profileController.getProfilesBySearch);

export default router;