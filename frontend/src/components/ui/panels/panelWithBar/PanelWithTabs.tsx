import React from 'react';
import {
  ElementBackgroundColor,
  PanelBackgroundColor,
  TextPrimaryColor,
  HoverTextPrimarySelectedColor,
} from '../../../../styles/CommonColorClassNames';

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

const PanelWithTabs: React.FC<PanelProps> = ({
  tabs,
  defaultTab,
  className = '',
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].id);

  if (className === '') {
    className = PanelBackgroundColor;
  }
  return (
    <div className={`w-full ${className}`}>
      <div className={`flex ${ElementBackgroundColor}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.id
                ? `${TextPrimaryColor} border-b-2 border-text-primary`
                : ` ${HoverTextPrimarySelectedColor} `
            }
          `}
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
