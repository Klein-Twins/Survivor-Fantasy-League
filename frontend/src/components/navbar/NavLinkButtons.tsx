import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './NavLinkButtons.module.css';

interface NavLinkButtonsProps {
    onClick : () => void
}

const NavLinkButtons: React.FC<NavLinkButtonsProps> = ({onClick}) => {
    return (
        <ul className="flex flex-col lg:flex-row justify-start items-center space-y-2 lg:space-y-0 lg:space-x-4 ">
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? styles.activeLink : styles.linkButton
                    }
                    onClick={onClick}
                >
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/survivor-cast"
                    className={({ isActive }) =>
                        isActive ? styles.activeLink : styles.linkButton
                    }
                    onClick={onClick}
                >
                    Survivor Cast
                </NavLink>
            </li>
        </ul>
    );
}

export default NavLinkButtons;