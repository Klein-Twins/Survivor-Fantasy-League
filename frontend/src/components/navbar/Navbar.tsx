import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import HamburgerButton from './HamburgerButton';
import NavLinkButtons from './NavLinkButtons';
import NavAuthButtons from './NavAuthButtons';
import DarkModeToggle from '../ui/DarkModeToggle';
import { NavBarColor } from '../../styles/CommonColorClassNames';

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
    <header
      className={`px-4 py-4 relative ${NavBarColor} dark:text-primary-a3-dark`}>
      <div className='flex items-center justify-between md:space-x-8 relative'>
        <div className='flex flex-row items-center justify-between flex-grow md:flex-none'>
          <div className='flex flex-row justify-start space-x-4 items-center'>
            {/* Title Button */}
            <div className='flex-grow md:flex text-left '>
              <NavLink
                className={'text-xl font-bold dark:text-primary-a5-dark'}
                onClick={handleLinkClick}
                to='/'>
                <img src='/SFLLogoDark.jpeg' className='h-12 object-contain' />
              </NavLink>
            </div>
            <DarkModeToggle />
          </div>
          {/* Hamburger Button */}
          <div className='absolute right-4 md:hidden'>
            <HamburgerButton
              isOpen={isHamburgerOpen}
              onClick={handleHamburgerClick}
            />
          </div>
        </div>

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
