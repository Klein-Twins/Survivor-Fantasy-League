import { PickOptionTypeEnum } from '../../../generated-api';
import { PickOptionsAttributes } from '../../../models/surveysAndPicks/picks/PickOptions';

const pickOptionsData: PickOptionsAttributes[] = [
  {
    type: PickOptionTypeEnum.Color,
    choiceDescription: 'red',
    choice: '#FF0000',
  },
  {
    type: PickOptionTypeEnum.Color,
    choiceDescription: 'orange',
    choice: '#FFA500',
  },
  {
    type: PickOptionTypeEnum.Color,
    choiceDescription: 'yellow',
    choice: '#FFFF00',
  },
  {
    type: PickOptionTypeEnum.Color,
    choiceDescription: 'green',
    choice: '#008000',
  },
  {
    type: PickOptionTypeEnum.Color,
    choiceDescription: 'blue',
    choice: '#0000FF',
  },
  {
    type: PickOptionTypeEnum.Color,
    choiceDescription: 'purple',
    choice: '#800080',
  },
  {
    type: PickOptionTypeEnum.Color,
    choiceDescription: 'pink',
    choice: '#FFC0CB',
  },
];

export default pickOptionsData;
