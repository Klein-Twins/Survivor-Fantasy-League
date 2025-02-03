import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../store/slices/modalSlice';
import { RootState } from '../../store/store';

import styles from './NavAuthButtons.module.css';
import ProfileButton from './ProfileButton';
import { ButtonPrimaryColors, ButtonSubtleColors } from '../../styles/CommonColorClassNames';

interface NavAuthButtonsProps {
  onClick: () => void;
}

const NavAuthButtons: React.FC<NavAuthButtonsProps> = ({ onClick }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleSignUpClick = () => {
    dispatch(openModal({ type: 'signup' }));
    onClick();
  };

  const handleLogInClick = () => {
    dispatch(openModal({ type: 'login' }));
    onClick();
  };

  const handleLogOutClick = () => {
    dispatch(openModal({ type: 'logout' }));
    onClick();
  };

  return (
    <>
      {!isAuthenticated ? (
        <div className='flex flex-row justify-center lg:justify-end items-center space-x-4'>
          <button onClick={handleLogInClick} className={`${ButtonSubtleColors} rounded-md transition py-2 px-4`}>
            Log In
          </button>
          <button onClick={handleSignUpClick} className={`${ButtonPrimaryColors} rounded-md transition py-2 px-4`}>
            Sign Up
          </button>
        </div>
      ) : (
        <ProfileButton onLogoutClick={handleLogOutClick} />
      )}
    </>
  );
};

export default NavAuthButtons;
