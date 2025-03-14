import React from 'react';
import { HorizontalLinePrimaryColors } from '../../../styles/CommonColorClassNames';

interface PanelProps {
  header: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ header, children, actions }) => {
  return (
    <div className='flex flex-col w-full rounded-md dark:bg-surface-a1-dark dark:text-primary-a1-dark bg-surface-a1-light text-primary-a1-light'>
      <div className='flex items-center justify-center relative py-4'>
        <h1 className='text-4xl font-bold'>{header}</h1>
        {actions && <div className='absolute right-4'>{actions}</div>}
      </div>
      <hr className={`w-full ${HorizontalLinePrimaryColors}`} />
      <div className='p-4'>{children}</div>
    </div>
  );
};

export default Panel;
