import React, { useState } from 'react';
import PanelWithTabs from '../../ui/panels/panelWithBar/PanelWithTabs';
import { PanelBackgroundColor } from '../../../styles/CommonColorClassNames';
import LeaguesList from './LeaguesList';
import LeagueInvitesList from './LeagueInvitesList';
import CreateLeagueForm from './CreateLeagueForm';

export const LeaguesPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leagues' | 'invites' | 'create'>(
    'leagues'
  );

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
    {
      id: 'createLeague',
      label: 'Create League',
      content: <CreateLeagueForm />,
    },
  ];
  return (
    <div className={`${PanelBackgroundColor}`}>
      <PanelWithTabs tabs={tabs} />
    </div>
  );
};
