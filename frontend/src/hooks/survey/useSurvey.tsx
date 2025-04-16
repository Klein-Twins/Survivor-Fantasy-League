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
  PlayerChoice,
  PlayerChoices,
} from '../../../generated-api';
import { ApiRequestParams, useApi } from '../useApi';
import surveyService, {
  GetLeagueSurveyRequestParams,
} from '../../services/league/survey/surveyService';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import usePickOptions from './usePickOptions';
import { submitSurvey } from '../../store/slices/surveySlice';

interface UseSurveyProps {
  // leagueId: League['id'];
  // profileId: Profile['profileId'];
  // episode: Episode;
  survey: LeagueMemberSurvey;
}

export type SurveyPickChoicesMap = Map<string, PlayerChoices>;
const useSurvey = ({ survey }: UseSurveyProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { submitSurveyError, submitSurveyLoading } = useSelector(
    (state: RootState) => state.survey
  );

  const [playerChoices, setPlayerChoices] = useState<SurveyPickChoicesMap>(
    new Map<string, PlayerChoices>()
  );

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
    const submitSurveyRequestData: ApiRequestParams<
      SubmitSurveyRequestBody,
      void
    > = {
      body: {
        episodeId: survey.episodeId,
        surveyId: survey.surveyDefinitionId,
        leagueSurveyId: survey?.leagueSurveyId,
        leagueId: survey.leagueId,
        leagueProfileId: survey.leagueProfileId,
        picksWithChoice: Array.from(playerChoices.entries()).map(
          ([pickId, choices]) => ({
            pickId,
            choice: choices.map((choice) => choice.playerChoice as string),
          })
        ),
      },
    };
    dispatch(submitSurvey(submitSurveyRequestData));
  }

  useEffect(() => {
    if (survey.submissionStatus === SurveySubmissionStatus.Submitted) {
      const picks = survey.picks;
      const choicesMap = new Map<string, PlayerChoices>();
      picks.forEach((pick: Pick) => {
        const pickId = pick.id;
        let choices: PlayerChoices = [];
        if (!pick.playerChoices) {
          choices = [];
        } else {
          const choices: PlayerChoices = pick.playerChoices.map(
            (playerChoice: PlayerChoice) => ({
              playerChoice: playerChoice.playerChoice,
              rank: playerChoice.rank,
            })
          );
        }

        choicesMap.set(pickId, choices);
      });
      setPlayerChoices(choicesMap);
    } else {
      const choicesMap = new Map<string, any[]>(
        survey.picks.map((pick): [string, any[]] => [pick.id, []])
      );
      setPlayerChoices(choicesMap);
    }
  }, [survey]);

  return {
    survey,
    //  getSurveyIsLoading,
    //  getSurveyError,
    playerChoices, // Expose playerChoices
    setPlayerChoices,
    handleOptionClick, // Expose handleOptionClick
    handleSubmit,
    allPicksCompleted, // Expose allPicksCompleted
  };
};

export default useSurvey;
