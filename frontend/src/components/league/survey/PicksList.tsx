import React from 'react';
import { Pick, SurveyAvailabilityStatusEnum, SurveySubmissionStatusEnum } from '../../../../generated-api';
import PickItem from './PickItem';

interface PicksListProps {
  picks: Pick[];
  submissionStatus: SurveySubmissionStatusEnum;
  availabilityStatus: SurveyAvailabilityStatusEnum;
}

const PicksList: React.FC<PicksListProps> = ({ picks, submissionStatus, availabilityStatus }) => {
  return (
    <>
      <div className='flex flex-col w-full space-y-2 items-center'>
        <h2 className='text-center text-3xl font-bold'>Your Survey</h2>
        <h2>Submission Status: {submissionStatus}</h2>
        <h2>Availability Status: {availabilityStatus}</h2>
        {picks.map((pick) => {
          return <PickItem key={pick.id} pick={pick} />;
        })}
      </div>
    </>
  );
};

export default PicksList;
