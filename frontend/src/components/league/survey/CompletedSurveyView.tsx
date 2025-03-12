import React from 'react';
import {
  Color,
  ColorPickOptions,
  CompletedLeagueSurvey,
  Pick,
  PickOptionTypeEnum,
  PickSelection,
  Survivor,
  SurvivorPickOptions,
  Tribe,
  TribePickOptions,
} from '../../../../generated-api';
import SurvivorImage from '../../ui/image/SurvivorImage';
import TribeImage from '../../season/tribes/TribeImage';

interface CompletedSurveyViewProps {
  survey: CompletedLeagueSurvey;
}

const CompletedSurveyView: React.FC<CompletedSurveyViewProps> = ({
  survey,
}) => {
  return (
    <div className='flex flex-col space-y-4'>
      {survey.pickSelections.map((pickSelection) => {
        const foundPick = survey.picks.find(
          (pick) => pick.id === pickSelection.pickId
        );
        if (!foundPick) {
          return null;
        }
        return (
          <CompletedPickView pick={foundPick} pickSelection={pickSelection} />
        );
      })}
    </div>
  );
};

interface CompletedPickViewProps {
  pick: Pick;
  pickSelection: PickSelection;
}

const CompletedPickView: React.FC<CompletedPickViewProps> = ({
  pick,
  pickSelection,
}) => {
  let pickSelectionView;

  if (pick.pickOptionType === PickOptionTypeEnum.Binary) {
    pickSelectionView = (
      <BinaryPickView pick={pick} pickSelection={pickSelection} />
    );
  } else if (pick.pickOptionType === PickOptionTypeEnum.Color) {
    pickSelectionView = (
      <ColorPickView pick={pick} pickSelection={pickSelection} />
    );
  } else if (pick.pickOptionType === PickOptionTypeEnum.Survivor) {
    pickSelectionView = (
      <SurvivorPickView pick={pick} pickSelection={pickSelection} />
    );
  } else if (pick.pickOptionType === PickOptionTypeEnum.Tribe) {
    pickSelectionView = (
      <TribePickView pick={pick} pickSelection={pickSelection} />
    );
  }

  return (
    <div className='flex flex-col space-y-2 text-center'>
      <h1 className='text-2xl'>{pick.description}</h1>
      <div className='w-1/3 mx-auto'>{pickSelectionView}</div>
    </div>
  );
};

interface TribePickViewProps {
  pick: Pick;
  pickSelection: PickSelection;
}

const TribePickView: React.FC<TribePickViewProps> = ({
  pick,
  pickSelection,
}) => {
  const tribe: Tribe | undefined = (
    pick.pickOptions as TribePickOptions
  ).options.find((option) => option.id === pickSelection.playerChoice);
  if (!tribe) {
    return <h1>Not found</h1>;
  }
  return (
    <div className={`w-full rounded-md`}>
      <TribeImage
        seasonId={47}
        tribeId={pickSelection.playerChoice}
        className={`h-32 w-32 mx-auto`}
      />
    </div>
  );
};

interface SurvivorPickViewProps {
  pick: Pick;
  pickSelection: PickSelection;
}

const SurvivorPickView: React.FC<SurvivorPickViewProps> = ({
  pick,
  pickSelection,
}) => {
  const survivor: Survivor | undefined = (
    pick.pickOptions as SurvivorPickOptions
  ).options.find((option) => option.survivorId === pickSelection.playerChoice);
  if (!survivor) {
    return <h1>Not found</h1>;
  }
  return (
    <div className={`w-full rounded-md`}>
      <SurvivorImage
        className={`h-32 w-32 mx-auto`}
        seasonId={47}
        survivorId={pickSelection.playerChoice}
        survivorName={survivor.firstName + ' ' + survivor.lastName}
      />
    </div>
  );
};

interface BinaryPickViewProps {
  pick: Pick;
  pickSelection: PickSelection;
}

const BinaryPickView: React.FC<BinaryPickViewProps> = ({
  pick,
  pickSelection,
}) => {
  return (
    <div
      className={`w-full py-4 rounded-md dark:bg-surface-a3-dark bg-surface-a3-light`}>
      <p className={`text-black font-bold`}>{pickSelection.playerChoice}</p>
    </div>
  );
};

interface ColorPickViewProps {
  pick: Pick;
  pickSelection: PickSelection;
}

const ColorPickView: React.FC<ColorPickViewProps> = ({
  pick,
  pickSelection,
}) => {
  const color: Color | undefined = (
    pick.pickOptions as ColorPickOptions
  ).options.find((option) => option.hex === pickSelection.playerChoice);
  if (!color) {
    return <h1>Not found</h1>;
  }
  return (
    <div
      key={color.hex + '_' + Math.random()}
      className={`w-full py-4 rounded-md`}
      style={{
        backgroundColor: color.hex,
      }}>
      <p className={`text-black font-bold`}>{color.color}</p>
    </div>
  );
};

export default CompletedSurveyView;
