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
  showPickInstructions?: boolean;
  disabled?: boolean;
}

const PickOptions: React.FC<PickOptionsProps> = ({
  pick,
  pickSelection,
  showPickInstructions = true,
  disabled = false,
}) => {
  const pickOptionComponents: Record<
    PickOptionTypeEnum.Survivor | PickOptionTypeEnum.Tribe,
    React.FC<{
      pick: Pick;
      pickSelection: PickOptionsProps['pickSelection'];
      disabled?: boolean;
      showPickInstructions?: boolean;
    }>
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

  return (
    <PickOptionComponent
      pick={pick}
      pickSelection={pickSelection}
      showPickInstructions={showPickInstructions}
      disabled={disabled}
    />
  );
};

export default PickOptions;
