import { useState, useEffect, useMemo } from 'react';
import {
  Episode,
  GetLeagueMemberSurveyResponse,
  League,
  Profile,
  Pick,
  LeagueMemberSurvey,
  SurveySubmissionStatus,
  SubmitSurveyRequestBody,
  SubmitSurveyResponse,
} from '../../../generated-api';
import { useApi } from '../useApi';
import surveyService, {
  GetLeagueSurveyRequestParams,
} from '../../services/league/survey/surveyService';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import usePickOptions from './usePickOptions';

interface UseSurveyProps {
  leagueId: League['id'];
  profileId: Profile['profileId'];
  episode: Episode;
}

export type SurveyPickChoicesMap = Map<string, any[]>;
const useSurvey = ({ leagueId, profileId, episode }: UseSurveyProps) => {
  const [survey, setSurvey] = useState<LeagueMemberSurvey | null>(null);
  const [playerChoices, setPlayerChoices] = useState<SurveyPickChoicesMap>(
    new Map<string, any[]>()
  );
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const {
    data: getSurveyResponse,
    isLoading: getSurveyIsLoading,
    error: getSurveyError,
    execute: getSurvey,
  } = useApi<void, GetLeagueSurveyRequestParams, GetLeagueMemberSurveyResponse>(
    surveyService.getLeagueSurvey
  );

  const {
    data: submitSurveyResponse,
    isLoading: submitSurveyIsLoading,
    error: submitSurveyError,
    execute: submitSurvey,
  } = useApi<SubmitSurveyRequestBody, void, SubmitSurveyResponse>(
    surveyService.submitLeagueSurvey
  );

  // Handle option click logic
  const handleOptionClick = (
    pickId: string,
    item: any,
    getId: (item: any) => string,
    maxNumSelections: number
  ) => {
    setPlayerChoices((prev) => {
      const updatedChoices = new Map(prev);
      const currentChoices = updatedChoices.get(pickId) || [];
      const itemId = getId(item);

      if (currentChoices.some((choice) => getId(choice) === itemId)) {
        // Remove the item if it is already selected
        updatedChoices.set(
          pickId,
          currentChoices.filter((choice) => getId(choice) !== itemId)
        );
      } else {
        // Add the item if it is not already selected
        if (currentChoices.length < maxNumSelections) {
          updatedChoices.set(pickId, [...currentChoices, item]);
        } else {
          // Remove the first item and add the new item
          const updatedSelection = [...currentChoices.slice(1), item];
          updatedChoices.set(pickId, updatedSelection);
        }
      }

      return updatedChoices;
    });
  };

  // Calculate if all picks are completed
  const allPicksCompleted = useMemo(() => {
    if (!survey) return false;
    return survey.picks.every((pick) => {
      const selectedItems = playerChoices.get(pick.id) || [];
      return (
        selectedItems.length >= pick.options.minNumSelections &&
        selectedItems.length <= pick.options.maxNumSelections
      );
    });
  }, [survey, playerChoices]);

  async function handleSubmit() {
    console.log('Survey submitted with choices:', playerChoices);
    await submitSurvey({
      body: {
        episodeId: episode.id,
        surveyId: survey.surveyDefinitionId,
        leagueSurveyId: survey?.leagueSurveyId,
        leagueId: leagueId,
        profileId: profileId,
        picksWithChoice: Array.from(playerChoices.entries()).map(
          ([pickId, choices]) => ({
            pickId,
            choice: choices.map((choice) => choice.id as string),
          })
        ),
      },
    });
  }

  useEffect(() => {
    async function fetchSurvey() {
      const getSurveyResponse = await getSurvey({
        queryParams: {
          leagueId: leagueId,
          profileId: profileId,
          episodeId: episode.id,
        },
      });
      if (getSurveyResponse) {
        setSurvey(getSurveyResponse.responseData.leagueSurvey);
        if (
          getSurveyResponse.responseData.leagueSurvey.submissionStatus ===
          SurveySubmissionStatus.Submitted
        ) {
          const picks = getSurveyResponse.responseData.leagueSurvey.picks;
          const choicesMap = new Map<string, any[]>();
          picks.forEach((pick: Pick) => {
            const pickId = pick.id;
            const choices = pick.playerChoices.map((choice) => ({
              id: choice.playerChoice,
              rank: choice.rank,
            }));
            choicesMap.set(pickId, choices);
          });
          setPlayerChoices(choicesMap);
          setSurveySubmitted(true);
        } else {
          const choicesMap = new Map<string, any[]>(
            getSurveyResponse.responseData.leagueSurvey.picks.map(
              (pick): [string, any[]] => [pick.id, []]
            )
          );
          setPlayerChoices(choicesMap);
          setSurveySubmitted(false);
        }
      }
    }
    fetchSurvey();
  }, [leagueId, profileId, episode]);

  return {
    survey,
    getSurveyIsLoading,
    getSurveyError,
    playerChoices, // Expose playerChoices
    setPlayerChoices,
    handleOptionClick, // Expose handleOptionClick
    handleSubmit,
    surveySubmitted,
    setSurveySubmitted,
    submitSurveyIsLoading,
    submitSurveyError,
    submitSurveyResponse,
    allPicksCompleted, // Expose allPicksCompleted
  };
};

export default useSurvey;
