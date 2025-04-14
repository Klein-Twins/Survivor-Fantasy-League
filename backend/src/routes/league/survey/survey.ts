import express from 'express';
import surveyController from '../../../controllers/league/survey/surveyController';

const router = express.Router();

router.get(
  '/:leagueId/:profileId/:episodeId',
  surveyController.getSurveyForLeagueMember
);
router.get('/:leagueId/:profileId', surveyController.getSurveysForLeagueMember);
router.post('/submit', surveyController.submitSurvey);

export default router;
