import React, { useState } from 'react';
import { ButtonPrimaryColors } from '../../styles/CommonColorClassNames';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button onClick={onClick} className='flex flex-col items-center justify-center w-10 h-10 focus:outline-none'>
      <span
        className={`${ButtonPrimaryColors} h-[.125rem] w-full transition-transform duration-300 ease-in-out ${
          isOpen ? 'transform translate-y-1.5 rotate-45' : ''
        }`}
      />
      <span
        className={`${ButtonPrimaryColors} h-[.125rem] w-full transition-opacity duration-300 ease-in-out my-1 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`${ButtonPrimaryColors} h-[.125rem] w-full transition-transform duration-300 ease-in-out ${
          isOpen ? 'transform -translate-y-1.5 -rotate-45' : ''
        }`}
      />
    </button>
  );
};

export default HamburgerButton;
