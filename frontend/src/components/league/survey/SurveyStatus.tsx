import React from 'react';
import LoadingData from '../../ui/LoadingData';

interface surveyStatusProps {
  isCompleted: boolean;
  loading: boolean;
  error?: any;
}

const SurveyStatus: React.FC<surveyStatusProps> = ({
  isCompleted,
  loading,
  error,
}) => {
  if (loading) {
    return <LoadingData text='Loading Survey' />;
  }
  if (error) {
    return <div className='text-red-500'>Error loading survey</div>;
  }
  return (
    <div>
      {isCompleted ? (
        <span className='text-green-500'>Completed</span>
      ) : (
        <span className='text-red-500'>Not Completed</span>
      )}
    </div>
  );
};

export default SurveyStatus;
