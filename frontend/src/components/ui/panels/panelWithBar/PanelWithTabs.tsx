import React from 'react';

interface TabConfig {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface PanelProps {
  tabs: TabConfig[];
  defaultTab?: string;
  className?: string;
}

const PanelWithTabs: React.FC<PanelProps> = ({ tabs, defaultTab, className = '' }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].id);

  return (
    <div className={`w-full dark:bg-surface-a2-dark ${className}`}>
      <div className='flex border-b border-border-primary dark:border-primary-a1-dark mb-4'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.id
                ? 'text-text-primary border-b-2 border-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.find((tab) => tab.id === activeTab)?.content}
    </div>
  );
};

export default PanelWithTabs;
