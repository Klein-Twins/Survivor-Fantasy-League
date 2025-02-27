import React, { useState } from 'react';
import SeasonList from './SeasonList';
import CreateSeasonForm from './createSeasonForm';
import PanelWithTabs from '../ui/panels/panelWithBar/PanelWithTabs';
import { PanelBackgroundColor } from '../../styles/CommonColorClassNames';

const SeasonPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'all' | 'create'>(
    'active'
  );

  const tabs = [
    {
      id: 'active',
      label: 'Active Season',
      content: <h1>Placeholder for Active Season</h1>,
    },
    {
      id: 'all',
      label: 'All Seasons',
      content: <SeasonList />,
    },
    {
      id: 'create',
      label: 'Create Season',
      content: <CreateSeasonForm />,
    },
  ];
  return (
    <div className={`${PanelBackgroundColor}`}>
      <PanelWithTabs tabs={tabs} />
    </div>
  );
};

export default SeasonPanel;
