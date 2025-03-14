import React, { useState } from 'react';
import { Episode, Season, Survivor, Tribe } from '../../../../../generated-api';
import { FaFireAlt, FaSkull } from 'react-icons/fa';
import SurvivorImage from '../../../ui/image/SurvivorImage';
import {
  ButtonPrimaryColors,
  CardBgColor,
} from '../../../../styles/CommonColorClassNames';
import { Button } from '@headlessui/react';

interface SurvivorRowProps {
  survivor: Survivor;
  seasonId: Season['id'];
  cardSizing?: SurvivorCardSizing;
}

interface SurvivorCardSizing {
  infoSectionWidth: string;
  infoAndSpoilerWidth: string;
}

const SurvivorRow: React.FC<SurvivorRowProps> = ({
  survivor,
  seasonId,
  cardSizing = {
    infoAndSpoilerWidth: 'w-[40rem]',
    infoSectionWidth: 'w-[20rem]',
  },
}) => {
  const [showSpoiler, setShowSpoiler] = useState<boolean>(false);

  const survivorName = formatSurvivorName(survivor);
  const survivorHomeTown = formatSurvivorHomeTown(survivor);

  const cardWidth = showSpoiler
    ? cardSizing.infoAndSpoilerWidth
    : cardSizing.infoSectionWidth;

  const survivorInfoSection = (
    <div
      className={`flex flex-col space-y-4 items-center rounded-sm ${
        showSpoiler ? 'w-1/2' : 'w-full'
      }`}
      id='survivor-info-section'>
      <SurvivorImage
        className={`${cardSizing.infoSectionWidth} h-56 `}
        survivorId={survivor.survivorId}
        seasonId={seasonId}
        survivorName={survivor.firstName}
      />
      <div className='flex flex-col items-center pb-4'>
        <p className='text-xl font-bold'>{survivorName}</p>
        <p className='text-lg'>Home Town: {survivorHomeTown}</p>
        <p className='text-lg'>Age: {survivor.age}</p>
        <p className='text-lg'>Occupation: {survivor.job}</p>
      </div>
    </div>
  );

  const survivorSpoilerSection = (
    <div className={`${showSpoiler ? 'w-1/2' : 'hidden'} flex flex-col p-2`}>
      {<SurvivorTorchStatus isTorchSnuffed={false} />}
    </div>
  );

  return (
    <div
      id='card-and-spoiler-button'
      className={`flex flex-col justify-between items-center ${cardWidth} ${CardBgColor}`}>
      <div id='survivor-card' className={`flex flex-row w-full`}>
        {survivorInfoSection}
        {showSpoiler && survivorSpoilerSection}
      </div>
      <Button
        onClick={() => setShowSpoiler(!showSpoiler)}
        className={`w-full py-2 text-center dark:bg-white bg-surface-a5-light ${
          showSpoiler ? 'w-[40rem]' : 'w-[20rem]'
        }`}>
        {showSpoiler ? 'Show Spoiler' : 'Hide Spoiler'}
      </Button>
    </div>
  );
};

type SurvivorEliminatedStatus =
  | {
      isEliminated: false;
      isJury: undefined;
      votedOutOrder: undefined;
      juryMemberOrder: undefined;
    }
  | {
      isEliminated: true;
      isJury: false;
      votedOutOrder: number;
      juryMemberOrder: undefined;
    }
  | {
      isEliminated: true;
      isJury: true;
      votedOutOrder: number;
      juryMemberOrder: number;
    };

type SurvivorStatus = {
  elimiationStatus: SurvivorEliminatedStatus;
  numVotes: number;
  tribeHistory: TribeHistory[];
};

type TribeHistory =
  | {
      tribe: Tribe;
      startEpisode: Episode['id'];
    }
  | {
      startEpisode: Episode['id'];
    };

type Challenge = {};

const SurvivorTorchStatus: React.FC<{ isTorchSnuffed: boolean }> = ({
  isTorchSnuffed,
}) => {
  const torchStatus = isTorchSnuffed ? (
    <div className='flex space-x-2 items-center'>
      <p>Snuffed</p>
      <FaSkull className='text-2xl text-red-500' />
    </div>
  ) : (
    <div className='flex space-x-2 items-center'>
      <p>Lit</p>
      <FaFireAlt className='text-2xl text-red-500' />
    </div>
  );
  return (
    <div className='flex flex-row items-center space-x-6 text-left w-full'>
      <p className='text-lg font-semibold'>Torch Status:</p>
      {torchStatus}
    </div>
  );
};

function formatSurvivorName(survivor: Survivor) {
  return `${survivor.firstName} ${survivor.lastName}`;
}
function formatSurvivorHomeTown(survivor: Survivor) {
  if (survivor.fromState) {
    return `${survivor.fromCity}, ${survivor.fromState}`;
  } else if (!survivor.fromState && survivor.fromCountry !== 'US') {
    return `${survivor.fromCity}, ${survivor.fromCountry}`;
  }

  return `${survivor.fromCity}, ${survivor.fromCountry}, ${survivor.fromCountry}`;
}

export default SurvivorRow;
