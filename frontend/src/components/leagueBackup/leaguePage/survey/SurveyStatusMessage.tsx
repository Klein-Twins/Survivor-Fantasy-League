import React from 'react';
import { FaExclamationTriangle, FaTimes, FaXing } from 'react-icons/fa';

interface SurveyStatusMessage {}

const SurveyStatusMessage: React.FC = ({}) => {
  const [showMessage, setShowMessage] = React.useState<boolean>(true);

  const handleXClick = () => {
    setShowMessage(false);
  };

  if (!showMessage) {
    return null;
  }
  return (
    <div className='w-full py-2 dark:bg-surface-a1-dark bg-surface-a1-light rounded-md relative'>
      <FaTimes
        onClick={handleXClick}
        className='absolute top-4 right-4 dark:text-amber-400 dark:hover:text-amber-600 text-orange-700 hover:text-orange-900 text-2xl'
      />
      <div className='flex flex-col space-y-2 items-center'>
        <div className='flex flex-row space-x-4 justify-center items-center'>
          <FaExclamationTriangle className='dark:text-amber-400 text-orange-700 text-4xl' />
          <h1 className='text-center text-xl dark:text-amber-400 text-orange-700'>
            Fill out the Episode 4 Survey before 7pm 3/19/2024
          </h1>
        </div>
        <button
          className={`py-2 px-4 dark:text-black dark:bg-amber-400 dark:hover:bg-amber-600 bg-orange-700 hover:bg-orange-900 text-white rounded-md`}>
          Go to Survey
        </button>
      </div>
    </div>
  );
};

export default SurveyStatusMessage;
