import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import seasonService from '../../services/season/seasonService';
import { GetSeasonsResponse } from '../../../generated-api';
import Season from './Season';
import {
  ElementBackgroundColor,
  PanelBackgroundColor,
} from '../../styles/CommonColorClassNames';

const SeasonList: React.FC = () => {
  const { data, execute, error } = useApi<void, void, GetSeasonsResponse>(
    seasonService.getSeasons
  );

  useEffect(() => {
    const fetchSeasons = async () => {
      await execute();
    };
    fetchSeasons();
  }, []);

  return (
    <div className={PanelBackgroundColor}>
      <h1>Season List</h1>
      {data && data.responseData && data.responseData.seasons && (
        <ul className='flex flex-col space-y-2'>
          {data?.responseData?.seasons.map((season) => (
            <li key={season.id} className={ElementBackgroundColor}>
              <Season season={season} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SeasonList;
