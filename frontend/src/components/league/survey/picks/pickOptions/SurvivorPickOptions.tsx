import { Pick, Survivor } from '../../../../../../generated-api';
import { usePickOptions } from '../../../../../hooks/survey/usePickOptions';
import SurvivorImage from '../../../../ui/image/SurvivorImage';
import PickOption from './pickOption';
const SurvivorPickOptions: React.FC<{
  pick: Pick;
  pickSelection: {
    selectedItems: any[];
    handleOptionClick: (item: any, getId: (item: any) => string) => void;
    isCompleted: boolean;
  };
}> = ({ pick, pickSelection }) => {
  const survivorOptions = pick.options.options as Survivor[];

  const selectableCountMessage =
    pick.options.minNumSelections === pick.options.maxNumSelections
      ? `Select ${pick.options.minNumSelections} survivor(s)`
      : `Select ${pick.options.minNumSelections} - ${pick.options.maxNumSelections} survivors`;

  return (
    <>
      <div className='w-full'>
        <p className='text-center'>{selectableCountMessage}</p>
      </div>
      <div className='flex flex-wrap gap-2 justify-center'>
        {survivorOptions.map((survivor) => (
          <div
            key={survivor.id}
            className='flex justify-center items-center w-1/2 sm:w-1/4 md:w-1/6 lg:w-1/8'>
            <PickOption
              item={survivor}
              onClick={() =>
                pickSelection.handleOptionClick(survivor, (s) => s.id)
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
