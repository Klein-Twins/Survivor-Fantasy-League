import { Pick, Survivor } from '../../../../../../generated-api';
import SurvivorImage from '../../../../ui/image/SurvivorImage';
import PickOption from './pickOption';
const SurvivorPickOptions: React.FC<{
  pick: Pick;
  pickSelection: {
    selectedItems: any[];
    handleOptionClick: (item: any, getId: (item: any) => string) => void;
    isCompleted: boolean;
  };
  disabled?: boolean;
  showPickInstructions?: boolean;
}> = ({
  pick,
  pickSelection,
  disabled = false,
  showPickInstructions = true,
}) => {
  const survivorOptions = pick.options.options as Survivor[];

  const selectableCountMessage =
    pick.options.minNumSelections === pick.options.maxNumSelections
      ? `Select ${pick.options.minNumSelections} survivor(s)`
      : `Select ${pick.options.minNumSelections} - ${pick.options.maxNumSelections} survivors`;

  return (
    <>
      {showPickInstructions && (
        <div className='w-full'>
          <p className='text-center'>{selectableCountMessage}</p>
        </div>
      )}
      <div className='flex flex-wrap gap-2 justify-center'>
        {survivorOptions.map((survivor) => (
          <div
            key={pick.id + '|' + survivor.id}
            className='flex justify-center items-center w-[calc(100%/3-8px)] sm:w-[calc(100%/4-8px)] md:w-[calc(100%/6-8px)] lg:w-[calc(100%/9-8px)]'>
            <PickOption
              item={survivor}
              onClick={
                !disabled
                  ? () => pickSelection.handleOptionClick(survivor, (s) => s.id)
                  : undefined // Disable onClick if survey is submitted
              }
              isSelected={pickSelection.selectedItems.some(
                (s) => s.id === survivor.id
              )}
              renderContent={(s) => (
                <div className='flex flex-col items-center space-y-1'>
                  <SurvivorImage
                    survivorId={s.id}
                    seasonId={48}
                    survivorName=''
                    className='w-full h-auto'
                  />
                  <p className='text-center'>{s.firstName}</p>
                </div>
              )}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default SurvivorPickOptions;
