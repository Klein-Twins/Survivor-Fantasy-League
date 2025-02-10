import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
import ImageController from '../../controllers/image/ImageController';

const router = express.Router();

router.get(
  '/profile/:profileId',
  tokenMiddleware.authenticateToken,
  ImageController.getProfileImage
);

router.get(
  '/league/:leagueId',
  tokenMiddleware.authenticateToken,
  ImageController.getLeagueImage
);

export default router;
