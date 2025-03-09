import React from 'react';
import {
  ElementBackgroundColor,
  PanelBackgroundColor,
  TextPrimaryColor,
  HoverTextPrimarySelectedColor,
  HorizontalLineMutedColors,
  HorizontalLinePrimaryColors,
  ButtonPrimaryColors,
  ButtonCheckColors,
} from '../../../../styles/CommonColorClassNames';
import { FaPlusCircle } from 'react-icons/fa';
interface TabConfig {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface PanelProps {
  tabs: TabConfig[];
  defaultTab?: string;
  className?: string;
  justifyBetween?: boolean;
  addButton?: boolean;
  handlePlusClick?: () => void;
}

const PanelWithTabs: React.FC<PanelProps> = ({
  tabs,
  defaultTab,
  className = '',
  justifyBetween = false,
  addButton = false,
  handlePlusClick = () => {},
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].id);

  const justifyBetweenClassName = justifyBetween ? 'justify-between' : '';
  if (justifyBetween) {
  }

  if (className === '') {
    className = PanelBackgroundColor;
  }
  return (
    <div className={`w-full ${className}`}>
      <div className='flex items-center justify-between'>
        <div className={`flex ${ElementBackgroundColor} justify-start`}>
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
        {addButton && (
          <button className='flex items-center pr-2'>
            <FaPlusCircle
              className={`text-2xl ${ButtonCheckColors}`}
              onClick={handlePlusClick}
            />
          </button>
        )}
      </div>
      <hr className={`${HorizontalLinePrimaryColors}`} />
      {tabs.find((tab) => tab.id === activeTab)?.content}
    </div>
  );
};

export default PanelWithTabs;
