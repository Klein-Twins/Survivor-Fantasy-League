import React, { useEffect, useState } from 'react';
import {
  Color,
  Episode,
  GetSurveyForEpisodeForLeagueMember,
  League,
  Pick,
  PickOptionTypeEnum,
  Profile,
  Survivor,
  Tribe,
} from '../../../../generated-api';
import { useApi } from '../../../hooks/useApi';
import leagueSurveyService, {
  GetLeagueSurveyParams,
} from '../../../services/league/leagueSurveyService';
import { Button } from '@headlessui/react';
import { ButtonPrimaryColors } from '../../../styles/CommonColorClassNames';
import SurvivorImage from '../../ui/image/SurvivorImage';
import TribeView from '../../season/tribes/TribeView';

interface SurveyFormProps {
  episodeId: Episode['id'];
  profileId: Profile['profileId'];
  leagueId: League['leagueId'];
}

const SurveyForm: React.FC<SurveyFormProps> = ({
  episodeId,
  profileId,
  leagueId,
}) => {
  const {
    data: leagueSurvey,
    isLoading,
    error,
    execute,
  } = useApi<void, GetLeagueSurveyParams, GetSurveyForEpisodeForLeagueMember>(
    leagueSurveyService.getLeagueSurvey
  );

  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchSurvey() {
      await execute({
        queryParams: {
          episodeId,
          leagueId,
          profileId,
        },
      });
    }
    fetchSurvey();
  }, [episodeId, leagueId, profileId]);

  useEffect(() => {
    if (leagueSurvey) {
      const initialValues =
        leagueSurvey.responseData.leagueSurveys[0].picks.reduce((acc, pick) => {
          acc[pick.id] = '';
          return acc;
        }, {} as Record<string, string>);
      setFormValues(initialValues);
    }
  }, [leagueSurvey]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error || !leagueSurvey) {
    return <h1>Error: {error}</h1>;
  }

  const picks: Pick[] = leagueSurvey.responseData.leagueSurveys[0].picks;

  return (
    <div className='flex flex-col space-y-4 px-4'>
      {picks.map((pick) => {
        return <FormPickInput key={pick.id} pick={pick} />;
      })}
    </div>
  );
};

export default SurveyForm;

interface FormPickInputProps {
  pick: Pick;
}
const FormPickInput: React.FC<FormPickInputProps> = ({ pick }) => {
  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold text-center'>{pick.description} </h2>
        <h2 className='text-2xl'>Points: {pick.numPointsWorth}</h2>
      </div>
      <div className='container px-8 mx-auto'>
        <FormPickOptions
          pickOptionType={pick.pickOptionType}
          pickOptions={pick.pickOptions}
        />
      </div>
    </div>
  );
};

interface FormPickOptionsProps {
  pickOptionType: Pick['pickOptionType'];
  pickOptions: Pick['pickOptions'];
}

const FormPickOptions: React.FC<FormPickOptionsProps> = ({
  pickOptionType,
  pickOptions,
}) => {
  switch (pickOptionType) {
    case PickOptionTypeEnum.Binary:
      return <BinaryPickOptions pickOptions={pickOptions} />;
    case PickOptionTypeEnum.Color:
      return <ColorPickOptions colors={pickOptions.options as Color[]} />;
    case PickOptionTypeEnum.Survivor:
      return (
        <SurvivorPickOptions survivors={pickOptions.options as Survivor[]} />
      );
    case PickOptionTypeEnum.Tribe:
      return <TribePickOptions tribes={pickOptions.options as Tribe[]} />;
    default:
      return null;
  }
};

const BinaryPickOptions: React.FC<{ pickOptions: Pick['pickOptions'] }> = ({
  pickOptions,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  return (
    <div className='flex space-x-4 justify-center'>
      <Button className={`w-1/2 p-2 rounded-md ${ButtonPrimaryColors}`}>
        Yes
      </Button>
      <Button className={`w-1/2 p-2 rounded-md ${ButtonPrimaryColors}`}>
        No
      </Button>
    </div>
  );
};

const ColorPickOptions: React.FC<{ colors: Color[] }> = ({ colors }) => {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  return (
    <div className='flex flex-row space-x-4 items-center justify-between'>
      {colors.map((color) => {
        let isSelected = false;
        if (selectedColor && selectedColor.hex === color.hex) {
          isSelected = true;
        }

        return (
          <div
            key={color.hex + '_' + Math.random()}
            className={`flex items-center justify-center w-full h-24 rounded-md ${
              isSelected ? 'opacity-75' : ''
            }`}
            style={{ backgroundColor: color.hex }}
            onClick={() => setSelectedColor(color)}>
            <p
              className={`text-black font-bold ${
                isSelected ? 'underline' : ''
              }`}>
              {color.color}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const SurvivorPickOptions: React.FC<{ survivors: Survivor[] }> = ({
  survivors,
}) => {
  const [selectedSurvivorId, setSelectedSurvivorId] = useState<
    Survivor['survivorId'] | null
  >(null);

  const selectedStyle = 'bg-white';

  return (
    <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4'>
      {survivors.map((survivor) => {
        return (
          <div
            className={`flex flex-col items-center rounded-md ${
              survivor.survivorId === selectedSurvivorId ? selectedStyle : ''
            }`}
            onClick={() => setSelectedSurvivorId(survivor.survivorId)}>
            <SurvivorImage
              seasonId={47}
              survivorName={survivor.firstName}
              key={survivor.survivorId}
              survivorId={survivor.survivorId}
              className='w-16 h-16'
            />
            <div className='flex flex-col font-semibold text-center mt-2'>
              <h2>{survivor.firstName}</h2>
              <h2>{survivor.lastName}</h2>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TribePickOptions: React.FC<{ tribes: Tribe[] }> = ({ tribes }) => {
  const preMergeTribes = tribes.filter((tribe) => !tribe.isMergeTribe);

  return (
    <div className='flex flex-row items-center justify-between space-x-4'>
      {preMergeTribes.map((tribe) => {
        return <TribeView key={tribe.id} tribe={tribe} />;
      })}
    </div>
  );
};
