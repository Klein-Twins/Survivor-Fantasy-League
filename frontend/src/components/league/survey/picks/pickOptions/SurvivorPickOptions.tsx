import { Pick, Survivor } from '../../../../../../generated-api';
import { usePickOptions } from '../../../../../hooks/survey/usePickOptions';
import SurvivorImage from '../../../../ui/image/SurvivorImage';
import PickOption from './pickOption';

const SurvivorPickOptions: React.FC<{ pick: Pick }> = ({ pick }) => {
  const minNumSelections = Math.max(1, pick.options.minNumSelections);
  const maxNumSelections = Math.max(
    minNumSelections,
    pick.options.maxNumSelections
  );
  const survivorOptions = pick.options.options as Survivor[];

  const { selectedItems: selectedSurvivors, handleOptionClick } =
    usePickOptions<Survivor>(minNumSelections, maxNumSelections);

  const selectableCountMessage =
    minNumSelections === maxNumSelections
      ? `Select ${minNumSelections} survivor(s)`
      : `Select ${minNumSelections} - ${maxNumSelections} survivors`;

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
              onClick={() => handleOptionClick(survivor, (s) => s.id)}
              isSelected={selectedSurvivors.some((s) => s.id === survivor.id)}
              renderContent={(s) => (
                <div className='flex flex-col items-center space-y-1'>
                  <SurvivorImage
                    survivorId={s.id}
                    seasonId={48}
                    survivorName=''
                    className='w-full h-auto'
                  />
                  <p className='text-center'>
                    {s.firstName} {s.lastName}
                  </p>
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
