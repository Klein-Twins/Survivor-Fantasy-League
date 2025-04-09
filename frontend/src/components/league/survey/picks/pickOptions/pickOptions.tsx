import { Pick, PickOptionTypeEnum } from '../../../../../../generated-api';
import SurvivorPickOptions from './SurvivorPickOptions';
import TribePickOptions from './TribePickOptions';

interface PickOptionsProps {
  pick: Pick; // The pick object containing options and metadata
}

const PickOptions: React.FC<PickOptionsProps> = ({ pick }) => {
  const pickOptionComponents: Record<
    PickOptionTypeEnum.Survivor | PickOptionTypeEnum.Tribe,
    React.FC<{ pick: Pick }>
  > = {
    [PickOptionTypeEnum.Survivor]: SurvivorPickOptions,
    [PickOptionTypeEnum.Tribe]: TribePickOptions,
  };

  const truncPickOptionType =
    pick.options.pickOptionType === PickOptionTypeEnum.Survivor
      ? PickOptionTypeEnum.Survivor
      : pick.options.pickOptionType === PickOptionTypeEnum.Tribe
      ? PickOptionTypeEnum.Tribe
      : null;

  if (!truncPickOptionType) {
    throw new Error(
      `Unsupported pick option type: ${pick.options.pickOptionType}`
    );
  }

  const PickOptionComponent = pickOptionComponents[truncPickOptionType];

  if (!PickOptionComponent) {
    throw new Error(
      `Unsupported pick option type: ${pick.options.pickOptionType}`
    );
  }

  return <PickOptionComponent pick={pick} />;
};

export default PickOptions;
