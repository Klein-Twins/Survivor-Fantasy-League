import React, { useEffect, useState } from 'react';
import {
  Account,
  CompletedLeagueSurvey,
  Episode,
  GetLeagueSurveyResponse,
  League,
  LeagueSurvey,
  PickSelection,
  SubmitSurveyRequestBody,
} from '../../../../generated-api';
import leagueSurveyService, {
  GetLeagueSurveyPathParams,
} from '../../../servicesBackup/league/leagueSurveyService';
import { useApi } from '../../../hooks/useApi';
import SurveyForm from './SurveyForm';
import api from '../../../servicesBackup/apiContainer';
import { FaCircle, FaSpinner } from 'react-icons/fa';
import CompletedSurveyView from './CompletedSurveyView';

interface SurveyProps {
  episodeId: Episode['id'];
  profileId: Account['profileId'];
  leagueId: League['leagueId'];
}

const Survey: React.FC<SurveyProps> = ({ episodeId, profileId, leagueId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<any>(null);
  const [submitData, setSubmitData] = useState<string>('');

  const {
    data,
    isLoading: surveyIsLoading,
    error,
    execute,
  } = useApi<void, GetLeagueSurveyPathParams, GetLeagueSurveyResponse>(
    leagueSurveyService.getLeagueSurvey
  );

  useEffect(() => {
    async function fetchSurvey() {
      if (!episodeId || !leagueId || !profileId) {
        console.error('Missing required data');
      }

      await execute({
        queryParams: {
          episodeId,
          leagueId,
          profileId,
        },
      });
    }
    fetchSurvey();
  }, [episodeId, leagueId, profileId, execute]);

  if (surveyIsLoading) {
    return (
      <div className='flex flex-col justify-center items-center space-y-4 my-8'>
        <FaSpinner className='animate-spin-slow text-4xl' />
        <h1 className='text-4xl'>Loading Survey</h1>
      </div>
    );
  }

  if (error) {
    return <h1>Error: {error.toString()}</h1>;
  }

  if (!data) {
    return <h1>No data</h1>;
  }

  const isSurveyCompleted = data.responseData.isCompleted;
  const survey = isSurveyCompleted
    ? (data.responseData.leagueSurvey as CompletedLeagueSurvey)
    : (data.responseData.leagueSurvey as LeagueSurvey);

  if (isSurveyCompleted) {
    return <CompletedSurveyView survey={survey as CompletedLeagueSurvey} />;
  }

  async function handleSurveySubmit(pickSelections: PickSelection[]) {
    setIsSubmitting(true);
    try {
      const body: SubmitSurveyRequestBody = {
        episodeId: episodeId,
        leagueSurveyId: survey!.leagueSurveyId,
        surveyId: survey.id,
        leagueId: leagueId,
        profileId: profileId,
        pickChoices: pickSelections,
      };
      const response =
        await api.LeagueSurveyService.submitSurveyWithPickChoices(body, {
          withCredentials: true,
        });
      setIsSubmitting(false);
      setSubmitData(response.toString());
    } catch (error: any) {
      setSubmitError(error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex flex-col'>
      {isSubmitting && <h1>Submitting...</h1>}
      {submitError && <h1>Error: {submitError.toString()}</h1>}
      {submitData && <h1>Submitted: {submitData}</h1>}
      <SurveyForm picks={survey.picks} onSubmit={handleSurveySubmit} />
    </div>
  );
};

export default Survey;
