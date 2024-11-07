import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from './Navbar.module.css';
import HamburgerButton from "./HamburgerButton";
import NavLinkButtons from "./NavLinkButtons";
import NavAuthButtons from "./NavAuthButtons";

const Navbar: React.FC = () => {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);

    const handleHamburgerClick = () => {
        setIsHamburgerOpen(!isHamburgerOpen);
    };

    const handleLinkClick = () => {
        setIsHamburgerOpen(false);
    }

    return (
        <header className={styles.header}>
            <div className="flex items-center justify-between lg:space-x-8 relative">
                <div className="flex items-center justify-between flex-grow lg:flex-none">
                    <div className="flex-grow lg:flex text-left">
                        <NavLink className={styles.title} onClick={handleLinkClick} to="/">Survivor Fantasy League</NavLink>
                    </div>
                    <div className="absolute right-4 lg:hidden">
                        <HamburgerButton isOpen={isHamburgerOpen} onClick={handleHamburgerClick} />
                    </div>
                </div>
                <div className="hidden lg:flex lg: w-full justify-between items-center">
                    <NavLinkButtons onClick={handleLinkClick}/>
                    <NavAuthButtons onClick={handleLinkClick}/>
                </div>
            </div>
            {isHamburgerOpen && (
                <div className="flex flex-col my-4 lg:my-0 lg:hidden space-y-6">
                    <NavLinkButtons onClick={handleLinkClick}/>
                    <NavAuthButtons onClick={handleLinkClick}/>
                </div>
            )}
        </header>
    );
}

export default Navbar;