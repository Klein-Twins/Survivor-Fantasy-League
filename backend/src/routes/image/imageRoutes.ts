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

router.get(
  '/season/:seasonId',
  tokenMiddleware.authenticateToken,
  ImageController.getSeasonLogoImage
);

router.get(
  '/episode/:episodeId',
  tokenMiddleware.authenticateToken,
  ImageController.getEpisodeImage
);

export default router;
