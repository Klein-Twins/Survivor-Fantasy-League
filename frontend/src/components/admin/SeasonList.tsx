import React from 'react';
import Season from './Season';
import {
  ElementBackgroundColor,
  PanelBackgroundColor,
} from '../../styles/CommonColorClassNames';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const SeasonList: React.FC = () => {
  useSelector((state: RootState) => state.season);
  const seasonState = useSelector((state: RootState) => state.season);

  return (
    <div className={PanelBackgroundColor}>
      <h1>Season List</h1>
      {seasonState.seasons && seasonState.seasons.length > 0 && (
        <ul>
          {seasonState.seasons.map((season) => {
            return (
              <li key={season.id} className={ElementBackgroundColor}>
                <Season season={season} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SeasonList;
