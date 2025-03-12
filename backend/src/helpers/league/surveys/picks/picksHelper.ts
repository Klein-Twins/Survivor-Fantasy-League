import { validate } from 'uuid';
import { PicksAttributes } from '../../../../models/surveyAndPick/picks/Picks';
import {
  BinaryPickOptions,
  ColorPickOptions,
  Pick,
  SurvivorPickOptions,
  TribePickOptions,
} from '../../../../generated-api';

const picksHelper = {
  validatePickId,
  buildPick,
};

function validatePickId(pickId: PicksAttributes['pickId']): void {
  if (!pickId) {
    throw new Error('Missing pick id');
  }
  if (!validate(pickId)) {
    throw new Error('Invalid pick id - not a UUID');
  }
}

function buildPick(
  pickAttributes: PicksAttributes,
  pickOptions:
    | SurvivorPickOptions
    | ColorPickOptions
    | TribePickOptions
    | BinaryPickOptions,
  points: number
): Pick {
  return {
    id: pickAttributes.pickId,
    description: pickAttributes.description,
    pickOptionType: pickAttributes.type,
    numPointsWorth: points,
    pickOptions: pickOptions,
  };
}

export default picksHelper;
