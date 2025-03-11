import React, { useEffect, useState } from 'react';
import {
  Account,
  Episode,
  GetSurveyForEpisodeForLeagueMember,
  League,
  PickWithPlayerChoice,
  SubmitSurveyWithPickChoicesRequestBody,
} from '../../../../generated-api';
import leagueSurveyService, {
  GetLeagueSurveyParams,
} from '../../../services/league/leagueSurveyService';
import { useApi } from '../../../hooks/useApi';
import SurveyForm from './SurveyForm';
import api from '../../../services/apiContainer';

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
    data: leagueSurvey,
    isLoading,
    error,
    execute,
  } = useApi<void, GetLeagueSurveyParams, GetSurveyForEpisodeForLeagueMember>(
    leagueSurveyService.getLeagueSurvey
  );

  useEffect(() => {
    async function fetchSurvey() {
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

  const survey = leagueSurvey?.responseData.leagueSurveys[0];

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error.toString()}</h1>;
  }

  if (!survey || survey === undefined) {
    return <h1>Error: No survey</h1>;
  }

  async function handleSurveySubmit(
    picksWithPlayerChoice: PickWithPlayerChoice[]
  ) {
    setIsSubmitting(true);
    try {
      const body: SubmitSurveyWithPickChoicesRequestBody = {
        episodeId: episodeId,
        leagueSurveyId: survey!.leagueSurveyId,
        surveyId: survey!.surveyId,
        leagueId: leagueId,
        profileId: profileId,
        pickChoices: picksWithPlayerChoice,
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
