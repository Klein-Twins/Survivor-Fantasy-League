import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
import surveyController from '../../controllers/league/survey/surveyController';

const router = express.Router();

router.get(
  '/currentEpisodeSurveys/:profileId/:leagueIds',
  tokenMiddleware.authenticateToken,
  surveyController.getOutstandingSurveysForProfile
);

export default router;
