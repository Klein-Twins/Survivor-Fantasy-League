import { PickOptionTypeEnum } from '../../../generated-api';
import { PickOptionsAttributes } from '../../../models/surveysAndPicks/picks/PickOptions';

const pickOptionsData: PickOptionsAttributes[] = [
  {
    type: PickOptionTypeEnum.Color,
    choice: 'red',
  },
  {
    type: PickOptionTypeEnum.Color,
    choice: 'orange',
  },
  {
    type: PickOptionTypeEnum.Color,
    choice: 'yellow',
  },
  {
    type: PickOptionTypeEnum.Color,
    choice: 'green',
  },
  {
    type: PickOptionTypeEnum.Color,
    choice: 'blue',
  },
  {
    type: PickOptionTypeEnum.Color,
    choice: 'purple',
  },
  {
    type: PickOptionTypeEnum.Color,
    choice: 'pink',
  },
];

export default pickOptionsData;
