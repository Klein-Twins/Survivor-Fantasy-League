import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface DrawerProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Drawer: React.FC<DrawerProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className='space-y-0'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center py-2 px-4 
          dark:bg-surface-a2-dark 
          dark:hover:bg-surface-a3-dark 
          transition-colors
          border-2 dark:border-surface-a3-dark
          ${isOpen ? 'rounded-t border-b-0' : 'rounded'}`}>
        <h2 className='text-2xl font-bold'>{title}</h2>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      <div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out 
    dark:bg-surface-a1-dark
    border-x-2 border-b-2 dark:border-surface-a3-dark
    ${isOpen ? 'rounded-b p-6 max-h-[1000px] opacity-100 space-y-4' : 'max-h-0 opacity-0 p-0'}`}>
          <div className='space-y-4'>{children}</div>
        </div>
      </div>
    </section>
  );
};

export default Drawer;
