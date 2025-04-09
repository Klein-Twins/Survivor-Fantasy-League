import React, { useState } from 'react';
import {
  CompletedLeagueMemberSurvey,
  LeagueMemberSurvey,
} from '../../../../generated-api';
import { usePickOptions } from '../../../hooks/survey/usePickOptions';
import { PickView } from './picks/Picks';
import { SurveyPickChoicesMap } from './Survey';

interface SurveyPicksProps {
  survey: CompletedLeagueMemberSurvey | LeagueMemberSurvey;
  selectedChoices: Map<string, any[]>;
  setSurveySelectedChoices: React.Dispatch<
    React.SetStateAction<SurveyPickChoicesMap>
  >;
}

const SurveyPicks: React.FC<SurveyPicksProps> = ({ survey }) => {
  const numPicks = survey.picks.length;
  const indices = survey.picks.map((_, index) => index);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Manage pick selections for all picks
  const pickSelections = survey.picks.map((pick) =>
    usePickOptions(pick.options.minNumSelections, pick.options.maxNumSelections)
  );

  const allPicksCompleted = pickSelections.every(
    (selection) => selection.isCompleted
  );

  const handleSubmit = () => {
    if (!allPicksCompleted) {
      alert('Please complete all picks before submitting.');
      return;
    }

    console.log(
      'All picks:',
      pickSelections.map((s) => s.selectedItems)
    );
    alert('Survey submitted successfully!');
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='flex h-full'>
        <div className='w-1/5 flex flex-col'>
          <PickSelection
            indices={indices}
            onClick={(index) => setSelectedIndex(index)}
          />
        </div>
        <div className='w-4/5 flex flex-col'>
          <PickView
            pick={survey.picks[selectedIndex]}
            pickSelection={pickSelections[selectedIndex]}
          />
        </div>
      </div>
      <div className='mt-4 flex justify-center'>
        <button
          className={`px-4 py-2 rounded ${
            allPicksCompleted
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
          disabled={!allPicksCompleted}>
          Submit
        </button>
      </div>
    </div>
  );
};

const PickSelection: React.FC<{
  indices: number[];
  onClick: (index: number) => void;
}> = ({ indices, onClick }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const backgroundColor =
    'dark:bg-surface-a4-dark bg-surface-a4-light text-white';

  return (
    <div
      className={`flex flex-col w-full h-full ${backgroundColor} p-4 rounded-l-lg`}>
      {indices.map((index) => {
        const isSelected = selectedIndex === index;

        return (
          <div
            key={index}
            className={`flex items-center p-2 mb-2 rounded-lg cursor-pointer transition-all ${
              isSelected
                ? 'dark:bg-surface-a5-dark'
                : 'dark:bg-surface-a4-dark bg-surface-a4-light dark:hover:bg-surface-a5-dark'
            }`}
            onClick={() => {
              setSelectedIndex(index);
              onClick(index);
            }}>
            <span className='font-medium text-white'>Pick {index + 1}</span>
          </div>
        );
      })}
    </div>
  );
};

export default SurveyPicks;
