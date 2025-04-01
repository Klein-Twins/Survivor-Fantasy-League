import { Pick, PickOptionTypeEnum } from '../../../../../../generated-api';
import SurvivorPickOptions from './SurvivorPickOptions';
import TribePickOptions from './TribePickOptions';

interface PickOptionsProps {
  pick: Pick;
}

const PickOptions: React.FC<PickOptionsProps> = ({ pick }) => {
  switch (pick.optionType) {
    case PickOptionTypeEnum.Survivor:
      return <SurvivorPickOptions pick={pick} />;
    case PickOptionTypeEnum.Tribe:
      return <TribePickOptions pick={pick} />;
  }
};

export default PickOptions;
