import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
import ProfileImageController from '../../controllers/image/ProfileImageController';

const router = express.Router();

router.get('/profile/:profileId', tokenMiddleware.authenticateToken, ProfileImageController.getProfileImage);

export default router;
