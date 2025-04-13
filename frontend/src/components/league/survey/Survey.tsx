import React, { useState } from 'react';
import {
  Episode,
  League,
  LeagueMemberSurvey,
  Profile,
  SurveyAvailabilityStatus,
  SurveySubmissionStatus,
} from '../../../../generated-api';
import LoadingData from '../../ui/LoadingData';
import SurveyPicks from './SurveyPicks';
import surveyService from '../../../services/league/survey/surveyService';
import useSurvey from '../../../hooks/survey/useSurvey';
import PickSwiper from './picks/PickSwiper';
import SurveyStatusView from './SurveyStatusInfo';
import SubmitButton from '../../ui/forms/SubmitButton';
import usePickOptions from '../../../hooks/survey/usePickOptions';

interface SurveyProps {
  leagueId: League['id'];
  profileId: Profile['profileId'];
  activeEpisode: Episode;
}

export type SurveyPickChoicesMap = Map<string, any[]>;
const Survey: React.FC<SurveyProps> = ({
  leagueId,
  profileId,
  activeEpisode,
}) => {
  const {
    survey,
    getSurveyIsLoading: surveyIsLoading,
    getSurveyError: surveyError,
    playerChoices,
    setPlayerChoices,
    handleSubmit: handleSurveySubmit,
    surveySubmitted,
    handleOptionClick,
  } = useSurvey({ leagueId, profileId, episode: activeEpisode });

  if (surveyIsLoading) {
    return <LoadingData text='Loading Survey' />;
  }
  if (surveyError || !survey) {
    return <div className='text-red-500'>Error loading survey</div>;
  }

  return (
    <div className='w-full flex flex-col space-y-0'>
      <SurveyStatusView
        openDate={new Date(survey.openDate)}
        dueDate={new Date(survey.dueDate)}
        submissionStatus={survey.submissionStatus}
        availabilityStatus={survey.surveyAvailabilityStatus}
      />
      <PickSwiper
        survey={survey}
        playerChoices={playerChoices}
        setPlayerChoices={setPlayerChoices}
        handleOptionClick={handleOptionClick}
        handleSurveySubmit={handleSurveySubmit}
        surveySubmitted={surveySubmitted}
        allPicksCompleted={Array.from(playerChoices.values()).every(
          (choices) => choices.length > 0
        )}
      />
    </div>
  );
};

export default Survey;
