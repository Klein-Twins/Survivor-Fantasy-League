import { useState, useEffect } from 'react';
import {
  Episode,
  GetLeagueMemberSurveyResponse,
  League,
  Profile,
  Pick,
} from '../../../generated-api';
import { useApi } from '../useApi';
import surveyService, {
  GetLeagueSurveyRequestParams,
} from '../../services/league/survey/surveyService';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface UseSurveyProps {
  leagueId: League['id'];
  profileId: Profile['profileId'];
  episode: Episode;
}

export type SurveyPickChoicesMap = Map<string, any[]>;

const useSurvey = ({ leagueId, profileId, episode }: UseSurveyProps) => {
  //season to work under
  const season = useSelector((state: RootState) => state.season.selectedSeason);
  const [selectedChoices, setSurveySelectedChoices] =
    useState<SurveyPickChoicesMap>(new Map<string, any[]>());

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
      const getSurveyResponse = await getSurvey({
        queryParams: {
          leagueId: leagueId,
          profileId: profileId,
          episodeId: episode.id,
        },
      });
    }
    fetchSurvey();
  }, [leagueId, profileId, episode]);

  return {
    survey: getSurveyResponse?.responseData.leagueSurvey,
    isLoading: getSurveyIsLoading,
    error: getSurveyError,
    selectedChoices,
    setSurveySelectedChoices,
  };
};

export default useSurvey;
