import express from 'express';
import ImageController from '../../controllers/image/ImageController';

const router = express.Router();

router.get('/profile/:profileId', ImageController.getProfileImage);

router.get('/league/:leagueId', ImageController.getLeagueImage);

router.get('/season/:seasonId', ImageController.getSeasonLogoImage);

router.get('/episode/:episodeId', ImageController.getEpisodeImage);

router.get('/survivor/:seasonId/:survivorId', ImageController.getSurvivorImage);

//TODO: Implement for Tribe

export default router;
