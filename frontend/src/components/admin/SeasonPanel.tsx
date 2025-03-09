import React, { useState } from 'react';
import SeasonList from './SeasonList';
import PanelWithTabs from '../ui/panels/panelWithBar/PanelWithTabs';
import { PanelBackgroundColor } from '../../styles/CommonColorClassNames';
import CreateSeasonForm from './CreateSeasonForm';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { openModal } from '../../store/slices/modalSlice';

const SeasonPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState<'active' | 'all' | 'create'>(
    'active'
  );

  const handlePlusClick = () => {
    dispatch(openModal({ type: 'createSeason' }));
  };

  const tabs = [
    {
      id: 'all',
      label: 'All Seasons',
      content: <SeasonList />,
    },
  ];
  return (
    <div className={`${PanelBackgroundColor}`}>
      <PanelWithTabs tabs={tabs} addButton handlePlusClick={handlePlusClick} />
    </div>
  );
};

export default SeasonPanel;
