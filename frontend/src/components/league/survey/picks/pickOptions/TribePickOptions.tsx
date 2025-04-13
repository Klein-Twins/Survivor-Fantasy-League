import { Pick, Tribe } from '../../../../../../generated-api';
import TribeImage from '../../../../season/tribes/TribeImage';
import SurvivorImage from '../../../../ui/image/SurvivorImage';
import PickOption from './pickOption';

const TribePickOptions: React.FC<{
  pick: Pick;
  pickSelection: {
    selectedItems: any[];
    handleOptionClick: (item: any, getId: (item: any) => string) => void;
    isCompleted: boolean;
  };
  disabled?: boolean;
}> = ({ pick, pickSelection, disabled = false }) => {
  const tribeOptions = pick.options.options as Tribe[];

  const selectableCountMessage =
    pick.options.minNumSelections === pick.options.maxNumSelections
      ? `Select ${pick.options.minNumSelections} tribe(s)`
      : `Select ${pick.options.minNumSelections} - ${pick.options.maxNumSelections} tribes`;

  return (
    <>
      <div className='w-full'>
        <p className='text-center'>{selectableCountMessage}</p>
      </div>
      <div className='flex flex-col justify-center items-stretch space-y-2'>
        {tribeOptions.map((tribe) => (
          <PickOption
            key={tribe.id}
            item={tribe}
            onClick={
              !disabled
                ? () => pickSelection.handleOptionClick(tribe, (t) => t.id)
                : undefined // Disable onClick if survey is submitted
            }
            isSelected={pickSelection.selectedItems.some(
              (t) => t.id === tribe.id
            )}
            renderContent={(t) => (
              <>
                <TribeImage tribeId={t.id} seasonId={48} />
                <p className='text-center'>{t.name}</p>
                <div
                  id='survivorsInTribe'
                  className='flex space-x-1 items-center'>
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
