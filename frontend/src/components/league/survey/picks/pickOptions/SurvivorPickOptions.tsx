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
      <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4'>
        {survivorOptions.map((survivor) => (
          <PickOption
            key={survivor.id}
            item={survivor}
            onClick={() => handleOptionClick(survivor, (s) => s.id)}
            isSelected={selectedSurvivors.some((s) => s.id === survivor.id)}
            renderContent={(s) => (
              <>
                <SurvivorImage
                  survivorId={s.id}
                  seasonId={48}
                  survivorName=''
                />
                <p className='text-center'>
                  {s.firstName} {s.lastName}
                </p>
              </>
            )}
          />
        ))}
      </div>
    </>
  );
};

export default SurvivorPickOptions;
