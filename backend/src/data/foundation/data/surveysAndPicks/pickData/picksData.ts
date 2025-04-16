import { UUID } from 'crypto';

import { v4 as uuidv4 } from 'uuid';
import {
  EventType,
  PicksAttributes,
} from '../../../../../models/surveyAndPick/picks/Picks';
import { PickOptionsAttributes } from '../../../../../models/surveyAndPick/picks/PickOptions';
import { PickPointsAttributes } from '../../../../../models/surveyAndPick/picks/PickPoints';
import { EpisodeType, PickOptionTypeEnum } from '../../../../../generated-api';

export type PickData = PicksAttributes &
  Omit<PickOptionsAttributes, 'pickId'> &
  Omit<PickPointsAttributes, 'pickId'> & { episodeType: EpisodeType[] };

export const survivorEliminationPickId = uuidv4() as UUID;

export const picksData: PickData[] = [
  //Premier Episode Picks
  // {
  //   pickId: uuidv4() as UUID,
  //   description: 'Who will be the sole Survivor?',
  //   type: PickOptionTypeEnum.Survivor,
  //   minNumSelections: 1,
  //   maxNumSelections: 1,
  //   noneOptionAllowed: false,
  //   points: 100,
  //   episodeType: [EpisodeType.PREMIERE],
  // },
  // {
  //   pickId: uuidv4() as UUID,
  //   description: 'Will there be a medical evacuation?',
  //   type: PickOptionTypeEnum.Binary,
  //   minNumSelections: 1,
  //   maxNumSelections: 1,
  //   noneOptionAllowed: false,
  //   points: 20,
  //   notes:
  //     'A medical evacuation is when a castaway is removed from the game due to a medical reasons',
  //   episodeType: [EpisodeType.PREMIERE],
  // },
  // {
  //   pickId: uuidv4() as UUID,
  //   description: 'Will someone quit/throw their game?',
  //   type: PickOptionTypeEnum.Binary,
  //   minNumSelections: 1,
  //   maxNumSelections: 1,
  //   noneOptionAllowed: false,
  //   points: 20,
  //   notes:
  //     'A quit is when a castaway voluntarily leaves the game. A throw is when a castaway throws their game to help another castaway.',
  //   episodeType: [EpisodeType.PREMIERE],
  // },

  //All Episodes Picks
  {
    pickId: survivorEliminationPickId,
    description: 'Which castaway will be eliminated?',
    type: PickOptionTypeEnum.Survivor,
    minNumSelections: 1,
    maxNumSelections: 1,
    noneOptionAllowed: false,
    points: 42,
    episodeType: [...Object.values(EpisodeType)],
    eventType: EventType.SurvivorElimination,
  },
  // {
  //   pickId: uuidv4() as UUID,
  //   description: 'Will a survivor lose their vote?',
  //   type: PickOptionTypeEnum.Binary,
  //   minNumSelections: 1,
  //   maxNumSelections: 1,
  //   noneOptionAllowed: false,
  //   points: 10,
  //   notes:
  //     'A vote lost does not include a stolen vote. A vote lost is when a castaway is not allowed to vote at tribal council.',
  //   episodeType: [...Object.values(EpisodeType)],
  // },
  // {
  //   pickId: uuidv4() as UUID,
  //   description: 'Will a survivor play their shot in the dark?',
  //   type: PickOptionTypeEnum.Binary,
  //   minNumSelections: 1,
  //   maxNumSelections: 1,
  //   noneOptionAllowed: false,
  //   points: 10,
  //   episodeType: [...Object.values(EpisodeType)],
  // },
  // {
  //   pickId: uuidv4() as UUID,
  //   description: 'Will a survivor play an idol?',
  //   type: PickOptionTypeEnum.Binary,
  //   minNumSelections: 1,
  //   maxNumSelections: 1,
  //   noneOptionAllowed: false,
  //   points: 10,
  //   episodeType: [...Object.values(EpisodeType)],
  // },

  // //Premier and Premerge Picks
  {
    pickId: uuidv4() as UUID,
    description: "Which tribe will win 1'st place in the immunity challenge?",
    type: PickOptionTypeEnum.Tribe,
    minNumSelections: 1,
    maxNumSelections: 1,
    noneOptionAllowed: false,
    points: 15,
    episodeType: [EpisodeType.PREMIERE, EpisodeType.PREMERGE],
  },
  // {
  //   pickId: uuidv4() as UUID,
  //   description: "Which tribe will win 2'nd place in the immunity challenge?",
  //   type: PickOptionTypeEnum.Tribe,
  //   minNumSelections: 1,
  //   maxNumSelections: 1,
  //   noneOptionAllowed: false,
  //   points: 15,
  //   episodeType: [EpisodeType.PREMIERE, EpisodeType.PREMERGE],
  // },
  // {
  //   pickId: uuidv4() as UUID,
  //   description: "Which tribe will win 1'st place in the reward challenge?",
  //   type: PickOptionTypeEnum.Tribe,
  //   minNumSelections: 1,
  //   maxNumSelections: 1,
  //   noneOptionAllowed: false,
  //   points: 15,
  //   notes:
  //     'If the episode only has one immunity challenge, this pick will be the same as the immunity challenge pick as long as there was a reward granted other than immunity.',
  //   episodeType: [EpisodeType.PREMIERE, EpisodeType.PREMERGE],
  // },
  // {
  //   pickId: uuidv4() as UUID,
  //   description: "Which tribe will win 2'nd place in the reward challenge?",
  //   type: PickOptionTypeEnum.Tribe,
  //   minNumSelections: 1,
  //   maxNumSelections: 1,
  //   noneOptionAllowed: false,
  //   points: 15,
  //   episodeType: [EpisodeType.PREMIERE, EpisodeType.PREMERGE],
  // },
  // {
  //   pickId: uuidv4() as UUID,
  //   description: 'Which tribe will go to tribal council and lose their flint?',
  //   type: PickOptionTypeEnum.Tribe,
  //   minNumSelections: 1,
  //   maxNumSelections: 1,
  //   noneOptionAllowed: false,
  //   points: 15,
  //   episodeType: [EpisodeType.PREMIERE, EpisodeType.PREMERGE],
  // },
];

const picks = new Map<EpisodeType, PickData[]>();
picksData.forEach((pick) => {
  pick.episodeType.forEach((pickOfType) => {
    picks.set(pickOfType, [...(picks.get(pickOfType) || []), pick]);
  });
});

export default picks;
