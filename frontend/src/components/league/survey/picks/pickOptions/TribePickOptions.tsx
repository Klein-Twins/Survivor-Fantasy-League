import { Pick, Tribe } from '../../../../../../generated-api';
import { usePickOptions } from '../../../../../hooks/survey/usePickOptions';
import TribeImage from '../../../../season/tribes/TribeImage';
import SurvivorImage from '../../../../ui/image/SurvivorImage';
import PickOption from './pickOption';

const TribePickOptions: React.FC<{ pick: Pick }> = ({ pick }) => {
  const minNumSelections = Math.max(1, pick.options.minNumSelections);
  const maxNumSelections = Math.max(
    minNumSelections,
    pick.options.maxNumSelections
  );
  const tribeOptions = pick.options.options as Tribe[];

  const { selectedItems: selectedTribes, handleOptionClick } =
    usePickOptions<Tribe>(minNumSelections, maxNumSelections);

  const selectableCountMessage =
    minNumSelections === maxNumSelections
      ? `Select ${minNumSelections} tribe(s)`
      : `Select ${minNumSelections} - ${maxNumSelections} tribes`;

  return (
    <>
      <div className='w-full'>
        <p className='text-center'>{selectableCountMessage}</p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {tribeOptions.map((tribe) => (
          <PickOption
            key={tribe.id}
            item={tribe}
            onClick={() => handleOptionClick(tribe, (t) => t.id)}
            isSelected={selectedTribes.some((t) => t.id === tribe.id)}
            renderContent={(t) => (
              <>
                <TribeImage tribeId={t.id} seasonId={48} />
                <p className='text-center'>{t.name}</p>
                <div id='survivorsInTribe' className='grid grid-cols-3 gap-2'>
                  {t.survivors.map((survivor) => (
                    <div
                      key={survivor.id}
                      className='flex flex-col items-center'>
                      <SurvivorImage
                        survivorId={survivor.id}
                        seasonId={tribe.seasonId as unknown as number}
                        survivorName=''
                        className='w-12 h-12'
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          />
        ))}
      </div>
    </>
  );
};

export default TribePickOptions;
