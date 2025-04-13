import { UUID } from 'crypto';
import {
  LeagueMemberSurvey,
  LeagueSurvey,
  PickIdAndPlayerChoice,
  SurveySubmissionStatus,
} from '../../../generated-api';
import { ProfileAttributes } from '../../../models/account/Profile';
import { LeagueAttributes } from '../../../models/league/League';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import episodeService from '../../season/episodeService';
import leagueMemberService from '../leagueMemberService';
import leagueService from '../leagueService';
import leagueSurveyService from './leagueSurveyService.ts';
import surveySubmissionService from './surveySubmissionService.ts';
import { LeagueSurveyForEpisodeAttributes } from '../../../models/league/LeagueSurveysForEpisode.ts';
import { SurveyAttributes } from '../../../models/surveyAndPick/Survey.ts';
import profileService from '../../account/profileService.ts';
import pickService from './pickService.ts';
import pickOptionService from './pickOptionService.ts';
import {
  ForbiddenError,
  InternalServerError,
} from '../../../utils/errors/errors.ts';
import sequelize, { models } from '../../../config/db.ts';
import { Transaction } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../../config/logger.ts';
import { profile } from 'console';
import pickChoiceService from './pickChoiceService.ts';
import surveySubmissionRepository from '../../../repositories/league/survey/surveySubmissionRepository.ts';

const leagueMemberSurveyService = {
  getLeagueMemberSurvey,
  submitLeagueSurvey,
};

async function submitLeagueSurvey({
  episodeId,
  leagueSurveyId,
  surveyId,
  leagueId,
  profileId,
  picksWithChoice,
}: {
  episodeId: EpisodeAttributes['id'];
  leagueSurveyId: LeagueSurveyForEpisodeAttributes['leagueSurveyId'];
  surveyId: SurveyAttributes['surveyId'];
  leagueId: LeagueAttributes['leagueId'];
  profileId: ProfileAttributes['profileId'];
  picksWithChoice: PickIdAndPlayerChoice[];
}): Promise<LeagueMemberSurvey> {
  const episode = await episodeService.getEpisode('episodeId', episodeId);
  const league = await leagueService.getLeague(leagueId);
  const profile = await profileService.getProfile('profileId', profileId);
  const leagueProfile = await leagueMemberService.getEnrolledLeagueMember(
    leagueId,
    profileId
  );

  const surveySubmission =
    await surveySubmissionService.getSurveySubmissionStatus(
      leagueProfile.leagueProfileId,
      leagueSurveyId
    );

  if (
    surveySubmission.surveySubmissionStatus === SurveySubmissionStatus.Submitted
  ) {
    throw new ForbiddenError('Survey already submitted');
  }

  const leagueSurvey = await leagueSurveyService.getLeagueSurvey(
    leagueId,
    episodeId
  );

  //Validate that the current dateTime is between the openDae and closeDate
  const currentDateTime = new Date();
  if (currentDateTime < leagueSurvey.openDate) {
    throw new ForbiddenError('Survey is not open for submission');
  } else if (currentDateTime > leagueSurvey.dueDate) {
    throw new ForbiddenError('Survey is closed for submission');
  }

  await leagueMemberService.isInLeague(
    'profileId',
    profileId,
    leagueId,
    true,
    true
  );

  await pickService.validatePicksAreInSurvey(
    picksWithChoice.map((pick) => pick.pickId as UUID),
    episodeId,
    true
  );

  await pickOptionService.validatePicksOptions(
    picksWithChoice,
    episodeId,
    true
  );

  let t: Transaction = await sequelize.transaction();
  try {
    const surveySubmissionId = uuidv4() as UUID;
    await models.SurveySubmissions.create(
      {
        surveySubmissionId,
        leagueProfileId: leagueProfile.leagueProfileId,
        leagueSurveyId,
      },
      { transaction: t }
    );

    for (const pickWithChoice of picksWithChoice) {
      let rank = 1;
      for (const pickChoice of pickWithChoice.choice) {
        await models.PickSubmissions.create(
          {
            surveySubmissionId,
            pickId: pickWithChoice.pickId as UUID,
            playerChoice: pickChoice,
            rank,
            pointsEarned: null,
          },
          { transaction: t }
        );
        rank++;
      }
    }

    await t.commit();
  } catch (error) {
    logger.error(error);
    await t.rollback();
    throw new InternalServerError(
      'Error creating survey submission in DB: ' + error
    );
  }

  return await leagueMemberSurveyService.getLeagueMemberSurvey(
    leagueId,
    profileId,
    episodeId
  );
}

async function getLeagueMemberSurvey(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId'],
  episodeId: EpisodeAttributes['id']
): Promise<LeagueMemberSurvey> {
  //Validate leagueId exists
  const league = await leagueService.getLeague(leagueId);
  //Validate profileId is in league
  const leagueMember = await leagueMemberService.getEnrolledLeagueMember(
    leagueId,
    profileId
  );
  //Validate episodeId is in season
  const episode = await episodeService.getEpisode('seasonIdAndEpisodeId', {
    seasonId: league.seasonId,
    episodeId,
  });

  const leagueSurvey = await leagueSurveyService.getLeagueSurvey(
    leagueId,
    episodeId
  );

  const submissionStatus =
    await surveySubmissionService.getSurveySubmissionStatus(
      leagueMember.leagueProfileId,
      leagueSurvey.leagueSurveyId as UUID
    );

  const leagueMemberSurvey = buildLeagueMemberSurvey(
    leagueSurvey,
    leagueMember.leagueProfileId,
    submissionStatus.surveySubmissionStatus
  );

  if (
    submissionStatus.surveySubmissionStatus === SurveySubmissionStatus.Submitted
  ) {
    const picks = leagueMemberSurvey.picks;
    for (const pick of picks) {
      const pickChoices = await pickChoiceService.getPickChoices(
        pick.id as UUID,
        submissionStatus.surveySubmissionAttributes!.surveySubmissionId
      );
      if (pickChoices && pickChoices.length > 0) {
        pick.playerChoices = pickChoices;
      } else {
        logger.debug(
          `No choices found for pickId: ${pick.id} and profileId: ${leagueMemberSurvey.leagueProfileId}`
        );
      }
    }
  }

  return leagueMemberSurvey;
}

function buildLeagueMemberSurvey(
  leagueSurvey: LeagueSurvey,
  leagueProfileId: string,
  submissionStatus: SurveySubmissionStatus
): LeagueMemberSurvey {
  return {
    ...leagueSurvey,
    leagueProfileId,
    submissionStatus,
  };
}
export default leagueMemberSurveyService;
