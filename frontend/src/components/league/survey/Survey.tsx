import React from 'react';
import {
  CompletedLeagueMemberSurvey,
  LeagueMemberSurvey,
} from '../../../../generated-api';
import Picks from './picks/Picks';

interface SurveyProps {
  survey: CompletedLeagueMemberSurvey | LeagueMemberSurvey;
}

const Survey: React.FC<SurveyProps> = ({ survey }) => {
  console.log(survey);
  return <Picks picks={survey.picks} />;
};
export default Survey;
