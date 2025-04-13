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
    isLoading: surveyIsLoading,
    error: surveyError,
  } = useSurvey({ leagueId, profileId, episode: activeEpisode });

  if (surveyIsLoading) {
    return <LoadingData text='Loading Survey' />;
  }
  if (surveyError || !survey) {
    return <div className='text-red-500'>Error loading survey</div>;
  }

  return (
    <>
      <SurveyStatusView
        openDate={new Date(survey.openDate)}
        dueDate={new Date(survey.dueDate)}
        submissionStatus={survey.submissionStatus}
        availabilityStatus={survey.surveyAvailabilityStatus}
      />
      {survey.submissionStatus === SurveySubmissionStatus.NotSubmitted && (
        <IncompleteSurvey survey={survey} />
      )}
      {survey.submissionStatus === SurveySubmissionStatus.Submitted && (
        <p>Survey Is submitted</p>
      )}
    </>
  );
};

export default Survey;

const IncompleteSurvey: React.FC<{
  survey: LeagueMemberSurvey;
}> = ({ survey }) => {
  const [surveySubmissionError, setSurveySubmissionError] = useState<
    string | null
  >(null);

  const [surveySelectedChoices, setSurveySelectedChoices] =
    useState<SurveyPickChoicesMap>(
      new Map<string, string[]>(
        survey.picks.map((pick): [string, any[]] => [pick.id, []])
      )
    );

  async function handleSubmit() {
    // Handle submission logic here
    console.log('Survey submitted with choices:', surveySelectedChoices);

    try {
      setSurveySubmissionError(null);
      const response = await surveyService.submitLeagueSurvey({
        profileId: survey.leagueProfileId,
        leagueSurveyId: survey.leagueSurveyId,
        surveyId: survey.surveyDefinitionId,
        episodeId: survey.episodeId,
        leagueId: survey.leagueId,
        surveyChoicesMap: surveySelectedChoices,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred';
      setSurveySubmissionError(errorMessage);
    }
  }
  return (
    <>
      {surveySubmissionError && (
        <div className='text-red-500 text-center mt-4'>
          {surveySubmissionError}
        </div>
      )}
      <SurveyPicks
        survey={survey}
        selectedChoices={surveySelectedChoices}
        setSurveySelectedChoices={setSurveySelectedChoices}
        onSubmit={handleSubmit}
      />
    </>
  );
};

interface SurveyStatusViewProps {
  openDate: Date;
  dueDate: Date;
  submissionStatus: SurveySubmissionStatus;
  availabilityStatus: SurveyAvailabilityStatus;
}

const SurveyStatusView: React.FC<SurveyStatusViewProps> = ({
  openDate,
  dueDate,
  submissionStatus,
  availabilityStatus,
}) => {
  const colors = 'dark:text-white text-black';

  return (
    <div className={`w-full p-6 space-y-4 ${colors}`}>
      <h2 className='text-2xl font-bold'>Survey Details</h2>
      <div className='flex justify-between'>
        <div id='open-and-due-date'>
          <div id='open-date'>
            <p className='text-sm'>Open Date</p>
            <p className='text-lg font-medium'>
              {openDate.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
          <div id='due-date'>
            <p className='text-sm'>Due Date</p>
            <p className='text-lg font-medium'>
              {dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div id='status'>
          <div id='submission-status'>
            <p className='text-sm'>Submission Status</p>
            <p
              className={`text-lg font-medium ${
                submissionStatus === 'Submitted'
                  ? 'dark:text-green-300 text-green-300'
                  : 'text-red-700'
              }`}>
              {submissionStatus}
            </p>
          </div>
          <div id='availability-status'>
            <p className='text-sm'>Availability Status</p>
            <p
              className={`text-lg font-medium ${
                availabilityStatus === 'Available'
                  ? 'dark:text-green-300 text-green-300'
                  : 'text-red-700'
              }`}>
              {availabilityStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
