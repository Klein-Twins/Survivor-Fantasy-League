import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import PanelWithTabs from '../../ui/panels/panelWithBar/PanelWithTabs';
import { PanelBackgroundColor } from '../../../styles/CommonColorClassNames';
import LeaguesList from './LeaguesList';
import LeagueInvitesList from './LeagueInvitesList';

export const LeaguesPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leagues' | 'invites' | 'create'>(
    'leagues'
  );
  const className = 'dark:bg-surface-a2-dark';

  const tabs = [
    {
      id: 'leagues',
      label: 'My Leagues',
      content: <LeaguesList />,
    },
    {
      id: 'invites',
      label: 'League Invites',
      content: <LeagueInvitesList />,
    },
  ];
  return (
    <div className={`${PanelBackgroundColor}`}>
      <PanelWithTabs tabs={tabs} className={className} />
    </div>
  );
};
