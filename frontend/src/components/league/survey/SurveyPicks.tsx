import React, { useState } from 'react';
import {
  CompletedLeagueMemberSurvey,
  LeagueMemberSurvey,
} from '../../../../generated-api';
import { PickView } from './picks/Picks';
import { SurveyPickChoicesMap } from './Survey';
import usePickOptions from '../../../hooks/survey/usePickOptions';
import { Button } from '@headlessui/react';
import { ButtonPrimaryColors } from '../../../styles/CommonColorClassNames';

interface SurveyPicksProps {
  survey: CompletedLeagueMemberSurvey | LeagueMemberSurvey;
  selectedChoices: Map<string, any[]>;
  setSurveySelectedChoices: React.Dispatch<
    React.SetStateAction<SurveyPickChoicesMap>
  >;
  onSubmit: () => void;
}
const SurveyPicks: React.FC<SurveyPicksProps> = ({
  survey,
  selectedChoices,
  setSurveySelectedChoices,
  onSubmit,
}) => {
  const numPicks = survey.picks.length;
  const indices = survey.picks.map((_, index) => index);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Manage pick selections for all picks
  const pickSelections = survey.picks.map((pick) =>
    usePickOptions({
      pickId: pick.id,
      minNumSelections: pick.options.minNumSelections,
      maxNumSelections: pick.options.maxNumSelections,
      selectedChoices,
      setSurveySelectedChoices,
    })
  );

  const isSurveyReadyToSubmit = pickSelections.every(
    (pickSelection) => pickSelection.isCompleted
  );

  return (
    <div className='flex flex-col h-full'>
      <div className='flex h-full'>
        <div className='w-1/5 flex flex-col space-y-0 dark:bg-surface-a4-dark bg-surface-a4-light text-white rounded-l-lg'>
          <Button
            disabled={!isSurveyReadyToSubmit}
            className={`${ButtonPrimaryColors} m-2 py-2 rounded-md`}
            onClick={onSubmit}>
            {isSurveyReadyToSubmit ? 'Submit' : 'Cannot Submit'}
          </Button>
          <PickSelection
            indices={indices}
            onClick={(index) => setSelectedIndex(index)}
            isCompleted={pickSelections.map(
              (selection) => selection.isCompleted
            )}
          />
        </div>
        <div className='w-4/5 flex flex-col'>
          <PickView
            pick={survey.picks[selectedIndex]}
            pickSelection={pickSelections[selectedIndex]}
          />
        </div>
      </div>
    </div>
  );
};
const PickSelection: React.FC<{
  indices: number[];
  onClick: (index: number) => void;
  isCompleted: boolean[]; // Array indicating whether each pick is completed
}> = ({ indices, onClick, isCompleted }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className={`flex flex-col w-full h-full p-4`}>
      {indices.map((index) => {
        const isSelected = selectedIndex === index;

        return (
          <div
            key={index}
            className={`flex items-center justify-between p-2 mb-2 rounded-lg cursor-pointer transition-all ${
              isSelected
                ? 'dark:bg-surface-a5-dark'
                : 'dark:bg-surface-a4-dark bg-surface-a4-light dark:hover:bg-surface-a5-dark'
            }`}
            onClick={() => {
              setSelectedIndex(index);
              onClick(index);
            }}>
            <div className='flex items-center space-x-2'>
              {/* Circle to the left of the text */}
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full ${
                  isCompleted[index]
                    ? 'bg-green-500 text-white'
                    : 'border-2 border-gray-400'
                }`}>
                {isCompleted[index] && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </div>
              {/* Text for the pick */}
              <span className='font-medium text-white'>Pick {index + 1}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SurveyPicks;
