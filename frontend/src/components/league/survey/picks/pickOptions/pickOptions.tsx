import { Pick, PickOptionTypeEnum } from '../../../../../../generated-api';
import SurvivorPickOptions from './SurvivorPickOptions';
import TribePickOptions from './TribePickOptions';

interface PickOptionsProps {
  pick: Pick;
  pickSelection: {
    selectedItems: any[];
    handleOptionClick: (item: any, getId: (item: any) => string) => void;
    isCompleted: boolean;
  };
}

const PickOptions: React.FC<PickOptionsProps> = ({ pick, pickSelection }) => {
  const pickOptionComponents: Record<
    PickOptionTypeEnum.Survivor | PickOptionTypeEnum.Tribe,
    React.FC<{ pick: Pick; pickSelection: PickOptionsProps['pickSelection'] }>
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

  return <PickOptionComponent pick={pick} pickSelection={pickSelection} />;
};

export default PickOptions;
/**
 *   const truncPickOptionType =
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
 */
