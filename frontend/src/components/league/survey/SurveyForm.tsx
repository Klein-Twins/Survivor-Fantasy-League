import React, { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';
import leagueSurveyService, { GetLeagueSurveyParams } from '../../../services/league/leagueSurveyService';
import { GetSurveyForEpisodeForLeagueMember } from '../../../../generated-api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import PicksList from './PicksList';

interface SurveyFormProps {
  episodeNumber: number;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ episodeNumber }) => {
  const account = useSelector((state: RootState) => state.auth.account);
  const { leagueId } = useParams<{ leagueId: string }>();

  const { data, isLoading, error, execute, setData } = useApi<
    void,
    GetLeagueSurveyParams,
    GetSurveyForEpisodeForLeagueMember
  >(leagueSurveyService.getLeagueSurvey);

  useEffect(() => {
    if (!leagueId || !account?.profileId) return;

    execute({
      queryParams: {
        leagueId,
        profileId: account.profileId,
        episodeNumber,
      },
    });
  }, [leagueId, account?.profileId, episodeNumber, execute]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No survey data available</div>;

  return (
    <PicksList
      picks={data.responseData.leagueSurveys[0].picks}
      availabilityStatus={data!.responseData!.leagueSurveys[0]!.surveyAvailabilityStatus!}
      submissionStatus={data!.responseData!.leagueSurveys[0]!.surveySubmissionStatus!}
    />
  );
};

export default SurveyForm;
