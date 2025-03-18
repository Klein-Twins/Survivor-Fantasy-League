import express from 'express';
import surveyController from '../../../controllers/league/survey/surveyController';

const router = express.Router();

router.get(
  '/:leagueId/:profileId/:episodeId',
  surveyController.getSurveyForLeagueMember
);

export default router;
