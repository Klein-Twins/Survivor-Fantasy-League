import { Pick, PickOptionTypeEnum } from '../../../../../../generated-api';
import SurvivorPickOptions from './SurvivorPickOptions';

interface PickOptionsProps {
  pick: Pick;
}

const PickOptions: React.FC<PickOptionsProps> = ({ pick }) => {
  switch (pick.optionType) {
    case PickOptionTypeEnum.Survivor:
      return <SurvivorPickOptions pick={pick} />;
  }
};

export default PickOptions;
