import React, { useState } from 'react';
import {
  CompletedLeagueMemberSurvey,
  LeagueMemberSurvey,
  Pick,
} from '../../../../generated-api';
import Picks, { PickView } from './picks/Picks';

interface SurveyProps {
  survey: CompletedLeagueMemberSurvey | LeagueMemberSurvey;
}

const Survey: React.FC<SurveyProps> = ({ survey }) => {
  const numPicks = survey.picks.length;
  const indices = survey.picks.map((_, index) => index);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <div className='flex h-full'>
      <div className='w-1/5 flex flex-col'>
        <PickSelection
          indices={indices}
          onClick={(index) => setSelectedIndex(index)}
        />
      </div>
      <div className='w-4/5 flex flex-col'>
        <PickView pick={survey.picks[selectedIndex]} />
      </div>
    </div>
  );
};

const PickSelection: React.FC<{
  indices: number[];
  onClick: (index: number) => void;
}> = ({ indices, onClick }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Track the selected index

  const backgroundColor =
    'dark:bg-surface-a4-dark bg-surface-a4-light text-white';

  return (
    <div
      className={`flex flex-col w-full h-full ${backgroundColor} p-4 rounded-l-lg`}>
      {indices.map((index) => {
        // Randomly generate true or false for isAnswered
        const isAnswered = Math.random() < 0.5;

        const isSelected = selectedIndex === index;

        return (
          <div
            key={index}
            className={`flex items-center p-2 mb-2 rounded-lg cursor-pointer transition-all ${
              isAnswered && isSelected
                ? 'bg-green-200'
                : isAnswered
                ? 'bg-green-100 hover:bg-green-200'
                : isSelected
                ? 'dark:bg-surface-a5-dark'
                : 'dark:bg-surface-a4-dark bg-surface-a4-light dark:hover:bg-surface-a5-dark'
            }`}
            onClick={() => {
              setSelectedIndex(index); // Update the selected index
              onClick(index);
            }}
            style={{
              width: '100%', // Ensure consistent width
              boxSizing: 'border-box', // Include padding and border in width
            }}>
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                isAnswered ? 'bg-green-500' : 'bg-gray-400'
              }`}>
              {isAnswered && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              )}
            </div>
            <span
              className={`font-medium ${
                isAnswered ? 'text-gray-800' : 'text-white'
              }`}>
              Pick {index + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
};
export default Survey;
