import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import HamburgerButton from './HamburgerButton';
import NavLinkButtons from './NavLinkButtons';
import NavAuthButtons from './NavAuthButtons';
import DarkModeToggle from '../ui/DarkModeToggle';

const Navbar: React.FC = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);

  const handleHamburgerClick = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  const handleLinkClick = () => {
    setIsHamburgerOpen(false);
  };

  return (
    //Header Container
    <header className={'px-4 py-4 relative dark:bg-surface-a1-dark dark:text-primary-a3-dark'}>
      <div className='flex items-center justify-between md:space-x-8 relative'>
        <div className='flex items-center justify-between flex-grow md:flex-none'>
          {/* Title Button */}
          <div className='flex-grow md:flex text-left '>
            <NavLink className={'text-xl font-bold dark:text-primary-a5-dark'} onClick={handleLinkClick} to='/'>
              SFL
            </NavLink>
          </div>
          {/* Hamburger Button */}
          <div className='absolute right-4 md:hidden'>
            <HamburgerButton isOpen={isHamburgerOpen} onClick={handleHamburgerClick} />
          </div>
        </div>
        {/* Dark Mode Toggle */}
        <DarkModeToggle />
        {/* Links on md+ size screens */}
        <div className='hidden md:flex md:w-full justify-between items-center'>
          <NavLinkButtons onClick={handleLinkClick} />
          <NavAuthButtons onClick={handleLinkClick} />
        </div>
      </div>
      {/* Links on small size screens */}
      {isHamburgerOpen && (
        <div className='flex flex-col my-4 md:my-0 md:hidden space-y-6'>
          <NavLinkButtons onClick={handleLinkClick} />
          <NavAuthButtons onClick={handleLinkClick} />
        </div>
      )}
    </header>
  );
};

export default Navbar;
