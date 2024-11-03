import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <header>
            <nav className="flex items-center justify-between">
                <NavLink to="/">Home</NavLink>
                <ul className="flex space-x-4 items-center justify-center">
                    <li>
                        <NavLink to="/survivor-cast">Survivor Cast</NavLink>
                    </li>
                    <li>
                        <NavLink to="/survivor-cast">Survivor Cast</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;