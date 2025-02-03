import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './NavLinkButtons.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ButtonPrimaryColors, ButtonPrimaryTextColor, ButtonSubtleTextColor } from '../../styles/CommonColorClassNames';

interface NavLinkButtonsProps {
  onClick: () => void;
}

const NavLinkButtons: React.FC<NavLinkButtonsProps> = ({ onClick }) => {
  const isAuthenticated: boolean = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <ul className='flex flex-col md:flex-row justify-start items-center space-y-2 md:space-y-0 md:space-x-4 '>
      <li>
        <NavLink
          to='/'
          className={({ isActive }) =>
            isActive
              ? `${styles.activeLink} ${ButtonPrimaryTextColor}`
              : `${styles.linkButton} ${ButtonSubtleTextColor}`
          }
          onClick={onClick}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to='/survivor-cast'
          className={({ isActive }) =>
            isActive
              ? `${styles.activeLink} ${ButtonPrimaryTextColor}`
              : `${styles.linkButton} ${ButtonSubtleTextColor}`
          }
          onClick={onClick}>
          Survivor Cast
        </NavLink>
      </li>
      {/* {isAuthenticated && (
                <li>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => 
                            isActive ? styles.activeLink : styles.linkButton
                        }
                        onClick={onClick}
                    >
                        Dashboard
                    </NavLink>
                </li>
            )} */}
      <li>
        <NavLink
          to='/about'
          className={({ isActive }) =>
            isActive
              ? `${styles.activeLink} ${ButtonPrimaryTextColor}`
              : `${styles.linkButton} ${ButtonSubtleTextColor}`
          }
          onClick={onClick}>
          Meet the Developer
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinkButtons;
