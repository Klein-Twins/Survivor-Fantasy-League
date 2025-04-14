import React from 'react';
import {
  Episode,
  League,
  LeagueMemberSurvey,
  Profile,
} from '../../../../generated-api';
import LoadingData from '../../ui/LoadingData';
import useSurvey from '../../../hooks/survey/useSurvey';
import PickSwiper from './picks/PickSwiper';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface SurveyProps {
  survey: LeagueMemberSurvey;
}

export type SurveyPickChoicesMap = Map<string, any[]>;
const Survey: React.FC<SurveyProps> = ({ survey }) => {
  const {
    playerChoices,
    setPlayerChoices,
    handleSubmit: handleSurveySubmit,
    allPicksCompleted,
    handleOptionClick,
  } = useSurvey({ survey });

  return (
    <div className='w-full flex flex-col space-y-0'>
      <PickSwiper
        survey={survey}
        playerChoices={playerChoices}
        setPlayerChoices={setPlayerChoices}
        handleOptionClick={handleOptionClick}
        handleSurveySubmit={handleSurveySubmit}
        allPicksCompleted={allPicksCompleted}
      />
    </div>
  );
};

export default Survey;
