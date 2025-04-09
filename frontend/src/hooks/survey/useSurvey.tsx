import { useState, useEffect } from 'react';
import {
  Episode,
  GetLeagueMemberSurveyResponse,
  League,
  Profile,
} from '../../../generated-api';
import { useApi } from '../useApi';
import surveyService, {
  GetLeagueSurveyRequestParams,
} from '../../services/league/survey/surveyService';

interface UseSurveyProps {
  leagueId: League['id'];
  profileId: Profile['profileId'];
  activeEpisode: Episode;
}

const useSurvey = ({ leagueId, profileId, activeEpisode }: UseSurveyProps) => {
  const [selectedEpisode, setSelectedEpisode] =
    useState<Episode>(activeEpisode);

  const {
    data: getSurveyResponse,
    isLoading: getSurveyIsLoading,
    error: getSurveyError,
    execute: getSurvey,
  } = useApi<void, GetLeagueSurveyRequestParams, GetLeagueMemberSurveyResponse>(
    surveyService.getLeagueSurvey
  );

  useEffect(() => {
    async function fetchSurvey() {
      await getSurvey({
        queryParams: {
          leagueId: leagueId,
          profileId: profileId,
          episodeId: selectedEpisode.id,
        },
      });
    }
    fetchSurvey();
  }, [leagueId, profileId, selectedEpisode]);

  return {
    survey: getSurveyResponse?.responseData.leagueSurvey,
    isLoading: getSurveyIsLoading,
    error: getSurveyError,
    selectedEpisode,
    setSelectedEpisode,
  };
};

export default useSurvey;
