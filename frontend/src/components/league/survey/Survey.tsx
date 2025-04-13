import React from 'react';
import { Episode, League, Profile } from '../../../../generated-api';
import LoadingData from '../../ui/LoadingData';
import useSurvey from '../../../hooks/survey/useSurvey';
import PickSwiper from './picks/PickSwiper';
import SurveyStatusView from './SurveyStatusInfo';

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
