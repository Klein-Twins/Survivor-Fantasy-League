import { PickOptionTypeEnum } from '../../../generated-api';
import { PicksAttributes } from '../../../models/surveyAndPick/picks/Picks';

const picksData: PicksAttributes[] = [
  {
    pickId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'Which Tribe will go to tribal council?',
    isCustom: false,
    type: PickOptionTypeEnum.Tribe,
  },
  {
    pickId: '38c3f7bc-e2c4-4c9d-b4a8-f1c2d3e4f5a6',
    description: 'Which tribe will have the sole survivor?',
    isCustom: false,
    type: PickOptionTypeEnum.Tribe,
  },
  {
    pickId: 'b9d1c2e3-f4a5-4b7c-8d9e-0f1a2b3c4d5e',
    description: 'Who will be eliminated in the next episode?',
    isCustom: false,
    type: PickOptionTypeEnum.Survivor,
  },
  {
    pickId: '7a8b9c0d-1e2f-4372-a567-0e02b2c3d479',
    description: 'The color of the underwear for the first naked survivor',
    isCustom: false,
    type: PickOptionTypeEnum.Color,
  },
  {
    pickId: 'c5d6e7f8-9a0b-4c9d-b4a8-f1c2d3e4f5a6',
    description: 'Who will win the immunity challenge?',
    isCustom: false,
    type: PickOptionTypeEnum.Tribe,
  },
  {
    pickId: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Whose name will be mispelled first?',
    isCustom: false,
    type: PickOptionTypeEnum.Survivor,
  },
  {
    pickId: '67f890cd-ef12-4567-89ab-cdef01234567',
    description: 'Whose name will be mispelled first?',
    isCustom: false,
    type: PickOptionTypeEnum.Survivor,
  },
  {
    pickId: 'd9b2d63d-a233-4d4b-8f3e-3c2b2b2b2b2b',
    description: 'Will we see Jeff Probst?',
    isCustom: false,
    type: PickOptionTypeEnum.Binary,
  },
];

export default picksData;
