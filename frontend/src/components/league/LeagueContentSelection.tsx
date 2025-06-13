import { Button } from '@headlessui/react';
import { useState } from 'react';

export type LeagueContentTabSelection = 'summary' | 'leagueMembers' | 'surveys';

interface LeagueContentSelectionProps {
  selectedTab: LeagueContentTabSelection;
  onTabChange: (tab: LeagueContentTabSelection) => void;
}

function LeagueContentSelection({
  selectedTab,
  onTabChange,
}: LeagueContentSelectionProps) {
  return (
    <div className='flex w-full space-x-4 justify-center'>
      <Button
        onClick={() => onTabChange('summary')}
        className={`w-1/3 py-2 rounded-lg transition 
            ${
              selectedTab === 'summary'
                ? 'bg-blue-500 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}>
        Summary
      </Button>
      <Button
        onClick={() => onTabChange('leagueMembers')}
        className={`w-1/3 py-2 rounded-lg transition 
            ${
              selectedTab === 'leagueMembers'
                ? 'bg-blue-500 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}>
        League Members
      </Button>
      <Button
        onClick={() => onTabChange('surveys')}
        className={`w-1/3 py-2 rounded-lg transition 
            ${
              selectedTab === 'surveys'
                ? 'bg-blue-500 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}>
        Surveys
      </Button>
    </div>
  );
}

export default LeagueContentSelection;
