import { NextFunction, Request, Response } from 'express';
import { Pick, SurveyType } from '../../generated-api';
import picksService from '../../servicesAndHelpers/picks/picksService';
import surveyService from '../../servicesAndHelpers/leagues/surveyService';

async function getSurveyForLeagueMember(req: Request, res: Response, next: NextFunction) {
  try {
    const leagueId: string = req.query.leagueId as string;
    const surveyType: SurveyType = req.query.surveyType as SurveyType;

    surveyService.getSurveyForLeagueMember(leagueId, 'test', 'testEpisode');

    res.status(200).json({ message: 'Get League Picks' });
  } catch (error) {
    next(error);
  }
}

const leagueSurveyController = {
  getSurveyForLeagueMember,
};

export default leagueSurveyController;
