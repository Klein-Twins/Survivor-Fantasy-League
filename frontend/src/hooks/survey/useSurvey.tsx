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

interface UseSurveyProps {
  leagueId: League['id'];
  profileId: Profile['profileId'];
  activeEpisode: Episode;
}

export type SurveyPickChoicesMap = Map<string, any[]>;

const useSurvey = ({ leagueId, profileId, activeEpisode }: UseSurveyProps) => {
  const [selectedEpisode, setSelectedEpisode] =
    useState<Episode>(activeEpisode);

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
      const response = await getSurvey({
        queryParams: {
          leagueId: leagueId,
          profileId: profileId,
          episodeId: selectedEpisode.id,
        },
      });

      if (response?.responseData?.leagueSurvey) {
        // Initialize selectedChoices with empty arrays for each pick
        const initialChoices: SurveyPickChoicesMap = new Map<string, any[]>(
          response.responseData.leagueSurvey.picks.map(
            (pick: Pick): [string, any[]] => [pick.id, []]
          )
        );
        setSurveySelectedChoices(initialChoices);
      }
    }
    fetchSurvey();
  }, [leagueId, profileId, selectedEpisode]);

  return {
    survey: getSurveyResponse?.responseData.leagueSurvey,
    isLoading: getSurveyIsLoading,
    error: getSurveyError,
    selectedEpisode,
    setSelectedEpisode,
    selectedChoices,
    setSurveySelectedChoices,
  };
};

export default useSurvey;
